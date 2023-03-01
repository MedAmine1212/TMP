<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Workson;
use App\Models\ScrumTeam;
use App\Models\Project;

class WorksonController extends Controller
{   

    /**
     * @OA\post(
     *     path="/api/assignProjectToScrumTeam",
     *     summary="Assignment of a project to a team",
     *     tags={"ScrumTeam"},
     *     @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"idCollaborator,idSCRUMTeam,role"},
     *           @OA\Property(property="idProject", type="integer", example= 1),
     *           @OA\Property(property="idScrumTeam", type="intger", example= 2),
     *          ),
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Project affected to the team"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Operation Impossible"
     *      )
     *      
     * )
     */
    public function AssignProjectToTeam(Request $request){
        $team = ScrumTeam::where(['id' => $request->idSCRUMTeam])->get()->first();
        $prj = Project::where(['id' => $request->idProject])->get()->first();
        if($team == null)
            return response()->json('team not found !', 404);
        if($prj == null)
            return response()->json('project not found !', 404);
        $WorksOn = Workson::where(['idSCRUMTeam' => $request->idSCRUMTeam])->where(['status' => 1])->get()->first();
        if($WorksOn == null) {
            $jt = Workson::create([
                'idProject' => $request->idProject,
                'idSCRUMTeam' => $request->idSCRUMTeam,
                'status' => '1',
            ]);
            $team->productOwner = $prj->owner;
            $team->update();
            return response()->json('Project affected to the team', 200);
        }
        if($WorksOn->idProject != null) {
            $WorksOn->status = 0;
            $WorksOn->endDate = DB::raw('CURRENT_TIMESTAMP');
            $WorksOn->update();
        }
        $team->productOwner = $prj->owner;
        $team->update();
        $jt = Workson::create([
            'idProject' => $request->idProject,
            'idSCRUMTeam' => $request->idSCRUMTeam,
            'status' => '1'
        ]);
        return response()->json('Project affected to the team', 200);
   }
}

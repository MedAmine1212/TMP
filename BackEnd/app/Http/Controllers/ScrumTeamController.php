<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\FunctionalRequirement;
use App\Models\JoinTeam;
use App\Models\Project;
use App\Models\ScrumTeam;
use App\Models\Version;
use App\Models\Workson;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScrumTeamController extends Controller
{
    /**
     * @OA\post(
     *     path="/api/scrumTeam",
     *     summary="Create Scrum Team",
     *     tags={"ScrumTeam"},
     *     @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"name"},
     *           @OA\Property(property="name", type="string", example= "Team Name")
     *          ),
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      )
     *
     * )
     */
    public function addScrumTeam(Request $request)
    {
        $ScrumTeam = ScrumTeam::create([
            'name' => $request->name
        ]);
        return $ScrumTeam;
    }


    /**
     * @OA\delete(
     *   tags={"ScrumTeam"},
     *   path="/api/deleteScrumTeam/{idScrumTeam}",
     *   summary="Delete a Scrum Team",
     *   security = {{ "apiAuth": {""} }},
     *      @OA\Parameter(
     *      name="idScrumTeam",
     *      in="path",
     *      required=true,
     *      description="ScrumTeam ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      )
     *
     *  )
     */
    public function deleteScrumTeam(Request $request, $idScrumTeam){
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        ScrumTeam::find($idScrumTeam)->delete();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        return response()->json('Scrum Team deleted', 200);
    }
    /**
     * @OA\Get(
     *   tags={"ScrumTeam"},
     *   path="/api/getAllScrumTeams",
     *   summary="Returns all ScrumTeams",
     *     @OA\Response(response="200", description="Successful operation !"),
     * )
     */
    public function getAllScrumTeams(){
        $teams = ScrumTeam::all();
        foreach ($teams as $team){
            $team->working = Workson::where(['idSCRUMTeam'=> $team->id, 'status'=>1])->get()->first();
            $team->totalWorkTime = 0;
            if($team->working)
                $team->working->project = Project::where(['id'=>$team->working->idProject])->get();
            $team->joinTeam = JoinTeam::where(['idSCRUMTeam'=> $team->id])->get();
            foreach($team->joinTeam as $jt){
                $jt->collaborator = Collaborator::find($jt['idCollaborator']);
                $jt->workTime = 0;
                //get work time
                if($team->working) {
                    $versions = Version::where(["project"=>$team->working->idProject])->get();
                    foreach($versions as $v){
                        $frs = FunctionalRequirement::where(["version"=>$v->id, "responsible"=>$jt['idCollaborator']])->get();
                        foreach($frs as $f){
                            $jt->workTime+= $f->elapsedTime;
                        }
                    }
                    $team->totalWorkTime+=$jt->workTime;
            }
                //end get work time
            }
        }
        //dd($collaborators);
        return $teams;
    }

    /**
     * @OA\Get(
     *   tags={"ScrumTeam"},
     *   path="/api/getScrumTeamsByProductOwner/{idProductOwner}",
     *   summary="Returns all ScrumTeams by product owner Id",
     *     @OA\Parameter(
     *      name="idProductOwner",
     *      in="path",
     *      required=true,
     *      description="Product Owner ID",
     *      @OA\Schema(
     *           type="number"
     *           )
     *      ),
     *     @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *     @OA\Response(response="201", description="No team found")
     * )
     */
    public function getScrumTeamByProductOwner($idProductOwner) {
        $teams = ScrumTeam::where(['productOwner'=> $idProductOwner])->get();
        if(!$teams->isEmpty()) {
            return $teams;
        }
        else {
            return response()->json(['massage' => 'No team found'], 201);
        }
    }

        /**
     * @OA\Get(
     *   tags={"ScrumTeam"},
     *   path="/api/getScrumTeamById/{idScrumTeam}",
     *   summary="Returns the ScrumTeams by Id",
     *     @OA\Parameter(
     *      name="idScrumTeam",
     *      in="path",
     *      required=true,
     *      description="Team ID",
     *      @OA\Schema(
     *           type="number"
     *           )
     *      ),
     *     @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *     @OA\Response(response="201", description="No team found")
     * )
     */
    public function getScrumTeamById($idScrumTeam) {
        $team = ScrumTeam::where(['id'=> $idScrumTeam])->get(['id', 'productOwner', 'name'])->first();
        if(!is_null($team)) {
            $team->productOwner = Collaborator::select(DB::raw("CONCAT(firstName, ' ', lastName) as productOwner"))->where('id', $team->productOwner)->get()->value('productOwner');
            $prj = Workson::select()->where('idSCRUMTeam', $team->id)->where('status', 1)->get()->first();
            if(!is_null($prj)) {
                $prjId = $prj->idProject;
                $team->currentlyAffectedProject = Project::select('name')->where('id', $prjId)->get()->value('name');
            }
            else
                $team->currentlyAffectedProject = null;
            $team->Collaborators = DB::table('join_team')->where('idSCRUMTeam', $team->id)->where('status', 1)->get(['idCollaborator','role','dateJoined'])->toArray();
            foreach ($team->Collaborators as $c){
               $c->full_name = Collaborator::select(DB::raw("CONCAT(firstName, ' ', lastName) as full_name"))->where('id', $c->idCollaborator)->get()->value('full_name');
               $c->email = Collaborator::select('email')->where('id', $c->idCollaborator)->get()->value('email');
            }
            return $team;
        }
        else {
            return response()->json(['massage' => 'No team found'], 201);
        }
    }

    /**
     * @OA\Get(
     *   tags={"ScrumTeam"},
     *   path="/api/scrumteam/{idScrumTeam}",
     *   summary="Returns all Collaborators",
     *      @OA\Parameter(
     *      name="idScrumTeam",
     *      in="path",
     *      required=true,
     *      description="ScrumTeam ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\Response(response="200", description="Successful operation !"),
     * )
     */
    public function getScrumTeam($idScrumTeam){
        $jts = JoinTeam::where(['idSCRUMTeam'=> $idScrumTeam])->get();
        $collaborators = Collection::make();
        foreach($jts as $jt){
            $collaborators->push(Collaborator::find($jt['idCollaborator']));
        }
        //dd($collaborators);
        return $collaborators;
    }

    /**
     * @OA\Get(
     *   tags={"ScrumTeam"},
     *   path="/api/currentscrumteam/project/{idProject}",
     *   summary="Returns the scrum Team that works currently on a project",
     *      @OA\Parameter(
     *      name="idProject",
     *      in="path",
     *      required=true,
     *      description="Project ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="404", description="no Project or available current team working on that project found!"),
     * )
     */
    public function getProjectCurrentScrumTeam($idProject){
        $wo = Workson::where(['idProject'=>$idProject, 'status'=>'1'])->first();
        $ScrumTeam = ScrumTeam::find($wo->idSCRUMTeam);
        return $ScrumTeam;
    }
    /**
     * @OA\Get(
     *   tags={"ScrumTeam"},
     *   path="/api/scrumteam/project/{idProject}",
     *   summary="Returns all the scrum Teams that worked on a project",
     *      @OA\Parameter(
     *      name="idProject",
     *      in="path",
     *      required=true,
     *      description="Project ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\Response(response="200", description="Successful operation !"),
     * )
     */
    public function getProjectScrumTeam($idProject){
        $wos = Workson::where(['idProject'=>$idProject])->get();
        $ScrumTeams = Collection::make();
        foreach($wos as $wo){
            $ScrumTeams->push(ScrumTeam::find($wo['idSCRUMTeam']));
        }
        return $ScrumTeams;
    }

}

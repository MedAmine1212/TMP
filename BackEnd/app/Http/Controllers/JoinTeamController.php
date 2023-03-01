<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\JoinTeam;
use App\Models\ScrumTeam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JoinTeamController extends Controller
{

    /**
     * @OA\post(
     *     path="/api/assignCollaboratorToScrumTeam",
     *     summary="Assignment of a collaborator to a team",
     *     tags={"ScrumTeam"},
     *     @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"idCollaborator,idSCRUMTeam,role"},
     *           @OA\Property(property="idCollaborator", type="integer", example= 0),
     *           @OA\Property(property="idScrumTeam", type="intger", example= 0),
     *           @OA\Property(property="role", type="string", example= "SCRUM Master")
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      )
     * )
     */

   public function AssignCollaboratorToTeam(Request $request){
       $jts = JoinTeam::where(["idCollaborator"=>$request->idCollaborator, 'idSCRUMTeam' => $request->idScrumTeam])->whereIn('status', [0,1])->get()->toArray();
       if(sizeof($jts) >0)
           return response()->json(null);
        $jt = JoinTeam::create([
            'idCollaborator' => $request->idCollaborator,
            'idSCRUMTeam' => $request->idScrumTeam,
            'role' => $request->role
        ]);
        $jt->collaborator = Collaborator::where(["id"=>$request->idCollaborator])->get()->first();
        return response()->json($jt);
   }


    /**
     * @OA\delete(
     *   tags={"ScrumTeam"},
     *   path="/api/scrumteam/{idSCRUMTeam}/remove/{idCollaborator}",
     *   summary="Remove a collaborator from a team",
     *   security = {{ "apiAuth": {""} }},
     *     @OA\Parameter(
     *      name="idSCRUMTeam",
     *      in="path",
     *      required=true,
     *      description="SCRUM Team ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *      @OA\Parameter(
     *      name="idCollaborator",
     *      in="path",
     *      required=true,
     *      description="Collaborator ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *     @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *     @OA\Response(
     *          response=404,
     *          description="Collaboration not found"
     *      ),
     *  )
     */
   public function RemoveCollaboratorFromTeam($idSCRUMTeam, $idCollaborator){
        $update_status = DB::table('join_team')->where('idSCRUMTeam', $idSCRUMTeam)->where('idCollaborator', $idCollaborator)->where('status', 1)->update(array('status' => -1));
        if($update_status == 0){
            return response()->json("collaboration not found", 404);
        }
        else{
            return response()->json('Collaborator Removed from the team');
        }
    }


    /**
     * @OA\delete(
     *   tags={"ScrumTeam"},
     *   path="/api/cancelInvite/{id}",
     *   summary="Cancel pending invication",
     *   security = {{ "apiAuth": {""} }},
     *     @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Invitation id",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *     @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *     @OA\Response(
     *          response=404,
     *          description="Collaboration not found"
     *      ),
     *  )
     */
    public function cancelInvite($id){

        JoinTeam::find($id)->delete();
        return response()->json('Invitaion deleted');
    }


    /**
     * @OA\put(
     *   tags={"ScrumTeam"},
     *   path="/api/scrumteam/{idSCRUMTeam}/collaborator/{idCollaborator}/role",
     *   summary="Update the role of a collaborator in a team",
     *      @OA\Response(response="200", description="OK"),
     *      @OA\Parameter(
     *      name="idSCRUMTeam",
     *      in="path",
     *      required=true,
     *      description="SCRUM Team ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *     @OA\Parameter(
     *      name="idCollaborator",
     *      in="path",
     *      required=true,
     *      description="Collaborator ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"role"},
     *           @OA\Property(property="role", type="string", example= "developer"),
     *      )
     *    )
     * )
     */

    public function UpdateCollaboratorRole(Request $request, $idSCRUMTeam, $idCollaborator){
        JoinTeam::where('idSCRUMTeam', $idSCRUMTeam)->where('idCollaborator', $idCollaborator)
        ->update(array('role' => $request->role));
        return response()->json('Collaborator role updated');
    }

    /**
     * @OA\Get(
     *   tags={"Collaborator"},
     *   path="/api/acceptInvitation/{id}",
     *   summary="Accept invitaion (set status to 1)",
     *     @OA\Response(response="200", description="Accept invitaion and return the current team"),
     *     @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Invitation ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      )
     *
     * )
     */
    function acceptInvitaion($id) {
        $invit = JoinTeam::where('id', $id)->get()->first();
        if ($invit){
            if($invit->status != 0)
                return response()->json('Team allready joined !', 200);
            $invit->status = 1;
            $oldInvit = JoinTeam::where(["idCollaborator"=>$invit->idCollaborator, 'status'=>1])->get();
            foreach ($oldInvit as $inv){
                $inv->status = -1;
                $inv->update();
            }
            $invit ->update();
            $team = ScrumTeam::where(["id"=>$invit->idSCRUMTeam])->get()->first();
            $team->dateJoined = $invit->dateJoined;
            $team->role = $invit->role;
            return response()->json($team, 200);
        }
        return response()->json('invitation not found !', 404);
    }
}

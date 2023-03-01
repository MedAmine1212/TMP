<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\JoinMeeting;
use App\Models\JoinTeam;
use App\Models\Meeting;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    //

    /**
     *
     * @OA\Post(
     * path="/api/scrumteam/{idSCRUMTeam}/meeting",
     * summary="Create meeting for a scrum team",
     * tags={"Meetings"},
     *   @OA\Response(response=200, description="Success"),
     *   @OA\Response(response=404, description="Token Not found "),
     *   @OA\Response(response=500, description="Server Error  "),
     *    @OA\Parameter(
     *      name="idSCRUMTeam",
     *      in="path",
     *      required=true,
     *      description="Scrum team ID",
     *      ),


     *    @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"title"},
    *         required={"date"},
    *           @OA\Property(property="title", type="string",example="meeting1"),
    *           @OA\Property(property="date", type="string",example="2022-08-30 10:02:05"),
     *
     *
     *
     *      )
     *    )
     * )
     *
     */


    public function createMeeting(Request $request,$idScrumTeam){
        $request->input('title');
        $request->input('date');
        $meeting = Meeting::create($request->all());
        $meeting['idSCRUMTeam'] = $idScrumTeam;
        $meeting->save();
        return $meeting;

    }
    /**
     *
     * @OA\Post(
     * path="/api/meeting/{idMeeting}/addCollaborator",
     * summary="add collaborator to meeting",
     * tags={"Meetings"},
     *   @OA\Response(response=200, description="Success"),
     *   @OA\Response(response=404, description="Token Not found "),
     *   @OA\Response(response=500, description="Server Error  "),
     *    @OA\Parameter(
     *      name="idMeeting",
     *      in="path",
     *      required=true,
     *      description="meeting ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *    @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"idCollaborator"},
    *           @OA\Property(property="idCollaborator", type="string",example=""),
     *
     *
     *
     *      )
     *    )
     * )
     *
     */

    public function inviteCollaborator(Request $request, int $idMeeting){
        $request->input('idCollaborator');
        $joinMeeting = JoinMeeting::create($request->all());
        $joinMeeting['idMeeting'] = $idMeeting;
        $joinMeeting->save();
        return $joinMeeting;


    }

    /**
     * @OA\Get(
     *   tags={"Meetings"},
     *   path="/api/scrumteam/{idSCRUMTeam}/meetings",
     *   summary="Returns meetings by scrum team ",
     *      @OA\Parameter(
     *      name="idSCRUMTeam",
     *      in="path",
     *      required=true,
     *      description="Scrum team ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\Response(response="200", description="Successful operation !")
     *     
     * )
     */
    
    // /api/scrumteam/{idSCRUMTeam}/meetings
    public function meetingsByScrumTeam(int $idScrumTeam){
        $meetings = Meeting::where(['idSCRUMTeam'=> $idScrumTeam])->get();
        $collaborators = Collection::make();
        foreach($meetings as $meeting){
            $jmss =JoinMeeting::where(['idMeeting'=> $meeting['id']])->get();
            foreach($jmss as $jms){
                $collaborators->push(Collaborator::select('firstName', 'lastName', 'status')->find($jms->idCollaborator));
            }
        }
        
        return [$meetings, $collaborators];
    }


    /**
     * @OA\Get(
     *   tags={"Meetings"},
     *   path="/api/collaborator/{idCollaborator}/meetings",
     *   summary="Returns meetings by collaborator ",
     *      @OA\Parameter(
     *      name="idCollaborator",
     *      in="path",
     *      required=true,
     *      description="Collaborator ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\Response(response="200", description="Successful operation !")
     *     
     * )
     */

    // /api/collaborator/{idCollaborator}/meetings
    public function meetingsByCollaborator(int $idCollaborator){
        $jms = JoinMeeting::where(['idCollaborator'=> $idCollaborator])->get();
        $meetings = Collection::make();
        foreach($jms as $jm){
            $meeting = Meeting::find($jm->idMeeting);
            if(!$meetings->contains($meeting))
            $meetings->push($meeting);
        }
        if(!$meetings->isEmpty()) {
            return $meeting;
        }
        else {
            return response()->json(['massage' => 'No meeting found'], 201);
        }
    }


    /**
     * @OA\Get(
     *   tags={"Meetings"},
     *   path="/api/meeting/{idMeeting}/uninvited",
     *   summary="Returns uninvited collaborators ",
     *      @OA\Parameter(
     *      name="idMeeting",
     *      in="path",
     *      required=true,
     *      description="Meeting ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\Response(response="200", description="Successful operation !")
     *     
     * )
     */
    

    // /api/meeting/{idMeeting}/uninvited

    public function getUninvitedCollaborators(int $idMeeting){
        $meeting = Meeting::find($idMeeting);
        $idScrumTeam = $meeting->idSCRUMTeam;
        $collaborators = App('App\Http\Controllers\ScrumTeamController')->getScrumTeam($idScrumTeam);
        $collaborators = $collaborators->keyBy('id');
        $joinMeetings = JoinMeeting::where('idMeeting',$idMeeting)->get();
        $collabs = $collaborators;
        foreach($joinMeetings as $joinMeeting){
            $collabs =$collabs->forget(['id'=> $joinMeeting->idCollaborator]);
        }
        return $collabs;  
        
    }

    
    /**
     * @OA\put(
     *   tags={"Meetings"},
     *   path="/api/joinmeeting/{idJoinMeeting}/declareAbsence",
     *   summary="declare absence",
     *      @OA\Response(response="201", description="Successful operation"),
     *      @OA\Response(response="404", description="joinmeeting not found"),
     *      @OA\Response(response="500", description="Server error"),
     *      @OA\Parameter(
     *      name="idJoinMeeting",
     *      in="path",
     *      required=true,
     *      description="Join Meeting ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *    )
     * )
     */

    // /api/joinmeeting/{idJoinMeeting}/declareAbsence
    public function declareAbsence(int $idJoinMeeting){
        $joinMeeting = JoinMeeting::find($idJoinMeeting);
        $joinMeeting->status=0;
        $joinMeeting->save();
        return $joinMeeting;
    }


        /**
     * @OA\delete(
     *     path="/api/joinmeeting/{idJoinMeeting}/cancelInvite",
     *     summary="cancel invitation by deleting joinmeeting row",
     *     tags={"Meetings"},
     *     @OA\Parameter(
     *      name="idJoinMeeting",
     *      in="path",
     *      required=true,
     *      description="Join meeting ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     * 
     *     @OA\Response(
     *        response="200",
     *        description="Successful operation"
     *     ),
     *     @OA\Response(response="404", description="join meeting not found"),
     *     @OA\Response(response="500", description="Server error"),
     * )
     */

    // /api/joinmeeting/{idJoinMeeting}/cancelInvite
    public function cancelInvitation(int $idJoinMeeting){
        return $res=JoinMeeting::where('id',$idJoinMeeting)->delete();
    }

}

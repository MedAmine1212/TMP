<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\JoinTeam;
use App\Models\ScrumTeam;
use Illuminate\Http\Request;
use DB;
use \stdClass;
use Illuminate\Support\Str;
use Carbon\Carbon;
use DateTime;
use App\Mail\InstanceMail;
use Illuminate\Support\Facades\Mail;
use function PHPUnit\Framework\isEmpty;
use Illuminate\Support\Facades\Hash;
use App\Models\ForgotPasswordRequest;


class CollaboratorController extends Controller
{


    /**
     * @OA\Get(
     *   tags={"Collaborator"},
     *   path="/api/getCollaborators",
     *   summary="Returns all collaborators",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="500", description="Server error "),
     *
     *
     * )
     */
    function getCollaborators(){
        $collaborators = Collaborator::all();
        return response()->json($collaborators,200);
}


     /**
     * @OA\Get(
     *   tags={"Collaborator"},
     *   path="/api/collaborator/{idCollaborator}",
     *   summary="Returns Collaborator By ID",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="404", description="Project not found "),
     *     @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="idCollaborator",
     *      in="path",
     *      required=true,
     *      description="Collaborator ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     * )
     */
    function getCollaborator( $idCollaborator){
            $col=DB::table('collaborator')->where("id", $idCollaborator)->first();
            $col_obj = new stdClass();
            $col_obj->full_name = $col->firstName . " " . $col->lastName;
            $col_obj->phone = $col->phone;
            $col_obj->email = $col->email;
            $SCRUMTeamId = DB::table('join_team')->where('idCollaborator', $col->id)->where('status', "1")->first()->idSCRUMTeam;
            $SCRUMTeamName = DB::table('scrum_team')->where('id', 1)->first()->name;
            $col_obj->SCRUMTeamName = $SCRUMTeamName;
            return response()->json($col_obj);
    }

    /**
     * @OA\Get(
     *   tags={"Collaborator"},
     *   path="/api/nonActiveCollab/",
     *   summary="Returns all non Collaborator",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="404", description="Project not found "),
     *     @OA\Response(response="500", description="Server error "),
     * )
     */
    function getNonActiveCollabs(){
        $collaborators = Collaborator::all()->toArray();
        $x = 0;
        foreach ($collaborators as $colab) {
            $joined = JoinTeam::whereRaw("idCollaborator = ? AND status !=-1",$colab['id'])->get();
            if(sizeof($joined) > 0){
                array_splice($collaborators,$x,1);
            } else {
                $x++;
            }
        }
        return response()->json($collaborators);
    }

     /**
     * @OA\put(
     *   tags={"Collaborator"},
     *   path="/api/collaborator/{idCollaborator}",
     *   summary="Update Collaborator ( first name, last name, email, phone )",
     *    @OA\Response(response="200", description="Update successfull"),
     *      @OA\Response(response="404", description="Collaborator not found"),
     *      @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="idCollaborator",
     *      in="path",
     *      required=true,
     *      description="Collaborator to be updated",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *           @OA\Property(property="firstName", type="string", example="Rachid"),
     *           @OA\Property(property="lastName", type="string", example="Gagnon"),
     *           @OA\Property(property="email", type="string", example="rachid@gmail.com"),
     *           @OA\Property(property="phone", type="string", example="20 000 000"),
     *      )
     *    )
     * )
     */
    function updateCollaborator(Request $request, $idCollaborator){
            $c=collaborator::find( $idCollaborator)->get()->first();
            if(!$c)
           return response()->json( "Collaborator not found", 404);
           if($request->has('firstName')){
                $c->firstName = $request->firstName;
           }
           if($request->has('lastName')){
                $c->lastName = $request->lastName;
           }
           if($request->has('phone')){
                $c->phone = $request->phone;
           }
           if($request->has('email')){
                $c->email = $request->email;
           }
           $c->update();
           return response()->json($c);
    }


      /**
     * send email invitation
     *
     * /**
     * c
     *
     * @OA\Post(
     * path="/api/sendEmailInvitation",
     * summary="Send an email  ",
     * description="this route allow admin to send an invitation to colloaborator ",
     * operationId="sendEmailInvitation",
     * tags={"Collaborator"},
     *   @OA\Response(response=200, description="Invitation sent successfully"),
     *   @OA\Response(response=400, description="Invitation already exist and valid"),

     *   @OA\Response(response=500, description="Server Error  "),
     *    @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"reciever"},
     *
     *          @OA\Property(property="reciever", type="string",example="tsunamitit.tmp@gmail.com"),
     *
     *
     *
     *      )
     *    )
     * )
     *
     */
    public function sendEmailInvitation(Request $request)
    {
        $details=[
            'reciever'=>$request->reciever,
            'forgetPassword'=>false
        ];
        $details['invitation']=true;
        $details['subject']="Invitation to TMP";
        $create=null;
        $result=null; // result=-1 :link is expired and a new invitation  will be generated;
                      // result =1 invitation is sent for first time
                        // result =0 link already valid


            $collaborator = Collaborator::where('email', $details['reciever'])->get()->first();
            if($collaborator)
            {
                // collaborateur deja existe dans la base de données donc on va verifier si le lien a expiré ou non
                if($collaborator->status=='1')
                return response()->json(['message'=>'Account exist and verified','result'=>2], 400);
                // collaborateur deja existe dans la base de données donc on va verifier si le lien a expiré ou non
                $currentDate=Carbon::now()->timestamp+3600;

                $creationDateCollaborator = DateTime::createFromFormat('Y-m-d H:i:s',$collaborator->creationDate);

                $expiration=604800; //7 days expiration


                if($currentDate-$creationDateCollaborator->getTimestamp()>$expiration || $collaborator->status=="-1")
                {
                    // lien expiré


                    $collaborator->delete();
                    $create=true;
                    $result=-1;



                }
                else {
                    $result=0;
                    return response()->json(['message'=>'Link valid ','result'=>$result], 400);

                }





            }
            else {
                $create=true;
                $result=1;
            }

            if($create)
            {
                $tokenInvitation= Str::random(80);

                $collaborator = Collaborator::create([
                    'email' => $details['reciever'],
                    'password' => Hash::make(Str::random(8)),
                    'invitationToken'=>$tokenInvitation,
                    'status'=>"0"
                ]);
                $frontEndLink=env('FRONTEND_URL');

                $details['link']=$frontEndLink ."accept-invitation"."/".$tokenInvitation;
                $details['link']="http://".$frontEndLink ."accept-invitation"."/".$tokenInvitation;
                       Mail::to($request->reciever)->send(new InstanceMail($details));
                      return response()->json(['message'=>'Invitation created','result'=>$result], 200);
            }
    }


    /**
     * verify token invitation
     *
     * /**
     * c
     *
     * @OA\Post(
     * path="/api/verifyInvitationToken",
     * summary="Verify token  ",
     * description="this route verify token  ",
     * operationId="verifyInvitationToken",
     * tags={"Collaborator"},
     *   @OA\Response(response=200, description="Token valid"),
     *   @OA\Response(response=400, description="Token Expired"),
     *   @OA\Response(response=404, description="Token dont exist"),


     *   @OA\Response(response=500, description="Server Error  "),
     *    @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"invitationToken"},
     *
     *          @OA\Property(property="invitationToken", type="string",example="xxxxx"),
     *
     *
     *
     *      )
     *    )
     * )
     *
     */

    function verifyInvitationToken(Request $request)
    {


     $collaborator = Collaborator::where('invitationToken', $request->invitationToken)->get()->first();

     if($collaborator)
     {

          $currentDate=Carbon::now()->timestamp+3600;

          $creationDateCollaborator = DateTime::createFromFormat('Y-m-d H:i:s',$collaborator->creationDate);

          $expiration=604800; //7 days expiration


          if($currentDate-$creationDateCollaborator->getTimestamp()>$expiration)

               return response()->json(['message'=>'Token expired','result'=>0], 400);

     return response()->json(['message'=>"Token exist",'result'=>1], 200);
     }

     return response()->json(['message'=>'Token dont exist','result'=>-1], 404);


    }




    /**
     *
     *
     * /**
     * c
     *
     * @OA\Post(
     * path="/api/createAccountCollaborator",
     * summary="Create account for a collaborator  ",
     * description="this route allow the collaborator to create an account ",
     * operationId="createAccountCollaborator",
     * tags={"Collaborator"},
     *   @OA\Response(response=200, description="Success"),
     *   @OA\Response(response=404, description="Token Not found "),
     *   @OA\Response(response=500, description="Server Error  "),



     *    @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"name"},
            * required={"password"},
            * required={"phone"},
            * required={"invitationToken"},
    *           @OA\Property(property="name", type="string",example="ryadh mahrez"),
    *           @OA\Property(property="password", type="string",example="1234"),
     *          @OA\Property(property="phone", type="string",example="90120933"),
    *           @OA\Property(property="invitationToken", type="string",example="xxxxx"),
     *
     *
     *
     *      )
     *    )
     * )
     *
     */
    public function createAccountCollaborator(Request $request)
    {

        if(!$request->invitationToken)
        return response()->json(['message'=>'Token not found'], 404);


        $spacePosition=strpos($request->name, " ");
        $firstName= substr($request->name, 0, $spacePosition);
        $lastName= substr($request->name, $spacePosition+1, strlen($request->name)-strlen($firstName));
        $password = Hash::make($request->password);

        $collaborator = Collaborator::where('invitationToken', $request->invitationToken)->where('status', "0")->update(['firstName' => $firstName,'lastName'=>$lastName,"password"=>$password,"invitationToken"=>null,"phone"=>$request->phone,'status'=>"1"]);

        if($collaborator)
            return response()->json(['message'=>'Success'], 201);
        return response()->json(['message'=>'Token not found'], 404);
    }


    /**
     * @OA\delete(
     *     path="/api/deleteCollaborator/{idCollaborator}",
     *     summary="Delete a collaborator,set status to -1",
     *     operationId="deleteCollaborator",

     *     tags={"Collaborator"},
     *     @OA\Parameter(
     *      name="idCollaborator",
     *      in="path",
     *      required=true,
     *      description="Collaborator ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     * 
     *     @OA\Response(
     *        response="200",
     *        description="Successful operation"
     *     ),
     * 
     *     @OA\Response(response="404", description="collaborator not found"),
     *     @OA\Response(response="500", description="Server error"),
     * )
     */
    public function deleteCollaborator($idCollaborator){
        $collaborator = Collaborator::where('id', $idCollaborator)->update(['status' => "-1",'invitationToken'=>null]);

        if ($collaborator)
            return response()->json('collaborator deleted !', 200);
        return response()->json('collaborator not found !', 404);


    }

    /**
     * @OA\Get(
     *   tags={"Collaborator"},
     *   path="/api/getInvitesByCollabId/{id}",
     *   summary="Returns all invitaions for a certain collaborator",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Collaborator ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      )
     *
     * )
     */
    function getInvitesByCollabId($id){
        $invitations = JoinTeam::where(["idCollaborator"=>$id, 'status'=>0])->get();
        foreach ($invitations as $invit){
            $invit->scrumTeam = ScrumTeam::where(['id'=> $invit->idSCRUMTeam])->get()->first();
        }
        //dd($collaborators);
        return $invitations;
    }

    /**
     * @OA\Get(
     *   tags={"Collaborator"},
     *   path="/api/getCurrentScrumTeam/{id}",
     *   summary="Get Collaborator's current active ScrumTeam",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Collaborator ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      )
     *
     * )
     */
    function getCurrentScrumTeam($id) {
        $invit = JoinTeam::where(["idCollaborator"=>$id, 'status'=>1])->get()->first();
        if(!$invit)
            return response()->json(null, 200);
        $st = ScrumTeam::where(['id'=> $invit->idSCRUMTeam])->get()->first();
        $st->dateJoined = $invit->dateJoined;
        $st->role = $invit->role;
        return $st;
    }


 /**
     * @OA\post(
     *   tags={"Collaborator"},
     *   path="/api/uploadPicture/{idCollaborator}",
     *   operationId="uploadPicture",

     *   summary="upload a picture for a collaborator",
     *      @OA\Response(response="200", description="Successful operation"),
     *      @OA\Response(response="404", description="Collaborator not found"),
     *      @OA\Response(response="500", description="Server error"),


     *      @OA\Parameter(
     *      name="idCollaborator",
     *      in="path",
     *      required=true,
     *      description=" Collaborator ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"picture"},
     *           @OA\Property(property="picture", type="file"),
     *      )
     *    )
     * )
     */
    public function uploadPicture($idCollaborator,Request $request)
    {
        $collaborator = Collaborator::find($idCollaborator);
        if(!$collaborator || $collaborator->status!="1")
        return response()->json('collaborator not found !', 404);




        
        
        if ($request->hasFile('picture')) {
            $file      = $request->file('picture');
            $filename  = $file->getClientOriginalName();

            $extension = $file->getClientOriginalExtension();
            $picture   = date('His') . '-' . $filename;
            //move image to public/img folder
            $file->move(public_path('images'), $picture);
            $collaborator->picture = $picture;
            $collaborator->update();
            return response()->json(["message" => "picture added", "picture" =>$picture], 200);

        } 
        return response()->json('Picture not found !', 404);


           
        

    }

}

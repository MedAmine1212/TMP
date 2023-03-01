<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Collaborator;
use App\Models\ForgotPasswordRequest;

use DB;
use \stdClass;
use Illuminate\Support\Str;
use Carbon\Carbon;
use DateTime;
use App\Mail\InstanceMail;
use Illuminate\Support\Facades\Mail;




class ForgotPasswordController extends Controller
{




    /**
     * send email forget password reques
     *
     * /**
     * c
     *
     * @OA\Post(
     * path="/api/forgotPasswordRequest",
     * summary="forgot password request  ",
     * description="this route allow admin to send an email to reset collaborator's password",
     * operationId="forgotPasswordRequest",
     * tags={"Forgot password"},
     *   @OA\Response(response=200, description="Forgot password request created successfully"),
     *   @OA\Response(response=404, description="Email not found "),

     *   @OA\Response(response=500, description="Server Error  "),
     *    @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"email"},
     *       
     *          @OA\Property(property="email", type="string",example="tsunamitit.tmp@gmail.com"),
     *          
     * 
     *      
     *      )
     *    )
     * )
     *
     */

    public function forgotPasswordRequest(Request $request)

    {
        $collaborator = Collaborator::where('email', $request->email)->where('status', "1")->get()->first();
        if(!$collaborator)
        return response()->json(['message'=>'Email not found ','result'=>-1], 404);
        
        $token= Str::random(80);

        $forgotPasswordRequest = ForgotPasswordRequest::create([
            'collaborator' => $collaborator->id,
            'token'=>$token
            
        ]);
        $frontEndLink=env('FRONTEND_URL');

        $details=[
            'reciever'=>$request->email,
            'invitation'=>true,
            'forgetPassword'=>true,
            'subject'=>"Forget password request for TMP",
            'collaborator'=>$collaborator,
            'link'=>"http://".$frontEndLink ."forgotPassword"."/".$token
        ];

     
        Mail::to($request->email)->send(new InstanceMail($details));

        

     

        return response()->json(['message'=>'Forgot password request created ','result'=>1], 201);



        



    }



    /**
     * verify token invitation 
     *
     * /**
     * c
     *
     * @OA\Post(
     * path="/api/forgetPasswordVerifyToken",
     * summary="Verify token   ",
     * description="this route verify token for forgot password  ",
     * operationId="forgetPasswordVerifyToken",
     * tags={"Forgot password"},
     *   @OA\Response(response=200, description="Token valid"),
     *   @OA\Response(response=400, description="Token Expired"),
     *   @OA\Response(response=404, description="Token dont exist"),


     *   @OA\Response(response=500, description="Server Error  "),
     *    @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"token"},
     *      
     *          @OA\Property(property="token", type="string",example="xxxxx"),
     *      
     * 
     *      
     *      )
     *    )
     * )
     *
     */
    function forgetPasswordVerifyToken(Request $request)
    {

        


     $forgotPasswordRequest = ForgotPasswordRequest::where('token', $request->token)->get()->first();

     if($forgotPasswordRequest)
     {



          $currentDate=Carbon::now()->timestamp+3600;

          $creationDateCollaborator = DateTime::createFromFormat('Y-m-d H:i:s',$forgotPasswordRequest->creationDate);

          $expiration=3600; //1 hour expiration 


          if($currentDate-$creationDateCollaborator->getTimestamp()>$expiration)
          
               return response()->json(['message'=>'Token expired','result'=>0], 400);

              



     return response()->json(['message'=>"Token exist",'result'=>1], 200);
     }
     
     return response()->json(['message'=>'Token dont exist','result'=>-1], 404);


    }


}

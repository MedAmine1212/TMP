<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\InstanceMail;

class MailController extends Controller
{
    

     /**
     * send email invitation
     *
     * /**
     * c
     *
     * @OA\Post(
     * path="/api/sendEmail",
     * summary="Send an email  ",
     * description="this route allow admin to send a simple email ",
     * operationId="sendEmail",
     * tags={"Email"},
     *   @OA\Response(response=200, description="Email sent successfully"),
     *   @OA\Response(response=500, description="Server Error  "),
     *    @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"reciever"},
     *       required={"subject"},
     *      required={"body"},
     *          @OA\Property(property="reciever", type="string",example="tsunamitit.tmp@gmail.com"),
     *           @OA\Property(property="subject", type="string", example= "email subject"),
     *          @OA\Property(property="body", type="string", example= "email body"),
     * 
     *      
     *      )
     *    )
     * )
     *
     */
    public function sendEmail(Request $request)
    {
        $details=[
            'reciever'=>$request->reciever,
            'subject'=>$request->subject,
            'body'=>$request->body,
        ];
        $details['invitation']=false;
        $details['forgetPassword']=false;


        Mail::to($request->reciever)->send(new InstanceMail($details));
        return response()->json('Email sent successfully', 200);

        
    }
}
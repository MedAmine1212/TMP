<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cookie;




class AuthController extends Controller
{
    /**
     * user login
     *
     * /**
     * c
     *
     * @OA\Post(
     * path="/api/login",
     * summary="User login",
     * description="this route allow collaborator to sign in ",
     * operationId="login",
     * tags={"Authentication"},
     *   @OA\Response(response=200, description="Credentials are valid and generate a token"),
     *   @OA\Response(response=401, description="Credentials not valid  "),


     *    @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"email"},
     *       required={"password"},

     *          @OA\Property(property="email", type="string",example="ericperdon@gmail.com"),
     *           @OA\Property(property="password", type="string", example= "1234"),
     *      
     *      )
     *    )
     * )
     *
     */
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $collaborator = Collaborator::where('email', $fields['email'])->get()->first();



        // Check email and password
        if (!Auth::attempt($fields)||$collaborator->status=="-1"||$collaborator->status=="0") {

            return response([
                'message' => 'Invalid credentials'
            ], Response::HTTP_UNAUTHORIZED);
        };
        $user = Auth::user();
        $token = $user->createToken('token')->plainTextToken;

        $cookie = cookie('token', $token, 60 * 24,null,null,null,false); // 1 day




        return response([
            'message' => $user
        ])->withCookie($cookie);
    }



    /**
     * user authenticated
     *
     * /**
     * c
     *
     * @OA\Get(
     * path="/api/user",
     * summary="User authenticated",
     * description="this route return user authenticated ",
     * operationId="user",
     * tags={"Authentication"},
     *   @OA\Response(response=200, description="returns user authenticated"),
     *   @OA\Response(response=401, description="No user authenticated "),


     *      
     *      )
     *    )
     * )
     *
     */

    public function user(Request $request)
    {
        if(Auth::user())
        {
            return Auth::user();

        
        }

        return response([
            'message' => 'No User authenticated'
        ], Response::HTTP_UNAUTHORIZED);    }




         /**
     * user logout
     *
     * /**
     * c
     *
     * @OA\Post(
     * path="/api/logout",
     * summary="User logout",
     * description="this route allow user to logout  ",
     * operationId="logout",
     * tags={"Authentication"},
     *   @OA\Response(response=200, description="logout successful"),
     *   @OA\Response(response=401, description="No user authenticated "),


     *      
     *      )
     *    )
     * )
     *
     */
    public function logout()
    {
        $cookie = Cookie::forget('token');
        if($cookie)
        {
            return response([
                'message' => 'Success'
            ])->withCookie($cookie);
        }

        return response([
            'message' => 'No User authenticated'
        ], Response::HTTP_UNAUTHORIZED);    
    }
}

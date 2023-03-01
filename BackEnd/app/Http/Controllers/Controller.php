<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;


/**
 * @OA\Info(
 *    title="TsunamiIT Manager Project API",
 *    version="1.0.0",
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    /**
     * @OA\Get(
     *     path="/",
     *     description="Swagger docs initialization",
     *     @OA\Response(response="default", description="Swagger init")
     * )
     */
    public function SwaggerDocsInit()
    {
        //This function is used to generate Swagger docs for the first time
    }
}

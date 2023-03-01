<?php

namespace App\Http\Controllers;
use App\Models\label;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class labelsController extends Controller
{
    /**
     * @OA\Get(
     *   tags={"Labels"},
     *   path="/api/labels",
     *   summary="Returns all Labels",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="404", description="No label found "),
     *     @OA\Response(response="500", description="Server error "),
     * )
     */
    public function getAllLabels(){
        return label::all();
    }



     /**
     * @OA\put(
     *   tags={"Labels"},
     *   path="/api/labels/{idLabels}",
     *   summary="Update Labels name, description and color",
     *      @OA\Response(response="200", description="OK"),
     *      @OA\Response(response="404", description="Label not found"),
     *      @OA\Parameter(
     *      name="idLabels",
     *      in="path",
     *      required=true,
     *      description="Label ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *           @OA\Property(property="name", type="string", example= "Frontend"),
     *           @OA\Property(property="description", type="text", example= "label5"),
     *           @OA\Property(property="color", type="string", example= "vert"),
     *      )
     *    )
     * )
     */
    public function UpdateLabelsByID(Request $request, $idLabels){
        $lab = label::find($idLabels);
            if(!$lab)
                return response()->json("Labels not found ", 404);
            if($request->has('name')){
                DB::table('labels')->where('id', $idLabels)->update(array('name' => $request->name));
            }

            if($request->has('description')){
                DB::table('labels')->where('id', $idLabels)->update(array('description' => $request->description));
            }
            if($request->has('color')){
                DB::table('labels')->where('id', $idLabels)->update(array('color' => $request->color));
            }

        return response()->json('Label updated', 200);
    }


/**
     * @OA\post(
     *     path="/api/labels",
     *     summary="Add Label",
     *     tags={"Labels"},
     *     @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"name,description,color"},
     *           @OA\Property(property="name", type="string", example= "backend"),
     *           @OA\Property(property="description", type="text", example= "Label 25"),
     *           @OA\Property(property="color", type="string", example= "rouge")
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      )
     * )
     */
    public function AddLabels(Request $request){
        label::create([
            'name' => $request->name,
            'description' => $request->description,
            'color' => $request->color
        ]);
        return response()->json('Label Added');
    }


     /**
     * @OA\delete(
     *   tags={"Labels"},
     *   path="/api/labels/{idLabels}",
     *   summary="Deletes a label but only if it’s not used in any functional requirement",
     *     @OA\Parameter(
     *      name="idLabels",
     *      in="path",
     *      required=true,
     *      description="Label ID",
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
     *          description="Label not found"
     *      ),
     *  )
     */
    public function removeLabelByID($idLabels){
        $labe = label::find($idLabels);
        if(!is_null($labe)){
            label::find($idLabels)->delete();
            return response()->json(['Label deleted !'], 200);
        }else{
            return response()->json(['label  used in  functional requirement !'], 201);
        }
    }


}

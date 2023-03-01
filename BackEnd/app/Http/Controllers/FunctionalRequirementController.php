<?php

namespace App\Http\Controllers;

use App\Models\FunctionalRequirement;
use App\Models\Collaborator;
use Carbon\Carbon;
use App\Models\Version;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use function PHPUnit\Framework\isEmpty;

class FunctionalRequirementController extends Controller
{


    /**
     * @OA\Get(
     *   tags={"Functional Requirements"},
     *   path="/api/functionalrequirement/{id}",
     *   summary="Get functional requirements data by id, (*estimationTime & elapsedTime in minutes*)",
     *     @OA\Response(response="200", description="Successful operation"),
     *     @OA\Response(response="404", description="Functionnal requirement not found"),
     *     @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Functional requirement ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     * )
     */
    public function getFunctionalRequirementById($id){

        $f = DB::table('functional_requirement')->where('id', $id)->get()->first();
        if (!$f)
            return response()->json("Functionnal requirement not found ", 404);

        $f->author = DB::table('Collaborator')->selectRaw("id, CONCAT(firstName, ' ', lastName) as full_name")->where('id', $f->author)->get()->first();
        $f->responsible = DB::table('Collaborator')->selectRaw("id, CONCAT(firstName, ' ', lastName) as full_name")->where('id', $f->responsible)->get()->first();
        $f->endDate = date("Y-m-d H:m", strtotime($f->creationDate) + $f->estimationTime*60*1000);
        $f->status =  $f->elapsedTime < $f->estimationTime ? 1 : 0 ;
        return response()->json($f, 200);
    }

    /**
     * @OA\put(
     *   tags={"Functional Requirements"},
     *   path="/api/functionalrequirement/update/{id}",
     *   summary="Update functional requirement (Description, elapsedTime, estimationTime, responsible)",
     *      @OA\Response(response="200", description="Update successfull"),
     *      @OA\Response(response="404", description="Functional requirement not found"),
     *      @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Functional requirement to be updated",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *           @OA\Property(property="description", type="string", example="New description"),
     *           @OA\Property(property="elapsedTime", type="integer", example=4800),
     *           @OA\Property(property="estimationTime", type="integer", example=7200),
     *           @OA\Property(property="responsible", type="integer", example=2),
     *      )
     *    )
     * )
     */
    public function updateFunctionRequirement(Request $request, $id){
        $f =FunctionalRequirement::find($id)->get()->first();
        if (!$f)
            return response()->json("Functionnal requirement not found ", 404);
        if($request->has('title')){
            $f->title = $request->title;
        }
        if($request->has('description')){
            $f->description = $request->description;
        }
        if($request->has('elapsedTime')){
            $f->elapsedTime = $request->elapsedTime;
        }
        if($request->has('estimationTime')){
            $f->estimationTime = $request->estimationTime;
        }
        if($request->has('responsible')){
            $f->responsible = $request->responsible;
        }
        $f->update();
        return $this->getFunctionalRequirementById($id);
    }

    /**
     * @OA\put(
     *   tags={"Functional Requirements"},
     *   path="/api/functionalrequirementStatusKanban/update/{id}",
     *   summary="Update functional requirement statusKanban By its Id",
     *      @OA\Response(response="200", description="Update successfull"),
     *      @OA\Response(response="404", description="Functional requirement not found"),
     *      @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Functional requirement to be updated",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *           @OA\Property(property="statusKanban", type="integer", example="2"),
     *      )
     *    )
     * )
     */
    public function updateStatusKanban(Request $request, $id){
        $f = FunctionalRequirement::select()->where('id', $id)->get()->first();
        if (!$f)
            return response()->json("Functionnal requirement not found ", 404);
        $f->statusKanban = $request->statusKanban;
        $f->update();
        return $this->getFunctionalRequirementById($id);
    }

    /**
     * @OA\Get(
     *   tags={"Functional Requirements"},
     *   path="/api/version/{idVersion}/functionalrequirements",
     *   summary="Returns all functional requirements of a version",
     *     @OA\Response(response="200", description="Successful operation"),
     *     @OA\Response(response="404", description="Version not found "),
     *     @OA\Response(response="500", description="Server error "),


     *      @OA\Parameter(
     *      name="idVersion",
     *      in="path",
     *      required=true,
     *      description="Version ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     * )
     */
    public function getFunctionalRequirementsByVersion(Request $request, $idVersion)
    {
        $fr = DB::table('functional_requirement')->whereRaw('parentId is null AND version = ?', $idVersion)->get()->toArray();
        if ($fr) {
            foreach ($fr as $f) {
                $f->dependecies = DB::table('dependencies')->where('dependentTask', $f->id)->get();
                $f->author = DB::table('Collaborator')->selectRaw("id, CONCAT(firstName, ' ', lastName) as full_name")->where('id', $f->author)->get()->first();
                $f->responsible = DB::table('Collaborator')->selectRaw("id, CONCAT(firstName, ' ', lastName) as full_name")->where('id', $f->responsible)->get()->first();
                $f = $this->getChildren($f);
            }
            return response()->json($fr, 200);
        }
        return response()->json("Version not found ", 404);
    }

    /**
     * @OA\Get(
     *   tags={"Functional Requirements"},
     *   path="/api/version/{idVersion}/calendar_functional_requirements",
     *   summary="Returns the title, the author's name, start date, projected end and status of a Functional Requirements by version",
     *     @OA\Response(response="200", description="Successful operation"),
     *     @OA\Response(response="404", description="Version not found "),
     *     @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="idVersion",
     *      in="path",
     *      required=true,
     *      description="Version ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     * )
     */
    public function getFunctionalRequirementsByVersion2(Request $request, $idVersion){

        $fr = DB::table('functional_requirement')->whereRaw('version = ?', $idVersion)
        ->get(['id', 'title','description','author', DB::raw("DATE_FORMAT(creationDate, '%Y-%c-%d') as start"), 'estimationTime', 'elapsedTime'])
        ->toArray();
        if ($fr) {
            foreach ($fr as $f) {
                $f->author = Collaborator::select(DB::raw("CONCAT(firstName, ' ', lastName) as full_name"))->where('id', $f->author)->get()->value('full_name');
                $f->end = Carbon::parse($f->start)->addMinutes($f->estimationTime)->toDateString();
                $f->status =  $f->elapsedTime < $f->estimationTime ;
            }
        return response()->json($fr, 200);
        }
        return response()->json("Version not found ", 404);
    }


    public function getChildren($parent)
    {
        $parent->functional_requirements = DB::table("functional_requirement")->where("parentId", $parent->id)->get()->toArray();
        foreach ($parent->functional_requirements as $f) {
            $f->dependecies = DB::table('dependencies')->where('dependentTask', $f->id)->get();
            $f->author = DB::table('Collaborator')->selectRaw("id, CONCAT(firstName, ' ', lastName) as full_name")->where('id', $f->author)->get()->first();
            $f->responsible = DB::table('Collaborator')->selectRaw("id, CONCAT(firstName, ' ', lastName) as full_name")->where('id', $f->responsible)->get()->first();
            $f = $this->getChildren($f);
        }
        return $parent;
    }
    /**
     * @OA\post(
     *   tags={"Functional Requirements"},
     *   path="/api/version/{idVersion}/functionalrequirements",
     *   summary="Add a functional requirement",
     *      @OA\Response(response="201", description="Successful operation"),
     *      @OA\Response(response="404", description="Version not found"),
     *      @OA\Response(response="500", description="Server error"),


     *      @OA\Parameter(
     *      name="idVersion",
     *      in="path",
     *      required=true,
     *      description=" Version ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"title,description,parentId,author,estimationTime"},
     *           @OA\Property(property="title", type="string", example= "Title"),
     *           @OA\Property(property="description", type="string", example= "Functional requirement description"),
     *           @OA\Property(property="parentId", type="integer",example=1),
     *           @OA\Property(property="author", type="integer",example=1),
     *           @OA\Property(property="estimationTime", type="integer",example=1),
     *      )
     *    )
     * )
     */
    public function addFunctionalRequirement(Request $request, $idVersion)
        {
            $version = Version::find($idVersion);
        if (is_null($version))
            return response()->json('Version not found  !', 404);

        $fr = FunctionalRequirement::create([
            'version' => $idVersion,
            'title' => $request->title,
            'description' => $request->description,
            'author' => $request->author,
            'estimationTime' => $request->estimationTime,
            'elapsedTime' =>0,
        ]);
        if($request->parentId != null){
            $fr->parentId = $request->parentId;
            $fr->update();
        }
        $fr = FunctionalRequirement::find($fr->id);
        $fr->author = DB::table('Collaborator')->selectRaw("id, CONCAT(firstName, ' ', lastName) as full_name")->where('id', $fr->author)->get()->first();
        $fr->responsible = DB::table('Collaborator')->selectRaw("id, CONCAT(firstName, ' ', lastName) as full_name")->where('id', $fr->responsible)->get()->first();
        return response()->json($fr, 201);
    }


    /**
     * @OA\POST(
     *     path="/api/version/{idVersion}/multiple-functional-requirements",
     *     summary = "To insert a requirement without a parent,we set the value 0 to the parent field",
     *     summary="Insert several functional requirements",
     *     tags={"Functional Requirements"},
     * @OA\Parameter(
     *      name="idVersion",
     *      in="path",
     *      required=true,
     *      description="Version ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\RequestBody(
     *        required = true,
     *        description = "Set of requirements to be inserted",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                property="functional_requirements",
     *                type="array",
     *                example={{
     *                  "author": 1,
     *                  "description": "Exemple 1",
     *                  "parentId":1
     *                }, {
     *                  "author": 1,
     *                  "description": "Exemple 2",
     *                  "parentId":1
     *                }},
     *                @OA\Items(
     *                      @OA\Property(
     *                         property="author",
     *                         type="integer",
     *                         example="1"
     *                      ),
     *                      @OA\Property(
     *                         property="description",
     *                         type="string",
     *                         example="New description for the functional requirement"
     *                      ),
     *                       @OA\Property(
     *                         property="parentID",
     *                         type="integer",
     *                         example=1
     *                      ),
     *                ),
     *             ),
     *        ),
     *     ),
     *     @OA\Response(
     *        response="201",
     *        description="Successful operation"),
     *      @OA\Response(response="404", description="Version not found"),

     *      @OA\Response(response="500", description="Server error ")


     *
     * )
     */
    public function addManyFunctionalRequirement(Request $request, $idVersion)
    {
        $version = Version::find($idVersion);
        if (is_null($version))
            return response()->json('Version not found  !', 404);

        for ($i = 0; $i < count($request->functional_requirements); $i++) {
            $fn = FunctionalRequirement::create([
                'version' => $idVersion,
                'title' => $request->functional_requirements[$i]["title"],
                'description' => $request->functional_requirements[$i]["description"],
                'author' => $request->functional_requirements[$i]["author"],
            ]);
            $fn->parentId = $request->functional_requirements[$i]["parentId"];
            $fn->update();
        }
        return response()->json('Functional requirements added successfully', 201);
    }

    /**
     * @OA\delete(
     *   tags={"Functional Requirements"},
     *   path="/api/functionalrequirement/{idFunctionalrequirement}",
     *   summary="Delete a functional requirement",
     *   security = {{ "apiAuth": {""} }},
     *      @OA\Parameter(
     *      name="idFunctionalrequirement",
     *      in="path",
     *      required=true,
     *      description="Functional requirement ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *       @OA\Response(response="404", description="Functional requirement not found"),

     *      @OA\Response(
     *      response=500,
     *      description="Server error"
     *      ),
     *
     *  )
     */
    public function deleteFunctionalRequirement(Request $request, $idFunctionalRequirement)
    {
        $fr = FunctionalRequirement::find($idFunctionalRequirement);
        if ($fr) {
            $fr->delete();
            return response()->json(['Functional requirement deleted !'], 200);
        }
        return response()->json("Functional requirement not found ", 404);
    }

    /**
     * @OA\delete(
     *     path="/api/multiple-functional-requirements",
     *     summary="Delete several functional requirements",
     *     tags={"Functional Requirements"},
     *     @OA\RequestBody(
     *        required = true,
     *        description = "Set of requirements to be deleted",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                property="functional_requirements",
     *                type="array",
     *                example={1, 2},
     *                @OA\Items(
     *                      @OA\Property(
     *                         type="integer",
     *                         example="1"
     *                      ),
     *                ),
     *             ),
     *        ),
     *     ),
     *     @OA\Response(
     *        response="200",
     *        description="Successful operation"
     *     ),
     *     @OA\Response(response="404", description=" Some functional requirement not found "),
     *     @OA\Response(response="500", description="Server error "),


     * )
     */
    public function deleteManyFunctionalRequirement(Request $request)
    {
        $test = false;
        for ($i = 0; $i < count($request->functional_requirements); $i++) {
            $fr = FunctionalRequirement::find($request->functional_requirements[$i]);
            if (is_null($fr) == false)
                $fr->delete();
            else
                $test = true;
        }
        if ($test)
            return response()->json('Some functional requirements were not deleted', 404);

        return response()->json('Functional requirements deleted', 200);
    }
    /**
     * @OA\put(
     *   tags={"Functional Requirements"},
     *   path="/api/functional-requirements-titles",
     *   summary="Modify Functional Requirements titles",
     *      @OA\RequestBody(
     *        required = true,
     *        description = "Set of peers ID and title",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                property="frsToUpdate",
     *                type="array",
     *                example={{
     *                  "id": 2,
     *                  "description": "New title for ID 2"
     *                }, {
     *                  "id": 3,
     *                  "description": "New title for ID 3"
     *                }},
     *                @OA\Items(
     *
     *
     *                      @OA\Property(
     *                         property="id",
     *                         type="integer",
     *                         example="1"
     *                      ),
     *                      @OA\Property(
     *                         property="parent",
     *                         type="string",
     *                         example="New title"
     *                      ),
     *                ),
     *             ),
     *        ),
     *     ),
     *     @OA\Response(
     *        response="200",
     *        description="Successful operation"
     *     ),
     *     @OA\Response(response="500", description="Server error "),

     * )
     */
    public function updateManyFunctionalRequirementTitle(Request $request)
    {
        foreach ($request->frsToUpdate as $keys) {
            FunctionalRequirement::find($keys["id"])->update(array('title' => $keys["title"]));
        }

        return response()->json('Functional requirements updated successfully', 200);
    }



    /**
     * @OA\put(
     *   tags={"Functional Requirements"},
     *   path="/api/updateHierarchy",
     *   summary="Update an hierarchy",
     *      @OA\RequestBody(
     *        required = true,
     *        description = "Set of peers ID and ParentID",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                property="frsToUpdate",
     *                type="array",
     *                example={{
     *                  "id": 2,
     *                  "parentId": 1
     *                }, {
     *                  "id": 3,
     *                  "parentId": 2
     *                }},
     *                @OA\Items(
     *                      @OA\Property(
     *                         property="id",
     *                         type="integer",
     *                         example="1"
     *                      ),
     *                      @OA\Property(
     *                         property="parentId",
     *                         type="integer",
     *                         example="2"
     *                      ),
     *                ),
     *             ),
     *        ),
     *     ),
     *     @OA\Response(
     *        response="200",
     *        description="Successful operation"
     *     ),
     *      @OA\Response(response="404", description="Functional requirement not found"),

     *     @OA\Response(response="500", description="Server error "),

     * )
     */

    public function updateHierarchy(Request $request)
    {
        $test = false;
        foreach ($request->frsToUpdate as $keys) {
            $fr = FunctionalRequirement::find($keys["id"]);
            if (is_NUll($fr))
                $test = true;
            else {
                $fr->parentId = $keys["parentId"];
                $fr->update();
            }
        }
        if ($test)
            return response()->json('Some functional requirement not found !', 404);

        return response()->json('Hierarchy updated !', 200);
    }
}

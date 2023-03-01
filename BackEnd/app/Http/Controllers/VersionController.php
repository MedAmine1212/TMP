<?php

namespace App\Http\Controllers;

use App\Models\Version;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\FunctionalRequirement;
use Illuminate\Support\Facades\DB;
use function PHPUnit\Framework\isNull;

class VersionController extends Controller
{

    public function getFr($id) {
        $fr = DB::table('functional_requirement')->whereRaw('parentId is null AND version = ?', $id)->get()->toArray();
        if ($fr) {

            foreach ($fr as $f) {
                $f = (new FunctionalRequirementController)->getChildren($f);
            }
            return $fr;
        }
    }
    /**
     * @OA\Get(
     *   tags={"Versions"},
     *   path="/api/version/getAllByProjectId/{id}",
     *   summary="Returns all versions of a given project",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="204", description="Project has no versions yet !"),
     *     @OA\Response(response="404", description="Project not found "),
     *     @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Project ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     * )
     */
    public function getAllByProject($id)
    {
        $project = DB::table("project")->where("id", $id)->get();

        if (!$project)
            return response()->json("Project not found !", 404);
        $versions = DB::table('version')->where('project', $id)->get()->toArray();
        if (!$versions)
            return response()->json("Project has no versions yet !", 204);
//         remove comment if u want to return the Versions + all the Functional requirements
//        foreach ($versions as $v) {
//            $v->functional_requirements = $this->getFr($v->id);
//        }
        foreach($versions as $v)
        {
            $v->frcount = count(DB::table('functional_requirement')->where('version', $v->id)->get()->toArray());
        }
        return response()->json($versions, 200);
    }

    /**
     * @OA\post(
     *   tags={"Versions"},
     *   path="/api/version/create/{id}",
     *   summary="Create a new version based on an old version",
     *      @OA\Response(response="201", description="Successful operation"),
     *      @OA\Response(response="404", description="Version not found"),
     *      @OA\Response(response="500", description="Server error"),


     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Old version ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"number,startDate,endDate"},
     *           @OA\Property(property="number", type="string", example= "Version number"),
     *           @OA\Property(property="startDate", type="timestamp",example="2022-08-31 08:00:00"),
     *           @OA\Property(property="endDate", type="timestamp",example="2022-09-05 18:31:32"),
     *      )
     *    )
     * )
     */
    public function createVersion(Request $request, $id): JsonResponse
    {
        $v = Version::find($id);
        if (is_null($v))
            return response()->json('Version not found  !', 404);

        $version = Version::create([
            'number' => $request->number,
            'startDate' => $request->startDate,
            'endDate' => $request->endDate,
            'project' => $v->project,
        ]);
        $frs = DB::table('functional_requirement')->where('version', $id)->get()->toArray();
        if ($frs) {
            $parentIds = [];
            foreach ($frs as $fr) {
               $f = FunctionalRequirement::create([
                    'version' => $version->id,
                    'author' => $fr->author,
                    'title' => $fr->title,
                    'estimationTime' => $fr->estimationTime,
                    'elapsedTime' => $fr->elapsedTime,
                    'responsible' => $fr->responsible,
                    'statusKanban' => $fr->statusKanban,
                    'backlogID' => $fr->backlogID,
                    'description' => $fr->description,
                ]);
               $parentIds[$fr->id] = $f->id;


            }

            // this process takes time => can be optimised with creating a job for it

            foreach ($frs as $fr) {
                if (!is_null($fr->parentId)) {
                    $f = FunctionalRequirement::find($parentIds[$fr->id]);
                    $f->parentId = $parentIds[$fr->parentId];
                    $f->update();
                }
            }
        }
        // remove comment if u want to return the Version + all the Functional requirements
        // $version->functional_requirements = $this->getFr($version->id);

        return response()->json($version, 201);
    }


    /**
     * @OA\put(
     *   tags={"Versions"},
     *   path="/api/version/update/{id}",
     *   summary="Update the number of a version",
     *      @OA\Response(response="200", description="Operation successfull !"),
     *      @OA\Response(response="404", description="Version not found"),
     *      @OA\Response(response="500", description="Server error "),


     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Version ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"number"},
     *           @OA\Property(property="number", type="string", example= "0.0.0"),
     *      )
     *    )
     * )
     */
    public function updateVersion(Request $request, $id)
    {
        $version = Version::find($id);
        if (!$version)
            return response()->json("Version not found ", 404);
        $version->number = $request->number;
        $version->update();
        return response()->json($version, 200);
    }

    /**
     * @OA\delete(
     *   tags={"Versions"},
     *   path="/api/version/delete/{id}",
     *   summary="Delete a version by ID and all it's functionnal requirements",
     *   security = {{ "apiAuth": {""} }},
     *      @OA\Parameter(
     *      name="id",
     *      in="path",
     *      required=true,
     *      description="Version ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *     @OA\Response(
     *          response=200,
     *          description="Version deleted !"
     *      ),
     *       @OA\Response(response="404", description="Version not found"),

     *      @OA\Response(
     *      response=500,
     *      description="Server error"
     *      ),
     *
     *  )
     */
    public function deleteVersionById($id) {
        $v = Version::find($id);
        if ($v) {
            $v->delete();
            return response()->json(['Version deleted !'], 200);
        }
        return response()->json("Version not found ", 404);
    }
}

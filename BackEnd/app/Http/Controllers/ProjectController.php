<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use DB;
use Illuminate\Support\Facades\Cookie;



class ProjectController extends Controller
{

     /**
     * @OA\Get(
     *   tags={"Project"},
     *   path="/api/project/{idOwner}",
     *   summary="Returns All Project By Owner ID",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="404", description="Project not found "),
     *     @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="idOwner",
     *      in="path",
     *      required=true,
     *      description="Owner ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     * )
     */
    public function getAllProjectByOwnerID($idOwner){
        $pro = DB::table("project")->where("owner", $idOwner)->get();
        return response()->json($pro);

    }
      /**
     * @OA\put(
     *   tags={"Project"},
     *   path="/api/project/{idProject}",
     *   summary="Update Project name, description and githubRepo",
     *      @OA\Response(response="200", description="OK"),
     *      @OA\Response(response="404", description="Project not found"),
     *      @OA\Parameter(
     *      name="idProject",
     *      in="path",
     *      required=true,
     *      description="Project ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *           @OA\Property(property="name", type="string", example= "Platforme"),
     *           @OA\Property(property="description", type="string", example= "Platforme E-learning"),
     *           @OA\Property(property="githubRepo", type="string", example= "github.com/..."),
     *      )
     *    )
     * )
     */
   public function UpdateProjectByID(Request $request, $idProject){
    $project = Project::find($idProject)->get()->first();
        if(!$project)
            return response()->json("Project not found ", 404);
        if($request->has('name')){
            $project->name = $request->name;
        }
        if($request->has('description')){
            $project->description = $request->description;
        }
        if($request->has('githubRepo')){
            $project->githubRepo = $request->githubRepo;
        }
        $project->update();
    return response()->json($project, 200);

   }

       /**
     * @OA\post(
     *     path="/api/project",
     *     summary="Add Project",
     *     tags={"Project"},
     *     @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"name,type,githubRepo"},
     *           @OA\Property(property="name", type="string", example= "IT"),
     *           @OA\Property(property="type", type="string", example= "LMS"),
     *           @OA\Property(property="githubRepo", type="string", example= "MohamedNabli004")
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      )
     * )
     */
public function AddProject(Request $request){
    project::create([
        'name' => $request->name,
        'type' => $request->type,
        'githubRepo' => $request->githubRepo
    ]);
    return response()->json('Project Added');


}
        /**
     * @OA\delete(
     *   tags={"Project"},
     *   path="/api/project/{idProject}",
     *   summary="Remove a Project If Project  isn't currently being worked on by a SCRUM team",
     *     @OA\Parameter(
     *      name="idProject",
     *      in="path",
     *      required=true,
     *      description="Project ID",
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
     *          description="Project not found"
     *      ),
     *  )
     */
       public function removeProjectByID($idProject){
        $projet = DB::table('works_on')->where('idProject', $idProject)->first();
        if(is_null($projet) == true){
            Project::find($idProject)->delete();
            return response()->json(['projects deleted !'], 200);
        }else{
            return response()->json(['project currently worked on !'], 201);
        }
       }


/**
     * @OA\Get(
     *   tags={"Project"},
     *   path="/api/projects",
     *   summary="Returns all projects",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="204", description="Project has no versions yet !"),
     *     @OA\Response(response="404", description="No project found "),
     *     @OA\Response(response="500", description="Server error "),
     * )
     */
    public function getProjects(){
        return Project::all();
    }

       /**
     * @OA\Get(
     *   tags={"Project"},
     *   path="/api/collaborator/{idCollaborator}/projects",
     *   summary="Get projects worked on by collaborator",
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
     *          response=201,
     *          description="No affected team or project !"
     *      ),
     *  )
     */
    public function getProjectByCollaboratorID($idCollaborator){
        $join_team = DB::table('join_team')->where('idCollaborator', $idCollaborator)->where('status', "1")->first();
        if(is_null($join_team))
        {
            return response()->json(['collaborator not affect to scrum team !'], 201);
        }
        else
        {
            $works_on = DB::table('works_on')->where('idSCRUMTeam', $join_team->idSCRUMTeam)->where('status', "1")->first();
            if(is_null($works_on))
            {
                return response()->json(['Collaborators team has no affected project'], 201);
            }
            else
            {
                $project = Project::find($works_on->idProject);
                return response()->json($project, 200);
            }
        }

    }

}

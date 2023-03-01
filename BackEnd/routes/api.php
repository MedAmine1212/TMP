<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VersionController;
use App\Http\Controllers\FunctionalRequirementController;
use App\Http\Controllers\ScrumTeamController;
use App\Http\Controllers\JoinTeamController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CollaboratorController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\WorksonController;


use App\Http\Controllers\kanbanTableController;
use App\Http\Controllers\MeetingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
/*************************************** Projects routes ************************************************** */

        Route::get('projects',[ProjectController::class,'getProjects']);

/*************************************** End Projects routes ************************************************** */

/***************************************Versions routes ************************************************** */
//Route::middleware('auth:sanctum')->group(function () {


    Route::get('version/getAllByProjectId/{id}', [VersionController::class, 'getAllByProject']);
    Route::post('version/create/{id}', [VersionController::class, 'createVersion']);
    Route::put('version/update/{id}', [VersionController::class, 'updateVersion']);
    Route::delete('version/delete/{id}', [VersionController::class, 'deleteVersionById']);

/***************************************End versions routes ************************************************** */

/***************************************Functional requirements routes ************************************************** */
Route::prefix('version/{idVersion}')->group(function () {
    Route::get('functionalrequirements', [FunctionalRequirementController::class, 'getFunctionalRequirementsByVersion']);
    Route::get('calendar_functional_requirements', [FunctionalRequirementController::class, 'getFunctionalRequirementsByVersion2']);
    Route::post('functionalrequirements', [FunctionalRequirementController::class, 'addFunctionalRequirement']);

    Route::post('multiple-functional-requirements', [FunctionalRequirementController::class, 'addManyFunctionalRequirement']);
});
Route::get('functionalrequirement/{id}', [FunctionalRequirementController::class, 'getFunctionalRequirementById']);

Route::put('functionalrequirement/update/{id}', [FunctionalRequirementController::class, 'updateFunctionRequirement']);

Route::put('functionalrequirementStatusKanban/update/{id}', [FunctionalRequirementController::class, 'updateStatusKanban']);

Route::delete('multiple-functional-requirements', [FunctionalRequirementController::class, 'deleteManyFunctionalRequirement']);
Route::delete('functionalrequirement/{idFunctionalrequirement}', [FunctionalRequirementController::class, 'deleteFunctionalRequirement']);
Route::put('functional-requirements-titles', [FunctionalRequirementController::class, 'updateManyFunctionalRequirementTitle']);

/***************************************End functional requirements routes ************************************************** */


/***************************************Authentication routes ************************************************** */


/***************************************End Authentication  routes ************************************************** */

/***************************************Kanban coulumn routes ************************************************** */
Route::get('/kanbanColumns/{idKanbanTable}',[kanbanTableController::class,'getAllColumns']);

Route::post('/createkanbanColumn/{idKanbanTable}',[kanbanTableController::class,'createColumn']);

Route::delete('/deletekanbanColumn/{idColumn}',[kanbanTableController::class,'deleteColumn']);

Route::put('/updatekanbanColumnName/{idColumn}',[kanbanTableController::class,'updateColumnName']);

/***************************************End Kanban column  routes ************************************************** */

Route::put('/updateHierarchy', [FunctionalRequirementController::class, 'updateHierarchy']);

/*     Collaborators Management    */

Route::get('/nonActiveCollab', [CollaboratorController::class, 'getNonActiveCollabs']);
Route::get('/getCurrentScrumTeam/{id}', [CollaboratorController::class, 'getCurrentScrumTeam']);
Route::get('/getInvitesByCollabId/{id}', [CollaboratorController::class, 'getInvitesByCollabId']);
Route::get('/acceptInvitation/{id}', [JoinTeamController::class, 'acceptInvitaion']);
//to delete use cancel invite API

/*      Scrum Team Management       */

Route::delete('/cancelInvite/{id}', [JoinTeamController::class, 'cancelInvite']);
Route::post('/scrumTeam', [ScrumTeamController::class, 'addScrumTeam']);

Route::get('/getAllScrumTeams', [ScrumTeamController::class, 'getAllScrumTeams']);

Route::get('/getScrumTeamById/{idScrumTeam}', [ScrumTeamController::class, 'getScrumTeamById']);

Route::get('/getScrumTeamsByProductOwner/{idProductOwner}', [ScrumTeamController::class, 'getScrumTeamByProductOwner']);

Route::post('/assignProjectToScrumTeam', [WorksonController::class, 'AssignProjectToTeam']);

Route::delete('/deleteScrumTeam/{idScrumTeam}', [ScrumTeamController::class, 'deleteScrumTeam']);

Route::post('/assignCollaboratorToScrumTeam', [JoinTeamController::class, 'AssignCollaboratorToTeam']);

Route::delete('/scrumteam/{idSCRUMTeam}/remove/{idCollaborator}', [JoinTeamController::class, 'RemoveCollaboratorFromTeam']);



Route::put('/scrumteam/{idSCRUMTeam}/collaborator/{idCollaborator}/role', [JoinTeamController::class, 'UpdateCollaboratorRole']);

Route::get('/scrumteam/{idScrumTeam}', [ScrumTeamController::class,'getScrumTeam']);

Route::get('/currentscrumteam/project/{idProject}',[ScrumTeamController::class,'getProjectCurrentScrumTeam']);

Route::get('/scrumteam/project/{idProject}',[ScrumTeamController::class,'getProjectScrumTeam']);

// Authentification routes
// groupe of methods allowed to use juste if you are authenticated

Route::get('user',[AuthController::class,'user']);
Route::post('logout',[AuthController::class,'logout']);

/* GET collaborator information by ID */
Route::get('/collaborator/{idCollaborator}', 'App\Http\Controllers\CollaboratorController@getCollaborator');
/* PUT collaborator information by ID */
Route::put('/collaborator/{idCollaborator}', 'App\Http\Controllers\CollaboratorController@updateCollaborator');
// get all collaborators
Route::get('getCollaborators',[CollaboratorController::class,'getCollaborators']);

Route::delete('/deleteCollaborator/{idCollaborator}',[CollaboratorController::class,'deleteCollaborator']);
Route::post('/uploadPicture/{idCollaborator}',[CollaboratorController::class,'uploadPicture']);







Route::post('sendEmailInvitation',[CollaboratorController::class,'sendEmailInvitation']);


Route::post('sendEmail',[MailController::class,'sendEmail']);


//});

Route::post('login',[AuthController::class,'login']);
Route::post('verifyInvitationToken',[CollaboratorController::class,'verifyInvitationToken']);
Route::post('createAccountCollaborator',[CollaboratorController::class,'createAccountCollaborator']);

Route::post('forgotPasswordRequest',[ForgotPasswordController::class,'forgotPasswordRequest']);

Route::post('forgetPasswordVerifyToken',[ForgotPasswordController::class,'forgetPasswordVerifyToken']);
Route::post('changePasswordCollaborator',[CollaboratorController::class,'changePasswordCollaborator']);





/* GET all projects by owner ID */
Route::get('/project/{idOwner}', 'App\Http\Controllers\ProjectController@getAllProjectByOwnerID');

/* POST project : Creates a new project (requires name + github repo + type) */
Route::post('/project', 'App\Http\Controllers\ProjectController@AddProject');

/* DELETE project by ID : Deletes all versions and functional requirements (Cannot be deleted if the project is currently being worked on by a SCRUM team) */
Route::delete('/project/{idProject}', 'App\Http\Controllers\ProjectController@removeProjectByID');

/* PUT project by ID : modifies the description and/or title and/or github repository. */
Route::put('/project/{idProject}','App\Http\Controllers\ProjectController@UpdateProjectByID');

/* GET : retrieves all labels */
Route::get('/labels','App\Http\Controllers\labelsController@getAllLabels');

/* PUT : Modifies the label color and/or name and/or description */
Route::put('/labels/{idLabels}','App\Http\Controllers\labelsController@UpdateLabelsByID');

/* POST : creates a new label (must have name + color, description is optional) */
Route::post('/labels', 'App\Http\Controllers\labelsController@AddLabels');

/* DELETE : Deletes a label but only if it’s not used in any functional requirement */
Route::delete('/labels/{idLabels}', 'App\Http\Controllers\labelsController@removeLabelByID');

/*     Meetings Management       */

Route::post('/scrumteam/{idSCRUMTeam}/meeting',[MeetingController::class,'createMeeting']);
Route::post('/meeting/{idMeeting}/addCollaborator',[MeetingController::class,'inviteCollaborator']);
Route::get('/scrumteam/{idSCRUMTeam}/meetings',[MeetingController::class,'meetingsByScrumTeam']);
Route::get('/collaborator/{idCollaborator}/meetings',[MeetingController::class,'meetingsByCollaborator']);
Route::get('/meeting/{idMeeting}/uninvited',[MeetingController::class, 'getUninvitedCollaborators']);
Route::delete('/joinmeeting/{idJoinMeeting}/cancelInvite',[MeetingController::class,'cancelInvitation']);
Route::put('/joinmeeting/{idJoinMeeting}/declareAbsence',[MeetingController::class,'declareAbsence']);

<?php

namespace App\Http\Controllers;

use App\Models\KanbanColumn;
use App\Models\KanbanTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class kanbanTableController extends Controller
{
    /**
     * @OA\Get(
     *   tags={"Kanban Columns"},
     *   path="/api/kanbanColumns/{idKanbanTable}",
     *   summary="Returns All Columns By Kanban table ID",
     *     @OA\Response(response="200", description="Successful operation !"),
     *     @OA\Response(response="404", description="Project not found "),
     *     @OA\Response(response="500", description="Server error "),
     *      @OA\Parameter(
     *      name="idKanbanTable",
     *      in="path",
     *      required=true,
     *      description="Kanban table ID",
     *      @OA\Schema(
     *           type="integer"
     *           )
     *      ),
     * )
     */
    public function getAllColumns($idKanbanTable){
        $columns = DB::table("kanban_column")->where("kanbanTable", $idKanbanTable)->get()->toArray();
        return response()->json($columns);
    }

    /**
     * @OA\post(
     *   tags={"Kanban Columns"},
     *   path="/api/createkanbanColumn/{idKanbanTable}",
     *   summary="Create a new column in a kanban table",
     *      @OA\Response(response="201", description="Successful operation"),
     *      @OA\Response(response="404", description="kanban table not found"),
     *      @OA\Response(response="500", description="Server error"),
     *      @OA\Parameter(
     *      name="idKanbanTable",
     *      in="path",
     *      required=true,
     *      description="Kanaban table ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"name"},
     *           @OA\Property(property="name", type="string", example= "To Do"),
     *           @OA\Property(property="order", type="intger",example="1"),
     *      )
     *    )
     * )
     */
    public function createColumn(Request $request, $idKanbanTable)
    {
        $KanbanTable = KanbanTable::find($idKanbanTable);
        if (is_null($KanbanTable))
            return response()->json('KanbanTable not found  !', 404);

        $column = KanbanColumn::create([
            'name' => $request->name,
            'kanbanTable' => $idKanbanTable,
            'order' => $request->order
        ]);
        return response()->json($column, 201);
    }

    /**
     * @OA\delete(
     *     path="/api/deletekanbanColumn/{idColumn}",
     *     summary="Delete a column from the kanban table and updates the rest of the columns orders",
     *     tags={"Kanban Columns"},
     *     @OA\Parameter(
     *      name="idColumn",
     *      in="path",
     *      required=true,
     *      description="Column ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     * 
     *     @OA\Response(
     *        response="200",
     *        description="Successful operation"
     *     ),
     *     @OA\Response(response="404", description="Column not found"),
     *     @OA\Response(response="500", description="Server error"),
     * )
     */
    public function deleteColumn($idColumn){
        $column = KanbanColumn::find($idColumn);
        if (is_null($column))
            return response()->json('Column not found  !', 404);
        $idKanbanTable = $column->kanbanTable;
        $columnOrder = $column->order;
        $column->delete();
        $columns = DB::table("kanban_column")->where("kanbanTable", $idKanbanTable)->get();
        foreach ($columns as $column) {
            if($columnOrder < $column->order)
            kanbanColumn::find($column->id)->update(array('order' => $column->order - 1));
        }
        $columns = DB::table("kanban_column")->where("kanbanTable", $idKanbanTable)->get();
        return response()->json($columns, 201);
    }

    /**
     * @OA\put(
     *   tags={"Kanban Columns"},
     *   path="/api/updatekanbanColumnName/{idColumn}",
     *   summary="Modifies the column name by ID",
     *      @OA\Response(response="201", description="Successful operation"),
     *      @OA\Response(response="404", description="column not found"),
     *      @OA\Response(response="500", description="Server error"),
     *      @OA\Parameter(
     *      name="idColumn",
     *      in="path",
     *      required=true,
     *      description="Column ID",
     *      @OA\Schema(
     *           type="string"
     *           )
     *      ),
     *      @OA\RequestBody(
     *      required=true,
     *      @OA\JsonContent(
     *        type="object",
     *        required={"name"},
     *           @OA\Property(property="name", type="string", example= "To Do"),
     *      )
     *    )
     * )
     */
    public function updateColumnName(Request $request, $idColumn){
        $column = KanbanColumn::find($idColumn);
        if (is_null($column))
            return response()->json('Column not found  !', 404);
        $column->update(array('name' => $request->name));
        return response()->json('Column updated', 201);
    }
}

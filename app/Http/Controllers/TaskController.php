<?php

namespace App\Http\Controllers;

use App\Exceptions\DatabaseException;
use App\Exceptions\ModelNotFoundException;
use App\Exceptions\ValidationException;
use Exception;
use App\Models\Task;
use Illuminate\Http\Request;

/**
 * Handles task-related API requests.
 * Uses Route Model Binding for tasks.
 */
class TaskController extends Controller
{
    /**
     * Get all tasks.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function index()
    {
        try {
            return response()->json(Task::all());
        } catch (Exception $e) {
            throw new DatabaseException('Failed to retrieve tasks.', 500, $e);
        }
    }

    /**
     * Create a new task.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @OA\Post(
     *     path="/api/tasks",
     *     summary="Create a new task",
     *     tags={"Tasks"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id", "title"},
     *             @OA\Property(property="user_id", type="integer", description="ID of the user who owns the task"),
     *             @OA\Property(property="title", type="string", description="Title of the task")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Task created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Task")
     *     ),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'title' => 'required|string|max:255',
            ]);
            $task = Task::create($validatedData);
            return response()->json($task, 201);
        } catch (ValidationException $e) {
            // Re-throw the validation exception so it can be handled by the handler
            throw $e;
        } catch (Exception $e) {
            throw new DatabaseException('Failed to create task.', 500, $e);
        }
    }

    /**
     * Update a task (mark as completed).
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\JsonResponse The updated task
     */
    public function update(Task $task)
    {
        try {
            $task->completed = true;
            $task->save();
            return response()->json($task);
        } catch (Exception $e) {
            throw new DatabaseException('Failed to update task.', 500, $e);
        }
    }

    /**
     * Delete a task.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Task $task)
    {
        try {
            $task->delete();
            return response()->json(['message' => 'Task deleted']);
        } catch (Exception $e) {
            throw new DatabaseException('Failed to delete task.', 500, $e);
        }
    }
}
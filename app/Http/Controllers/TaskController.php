<?php

namespace App\Http\Controllers;

use App\Exceptions\DatabaseException;
use App\Exceptions\ModelNotFoundException;
use App\Exceptions\ValidationException;
use Exception;
use App\Models\Task;
use Illuminate\Http\Request; // Already present or should be
use Illuminate\Validation\ValidationException as IlluminateValidationException; // For catching Laravel's validation exception

class TaskController extends Controller
{
    /**
     * Get tasks, optionally filtered by user_id, with pagination.
     */
    public function index(Request $request)
    {
        try {
            $query = Task::orderBy('created_at', 'desc');

            // Server-side filtering by user_id
            if ($request->has('user_id')) {
                // Validate user_id (optional but recommended)
                $validated = $request->validate([
                    'user_id' => 'required|integer|exists:users,id',
                ]);
                $query->where('user_id', $validated['user_id']);
            } else {
                // If user_id is strictly required for this endpoint:
                // return response()->json(['message' => 'user_id parameter is required.'], 400);
                // For this app, user_id will always be sent by the frontend when fetching tasks for a user.
                // If not provided, and it's essential, consider returning a 400 error or an empty paginated response.
                // For now, this will return all tasks paginated if no user_id is passed,
                // which might be acceptable for admin roles or specific scenarios.
            }

            // Pagination
            $tasks = $query->paginate(15); // Paginate with 15 items per page

            return response()->json($tasks);

        } catch (IlluminateValidationException $e) { // Catch Laravel's validation exception
             return response()->json([
                 'message' => 'Validation failed.',
                 'errors' => $e->errors(),
             ], 422);
        } catch (Exception $e) {
            throw new DatabaseException('Failed to retrieve tasks.', 500, $e);
        }
    }

    /**
     * Create a new task
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'title' => 'required|string|max:255',
            ]);
            $task = Task::create($validatedData);
            return response()->json($task, 201);
        } catch (IlluminateValidationException $e) { // Catch Laravel's validation exception first
             return response()->json([
                 'message' => 'Validation failed during task creation.',
                 'errors' => $e->errors(),
             ], 422);
        } catch (ValidationException $e) { // Then our custom ValidationException
            throw $e;
        } catch (Exception $e) {
            throw new DatabaseException('Failed to create task. Error: ' . $e->getMessage());
        }
    }

    /**
     * Update a task (mark as completed)
     */
    public function update(Task $task)
    {
        try {
            $task->completed = !$task->completed; // Toggle the completed status
            $task->save();
            return response()->json($task);
        } catch (Exception $e) {
            throw new DatabaseException('Failed to update task. Error: ' . $e->getMessage());
        }
    }

    /**
     * Delete a task
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
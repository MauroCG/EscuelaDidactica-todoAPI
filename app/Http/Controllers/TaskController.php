<?php

namespace App\Http\Controllers;

use App\Exceptions\DatabaseException;
use App\Exceptions\ModelNotFoundException;
use App\Exceptions\ValidationException;
use Exception;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Get all tasks
     */
    public function index()
    {
        try {
            // Getting task in descending order of creation date
            return response()->json(Task::orderBy('created_at', 'desc')->get());

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
        } catch (ValidationException $e) {
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
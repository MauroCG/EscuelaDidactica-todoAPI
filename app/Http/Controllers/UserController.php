<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Exceptions\DatabaseException;
use App\Exceptions\ValidationException;
use Exception;

class UserController extends Controller
{
    /**
     * Get all users
     */
    public function index()
    {
        try {
            $users = User::all();
            return response()->json($users);
        } catch (Exception $e) {
            throw new DatabaseException("Error retrieving users: " . $e->getMessage());
        }
    }

    /**
     * Creates a new user
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
            ]);

            // Creation of the user
            $user = User::create($validatedData);
            return response()->json($user, 201); // Return the created user with a 201 status code
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw new ValidationException("Validation error: " . json_encode($e->errors())); 
        } catch (Exception $e) { // Catch other exceptions
            throw new DatabaseException("Error creating user: " . $e->getMessage());
        }
    }
}
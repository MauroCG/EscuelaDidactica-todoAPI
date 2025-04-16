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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255', // Name is required, a string, and max 255 chars
                'email' => 'required|string|email|max:255|unique:users', // Email is required, a string, a valid email format, and unique in the users table
            ]);

            $user = User::create($validatedData);
            return response()->json($user, 201); // Return the created user with a 201 status code
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw new ValidationException("Validation error: " . json_encode($e->errors())); 
        } catch (Exception $e) { // Catch other exceptions
            throw new DatabaseException("Error creating user: " . $e->getMessage());
        }
    }
}
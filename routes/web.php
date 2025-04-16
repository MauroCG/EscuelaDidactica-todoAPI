<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware' => 'api', 'prefix' => 'api'], function () {
    Route::get('/users', [\App\Http\Controllers\UserController::class, 'index']);
    Route::post('/users', [\App\Http\Controllers\UserController::class, 'store']);

    Route::get('/tasks', [\App\Http\Controllers\TaskController::class, 'index']);
    Route::post('/tasks', [\App\Http\Controllers\TaskController::class, 'store']);
    Route::put('/tasks/{task}', [\App\Http\Controllers\TaskController::class, 'update']); // Assuming Route Model Binding
    Route::delete('/tasks/{task}', [\App\Http\Controllers\TaskController::class, 'destroy']); // Assuming Route Model Binding
});

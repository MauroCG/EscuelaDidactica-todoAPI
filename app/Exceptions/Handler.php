php
<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Database\Eloquent\ModelNotFoundException as LaravelModelNotFoundException;
use Illuminate\Validation\ValidationException as LaravelValidationException;
use Illuminate\Http\JsonResponse;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e): JsonResponse
    {
        if ($e instanceof ModelNotFoundException || $e instanceof LaravelModelNotFoundException) {
            return response()->json([
                'error' => 'Resource Not Found',
                'message' => 'The requested resource could not be found.',
            ], 404);
        }

        if ($e instanceof ValidationException || $e instanceof LaravelValidationException) {
            return response()->json([
                'error' => 'Validation Error',
                'message' => 'The provided data is invalid.',
                'errors' => $e->errors(),
            ], 422);
        }

        if ($e instanceof DatabaseException) {
            return response()->json([
                'error' => 'Database Error',
                'message' => 'A database error occurred.',
            ], 500);
        }

        return parent::render($request, $e);
    }
}
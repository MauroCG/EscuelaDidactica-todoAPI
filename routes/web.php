<?php

use Illuminate\Support\Facades\Route;

// Other web routes (if any) can go above

Route::get('/{any?}', function () {
    return view('app'); // Return the single Blade file
})->where('any', '.*'); // Matches everything

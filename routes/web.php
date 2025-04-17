<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    return view('app'); // Entry point of the react app
})->where('any', '.*'); // Matches everything (api routes are listed first in app bootstrap)

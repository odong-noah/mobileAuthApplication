<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Your new API endpoint
Route::post('/register', [AuthController::class, 'register']);
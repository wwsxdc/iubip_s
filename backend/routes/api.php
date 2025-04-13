<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\TicketController;

/*
|--------------------------------------------------------------------------
| Публичные маршруты
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/queues', [QueueController::class, 'index']);
Route::get('/queues/{id}', [QueueController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Защищённые маршруты (требуют авторизации Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Пользователь
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Выход
    Route::post('/logout', [AuthController::class, 'logout']);

    // Билеты
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);
});

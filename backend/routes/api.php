<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\TicketController;

// Публичные маршруты
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

// Публичный маршрут для неавторизованных пользователей
Route::get('/user/guest', function () {
    return response()->json(['message' => 'Unauthorized'], 200);
});

// Маршрут для проверки авторизации (заменяет middleware)
Route::get('/user', function (Request $request) {
    if (auth()->check()) {
        return response()->json(auth()->user());
    } else {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
});

// Маршруты для очередей (публичные)
Route::get('/queues', [QueueController::class, 'index']);
Route::get('/queues/{id}', [QueueController::class, 'show']);

// Маршруты для билетов (с проверкой авторизации)
Route::get('/tickets', [TicketController::class, 'index']);
Route::get('/tickets/{id}', [TicketController::class, 'show']);
Route::post('/tickets', [TicketController::class, 'store']);
Route::delete('/tickets/{id}', [TicketController::class, 'destroy']); 
<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        // Ручная проверка аутентификации
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $tickets = auth()->user()->tickets;
        return response()->json($tickets);
    }

    public function show($id)
    {
        // Ручная проверка аутентификации
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $ticket = Ticket::findOrFail($id);
        
        // Проверка, принадлежит ли билет текущему пользователю
        if ($ticket->user_id !== auth()->id()) {
            return response()->json(['message' => 'У вас нет доступа к этому билету'], 403);
        }
        
        return response()->json($ticket);
    }

    public function store(Request $request)
    {
        // Ручная проверка аутентификации
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $request->validate([
            'queueId' => 'required|exists:queues,id',
        ]);

        $ticket = Ticket::create([
            'user_id' => auth()->id(),
            'queue_id' => $request->queueId,
            'status' => 'active',
        ]);

        return response()->json($ticket, 201);
    }

    public function destroy($id)
    {
        // Ручная проверка аутентификации
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $ticket = Ticket::findOrFail($id);
        
        // Проверка, принадлежит ли билет текущему пользователю
        if ($ticket->user_id !== auth()->id()) {
            return response()->json(['message' => 'У вас нет доступа к этому билету'], 403);
        }
        
        $ticket->delete();
        
        return response()->json(['message' => 'Билет успешно отменен']);
    }
} 
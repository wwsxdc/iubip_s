<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function index()
    {
        $queues = Queue::all();
        return response()->json($queues);
    }

    public function show($id)
    {
        $queue = Queue::findOrFail($id);
        return response()->json($queue);
    }
} 
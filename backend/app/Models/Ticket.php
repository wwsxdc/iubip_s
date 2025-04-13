<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'queue_id',
        'status',
        'position',
    ];

    // Отношение к пользователю (многие к одному)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Отношение к очереди (многие к одному)
    public function queue()
    {
        return $this->belongsTo(Queue::class);
    }
} 
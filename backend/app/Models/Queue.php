<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'max_capacity',
        'current_count',
        'status',
    ];

    // Отношение к билетам (один ко многим)
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
} 
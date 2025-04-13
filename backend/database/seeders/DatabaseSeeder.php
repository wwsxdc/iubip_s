<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Queue;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Создаем несколько тестовых очередей
        Queue::create([
            'name' => 'Билеты в кино',
            'description' => 'Бронирование билетов на популярные сеансы',
            'max_capacity' => 100,
            'current_count' => 0,
            'status' => 'active',
        ]);

        Queue::create([
            'name' => 'Билеты на концерт',
            'description' => 'Билеты на концерт известного исполнителя',
            'max_capacity' => 50,
            'current_count' => 0,
            'status' => 'active',
        ]);

        Queue::create([
            'name' => 'Экскурсия в музей',
            'description' => 'Выставка редких экспонатов',
            'max_capacity' => 30,
            'current_count' => 0,
            'status' => 'active',
        ]);
    }
}

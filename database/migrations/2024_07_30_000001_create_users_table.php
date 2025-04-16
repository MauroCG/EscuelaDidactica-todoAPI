<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // This creates an auto-incrementing integer primary key column named 'id'
            $table->string('name'); // VARCHAR(255) by default
            $table->string('email')->unique(); // VARCHAR(255) and adds a UNIQUE constraint        
        });        
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
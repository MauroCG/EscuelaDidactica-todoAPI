<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'completed'
    ];

    public function user()
    {
        // This method defines a "belongs to" relationship between the Task model and the User model.
        // It indicates that a Task belongs to a single User, establishing a foreign key relationship
        // where the 'user_id' column in the 'tasks' table references the primary key in the 'users' table.
        return $this->belongsTo(User::class);
    }
}
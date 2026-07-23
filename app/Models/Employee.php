<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'position', 'branch_id',
        'salary', 'join_date', 'end_date', 'status', 'address', 'notes',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'join_date' => 'date',
        'end_date' => 'date',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function salaries(): HasMany
    {
        return $this->hasMany(Salary::class);
    }

    public function projectTasks(): HasMany
    {
        return $this->hasMany(ProjectTask::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}

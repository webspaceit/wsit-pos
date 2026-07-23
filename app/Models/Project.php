<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Project extends Model
{
    protected $fillable = [
        'branch_id', 'customer_id', 'name', 'code', 'description', 'budget',
        'start_date', 'end_date', 'status', 'progress',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'progress' => 'integer',
    ];

    public static function boot(): void
    {
        parent::boot();

        static::creating(function (Project $project) {
            if (empty($project->code)) {
                $project->code = 'PRJ-'.strtoupper(Str::random(6));
            }
        });
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(ProjectTask::class);
    }

    public function getTotalSpentAttribute(): float
    {
        return $this->tasks()->where('status', 'done')->count();
    }
}

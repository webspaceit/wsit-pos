<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id', 'date', 'clock_in', 'clock_out', 'status', 'hours_worked', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'hours_worked' => 'decimal:2',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}

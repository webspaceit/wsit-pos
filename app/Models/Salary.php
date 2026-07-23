<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Salary extends Model
{
    protected $fillable = [
        'employee_id', 'month', 'base_salary', 'bonus', 'deductions',
        'net_salary', 'status', 'paid_amount', 'paid_date', 'notes',
    ];

    protected $casts = [
        'base_salary' => 'decimal:2',
        'bonus' => 'decimal:2',
        'deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'paid_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}

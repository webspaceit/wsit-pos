<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class RepairTicket extends Model
{
    protected $fillable = [
        'branch_id', 'customer_id', 'user_id', 'ticket_no', 'date', 'device_type',
        'device_brand', 'device_model', 'serial_number', 'issue_description',
        'estimated_cost', 'actual_cost', 'advance_paid', 'status',
        'estimated_delivery', 'actual_delivery', 'technician_notes', 'internal_notes',
    ];

    protected $casts = [
        'date' => 'date',
        'estimated_cost' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'advance_paid' => 'decimal:2',
        'estimated_delivery' => 'date',
        'actual_delivery' => 'date',
    ];

    public static function boot(): void
    {
        parent::boot();

        static::creating(function (RepairTicket $ticket) {
            if (empty($ticket->ticket_no)) {
                $ticket->ticket_no = 'RPR-'.strtoupper(Str::random(8));
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getBalanceAttribute(): float
    {
        return $this->actual_cost - $this->advance_paid;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Challan extends Model
{
    use HasFactory;

    protected $fillable = [
        'branch_id', 'sale_id', 'customer_id', 'user_id', 'reference_no',
        'invoice_no', 'date', 'delivery_address', 'driver_name', 'vehicle_no', 'status', 'notes',
    ];

    protected $casts = ['date' => 'date'];

    protected static function booted(): void
    {
        static::creating(function (Challan $challan) {
            if (empty($challan->reference_no)) {
                $challan->reference_no = 'CH-'.strtoupper(Str::random(8));
            }
        });
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ChallanItem::class);
    }
}

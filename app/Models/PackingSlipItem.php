<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackingSlipItem extends Model
{
    use HasFactory;

    protected $fillable = ['packing_slip_id', 'product_id', 'quantity'];

    protected $casts = ['quantity' => 'decimal:2'];

    public function packingSlip(): BelongsTo
    {
        return $this->belongsTo(PackingSlip::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

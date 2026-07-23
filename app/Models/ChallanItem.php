<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallanItem extends Model
{
    use HasFactory;

    protected $fillable = ['challan_id', 'product_id', 'quantity'];

    protected $casts = ['quantity' => 'decimal:2'];

    public function challan(): BelongsTo
    {
        return $this->belongsTo(Challan::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

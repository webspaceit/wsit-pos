<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class JournalEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_no', 'date', 'description', 'user_id', 'is_posted',
    ];

    protected $casts = [
        'date' => 'date',
        'is_posted' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (JournalEntry $entry) {
            if (empty($entry->reference_no)) {
                $entry->reference_no = 'JE-'.strtoupper(Str::random(8));
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lines(): HasMany
    {
        return $this->hasMany(JournalEntryLine::class);
    }

    public function getDebitTotalAttribute(): float
    {
        return (float) $this->lines->sum('debit');
    }

    public function getCreditTotalAttribute(): float
    {
        return (float) $this->lines->sum('credit');
    }

    public function isBalanced(): bool
    {
        return abs($this->debit_total - $this->credit_total) < 0.01;
    }
}

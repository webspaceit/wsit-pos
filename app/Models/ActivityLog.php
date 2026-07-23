<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'type', 'subject_type', 'subject_id', 'description', 'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subject(): Model
    {
        return $this->subject_type::find($this->subject_id);
    }

    public static function log(string $type, Model $subject, string $description, array $properties = []): static
    {
        return static::create([
            'user_id' => auth()->id(),
            'type' => $type,
            'subject_type' => get_class($subject),
            'subject_id' => $subject->id,
            'description' => $description,
            'properties' => $properties,
        ]);
    }
}

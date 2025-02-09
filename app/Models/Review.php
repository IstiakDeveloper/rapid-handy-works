<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_id',
        'client_id',
        'provider_id',
        'service_id',
        'rating',
        'comment',
        'images',
        'is_public',
        'provider_reply',
        'provider_replied_at'
    ];

    protected $casts = [
        'rating' => 'integer',
        'images' => 'array',
        'is_public' => 'boolean',
        'provider_replied_at' => 'datetime'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}

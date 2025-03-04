<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'avatar',
        'is_active',
        'bio',
        'rating'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'rating' => 'decimal:2'
    ];

    public function services()
    {
        return $this->hasMany(Service::class, 'provider_id');
    }

    public function bookingsAsClient()
    {
        return $this->hasMany(Booking::class, 'client_id');
    }

    public function bookingsAsProvider()
    {
        return $this->hasMany(Booking::class, 'provider_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'provider_id');
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isProvider()
    {
        return $this->role === 'provider';
    }

    public function isClient()
    {
        return $this->role === 'client';
    }

     /**
     * Get all bookings associated with this user (as either client or provider).
     * This is a convenient method that combines both types of bookings.
     */
    public function bookings()
    {
        // For provider users, return provider bookings
        if ($this->role === 'provider') {
            return $this->providerBookings();
        }

        // For client users, return client bookings
        if ($this->role === 'client') {
            return $this->clientBookings();
        }

        // For admin users, you might want to return all bookings
        // or an empty collection depending on your needs
        return $this->clientBookings(); // Default to client bookings
    }

    public function clientBookings()
    {
        return $this->hasMany(Booking::class, 'client_id');
    }

    /**
     * Get the bookings where this user is the service provider.
     */
    public function providerBookings()
    {
        return $this->hasMany(Booking::class, 'provider_id');
    }
}

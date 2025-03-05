<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'provider_id',
        'service_id',
        'booking_date',
        'booking_time',
        'status',
        'payment_status',
        'total_amount',
        'calling_charge',
        'remaining_amount',
        'calling_charge_status',
        'commission_percentage',
        'commission_amount',
        'provider_amount',
        'payment_method',
        'transaction_id',
        'reference_number',
        'notes',
        'address',
        'phone',
        'completed_at',
        'cancelled_at',
        'cancellation_reason'
    ];

    protected $casts = [
        'booking_date' => 'date',
        'booking_time' => 'datetime',
        'total_amount' => 'decimal:2',
        'booking_fee' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime'
    ];

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

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }


    // Helpers for calculating booking fee and remaining amount
    public static function calculateBookingFee($totalAmount, $feePercentage = 10)
    {
        return round(($totalAmount * $feePercentage) / 100, 2);
    }

    public function getRemainingAmountAttribute()
    {
        return $this->total_amount - $this->booking_fee;
    }






    // Payment status scopes
    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeRefunded($query)
    {
        return $query->where('payment_status', 'refunded');
    }

    // Generate a unique reference number
    public static function generateReferenceNumber()
    {
        $prefix = 'BK-';
        $uniqueNumber = $prefix . date('Ymd') . '-' . mt_rand(1000, 9999);

        // Ensure uniqueness
        while (self::where('reference_number', $uniqueNumber)->exists()) {
            $uniqueNumber = $prefix . date('Ymd') . '-' . mt_rand(1000, 9999);
        }

        return $uniqueNumber;
    }


    /**
     * Calculate provider commission amount
     *
     * @param float $totalAmount
     * @param float $commissionPercentage
     * @return float
     */
    public static function calculateCommission($totalAmount, $commissionPercentage)
    {
        return round(($totalAmount * $commissionPercentage) / 100, 2);
    }

    /**
     * Calculate provider payment amount after commission
     *
     * @param float $totalAmount
     * @param float $commissionAmount
     * @return float
     */
    public static function calculateProviderAmount($totalAmount, $commissionAmount)
    {
        return $totalAmount - $commissionAmount;
    }
}

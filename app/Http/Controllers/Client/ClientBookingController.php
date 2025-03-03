<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientBookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['provider', 'service', 'review'])
            ->where('client_id', auth()->id())
            ->latest()
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'reference_number' => $booking->reference_number,
                    'provider' => [
                        'id' => $booking->provider->id,
                        'name' => $booking->provider->name,
                    ],
                    'service' => [
                        'id' => $booking->service->id,
                        'title' => $booking->service->title,
                    ],
                    'booking_date' => $booking->booking_date->format('Y-m-d'),
                    'booking_time' => $booking->booking_time->format('H:i'),
                    'status' => $booking->status,
                    'payment_status' => $booking->payment_status,
                    'booking_fee' => $booking->booking_fee,
                    'booking_fee_status' => $booking->booking_fee_status,
                    'remaining_amount' => $booking->remaining_amount,
                    'total_amount' => $booking->total_amount,
                    'payment_method' => $booking->payment_method,
                    'transaction_id' => $booking->transaction_id,
                    'notes' => $booking->notes,
                    'address' => $booking->address,
                    'phone' => $booking->phone,
                    'created_at' => $booking->created_at,
                    'completed_at' => $booking->completed_at,
                    'cancelled_at' => $booking->cancelled_at,
                    'review' => $booking->review ? true : false,
                ];
            });

        return Inertia::render('Client/Bookings', [
            'bookings' => $bookings
        ]);
    }

    public function show(Booking $booking)
    {
        if ($booking->client_id !== auth()->id()) {
            abort(403);
        }

        $booking->load(['provider', 'service', 'review']);

        return Inertia::render('Client/BookingDetail', [
            'booking' => [
                'id' => $booking->id,
                'reference_number' => $booking->reference_number,
                'provider' => [
                    'id' => $booking->provider->id,
                    'name' => $booking->provider->name,
                    'phone' => $booking->provider->phone,
                    'avatar' => $booking->provider->avatar,
                ],
                'service' => [
                    'id' => $booking->service->id,
                    'title' => $booking->service->title,
                    'description' => $booking->service->description,
                    'price' => $booking->service->price,
                ],
                'booking_date' => $booking->booking_date->format('Y-m-d'),
                'booking_time' => $booking->booking_time->format('H:i'),
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'booking_fee' => $booking->booking_fee,
                'booking_fee_status' => $booking->booking_fee_status,
                'remaining_amount' => $booking->remaining_amount,
                'total_amount' => $booking->total_amount,
                'payment_method' => $booking->payment_method,
                'transaction_id' => $booking->transaction_id,
                'notes' => $booking->notes,
                'address' => $booking->address,
                'phone' => $booking->phone,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,
                'completed_at' => $booking->completed_at,
                'cancelled_at' => $booking->cancelled_at,
                'cancellation_reason' => $booking->cancellation_reason,
                'review' => $booking->review ? [
                    'id' => $booking->review->id,
                    'rating' => $booking->review->rating,
                    'comment' => $booking->review->comment,
                    'created_at' => $booking->review->created_at,
                ] : null,
            ]
        ]);
    }

    public function cancel(Request $request, Booking $booking)
    {
        if ($booking->client_id !== auth()->id()) {
            abort(403);
        }

        // Only allow cancellation for pending or confirmed bookings
        if (!in_array($booking->status, ['pending', 'confirmed'])) {
            return back()->with('error', 'Cannot cancel this booking');
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $validated['reason'] ?? null
        ]);

        // If booking fee was paid, mark it as refundable
        // (actual refund process would be handled by admin)
        if ($booking->booking_fee_status === 'paid') {
            $booking->update([
                'booking_fee_status' => 'refunded'
            ]);
        }

        return back()->with('success', 'Booking cancelled successfully');
    }

    public function completePayment(Booking $booking)
    {
        if ($booking->client_id !== auth()->id()) {
            abort(403);
        }

        if ($booking->status !== 'completed') {
            return back()->with('error', 'Payment can only be completed for finished services');
        }

        if ($booking->payment_status === 'paid') {
            return back()->with('error', 'Payment has already been completed');
        }

        // Update payment status
        $booking->update([
            'payment_status' => 'paid'
        ]);

        return back()->with('success', 'Payment completed successfully');
    }
}

<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientBookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['provider', 'service'])
            ->where('client_id', auth()->id())
            ->latest()
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'provider' => [
                        'name' => $booking->provider->name,
                    ],
                    'service' => [
                        'title' => $booking->service->title,
                    ],
                    'booking_date' => $booking->booking_date->format('Y-m-d'),
                    'booking_time' => $booking->booking_time->format('H:i'),
                    'status' => $booking->status,
                    'payment_status' => $booking->payment_status,
                    'total_amount' => $booking->total_amount,
                    'notes' => $booking->notes,
                    'address' => $booking->address,
                    'phone' => $booking->phone,
                ];
            });

        return Inertia::render('Client/Bookings', [
            'bookings' => $bookings
        ]);
    }

    public function cancel(Booking $booking)
    {
        if ($booking->client_id !== auth()->id()) {
            abort(403);
        }

        // Only allow cancellation for pending or confirmed bookings
        if (!in_array($booking->status, ['pending', 'confirmed'])) {
            return back()->with('error', 'Cannot cancel this booking');
        }

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now()
        ]);

        return back()->with('success', 'Booking cancelled successfully');
    }
}

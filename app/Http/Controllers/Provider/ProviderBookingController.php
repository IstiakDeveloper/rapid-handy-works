<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderBookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['client', 'service'])
            ->where('provider_id', auth()->id())
            ->latest()
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'client' => [
                        'name' => $booking->client->name,
                        'email' => $booking->client->email,
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

        return Inertia::render('Provider/Bookings', [
            'bookings' => $bookings
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        // Check if the booking belongs to the provider
        if ($booking->provider_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:confirmed,in_progress,completed'
        ]);

        $booking->update($validated);

        return back()->with('success', 'Booking status updated successfully');
    }

    public function cancel(Booking $booking)
    {
        if ($booking->provider_id !== auth()->id()) {
            abort(403);
        }

        $booking->update(['status' => 'cancelled']);

        return back()->with('success', 'Booking cancelled successfully');
    }
}

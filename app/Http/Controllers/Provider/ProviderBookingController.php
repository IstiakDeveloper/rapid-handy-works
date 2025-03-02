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
                        'price' => $booking->service->price,
                    ],
                    'booking_date' => $booking->booking_date->format('Y-m-d'),
                    'booking_time' => $booking->booking_time->format('H:i'),
                    'status' => $booking->status,
                    'payment_status' => $booking->payment_status,
                    'total_amount' => $booking->total_amount,
                    'notes' => $booking->notes,
                    'address' => $booking->address,
                    'phone' => $booking->phone,
                    'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $booking->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Provider/Bookings', [
            'bookings' => $bookings
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        // Validate if the booking belongs to the provider
        if ($booking->provider_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate the status update
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:confirmed,in_progress,completed,cancelled']
        ]);

        // Check if status transition is valid
        if (!$this->isValidStatusTransition($booking->status, $validated['status'])) {
            return response()->json([
                'message' => 'Invalid status transition'
            ], 422);
        }

        // Update the booking status
        $booking->update([
            'status' => $validated['status'],
            'status_updated_at' => now()
        ]);

        // Send notifications if needed
        if ($validated['status'] === 'confirmed') {
            // Notify customer that booking is confirmed
            // $booking->client->notify(new BookingConfirmedNotification($booking));
        } elseif ($validated['status'] === 'completed') {
            // Notify customer that service is completed
            // $booking->client->notify(new ServiceCompletedNotification($booking));
        }

        return back()->with('success', 'Booking status updated successfully');
    }

    private function isValidStatusTransition($currentStatus, $newStatus)
    {
        $allowedTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['in_progress', 'cancelled'],
            'in_progress' => ['completed', 'cancelled'],
            'completed' => [], // No further transitions allowed
            'cancelled' => [] // No further transitions allowed
        ];

        return in_array($newStatus, $allowedTransitions[$currentStatus] ?? []);
    }

    public function cancel(Request $request, Booking $booking)
    {
        if ($booking->provider_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Optional: Add cancellation reason
        $validated = $request->validate([
            'cancellation_reason' => 'nullable|string|max:500'
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancellation_reason' => $validated['cancellation_reason'] ?? null,
            'cancelled_at' => now()
        ]);

        // Notify customer about cancellation
        // $booking->client->notify(new BookingCancelledNotification($booking));

        return back()->with('success', 'Booking cancelled successfully');
    }

    public function filter(Request $request)
    {
        $validated = $request->validate([
            'status' => 'nullable|string|in:pending,confirmed,in_progress,completed,cancelled',
            'date_range' => 'nullable|string|in:today,upcoming,past',
            'search' => 'nullable|string|max:100',
        ]);

        $query = Booking::with(['client', 'service'])
            ->where('provider_id', auth()->id());

        // Apply status filter
        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        // Apply date range filter
        if (!empty($validated['date_range'])) {
            switch ($validated['date_range']) {
                case 'today':
                    $query->whereDate('booking_date', today());
                    break;
                case 'upcoming':
                    $query->whereDate('booking_date', '>', today());
                    break;
                case 'past':
                    $query->whereDate('booking_date', '<', today());
                    break;
            }
        }

        // Apply search
        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->whereHas('client', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('service', function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                });
            });
        }

        $bookings = $query->latest()->get();

        return response()->json(['bookings' => $bookings]);
    }
}

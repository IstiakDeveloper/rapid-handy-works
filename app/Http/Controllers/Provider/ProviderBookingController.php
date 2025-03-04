<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
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
                    'reference_number' => $booking->reference_number,
                    'client' => [
                        'id' => $booking->client->id,
                        'name' => $booking->client->name,
                        'email' => $booking->client->email,
                    ],
                    'service' => [
                        'id' => $booking->service->id,
                        'title' => $booking->service->title,
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
                    'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $booking->updated_at->format('Y-m-d H:i:s'),
                    'completed_at' => $booking->completed_at ? $booking->completed_at->format('Y-m-d H:i:s') : null,
                    'cancelled_at' => $booking->cancelled_at ? $booking->cancelled_at->format('Y-m-d H:i:s') : null,
                    'cancellation_reason' => $booking->cancellation_reason,
                ];
            });

        return Inertia::render('Provider/Bookings', [
            'bookings' => $bookings
        ]);
    }

    public function show(Booking $booking)
    {
        if ($booking->provider_id !== auth()->id()) {
            abort(403);
        }

        $booking->load('client', 'service');

        return Inertia::render('Provider/BookingDetail', [
            'booking' => [
                'id' => $booking->id,
                'reference_number' => $booking->reference_number,
                'client' => [
                    'id' => $booking->client->id,
                    'name' => $booking->client->name,
                    'email' => $booking->client->email,
                    'phone' => $booking->client->phone,
                ],
                'service' => [
                    'id' => $booking->service->id,
                    'title' => $booking->service->title,
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
                'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $booking->updated_at->format('Y-m-d H:i:s'),
                'completed_at' => $booking->completed_at ? $booking->completed_at->format('Y-m-d H:i:s') : null,
                'cancelled_at' => $booking->cancelled_at ? $booking->cancelled_at->format('Y-m-d H:i:s') : null,
                'cancellation_reason' => $booking->cancellation_reason,
            ]
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
        ]);

        // Update payment and booking fee statuses based on the new booking status
        switch ($validated['status']) {
            case 'confirmed':
                // If a booking is confirmed, update booking fee status to 'paid' if it was 'pending'
                if ($booking->booking_fee > 0 && $booking->booking_fee_status === 'pending') {
                    $booking->update([
                        'booking_fee_status' => 'paid'
                    ]);
                }
                break;

            case 'completed':
                $booking->update([
                    'completed_at' => now(),
                    'payment_status' => 'paid'  // Mark full payment as paid when service is completed
                ]);
                break;

            case 'cancelled':
                $booking->update([
                    'cancelled_at' => now(),
                    'cancellation_reason' => $request->cancellation_reason ?? 'Cancelled by provider'
                ]);

                // If the booking was cancelled, handle refunds based on the current state
                if ($booking->booking_fee > 0 && $booking->booking_fee_status === 'paid') {
                    $booking->update([
                        'booking_fee_status' => 'refunded'
                    ]);
                }

                // If any payment was already made, mark it for refund
                if ($booking->payment_status === 'paid') {
                    $booking->update([
                        'payment_status' => 'refunded'
                    ]);
                }
                break;
        }

        // Send notifications if needed
        if ($validated['status'] === 'confirmed') {
            // Notify customer that booking is confirmed
            // $booking->client->notify(new BookingConfirmedNotification($booking));
        } elseif ($validated['status'] === 'completed') {
            // Notify customer that service is completed
            // $booking->client->notify(new ServiceCompletedNotification($booking));
        } elseif ($validated['status'] === 'cancelled') {
            // Notify customer that booking is cancelled
            // $booking->client->notify(new BookingCancelledNotification($booking));
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
            'cancellation_reason' => $validated['cancellation_reason'] ?? 'Cancelled by provider',
            'cancelled_at' => now()
        ]);

        // Handle booking fee refund
        if ($booking->booking_fee > 0 && $booking->booking_fee_status === 'paid') {
            $booking->update([
                'booking_fee_status' => 'refunded'
            ]);
        }

        // Handle payment refund if any payment was made
        if ($booking->payment_status === 'paid') {
            $booking->update([
                'payment_status' => 'refunded'
            ]);
        }

        // Notify customer about cancellation
        // $booking->client->notify(new BookingCancelledNotification($booking));

        return back()->with('success', 'Booking cancelled successfully');
    }

    public function earnings()
    {
        $bookings = Booking::where('provider_id', auth()->id())
            ->where('status', 'completed')
            ->latest()
            ->get();

        $totalEarnings = $bookings->sum('total_amount');
        $pendingEarnings = Booking::where('provider_id', auth()->id())
            ->whereIn('status', ['confirmed', 'in_progress'])
            ->sum('total_amount');

        $bookingFees = Booking::where('provider_id', auth()->id())
            ->where('booking_fee_status', 'paid')
            ->sum('booking_fee');

        $monthlyEarnings = $bookings
            ->groupBy(function ($booking) {
                return $booking->completed_at->format('Y-m');
            })
            ->map(function ($items, $month) {
                return [
                    'month' => $month,
                    'amount' => $items->sum('total_amount')
                ];
            })
            ->values();

        return Inertia::render('Provider/Earnings', [
            'earnings' => [
                'totalEarnings' => $totalEarnings,
                'pendingEarnings' => $pendingEarnings,
                'bookingFees' => $bookingFees,
                'monthlyEarnings' => $monthlyEarnings,
                'recentBookings' => $bookings->take(5)->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'reference_number' => $booking->reference_number,
                        'client_name' => $booking->client->name,
                        'service_title' => $booking->service->title,
                        'amount' => $booking->total_amount,
                        'booking_fee' => $booking->booking_fee,
                        'remaining_amount' => $booking->remaining_amount,
                        'completed_at' => $booking->completed_at->format('Y-m-d'),
                    ];
                })
            ]
        ]);
    }

    public function filter(Request $request)
    {
        $validated = $request->validate([
            'status' => 'nullable|string|in:pending,confirmed,in_progress,completed,cancelled',
            'date_range' => 'nullable|string|in:today,upcoming,past',
            'search' => 'nullable|string|max:100',
            'payment_status' => 'nullable|string|in:pending,paid,refunded',
        ]);

        $query = Booking::with(['client', 'service'])
            ->where('provider_id', auth()->id());

        // Apply status filter
        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        // Apply payment status filter
        if (!empty($validated['payment_status'])) {
            $query->where('payment_status', $validated['payment_status']);
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
                })->orWhere('reference_number', 'like', "%{$search}%");
            });
        }

        $bookings = $query->latest()->get();

        return response()->json(['bookings' => $bookings]);
    }

    public function download(Booking $booking)
    {
        // Validate if the booking belongs to the provider
        if ($booking->provider_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Load necessary relationships
        $booking->load(['client', 'service', 'provider']);

        // Generate a unique filename for the invoice
        $filename = 'invoice-' . $booking->reference_number . '.pdf';

        // Generate the PDF invoice
        $pdf = PDF::loadView('invoices.booking', [
            'booking' => $booking,
            'provider' => $booking->provider,
            'client' => $booking->client,
            'service' => $booking->service,
        ]);

        // For direct download
        return $pdf->download($filename);
    }
}

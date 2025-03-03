<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminBookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['client', 'provider', 'service'])
            ->latest()
            ->get();

        $stats = [
            'total' => $bookings->count(),
            'today' => $bookings->where('booking_date', Carbon::today()->format('Y-m-d'))->count(),
            'pending' => $bookings->where('status', 'pending')->count(),
            'revenue' => $bookings->where('payment_status', 'paid')->sum('total_amount')
        ];

        $mappedBookings = $bookings->map(function ($booking) {
            return [
                'id' => $booking->id,
                'client' => [
                    'name' => $booking->client->name,
                    'email' => $booking->client->email,
                ],
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
                'booking_fee' => $booking->booking_fee,
                'booking_fee_status' => $booking->booking_fee_status,
                'remaining_amount' => $booking->remaining_amount,
                'total_amount' => $booking->total_amount,
                'notes' => $booking->notes,
                'address' => $booking->address,
                'phone' => $booking->phone,
            ];
        });

        return Inertia::render('Admin/Bookings', [
            'bookings' => $mappedBookings,
            'stats' => $stats
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:pending,confirmed,in_progress,completed,cancelled'
            ]);

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
                        'cancellation_reason' => $request->cancellation_reason ?? 'Cancelled by admin'
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

            return back()->with('success', 'Booking status updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update booking status: ' . $e->getMessage());
        }
    }

    public function destroy(Booking $booking)
    {
        try {
            $booking->delete();
            return back()->with('success', 'Booking deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete booking: ' . $e->getMessage());
        }
    }

    public function export()
    {
        $bookings = Booking::with(['client', 'provider', 'service'])->get();

        $csvData = $bookings->map(function ($booking) {
            return [
                'ID' => $booking->id,
                'Service' => $booking->service->title,
                'Client' => $booking->client->name,
                'Provider' => $booking->provider->name,
                'Date' => $booking->booking_date->format('Y-m-d'),
                'Time' => $booking->booking_time->format('H:i'),
                'Status' => $booking->status,
                'Payment Status' => $booking->payment_status,
                'Booking Fee' => $booking->booking_fee,
                'Booking Fee Status' => $booking->booking_fee_status,
                'Remaining Amount' => $booking->remaining_amount,
                'Total Amount' => $booking->total_amount,
                'Address' => $booking->address,
                'Phone' => $booking->phone,
                'Notes' => $booking->notes,
                'Created At' => $booking->created_at->format('Y-m-d H:i:s'),
                'Completed At' => $booking->completed_at ? $booking->completed_at->format('Y-m-d H:i:s') : 'N/A',
                'Cancelled At' => $booking->cancelled_at ? $booking->cancelled_at->format('Y-m-d H:i:s') : 'N/A',
                'Cancellation Reason' => $booking->cancellation_reason ?? 'N/A',
            ];
        });

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="bookings.csv"',
        ];

        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');

            // Don't try to access first if there are no bookings
            if ($csvData->isNotEmpty()) {
                fputcsv($file, array_keys($csvData->first()));

                foreach ($csvData as $row) {
                    fputcsv($file, $row);
                }
            } else {
                // If there are no bookings, just add headers
                fputcsv($file, [
                    'ID', 'Service', 'Client', 'Provider', 'Date', 'Time', 'Status',
                    'Payment Status', 'Booking Fee', 'Booking Fee Status', 'Remaining Amount',
                    'Total Amount', 'Address', 'Phone', 'Notes', 'Created At',
                    'Completed At', 'Cancelled At', 'Cancellation Reason'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

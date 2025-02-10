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

            $booking->update($validated);

            return back()->with('success', 'Booking status updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update booking status');
        }
    }

    public function destroy(Booking $booking)
    {
        try {
            $booking->delete();
            return back()->with('success', 'Booking deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete booking');
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
                'Amount' => $booking->total_amount,
            ];
        });

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="bookings.csv"',
        ];

        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');
            fputcsv($file, array_keys($csvData->first()));

            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

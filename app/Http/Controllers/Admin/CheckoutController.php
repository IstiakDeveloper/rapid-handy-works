<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Please login to continue checkout');
        }

        return Inertia::render('Admin/Checkout', [
            'user' => auth()->user()
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Please login to continue'], 401);
        }

        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:services,id',
            'items.*.quantity' => 'required|integer|min:1',
            'booking_date' => ['required', 'date', 'after:today'],
            'booking_time' => ['required', 'date_format:H:i'],
            'address' => 'required|string|min:10',
            'phone' => 'required|string|min:10',
            'notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $bookingDateTime = Carbon::parse($request->booking_date . ' ' . $request->booking_time);

            if ($bookingDateTime->isPast()) {
                return response()->json([
                    'message' => 'Booking time must be in the future'
                ], 422);
            }

            $bookings = [];
            foreach ($request->items as $item) {
                $service = Service::findOrFail($item['id']);

                if (!$service->is_active) {
                    throw new \Exception("Service '{$service->title}' is no longer available");
                }

                $existingBooking = Booking::where('provider_id', $service->provider_id)
                    ->where('booking_date', $request->booking_date)
                    ->where('booking_time', $request->booking_time)
                    ->whereNotIn('status', ['cancelled', 'completed'])
                    ->first();

                if ($existingBooking) {
                    throw new \Exception("Selected time slot is not available for '{$service->title}'");
                }

                $booking = Booking::create([
                    'client_id' => auth()->id(),
                    'provider_id' => $service->provider_id,
                    'service_id' => $service->id,
                    'booking_date' => $request->booking_date,
                    'booking_time' => $request->booking_time,
                    'status' => 'pending',
                    'payment_status' => 'pending',
                    'total_amount' => $service->price * $item['quantity'],
                    'notes' => $request->notes,
                    'address' => $request->address,
                    'phone' => $request->phone
                ]);

                $bookings[] = $booking->load(['service', 'provider']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Booking created successfully',
                'bookings' => $bookings
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Checkout Error: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'request_data' => $request->all(),
                'exception' => $e
            ]);

            return response()->json([
                'message' => $e->getMessage(),
                'error_details' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ] : null
            ], 500);
        }
    }
}

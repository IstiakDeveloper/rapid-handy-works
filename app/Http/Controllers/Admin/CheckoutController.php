<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    private $bookingFeePercentage = 10;
    private $bankDetails;

    public function __construct()
    {
        // Get booking fee percentage from settings (fallback to 10%)
        $this->bookingFeePercentage = (int) Setting::where('key', 'booking_fee_percentage')->first()?->value ?? 10;

        // Bank details for direct transfer
        $this->bankDetails = [
            'account_name' => 'Netsoftuk Solution',
            'account_number' => '17855008',
            'sort_code' => '04-06-05',
        ];
    }

    public function index()
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Please login to continue checkout');
        }

        return Inertia::render('Admin/Checkout', [
            'user' => auth()->user(),
            'bookingFeePercentage' => $this->bookingFeePercentage,
            'bankDetails' => $this->bankDetails
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
            'notes' => 'nullable|string|max:500',
            'payment_method' => 'required|in:bank_transfer,stripe,cash'
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

                $totalAmount = $service->price * $item['quantity'];
                $bookingFee = Booking::calculateBookingFee($totalAmount, $this->bookingFeePercentage);
                $remainingAmount = $totalAmount - $bookingFee;
                $referenceNumber = Booking::generateReferenceNumber();

                $booking = Booking::create([
                    'client_id' => auth()->id(),
                    'provider_id' => $service->provider_id,
                    'service_id' => $service->id,
                    'booking_date' => $request->booking_date,
                    'booking_time' => $request->booking_time,
                    'status' => 'pending',
                    'payment_status' => 'pending',
                    'total_amount' => $totalAmount,
                    'booking_fee' => $bookingFee,
                    'remaining_amount' => $remainingAmount,
                    'booking_fee_status' => 'pending',
                    'payment_method' => $request->payment_method,
                    'reference_number' => $referenceNumber,
                    'notes' => $request->notes,
                    'address' => $request->address,
                    'phone' => $request->phone
                ]);

                // If payment method is bank_transfer, set the necessary information
                if ($request->payment_method === 'bank_transfer') {
                    // Bank transfer processing happens on the client side
                    // Just attach the reference number
                    $booking->update([
                        'transaction_id' => 'MANUAL-' . $referenceNumber,
                    ]);
                }

                // Load additional relationships for the response
                $bookings[] = $booking->load(['service', 'provider']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Booking created successfully',
                'bookings' => $bookings,
                'reference_number' => $bookings[0]->reference_number,
                'bank_details' => $this->bankDetails,
                'redirect_to' => $request->payment_method === 'bank_transfer'
                    ? route('payment.bank-transfer', ['reference' => $bookings[0]->reference_number])
                    : route('client.bookings')
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

    public function bankTransferInstructions($reference)
    {
        $booking = Booking::where('reference_number', $reference)->firstOrFail();

        return Inertia::render('Payment/BankTransfer', [
            'booking' => $booking->load(['service', 'client']),
            'bankDetails' => $this->bankDetails
        ]);
    }

    public function confirmBankTransfer(Request $request, $reference)
    {
        $booking = Booking::where('reference_number', $reference)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|string|min:5',
            'transaction_date' => 'required|date',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $booking->update([
            'transaction_id' => $request->transaction_id,
            'booking_fee_status' => 'paid', // Mark as paid but admin will verify
            'notes' => $booking->notes . "\n\nBank Transfer Information: " .
                       "Transaction ID: " . $request->transaction_id .
                       ", Date: " . $request->transaction_date .
                       ", Notes: " . $request->notes
        ]);

        // TODO: Send notification to admin about manual payment verification

        return redirect()->route('client.bookings')->with('success', 'Bank transfer information submitted successfully. Your booking will be confirmed once the payment is verified.');
    }
}

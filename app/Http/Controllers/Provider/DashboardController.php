<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Provider stats
        $totalBookings = Booking::where('provider_id', $user->id)->count();
        $completedBookings = Booking::where('provider_id', $user->id)
            ->where('status', 'completed')
            ->count();
        $pendingBookings = Booking::where('provider_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();
        $totalEarnings = Booking::where('provider_id', $user->id)
            ->where('status', 'completed')
            ->sum('remaining_amount'); // Provider gets the remaining amount after platform fee

        $monthlyEarnings = Booking::where('provider_id', $user->id)
            ->where('status', 'completed')
            ->whereMonth('booking_date', Carbon::now()->month)
            ->whereYear('booking_date', Carbon::now()->year)
            ->sum('remaining_amount');

        $lastMonthEarnings = Booking::where('provider_id', $user->id)
            ->where('status', 'completed')
            ->whereMonth('booking_date', Carbon::now()->subMonth()->month)
            ->whereYear('booking_date', Carbon::now()->subMonth()->year)
            ->sum('remaining_amount');

        $earningsGrowth = $lastMonthEarnings > 0
            ? round((($monthlyEarnings - $lastMonthEarnings) / $lastMonthEarnings) * 100, 1)
            : 0;

        $completionRate = $totalBookings > 0
            ? round(($completedBookings / $totalBookings) * 100, 1)
            : 0;

        $totalServices = Service::where('provider_id', $user->id)->count();
        $activeServices = Service::where('provider_id', $user->id)
            ->where('is_active', true)
            ->count();

        // Recent bookings for provider
        $myBookings = Booking::with(['client', 'service'])
            ->where('provider_id', $user->id)
            ->orderBy('booking_date', 'desc')
            ->orderBy('booking_time', 'desc')
            ->take(10)
            ->get();

        // Provider's services
        $myServices = Service::where('provider_id', $user->id)
            ->withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->get();

        // Booking status distribution
        $bookingStatusDistribution = [
            'pending' => Booking::where('provider_id', $user->id)->where('status', 'pending')->count(),
            'confirmed' => Booking::where('provider_id', $user->id)->where('status', 'confirmed')->count(),
            'in_progress' => Booking::where('provider_id', $user->id)->where('status', 'in_progress')->count(),
            'completed' => Booking::where('provider_id', $user->id)->where('status', 'completed')->count(),
            'cancelled' => Booking::where('provider_id', $user->id)->where('status', 'cancelled')->count()
        ];

        // Monthly earnings data (for charts)
        $earningsByMonth = DB::table('bookings')
            ->select(DB::raw('YEAR(booking_date) as year'), DB::raw('MONTH(booking_date) as month'), DB::raw('SUM(remaining_amount) as earnings'))
            ->where('provider_id', $user->id)
            ->where('status', 'completed')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                    'earnings' => $item->earnings
                ];
            });

        // Client reviews
        $clientReviews = DB::table('reviews')
            ->join('users', 'reviews.client_id', '=', 'users.id')
            ->join('bookings', 'reviews.booking_id', '=', 'bookings.id')
            ->join('services', 'bookings.service_id', '=', 'services.id')
            ->where('bookings.provider_id', $user->id)
            ->select('reviews.*', 'users.name as client_name', 'users.avatar as client_avatar', 'services.title as service_title')
            ->orderBy('reviews.created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => Carbon::parse($review->created_at)->format('d M Y'),
                    'client' => [
                        'name' => $review->client_name,
                        'avatar' => $review->client_avatar
                    ],
                    'service' => $review->service_title
                ];
            });

        // Combine provider stats
        $providerStats = [
            'totalEarnings' => $totalEarnings,
            'monthlyEarnings' => $monthlyEarnings,
            'earningsGrowth' => $earningsGrowth,
            'totalBookings' => $totalBookings,
            'pendingBookings' => $pendingBookings,
            'completionRate' => $completionRate,
            'averageRating' => $user->rating,
            'totalReviews' => $user->reviews_count,
            'totalServices' => $totalServices,
            'activeServices' => $activeServices
        ];

        return Inertia::render('Provider/Dashboard', [
            'providerStats' => $providerStats,
            'myServices' => $myServices,
            'myBookings' => $myBookings,
            'earningsByMonth' => $earningsByMonth,
            'bookingStatusDistribution' => $bookingStatusDistribution,
            'clientReviews' => $clientReviews
        ]);
    }
}

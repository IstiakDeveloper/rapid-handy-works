<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use App\Models\ServiceCategory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Revenue statistics
        $totalRevenue = Booking::where('payment_status', 'paid')->sum('total_amount');
        $monthlyRevenue = Booking::where('payment_status', 'paid')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_amount');

        // Get previous month revenue
        $previousMonthRevenue = Booking::where('payment_status', 'paid')
            ->whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->whereYear('created_at', Carbon::now()->subMonth()->year)
            ->sum('total_amount');

        // Calculate revenue growth percentage
        $revenueGrowth = $previousMonthRevenue > 0
            ? (($monthlyRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100
            : 100;

        // System statistics
        $totalServices = Service::count();
        $totalUsers = User::count();
        $totalProviders = User::where('role', 'provider')->count();
        $totalClients = User::where('role', 'client')->count();
        $totalCompletedBookings = Booking::where('status', 'completed')->count();
        $pendingBookings = Booking::where('status', 'pending')->count();

        // Recent bookings
        $recentBookings = Booking::with(['client:id,name,email,phone,avatar', 'provider:id,name,email,phone,avatar', 'service:id,title,price'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'reference_number' => $booking->reference_number,
                    'client' => [
                        'id' => $booking->client->id,
                        'name' => $booking->client->name,
                        'email' => $booking->client->email,
                        'avatar' => $booking->client->avatar,
                    ],
                    'provider' => [
                        'id' => $booking->provider->id,
                        'name' => $booking->provider->name,
                        'avatar' => $booking->provider->avatar,
                    ],
                    'service' => [
                        'id' => $booking->service->id,
                        'title' => $booking->service->title,
                        'price' => $booking->service->price,
                    ],
                    'booking_date' => $booking->booking_date,
                    'booking_time' => $booking->booking_time,
                    'total_amount' => $booking->total_amount,
                    'status' => $booking->status,
                    'payment_status' => $booking->payment_status,
                    'created_at' => $booking->created_at->format('M d, Y'),
                ];
            });

        // Top services
        $topServices = Service::withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'title' => $service->title,
                    'price' => $service->price,
                    'bookings_count' => $service->bookings_count,
                    'provider' => [
                        'id' => $service->provider_id,
                        'name' => User::find($service->provider_id)->name,
                    ],
                    'category' => ServiceCategory::find($service->category_id)->name,
                ];
            });

        // Top providers
        $topProviders = User::where('role', 'provider')
            ->withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($provider) {
                $completedBookings = Booking::where('provider_id', $provider->id)
                    ->where('status', 'completed')
                    ->count();

                $totalAmount = Booking::where('provider_id', $provider->id)
                    ->where('payment_status', 'paid')
                    ->sum('total_amount');

                return [
                    'id' => $provider->id,
                    'name' => $provider->name,
                    'email' => $provider->email,
                    'avatar' => $provider->avatar,
                    'bookings_count' => $provider->bookings_count,
                    'completed_bookings' => $completedBookings,
                    'total_amount' => $totalAmount,
                ];
            });

        // Revenue trends for the last 6 months
        $revenueTrends = collect([]);
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $revenue = Booking::where('payment_status', 'paid')
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('total_amount');

            $revenueTrends->push([
                'month' => $month->format('M Y'),
                'revenue' => $revenue,
            ]);
        }

        // Booking status distribution
        $bookingStatuses = DB::table('bookings')
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => $item->count];
            });

        // Category distribution
        $categoryDistribution = DB::table('services')
            ->join('service_categories', 'services.category_id', '=', 'service_categories.id')
            ->select('service_categories.name', DB::raw('count(*) as count'))
            ->groupBy('service_categories.name')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->name => $item->count];
            });

        // Service status distribution (active vs inactive)
        $serviceStatusDistribution = [
            'active' => Service::where('is_active', true)->count(),
            'inactive' => Service::where('is_active', false)->count(),
        ];

        // Check for common booking issues
        $issueCount = [
            'pending_payments' => Booking::where('payment_status', 'pending')
                ->where('booking_date', '<', Carbon::now())
                ->count(),
            'no_show_bookings' => Booking::where('status', 'confirmed')
                ->where('booking_date', '<', Carbon::now()->subDay())
                ->count(),
            'low_rated_services' => Service::where('rating', '<', 3.0)
                ->where('rating', '>', 0)
                ->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'monthlyRevenue' => $monthlyRevenue,
                'revenueGrowth' => round($revenueGrowth, 2),
                'totalServices' => $totalServices,
                'totalUsers' => $totalUsers,
                'totalProviders' => $totalProviders,
                'totalClients' => $totalClients,
                'totalCompletedBookings' => $totalCompletedBookings,
                'pendingBookings' => $pendingBookings,
            ],
            'recentBookings' => $recentBookings,
            'topServices' => $topServices,
            'topProviders' => $topProviders,
            'revenueTrends' => $revenueTrends,
            'bookingStatuses' => $bookingStatuses,
            'categoryDistribution' => $categoryDistribution,
            'serviceStatusDistribution' => $serviceStatusDistribution,
            'issueCount' => $issueCount,
        ]);
    }
}

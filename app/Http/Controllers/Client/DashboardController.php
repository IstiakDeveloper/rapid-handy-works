<?php

namespace App\Http\Controllers\Client;

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

        // Client stats
        $totalBookings = Booking::where('client_id', $user->id)->count();
        $completedBookings = Booking::where('client_id', $user->id)
            ->where('status', 'completed')
            ->count();
        $upcomingBookingsCount = Booking::where('client_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('booking_date', '>=', Carbon::now()->format('Y-m-d'))
            ->count();
        $totalSpent = Booking::where('client_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_amount');

        // Favorite providers count
        $favoriteProvidersCount = DB::table('favorites')
            ->where('client_id', $user->id)
            ->count();

        // Recent bookings for client
        $myBookings = Booking::with(['provider', 'service'])
            ->where('client_id', $user->id)
            ->orderBy('booking_date', 'desc')
            ->orderBy('booking_time', 'desc')
            ->take(10)
            ->get();

        // Upcoming bookings
        $upcomingBookings = Booking::with(['provider', 'service'])
            ->where('client_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->where('booking_date', '>=', Carbon::now()->format('Y-m-d'))
            ->orderBy('booking_date', 'asc')
            ->orderBy('booking_time', 'asc')
            ->take(5)
            ->get();

        // Favorite providers
        $favoriteProviders = DB::table('favorites')
            ->join('users', 'favorites.provider_id', '=', 'users.id')
            ->leftJoin(DB::raw('(SELECT provider_id, COUNT(*) as reviews_count FROM reviews GROUP BY provider_id) as provider_reviews'), 'provider_reviews.provider_id', '=', 'users.id')
            ->where('favorites.client_id', $user->id)
            ->select('users.id', 'users.name', 'users.avatar', 'users.rating', DB::raw('COALESCE(provider_reviews.reviews_count, 0) as reviews_count'))
            ->get()
            ->map(function ($provider) {
                // Get the main category for the provider
                $category = Service::where('provider_id', $provider->id)
                    ->join('service_categories', 'services.category_id', '=', 'service_categories.id')
                    ->select('service_categories.name')
                    ->first();

                return [
                    'id' => $provider->id,
                    'name' => $provider->name,
                    'avatar' => $provider->avatar,
                    'rating' => $provider->rating,
                    'reviews_count' => $provider->reviews_count,
                    'category' => $category ? $category->name : 'Multiple Categories'
                ];
            });

        // Recently viewed services
        $recentServices = Service::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->title,
                    'description' => $service->description,
                    'price' => $service->price,
                    'image' => $service->images[0] ?? null
                ];
            });

        // Combine client stats
        $clientStats = [
            'totalSpent' => $totalSpent,
            'totalBookings' => $totalBookings,
            'completedBookings' => $completedBookings,
            'upcomingBookings' => $upcomingBookingsCount,
            'favoriteProviders' => $favoriteProvidersCount
        ];

        return Inertia::render('Client/Dashboard', [
            'clientStats' => $clientStats,
            'myBookings' => $myBookings,
            'upcomingBookings' => $upcomingBookings,
            'favoriteProviders' => $favoriteProviders,
            'recentServices' => $recentServices
        ]);
    }
}

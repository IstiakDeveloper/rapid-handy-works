<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    // UK cities list
    private $ukCities = [
        'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds',
        'Glasgow', 'Edinburgh', 'Bristol', 'Sheffield', 'Newcastle',
        'Cardiff', 'Belfast', 'Nottingham', 'Southampton', 'Oxford',
        'Cambridge', 'York', 'Brighton', 'Leicester', 'Aberdeen',
        'Dundee', 'Swansea', 'Plymouth', 'Reading', 'Coventry'
    ];

    /**
     * Display the home page with featured services and categories
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Get available cities from services table
        $availableCities = Service::where('is_active', true)
            ->distinct()
            ->pluck('city')
            ->toArray();

        // Get selected city (null if none selected)
        $selectedCity = $request->city;

        // Fetch active and featured services
        $services = Service::query()
            ->with(['category', 'provider'])  // Include provider
            ->where('is_active', true)
            ->when($selectedCity, function ($query, $city) {
                $query->where('city', $city);
            })
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('rating')
            ->orderByDesc('created_at')
            ->limit(9)
            ->get()
            ->map(function ($service) {
                $data = $service->toArray();
                // Convert duration from minutes to hours
                $data['duration_hours'] = $service->duration / 60;
                $data['provider_details'] = [
                    'calling_charge' => $service->provider->calling_charge ?? 0,
                    'commission_percentage' => $service->provider->commission_percentage ?? 10
                ];
                return $data;
            });

        // Get categories for display purposes
        $categories = ServiceCategory::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Home', [
            'services' => $services,
            'categories' => $categories,
            'cities' => $availableCities,
            'selectedCity' => $selectedCity,
            'filters' => [
                'search' => request('search'),
                'city' => request('city')
            ]
        ]);
    }

    /**
     * Display all services with advanced filtering
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function services(Request $request)
    {
        // Get available cities from services table
        $availableCities = Service::where('is_active', true)
            ->distinct()
            ->pluck('city')
            ->toArray();

        // Add an "All Cities" option at the beginning of the array
        array_unshift($availableCities, "");

        $services = Service::query()
            ->with('category', 'provider')
            ->where('is_active', true)
            ->when($request->city, function ($query, $city) {
                if (!empty($city)) {
                    $query->where('city', $city);
                }
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('category', function ($categoryQuery) use ($search) {
                            $categoryQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->category, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->min_price, function ($query, $minPrice) {
                $query->where('price', '>=', $minPrice);
            })
            ->when($request->max_price, function ($query, $maxPrice) {
                $query->where('price', '<=', $maxPrice);
            })
            ->when($request->rating, function ($query, $rating) {
                $query->where('rating', '>=', $rating);
            })
            ->orderBy(
                $request->sort_by ?? 'created_at',
                $request->sort_direction ?? 'desc'
            )
            ->paginate($request->per_page ?? 12)
            ->withQueryString()
            ->through(function ($service) {
                $data = $service->toArray();
                // Convert duration from minutes to hours
                $data['duration_hours'] = $service->duration / 60;
                $data['provider_details'] = [
                    'calling_charge' => $service->provider->calling_charge ?? 0,
                    'commission_percentage' => $service->provider->commission_percentage ?? 10
                ];
                return $data;
            });

        // Fetch active service categories for filtering
        $categories = ServiceCategory::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Services/Index', [
            'services' => $services,
            'categories' => $categories,
            'cities' => $availableCities,
            'filters' => [
                'search' => $request->search,
                'city' => $request->city,
                'category' => $request->category,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'rating' => $request->rating,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
                'per_page' => $request->per_page
            ]
        ]);
    }

    /**
     * Show details of a specific service
     *
     * @param Service $service
     * @return \Inertia\Response
     */
    public function serviceDetail(Service $service)
    {
        // Load related data
        $service->load([
            'category',
            'provider',
            'provider.reviews'  // Assuming you'll have a reviews relationship
        ]);

        // Convert duration from minutes to hours
        $service->duration_hours = $service->duration / 60;

        // Add provider details to the service array
        $serviceData = $service->toArray();
        $serviceData['duration_hours'] = $service->duration_hours;
        $serviceData['provider_details'] = [
            'calling_charge' => $service->provider->calling_charge ?? 0,
            'commission_percentage' => $service->provider->commission_percentage ?? 10
        ];

        // Fetch similar services in the same category and city
        $similarServices = Service::query()
            ->where('category_id', $service->category_id)
            ->where('city', $service->city)
            ->where('id', '!=', $service->id)
            ->where('is_active', true)
            ->limit(4)
            ->get()
            ->map(function ($service) {
                $data = $service->toArray();
                $data['duration_hours'] = $service->duration / 60;
                return $data;
            });

        return Inertia::render('Services/Detail', [
            'service' => $serviceData,
            'similarServices' => $similarServices
        ]);
    }

    /**
     * Handle service booking initialization
     *
     * @param Service $service
     * @param Request $request
     * @return \Inertia\Response
     */
    public function bookService(Service $service)
    {
        // Ensure service is active
        if (!$service->is_active) {
            return back()->with('error', 'This service is currently unavailable.');
        }

        // Check if user is authenticated
        if (!auth()->check()) {
            return redirect()->route('login')->with('message', 'Please login to book a service');
        }

        // Convert duration from minutes to hours
        $service->duration_hours = $service->duration / 60;

        return Inertia::render('Bookings/Create', [
            'service' => $service->load('category', 'provider'),
            'user' => auth()->user()
        ]);
    }

    /**
     * Search services (API endpoint)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchServices(Request $request)
    {
        $services = Service::query()
            ->where('is_active', true)
            ->when($request->city, function ($query, $city) {
                $query->where('city', $city);
            })
            ->where(function ($query) use ($request) {
                $query->where('title', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%")
                    ->orWhereHas('category', function ($categoryQuery) use ($request) {
                        $categoryQuery->where('name', 'like', "%{$request->search}%");
                    });
            })
            ->limit(10)
            ->get(['id', 'title', 'description', 'price', 'category_id', 'city', 'duration']);

        // Convert duration from minutes to hours
        $services->transform(function ($service) {
            $service->duration_hours = $service->duration / 60;
            return $service;
        });

        return response()->json($services);
    }
}

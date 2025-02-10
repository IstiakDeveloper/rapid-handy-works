<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page with featured services and categories
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Fetch active and featured services
        $services = Service::query()
            ->with('category')  // Eager load category
            ->where('is_active', true)
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(request('category'), function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->orderByDesc('rating')  // Sort by highest rated first
            ->orderByDesc('created_at')
            ->limit(9)  // Limit to 9 featured services
            ->get();

        // Fetch active service categories
        $categories = ServiceCategory::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Home', [
            'services' => $services,
            'categories' => $categories,
            'filters' => [
                'search' => request('search'),
                'category' => request('category')
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
        $services = Service::query()
            ->with('category', 'provider')
            ->where('is_active', true)
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
            ->withQueryString();

        // Fetch active service categories for filtering
        $categories = ServiceCategory::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Services/Index', [
            'services' => $services,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
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

        // Fetch similar services in the same category
        $similarServices = Service::query()
            ->where('category_id', $service->category_id)
            ->where('id', '!=', $service->id)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        return Inertia::render('Services/Detail', [
            'service' => $service,
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
            ->where(function ($query) use ($request) {
                $query->where('title', 'like', "%{$request->search}%")
                      ->orWhere('description', 'like', "%{$request->search}%")
                      ->orWhereHas('category', function ($categoryQuery) use ($request) {
                          $categoryQuery->where('name', 'like', "%{$request->search}%");
                      });
            })
            ->limit(10)
            ->get(['id', 'title', 'description', 'price', 'category_id']);

        return response()->json($services);
    }
}

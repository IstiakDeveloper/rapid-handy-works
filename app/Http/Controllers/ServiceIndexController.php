<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceIndexController extends Controller
{
    /**
     * Display a paginated list of services with filtering and sorting options
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Validate and sanitize input parameters
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|exists:service_categories,id',
            'sort' => 'nullable|in:price_asc,price_desc,rating,newest,most_booked',
            'per_page' => 'nullable|integer|between:9,36'
        ]);

        // Base query for services
        $servicesQuery = Service::query()
            ->with(['category', 'provider', 'bookings'])
            ->where('is_active', true);

        // Apply search filter
        if ($request->filled('search')) {
            $servicesQuery->where(function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Apply category filter
        if ($request->filled('category')) {
            $servicesQuery->where('category_id', $request->category);
        }

        // Apply sorting
        switch ($request->sort) {
            case 'price_asc':
                $servicesQuery->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $servicesQuery->orderBy('price', 'desc');
                break;
            case 'rating':
                $servicesQuery->orderByDesc('rating');
                break;
            case 'newest':
                $servicesQuery->orderByDesc('created_at');
                break;
            case 'most_booked':
                $servicesQuery->withCount('bookings')
                    ->orderByDesc('bookings_count');
                break;
            default:
                // Default sorting can be by created_at or keep it as is
                $servicesQuery->orderByDesc('created_at');
        }

        // Paginate results
        $services = $servicesQuery->paginate($request->input('per_page', 12))
            ->withQueryString()
            ->through(fn($service) => [
                'id' => $service->id,
                'title' => $service->title,
                'description' => $service->description,
                'price' => $service->price,
                'duration' => $service->duration,
                'rating' => $service->rating,
                'images' => $service->images,
                'bookings_count' => $service->bookings_count ?? 0,
                'category' => $service->category ? [
                    'id' => $service->category->id,
                    'name' => $service->category->name
                ] : null,
                'provider' => $service->provider ? [
                    'id' => $service->provider->id,
                    'name' => $service->provider->name,
                    'calling_charge' => $service->provider->calling_charge ?? 0,
                    'commission_percentage' => $service->provider->commission_percentage ?? 10
                ] : null,
                'provider_details' => [
                    'calling_charge' => $service->provider->calling_charge ?? 0,
                    'commission_percentage' => $service->provider->commission_percentage ?? 10
                ]
            ]);

        // Get all categories for filtering
        $categories = ServiceCategory::where('is_active', true)
            ->withCount('services')
            ->orderBy('name')
            ->get();

        return Inertia::render('Services/Index', [
            'services' => $services,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'sort' => $request->sort,
                'per_page' => $request->per_page
            ]
        ]);
    }
}

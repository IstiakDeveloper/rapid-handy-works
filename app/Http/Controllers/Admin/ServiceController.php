<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    // UK cities list
    private $ukCities = [
        'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds',
        'Glasgow', 'Edinburgh', 'Bristol', 'Sheffield', 'Newcastle',
        'Cardiff', 'Belfast', 'Nottingham', 'Southampton', 'Oxford',
        'Cambridge', 'York', 'Brighton', 'Leicester', 'Aberdeen',
        'Dundee', 'Swansea', 'Plymouth', 'Reading', 'Coventry'
    ];

    public function index(Request $request)
    {
        $services = Service::query()
            ->with(['category', 'provider'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->category, function ($query, $category) {
                $query->where('category_id', $category);
            })
            ->when($request->city, function ($query, $city) {
                $query->where('city', $city);
            })
            ->when($request->has('is_active'), function ($query) use ($request) {
                $query->where('is_active', $request->is_active);
            })
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate(10)
            ->withQueryString();

        // Convert duration from minutes to hours for display
        $services->getCollection()->transform(function ($service) {
            $service->duration_hours = $service->duration / 60;
            return $service;
        });

        $categories = ServiceCategory::active()->get();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'categories' => $categories,
            'cities' => $this->ukCities,
            'filters' => $request->only(['search', 'category', 'city', 'is_active', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        $categories = ServiceCategory::active()->get();

        // Fetch providers only if the user is an admin
        $providers = auth()->user()->role === 'admin'
            ? User::where('role', 'provider')->get()
            : [];

        return Inertia::render('Admin/Services/Create', [
            'categories' => $categories,
            'providers' => $providers,
            'cities' => $this->ukCities,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:services,title',
            'description' => 'required|string',
            'category_id' => 'required|exists:service_categories,id',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|numeric|min:0.5', // Changed to numeric with min 0.5 hours
            'city' => 'required|string|max:255',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:2048',
            'is_active' => 'boolean',
            'provider_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    // If not admin, ensure user can only create service for themselves
                    if (!auth()->user()->isAdmin() && auth()->user()->id != $value) {
                        $fail('Unauthorized service creation');
                    }
                }
            ],
        ]);

        // Handle image uploads
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('services', 'public');
                $imageUrls[] = $imagePath;
            }
        }

        // For providers, force their own ID
        if (!auth()->user()->isAdmin()) {
            $validated['provider_id'] = auth()->user()->id;
        }

        // Convert duration from hours to minutes for database storage
        $validated['duration'] = (float)$validated['duration'] * 60;

        $service = new Service($validated);
        $service->images = $imageUrls;
        $service->save();

        return redirect()->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        $service->load('category');

        // Convert duration from minutes to hours for the form
        $service->duration = $service->duration / 60;

        $categories = ServiceCategory::active()->get();
        return Inertia::render('Admin/Services/Edit', [
            'service' => $service,
            'categories' => $categories,
            'cities' => $this->ukCities,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:services,title,' . $service->id,
            'description' => 'required|string',
            'category_id' => 'required|exists:service_categories,id',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|numeric|min:0.5', // Changed to numeric with min 0.5 hours
            'city' => 'required|string|max:255',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:2048',
            'is_active' => 'boolean',
        ]);

        // Handle image uploads
        $imageUrls = $service->images ?? [];
        if ($request->hasFile('images')) {
            // Delete old images
            foreach ($imageUrls as $oldImage) {
                Storage::disk('public')->delete($oldImage);
            }

            // Upload new images
            $imageUrls = [];
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('services', 'public');
                $imageUrls[] = $imagePath;
            }
        }

        // Convert duration from hours to minutes for database storage
        $validated['duration'] = (float)$validated['duration'] * 60;

        $service->fill($validated);
        $service->images = $imageUrls;
        $service->save();

        return back()->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        // Delete associated images
        if ($service->images) {
            foreach ($service->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $service->delete();

        return back()->with('success', 'Service deleted successfully.');
    }

    public function toggleStatus(Service $service)
    {
        $service->is_active = !$service->is_active;
        $service->save();

        return back()->with('success', 'Service status updated successfully.');
    }
}

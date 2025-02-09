<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
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
            ->when($request->has('is_active'), function ($query) use ($request) {
                $query->where('is_active', $request->is_active);
            })
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate(10)
            ->withQueryString();

        $categories = ServiceCategory::active()->get();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'is_active', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        $categories = ServiceCategory::active()->get();
        return Inertia::render('Admin/Services/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:services,title',
            'description' => 'required|string',
            'category_id' => 'required|exists:service_categories,id',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|max:2048',
            'is_active' => 'boolean',
        ]);

        // Handle image uploads
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('services', 'public');
                $imageUrls[] = $imagePath;
            }
        }

        $service = new Service($validated);
        $service->provider_id = auth()->user()->id;
        $service->images = $imageUrls;
        $service->save();

        return redirect()->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    public function edit(Service $service)
    {
        $service->load('category');
        $categories = ServiceCategory::active()->get();
        return Inertia::render('Admin/Services/Edit', [
            'service' => $service,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:services,title,' . $service->id,
            'description' => 'required|string',
            'category_id' => 'required|exists:service_categories,id',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
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

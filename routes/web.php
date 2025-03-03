<?php

use App\Http\Controllers\AboutIndexController;
use App\Http\Controllers\Admin\AdminBookingController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\ServiceCategoryController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\CheckoutController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Client\ClientBookingController;
use App\Http\Controllers\ContactIndexController;
use App\Http\Controllers\Provider\ProviderBookingController;
use App\Http\Controllers\ServiceIndexController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar'])->name('profile.avatar.delete');
});


Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [App\Http\Controllers\Admin\UserController::class, 'create'])->name('users.create');
    Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [App\Http\Controllers\Admin\UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
    Route::put('/users/{user}/toggle-status', [App\Http\Controllers\Admin\UserController::class, 'toggleStatus'])
        ->name('users.toggle-status');

    Route::resource('service-categories', ServiceCategoryController::class)
        ->except(['show'])
        ->names([
            'index' => 'service-categories.index',
            'create' => 'service-categories.create',
            'store' => 'service-categories.store',
            'edit' => 'service-categories.edit',
            'update' => 'service-categories.update',
            'destroy' => 'service-categories.destroy',
        ]);

    Route::put('service-categories/{serviceCategory}/toggle-status', [ServiceCategoryController::class, 'toggleStatus'])
        ->name('service-categories.toggle-status');

    Route::resource('services', ServiceController::class)
        ->except(['show'])
        ->names([
            'index' => 'services.index',
            'create' => 'services.create',
            'store' => 'services.store',
            'edit' => 'services.edit',
            'update' => 'services.update',
            'destroy' => 'services.destroy',
        ]);

    Route::put('services/{service}/toggle-status', [ServiceController::class, 'toggleStatus'])
        ->name('services.toggle-status');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/admin/checkout', [CheckoutController::class, 'index'])->name('admin.checkout');
    Route::post('/admin/checkout', [CheckoutController::class, 'store']);

    Route::get('/payment/bank-transfer/{reference}', [CheckoutController::class, 'bankTransferInstructions'])
        ->name('payment.bank-transfer');
    Route::post('/payment/bank-transfer/{reference}/confirm', [CheckoutController::class, 'confirmBankTransfer'])
        ->name('payment.bank-transfer.confirm');
});

Route::middleware(['auth'])->group(function () {
    // Admin routes
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/bookings', [AdminBookingController::class, 'index'])->name('admin.bookings');
        Route::put('/admin/bookings/{booking}', [AdminBookingController::class, 'update']);
        Route::delete('/admin/bookings/{booking}', [AdminBookingController::class, 'destroy']);
        Route::get('/admin/bookings/export', [AdminBookingController::class, 'export'])->name('admin.bookings.export');
    });

    // Provider routes
    Route::middleware(['provider_role'])->group(function () {
        Route::get('/provider/bookings', [ProviderBookingController::class, 'index'])->name('provider.bookings');
        Route::put('/provider/bookings/{booking}', [ProviderBookingController::class, 'update']);
        Route::put('/provider/bookings/{booking}/cancel', [ProviderBookingController::class, 'cancel']);
    });

    // Client routes
    Route::get('/bookings', [ClientBookingController::class, 'index'])->name('client.bookings');
    Route::put('/bookings/{booking}/cancel', [ClientBookingController::class, 'cancel']);
});


Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login']);
    Route::get('register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('register', [AuthController::class, 'register']);
    Route::post('check-email', [AuthController::class, 'checkEmail'])->name('check.email');
});

Route::post('logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/', [HomeController::class, 'index'])->name('services.index');
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::get('/services', [ServiceIndexController::class, 'index'])
    ->name('services.index');
Route::get('/about', [AboutIndexController::class, 'index'])->name('about');

Route::get('/checkout', [CheckoutController::class, 'index'])
     ->name('checkout.index')
     ->middleware(['auth']);

Route::post('/checkout', [CheckoutController::class, 'store'])
     ->name('checkout.store')
     ->middleware(['auth']);

Route::get('/contact', action: [ContactIndexController::class, 'index'])->name('about');



require __DIR__ . '/auth.php';

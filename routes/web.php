<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProductController;
use Illuminate\Foundation\Application;
use App\Models\Client;
use App\Models\Membership;
use App\Models\Payment;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__.'/auth.php';

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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//CLIENTES
Route::get('/clients', [ClientController::class, 'index'])->name('clients.index')->middleware('auth');
Route::get('/products', [ProductController::class, 'index'])->name('products.index')->middleware('auth');

Route::middleware('auth')->get('/test-auth', function () {
    return response()->json([
        'message' => '¡Bienvenido a la API!',
        'status' => 'success'
    ]);
});

Route::prefix('api')->group(function () {

    Route::get('/dashboard-stats', function () {
        return response()->json([
            'totalClients' => Client::count(),
            'activeMemberships' => Membership::where('status', 'active')->count(),
            'expiredMemberships' => Membership::where('status', 'expired')->count(),
            'totalRevenue' => Payment::sum('amount'),
        ]);
    });
    
    Route::middleware('auth')->get('/test-auth', function () {
        return response()->json([
            'message' => '¡Bienvenido a la API!',
            'status' => 'success'
        ]);
    });
    
    Route::resource('clients', ClientController::class)->middleware('auth');
    Route::resource('products', ProductController::class)->middleware('auth');
});


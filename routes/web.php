<?php
//controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\MembershipTypeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductSaleController;

use App\Http\Controllers\FaceRecognitionController;
use App\Http\Controllers\Api\FacialSaleController;

use Illuminate\Foundation\Application;
//models
use App\Models\Client;
use App\Models\Membership;
use App\Models\MembershipType;
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

Route::post('/facial-recognition', [FaceRecognitionController::class, 'recognize'])->name('facial.recognition');
Route::post('/facial-register', [FaceRecognitionController::class, 'registerClientFromFace'])->name('facial.register');
Route::post('/facial-recognition-entry', [FaceRecognitionController::class, 'registerEntry']);
Route::post('/facial-recognition-exit', [FaceRecognitionController::class, 'registerExit']);
Route::post('/facial-recognition-auto', [FaceRecognitionController::class, 'autoAccess']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //CLIENTES
    Route::get('/dashboard/clients', [ClientController::class, 'index'])->name('clients.index');
    //PRODUCTS
    Route::get('/dashboard/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/dashboard/products/qr', [ProductController::class, 'showQrList'])->name('products.qr');
    Route::get('/dashboard/products/scanner', function () {
        return Inertia::render('Products/ProductScanner');
    })->name('products.scanner');    
    Route::get('/api/products/scan/{qr_code}', [ProductController::class, 'scan']);
    Route::post('/api/facial-sale', [FacialSaleController::class, 'store']);

    //MEMBERSHIPS
    Route::get('/dashboard/memberships', [MembershipController::class, 'index'])->name('memberships.index');
    //PAYMENTS
    Route::get('/dashboard/payments', [PaymentController::class, 'index'])->name('payments.index');

    Route::get('/dashboard/access-logs', function () {
        return Inertia::render('AccessLogs/Index');
    })->name('access.logs');
});

Route::middleware('auth')->get('/test-auth', function () {
    return response()->json([
        'message' => '¡Bienvenido a la API!',
        'status' => 'success'
    ]);
});

//APIS
Route::get('/api/clients/get', [ClientController::class, 'get'])->name('clients.get')->middleware('auth');
Route::get('/api/products/get', [ProductController::class, 'get'])->name('products.get')->middleware('auth');

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

    Route::get('/memberships/get', [MembershipController::class, 'get'])->name('memberships.get')->middleware('auth');

    
    Route::resource('clients', ClientController::class)->middleware('auth');


    Route::resource('products', ProductController::class)->middleware('auth');
    Route::post('/product-sales', [ProductSaleController::class, 'store']);


    Route::resource('memberships', MembershipController::class)->middleware('auth');
    Route::resource('membership-types', MembershipTypeController::class)->middleware('auth');

    Route::get('/payments/get', [PaymentController::class, 'get'])->name('payments.get')->middleware('auth');

    Route::get('/payments/search-client', [PaymentController::class, 'searchClient']);
    Route::get('/payments/client-membership/{id}', [PaymentController::class, 'getMembershipByClient']);

    Route::prefix('payments')->group(function () {
    
        // Listar todos los pagos paginados
        Route::get('/', [PaymentController::class, 'index'])->middleware('auth');
    
        // Crear nuevo pago
        Route::post('/', [PaymentController::class, 'store'])->middleware('auth');
    
        // Mostrar pagos por membresía
        Route::get('/membership/{membershipId}', [PaymentController::class, 'showByMembership'])->middleware('auth');
    
        // Eliminar un pago
        Route::delete('/{id}', [PaymentController::class, 'destroy'])->middleware('auth');
    
    });
});


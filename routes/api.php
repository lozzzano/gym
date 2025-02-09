<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Client;
use App\Models\Membership;
use App\Models\Payment;
use App\Http\Controllers\ClientController;

// Ruta de ejemplo para probar
Route::get('/test', function () {
    return response()->json([
        'message' => '¡Bienvenido a la API!',
        'status' => 'success'
    ]);
});


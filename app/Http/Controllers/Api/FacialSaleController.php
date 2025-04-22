<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Client;
use App\Models\ProductSale;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FacialSaleController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'carrito' => 'required|array',
            'carrito.*.id' => 'required|exists:products,id',
            'carrito.*.quantity' => 'required|integer|min:1'
        ]);        

        try {
            DB::beginTransaction();

            $client = Client::with('membership')->findOrFail($request->client_id);

            if (!$client->membership || $client->membership->real_status != "active") {
                return response()->json([
                    'message' => 'El cliente no tiene una membresía activa'
                ], 422);
            }

            $total = 0;

            foreach ($request->carrito as $item) {
                $product = null;
            
                if (!empty($item['qr_code'])) {
                    $product = Product::where('qr_code', $item['qr_code'])->first();
                }
            
                // fallback por id
                if (!$product && !empty($item['id'])) {
                    $product = Product::find($item['id']);
                }
            
                if (!$product) {
                    throw new \Exception("Producto no encontrado en carrito");
                }
            
                $quantity = $item['quantity'];
                $subtotal = $product->price * $quantity;
                $total += $subtotal;
            
                ProductSale::create([
                    'membership_id' => $client->membership->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'total' => $subtotal,
                    'paid' => 0
                ]);
            }            

            DB::commit();

            return response()->json([
                'message' => 'Venta registrada correctamente',
                'total' => $total
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en FacialSaleController: ' . $e->getMessage());
            return response()->json(['message' => 'Error al registrar la venta'], 500);
        }
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductSale;
use App\Models\Product;

class ProductSaleController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'membership_id' => 'required|exists:memberships,id',
            'product_id'    => 'required|exists:products,id',
            'quantity'      => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        $sale = ProductSale::create([
            'membership_id' => $validated['membership_id'],
            'product_id'    => $product->id,
            'quantity'      => $validated['quantity'],
            'total'         => $product->price * $validated['quantity'],
            'paid'          => false,
        ]);

        return response()->json([
            'message' => 'Producto cargado correctamente a la membresía.',
            'sale'    => $sale,
        ], 201);
    }
}

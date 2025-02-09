<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        try {
            $products = Product::with('category')->get();
            return Inertia::render('Products/Index', [
                'products' => $products, 
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener los productos.', 'error' => $e->getMessage()], 500);
        }
    }

    // Crear un nuevo producto
    public function store(ProductRequest $request)
    {
        try {
            $product = Product::create($request->validated());
            return response()->json(['message' => 'Producto creado exitosamente.', 'data' => $product], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear el producto.', 'error' => $e->getMessage()], 500);
        }
    }

    // Actualizar un producto existente
    public function update(ProductRequest $request, $id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->update($request->validated());
            return response()->json(['message' => 'Producto actualizado exitosamente.', 'data' => $product], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar el producto.', 'error' => $e->getMessage()], 500);
        }
    }

    // Eliminar un producto
    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();
            return response()->json(['message' => 'Producto eliminado exitosamente.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el producto.', 'error' => $e->getMessage()], 500);
        }
    }
}

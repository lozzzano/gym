<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MembershipType;
use Illuminate\Database\QueryException;

class MembershipTypeController extends Controller
{
    // Obtener todos los tipos de membresía
    public function index()
    {
        try {
            $membershipTypes = MembershipType::all();
            return response()->json($membershipTypes, 200);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al obtener los tipos de membresía.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Crear un nuevo tipo de membresía
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'duration' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
            ]);

            $membershipType = MembershipType::create($validated);
            return response()->json([
                'message' => 'Tipo de membresía creado exitosamente.',
                'data' => $membershipType
            ], 201);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al crear el tipo de membresía.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Obtener un tipo de membresía específico
    public function show($id)
    {
        try {
            $membershipType = MembershipType::findOrFail($id);
            return response()->json($membershipType, 200);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al obtener el tipo de membresía.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Actualizar un tipo de membresía
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'duration' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
            ]);

            $membershipType = MembershipType::findOrFail($id);
            $membershipType->update($validated);

            return response()->json([
                'message' => 'Tipo de membresía actualizado exitosamente.',
                'data' => $membershipType
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al actualizar el tipo de membresía.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Eliminar un tipo de membresía
    public function destroy($id)
    {
        try {
            $membershipType = MembershipType::findOrFail($id);
            $membershipType->delete();

            return response()->json([
                'message' => 'Tipo de membresía eliminado exitosamente.'
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al eliminar el tipo de membresía.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

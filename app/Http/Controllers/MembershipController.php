<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Membership;
use App\Models\MembershipType;
use Carbon\Carbon;
use App\Http\Requests\MembershipRequest;
use Illuminate\Database\QueryException;
use Inertia\Inertia;

class MembershipController extends Controller
{
    // Listar todas las membresías
    public function index()
    {
        try {
            $memberships = Membership::with('client', 'membershipType')->paginate(15);
            return Inertia::render('Memberships/Index', ['memberships' => $memberships]);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al obtener las membresías.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function get()
    {
        try {
            $memberships = Membership::with('client', 'membershipType')->paginate(15);
            return response()->json($memberships, 200);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al obtener las membresías.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Mostrar una membresía específica
    public function show($id)
    {
        try {
            $membership = Membership::with('client')->findOrFail($id);
            return response()->json($membership);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al obtener la membresía.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Crear una nueva membresía
    public function store(MembershipRequest $request)
    {
        try {
            $membershipType = MembershipType::findOrFail($request->membership_type_id);
            
            $membership = Membership::create([
                'client_id' => $request->client_id,
                'membership_type_id' => $request->membership_type_id,
                'start_date' => $request->start_date,
                'end_date' => Carbon::parse($request->start_date)->addMonths($membershipType->duration),
                'status' => $request->status,
                'price' => $membershipType->price, // Usa el precio del tipo de membresía
            ]);
    
            return response()->json([
                'message' => 'Membresía creada exitosamente.',
                'data' => $membership,
            ], 201);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al crear la membresía.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }    

    // Actualizar una membresía
    public function update(MembershipRequest $request, $id)
    {
        try {
            $membership = Membership::findOrFail($id);
            $membership->update($request->validated());

            return response()->json([
                'message' => 'Membresía actualizada exitosamente.',
                'data' => $membership
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al actualizar la membresía.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Eliminar una membresía
    public function destroy($id)
    {
        try {
            $membership = Membership::findOrFail($id);
            $membership->delete();

            return response()->json(['message' => 'Membresía eliminada exitosamente.'], 200);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al eliminar la membresía.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

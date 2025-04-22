<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use Illuminate\Database\QueryException;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    // Listar todos los clientes
    public function index()
    {
        try {
            $clients = Client::with('membership', 'payments')->get();

            return Inertia::render('Clients/Index', [
                'clients' => $clients, 
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al obtener los clientes.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function get()
    {
        try{
            $clients = Client::with('membership', 'payments')->paginate(12);

            return response()->json($clients, 200);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Error al obtener los clientes.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Crear un nuevo cliente
    public function store(ClientRequest $request)
    {
        try {
            // Usa los datos validados
            $client = Client::create($request->validated());
            Log::info($client);
            return response()->json([
                'message' => 'Cliente creado exitosamente.',
                'data' => $client,
            ], 201);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al crear el cliente.',
                'message' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error inesperado.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Mostrar un cliente específico
    public function show($id)
    {
        try {
            $client = Client::findOrFail($id);
            return response()->json($client, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Cliente no encontrado.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error inesperado.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Actualizar un cliente
    public function update(ClientRequest $request, $id)
    {
        try {
            $client = Client::findOrFail($id);

            // Usa los datos validados
            $client->update($request->validated());
            Log::info($client);
            return response()->json([
                'message' => 'Cliente actualizado exitosamente.',
                'data' => $client,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Cliente no encontrado.',
            ], 404);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al actualizar el cliente.',
                'message' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error inesperado.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Eliminar un cliente
    public function destroy($id)
    {
        try {
            $client = Client::findOrFail($id);
            $client->delete();
            return response()->json([
                'message' => 'Cliente eliminado exitosamente.',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Cliente no encontrado.',
            ], 404);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Error al eliminar el cliente.',
                'message' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error inesperado.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}

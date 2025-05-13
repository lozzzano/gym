<?php

namespace App\Http\Controllers;

use App\Models\AccessLog;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class FaceRecognitionController extends Controller
{
    public function recognize(Request $request)
    {
        if (!$request->hasFile('imagen')) {
            return response()->json(['error' => 'Imagen requerida'], 400);
        }

        $response = Http::attach(
            'imagen',
            file_get_contents($request->file('imagen')->getRealPath()),
            $request->file('imagen')->getClientOriginalName()
        )->post('http://127.0.0.1:5000/recognize');

        $data = $response->json();

        if (isset($data['id'])) {
            $client = Client::with('membership.membershipType')->find($data['id']);

            $allowEntry = $client->membership && $client->membership->real_status === 'active';

            return response()->json([
                'mensaje' => $allowEntry ? 'Acceso permitido' : 'Acceso denegado',
                'cliente' => $client,
                'acceso' => $allowEntry
            ]);
        }

        return response()->json(['mensaje' => $data['mensaje'] ?? 'Error al reconocer'], 200);
    }

    public function registerClientFromFace(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:clients',
            'phone' => 'required',
            'birthdate' => 'required|date',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'imagen' => 'required|image|max:5120',
        ]);

        // 1. Guardar imagen local
        $path = $request->file('imagen')->store('clients', 'public');

        // 2. Enviar imagen a Flask para obtener encoding
        try {
            $response = Http::attach(
                'imagen',
                file_get_contents($request->file('imagen')->getRealPath()),
                $request->file('imagen')->getClientOriginalName()
            )->post('http://127.0.0.1:5000/encode');

            if (!$response->ok() || !isset($response->json()['face_encoding'])) {
                return response()->json(['error' => 'No se detectó rostro en la imagen.'], 422);
            }

            $face_encoding = $response->json()['face_encoding'];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al conectar con Flask: ' . $e->getMessage()], 500);
        }

        // 3. Guardar cliente en BD
        $client = Client::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'birthdate' => $request->birthdate,
            'address' => $request->address,
            'status' => $request->status,
            'profile_picture' => $path,
            'face_encoding' => $face_encoding,
        ]);

        return response()->json([
            'mensaje' => 'Cliente registrado con éxito',
            'cliente' => $client
        ]);
    }

    public function registerEntry(Request $request)
    {
        if (!$request->hasFile('imagen')) {
            return response()->json(['error' => 'Imagen requerida'], 400);
        }

        $response = Http::attach(
            'imagen',
            file_get_contents($request->file('imagen')->getRealPath()),
            $request->file('imagen')->getClientOriginalName()
        )->post('http://127.0.0.1:5000/recognize');

        $data = $response->json();

        if (!isset($data['id'])) {
            return response()->json(['allowed' => false, 'mensaje' => $data['mensaje'] ?? 'No identificado'], 404);
        }

        $client = Client::with('membership')->find($data['id']);

        $status = $client->access_status;
        AccessLog::create([
            'client_id' => $client->id,
            'status' => $status['allowed'] ? 'allowed' : 'denied',
            'reason' => $status['reason'],
            'access_time' => now(),
        ]);

        return response()->json([
            'allowed' => $status['allowed'],
            'mensaje' => $status['allowed'] ? 'Entrada registrada' : 'Acceso denegado',
            'reason' => $status['reason']
        ]);
    }

    public function registerExit(Request $request)
    {
        if (!$request->hasFile('imagen')) {
            return response()->json(['error' => 'Imagen requerida'], 400);
        }

        $response = Http::attach(
            'imagen',
            file_get_contents($request->file('imagen')->getRealPath()),
            $request->file('imagen')->getClientOriginalName()
        )->post('http://127.0.0.1:5000/recognize');

        $data = $response->json();

        if (!isset($data['id'])) {
            return response()->json(['allowed' => false, 'mensaje' => 'No identificado'], 404);
        }

        $client = Client::find($data['id']);

        $log = AccessLog::where('client_id', $client->id)
            ->whereNull('checkout')
            ->latest('access_time')
            ->first();

        if (!$log) {
            return response()->json([
                'allowed' => false,
                'mensaje' => 'No hay entrada pendiente',
                'reason' => 'Este cliente no tiene una entrada sin salida'
            ], 404);
        }

        $log->update(['checkout' => now()]);

        return response()->json([
            'allowed' => true,
            'mensaje' => 'Salida registrada',
            'reason' => 'Hasta luego'
        ]);
    }

    public function autoAccess(Request $request)
    {
        if (!$request->hasFile('imagen')) {
            return response()->json(['error' => 'Imagen requerida'], 400);
        }

        $response = Http::attach(
            'imagen',
            file_get_contents($request->file('imagen')->getRealPath()),
            $request->file('imagen')->getClientOriginalName()
        )->post('http://127.0.0.1:5000/recognize');

        $data = $response->json();

        if (!isset($data['id'])) {
            return response()->json([
                'tipo' => 'denegado',
                'mensaje' => 'Cliente no reconocido',
                'name' => null,
                'entrada' => null,
                'salida' => null,
                'tiempo' => null,
                'alerta' => null
            ], 404);
        }

        $client = Client::with('membership')->find($data['id']);

        if (!$client || $client->status !== 'active') {
            return response()->json([
                'tipo' => 'denegado',
                'mensaje' => 'Cliente inactivo',
                'name' => $client?->name,
                'entrada' => null,
                'salida' => null,
                'tiempo' => null,
                'alerta' => null
            ], 403);
        }

        // Validar acceso por lógica de membresía y entradas
        $status = $client->access_status;

        if (!$status['allowed']) {
            return response()->json([
                'tipo' => 'denegado',
                'mensaje' => $status['reason'],
                'name' => $client->name,
                'entrada' => null,
                'salida' => null,
                'tiempo' => null,
                'alerta' => null
            ], 403);
        }

        // Revisar si tiene entrada sin salida
        $access = AccessLog::where('client_id', $client->id)
            ->whereNull('checkout')
            ->latest('access_time')
            ->first();

        if ($access) {
            $entrada = Carbon::parse($access->access_time);
            $salida = now();
            $tiempo = $entrada->diff($salida);

            $access->update(['checkout' => $salida]);

            return response()->json([
                'tipo' => 'salida',
                'mensaje' => 'Hasta luego',
                'name' => $client->name,
                'entrada' => $entrada->format('H:i'),
                'salida' => $salida->format('H:i'),
                'tiempo' => $tiempo->format('%Hh %Im'),
                'alerta' => $tiempo->h >= 6
                    ? 'El cliente permaneció más de 6 horas en el sitio'
                    : null
            ]);
        }

        // Registrar nueva entrada
        AccessLog::create([
            'client_id' => $client->id,
            'status' => 'allowed',
            'reason' => 'Entrada automática',
            'access_time' => now()
        ]);

        return response()->json([
            'tipo' => 'entrada',
            'mensaje' => 'Bienvenido',
            'name' => $client->name,
            'entrada' => now()->format('H:i'),
            'salida' => null,
            'tiempo' => null,
            'alerta' => null
        ]);
    }
}

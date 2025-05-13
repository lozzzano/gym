<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Membership;
use App\Models\Client;
use App\Http\Requests\StorePaymentRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Services\PaymentService;

class PaymentController extends Controller
{
    public function index()
    {
        try {
            $payments = Payment::with('membership', 'client')->paginate(12);
            return Inertia::render('Payments/Index', [
                'payments' => $payments, 
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener los pagos.', 'error' => $e->getMessage()], 500);
        }
    }

    public function get()
    {
        try{
            $payments = Payment::with('membership', 'client')->paginate(12);
            return response()->json($payments, 200);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Error al obtener los pagos.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Crear nuevo pago
    public function store(StorePaymentRequest $request, PaymentService $paymentService)
    {
        $membership = Membership::with('productSales')->findOrFail($request->membership_id);
    
        // Total de productos no pagados
        $pendingSales = $membership->productSales()->where('paid', false)->get();
        $productsTotal = $pendingSales->sum('total');
    
        // Total general
        $total = $membership->price + $productsTotal;
    
        // Generar nombre para imagen si viene incluida
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = 'client_' . $membership->client_id . '_m' . $membership->id . '_' . now()->format('YmdHis') . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('public/payments', $filename); // se guarda en storage/app/public/payments
        }
    
        // Crear pago
        $payment = Payment::create([
            'client_id'       => $membership->client_id,
            'membership_id'   => $membership->id,
            'amount'          => $total,
            'payment_method'  => $request->payment_method,
            'reference'       => $request->reference,
            'payment_date'    => $request->payment_date,
            'image'           => $imagePath ? str_replace('public/', 'storage/', $imagePath) : null,
        ]);
    
        //Marcar ventas como pagadas
        foreach ($pendingSales as $sale) {
            $sale->update(['paid' => true]);
        }
    
        return response()->json([
            'message' => 'Pago registrado correctamente',
            'payment' => $payment
        ], 201);
    }

    // Obtener pagos por membresía
    public function showByMembership($membershipId)
    {
        $payments = Payment::where('membership_id', $membershipId)->get();

        return response()->json([
            'payments' => $payments
        ]);
    }

    // Buscar clientes por nombre (incluye fecha de nacimiento)
    public function searchClient()
    {
        $term = request()->query('term');
        
        $clients = Client::where('name', 'LIKE', "%{$term}%")
            ->select('id', 'name', 'birthdate') 
            ->limit(10)
            ->get();

        return response()->json($clients);
    }

    public function getMembershipByClient($id)
    {
        $membership = Membership::with(['client'])->where('client_id', $id)
            ->orderByDesc('created_at')
            ->first();

        if (!$membership) {
            return response()->json(['error' => 'Sin membresía'], 404);
        }

        return response()->json($membership);
    }

    // Eliminar un pago
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json([
            'message' => 'Pago eliminado correctamente'
        ]);
    }
}

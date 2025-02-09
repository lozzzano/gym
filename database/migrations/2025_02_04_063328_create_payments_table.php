<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id(); // ID único
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade'); // Relación con clientes
            $table->foreignId('membership_id')->nullable()->constrained('memberships')->onDelete('cascade'); // Relación opcional con membresías
            $table->decimal('amount', 10, 2); // Monto del pago
            $table->string('payment_method'); // Método de pago (ejemplo: tarjeta, efectivo)
            $table->string('reference')->nullable(); // Código o referencia del pago
            $table->date('payment_date'); // Fecha del pago
            $table->timestamps(); // created_at, updated_at
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};

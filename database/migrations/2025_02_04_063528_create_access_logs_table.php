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
        Schema::create('access_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade'); // Relación con clientes
            $table->timestamp('access_time'); // Fecha y hora de acceso
            $table->timestamp('checckout')->nullable(); // Fecha y hora de salida
            $table->enum('status', ['allowed', 'denied'])->default('allowed'); // Permitido o denegado
            $table->string('reason')->nullable(); // Razón si fue denegado
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_logs');
    }
};

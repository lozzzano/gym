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
        Schema::create('clients', function (Blueprint $table) {
            $table->id(); // ID único
            $table->string('name'); // Nombre completo
            $table->string('email')->unique(); // Correo único
            $table->unsignedBigInteger('phone')->unique(); // Número de teléfono único
            $table->date('birthdate'); // Fecha de nacimiento
            $table->string('address', 100)->nullable(); // Dirección opcional
            $table->string('profile_picture')->nullable(); // Foto de perfil (ruta)
            $table->enum('status', ['active', 'inactive'])->default('active'); // Estado general del cliente
            $table->timestamps(); // created_at, updated_at
            $table->softDeletes(); // Eliminación lógica
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};

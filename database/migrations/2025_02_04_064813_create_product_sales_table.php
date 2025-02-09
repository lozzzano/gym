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
        Schema::create('product_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('membership_id')->constrained('memberships')->onDelete('cascade'); // Relación con la membresía activa
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // Producto comprado
            $table->integer('quantity'); // Cantidad comprada
            $table->decimal('total', 10, 2); // Precio total (price * quantity)
            $table->boolean('paid')->default(false); // Indica si ya se pagó o está pendiente
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_sales');
    }
};

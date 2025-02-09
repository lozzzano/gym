<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Client;
use App\Models\Membership;
use App\Models\Payment;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductSale;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear roles predeterminados
        $roles = Role::insert([
            ['name' => 'admin', 'description' => 'Administrador del sistema'],
            ['name' => 'receptionist', 'description' => 'Recepcionista del gimnasio'],
        ]);

        // 2. Crear usuarios con roles
        $adminRole = Role::where('name', 'admin')->first();
        $receptionistRole = Role::where('name', 'receptionist')->first();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role_id' => $adminRole->id,
        ]);

        User::factory()->create([
            'name' => 'Receptionist User',
            'email' => 'receptionist@example.com',
            'role_id' => $receptionistRole->id,
        ]);

        // 3. Crear clientes
        $clients = Client::factory(10)->create();

        // 4. Crear membresías para cada cliente
        $clients->each(function ($client) {
            Membership::create([
                'client_id' => $client->id,
                'type' => 'Mensual',
                'start_date' => now(),
                'end_date' => now()->addMonth(),
                'status' => 'active',
                'price' => 500,
            ]);
        });

        // 5. Crear categorías de productos
        $categories = Category::insert([
            ['name' => 'Bebidas', 'description' => 'Bebidas energéticas y agua.'],
            ['name' => 'Suplementos', 'description' => 'Suplementos deportivos.'],
        ]);

        $bebidasCategory = Category::where('name', 'Bebidas')->first();
        $suplementosCategory = Category::where('name', 'Suplementos')->first();

        // 6. Crear productos
        Product::create([
            'name' => 'Botella de Agua',
            'description' => 'Agua purificada 500ml',
            'price' => 10.00,
            'stock' => 100,
            'category_id' => $bebidasCategory->id,
        ]);

        Product::create([
            'name' => 'Proteína en Polvo',
            'description' => 'Proteína de suero de leche 1kg',
            'price' => 300.00,
            'stock' => 50,
            'category_id' => $suplementosCategory->id,
        ]);

        // 7. Crear ventas de productos y asociarlas a membresías
        Membership::all()->each(function ($membership) {
            $product = Product::inRandomOrder()->first();
            ProductSale::create([
                'membership_id' => $membership->id,
                'product_id' => $product->id,
                'quantity' => rand(1, 5),
                'total' => $product->price * rand(1, 5),
                'paid' => false, // Marcar como pendiente de pago
            ]);
        });

        // 8. Crear pagos para algunas membresías
        Membership::take(5)->get()->each(function ($membership) {
            Payment::create([
                'client_id' => $membership->client_id,
                'membership_id' => $membership->id,
                'amount' => $membership->price,
                'payment_method' => 'efectivo',
                'payment_date' => now(),
                'reference' => 'PAY-' . strtoupper(uniqid()),
            ]);
        });
    }
}

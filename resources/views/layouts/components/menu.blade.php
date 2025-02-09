<nav class="bg-white shadow-md w-full">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-4">
            <a href="{{ route('dashboard') }}" class="text-xl font-bold text-gray-700">
                {{ config('app.name', 'Gym') }}
            </a>
            <ul class="flex space-x-4">
                <li>
                    <a href="{{ route('dashboard') }}" class="{{ request()->routeIs('dashboard') ? 'text-blue-500' : 'text-gray-600' }} hover:text-blue-500">
                        Dashboard
                    </a>
                </li>
                <li>
                    <a href="/clients" class="{{ request()->routeIs('clients.*') ? 'text-blue-500' : 'text-gray-600' }} hover:text-blue-500">
                        Clientes
                    </a>
                </li>
                <li>
                    <a href="{{ route('logout') }}" class="text-gray-600 hover:text-blue-500">
                        Cerrar Sesión
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>

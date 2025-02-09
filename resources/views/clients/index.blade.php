@extends('layouts.app') {{-- Usa tu layout base de Blade si tienes uno --}}

@section('content')
    <h1 class="text-2xl font-bold mb-4">Gestión de Clientes</h1>
    <div id="react-clients"></div> {{-- Aquí se monta el componente React --}}
    <p>Vista</p>
@endsection

@push('scripts')
    {{-- Cargar React con Vite --}}
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
@endpush

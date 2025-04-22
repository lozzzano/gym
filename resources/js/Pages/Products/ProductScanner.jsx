import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import FacialPurchase from "@/Components/FacialPurchase";

export default function ProductScanner() {
    return (
        <AuthenticatedLayout>
            <Head title="Escaneo de Productos" />
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Escaneo de Productos</h1>
                <FacialPurchase />
            </div>
        </AuthenticatedLayout>
    );
} 

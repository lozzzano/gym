import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalClients: 0,
        activeMemberships: 0,
        expiredMemberships: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        axios.get("/api/dashboard-stats").then((response) => {
            setStats(response.data);
        });
    }, []);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 m-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Total Clientes</h3>
                        <p className="text-3xl">{stats.totalClients}</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Membresías Activas</h3>
                        <p className="text-3xl">{stats.activeMemberships}</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Membresías Expiradas</h3>
                        <p className="text-3xl">{stats.expiredMemberships}</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Ingresos Totales</h3>
                        <p className="text-3xl">${stats.totalRevenue}</p>
                    </div>
                </div>
            </div>

            <div className="py-4 m-6">
                <h3 className="text-lg font-semibold">Accesos Rápidos</h3>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    <a
                        href="/clients"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow min-w-[150px] text-center"
                    >
                        Clientes
                    </a>
                    <a
                        href="/products"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow min-w-[150px] text-center"
                    >
                        Productos
                    </a>
                    <a
                        href="/reports"
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow min-w-[150px] text-center"
                    >
                        Ver Reportes
                    </a>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}

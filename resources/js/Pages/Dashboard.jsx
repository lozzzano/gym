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
            header={<h2 className="text-gray-800 text-xl font-semibold leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="m-4 py-12">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:px-8 max-w-7xl md:grid-cols-2 mx-auto sm:px-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Total Clientes</h3>
                        <p className="text-3xl">{stats.totalClients}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Membresías Activas</h3>
                        <p className="text-3xl">{stats.activeMemberships}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Membresías Expiradas</h3>
                        <p className="text-3xl">{stats.expiredMemberships}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Ingresos Totales</h3>
                        <p className="text-3xl">${stats.totalRevenue}</p>
                    </div>
                </div>
            </div>

            <div className="m-6 py-4">
                <h3 className="text-lg font-semibold">Accesos Rápidos</h3>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <a
                        href="/dashboard/clients"
                        className="bg-blue-500 rounded-lg shadow text-center text-white min-w-[150px] px-4 py-2"
                    >
                        Clientes
                    </a>
                    <a
                        href="/dashboard/products"
                        className="bg-green-500 rounded-lg shadow text-center text-white min-w-[150px] px-4 py-2"
                    >
                        Productos
                    </a>
                    <a
                        href="/dashboard/reports"
                        className="bg-purple-500 rounded-lg shadow text-center text-white min-w-[150px] px-4 py-2"
                    >
                        Ver Reportes
                    </a>
                    <a
                        href="/dashboard/memberships"
                        className="bg-yellow-500 rounded-lg shadow text-center text-white min-w-[150px] px-4 py-2"
                    >
                        Ver Membresías
                    </a>
                    <a
                        href="/dashboard/payments"
                        className="bg-red-500 rounded-lg shadow text-center text-white min-w-[150px] px-4 py-2"
                    >
                        Ver Pagos
                    </a>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}

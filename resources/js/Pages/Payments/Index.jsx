import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import PaymentForm from "@/Components/Payments/PaymentForm";
import PaymentTable from "@/Components/Payments/PaymentTable";

export default function Index() {
    const [payments, setPayments] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchPayments = async (page = 1) => {
        try {
            const response = await axios.get(`/api/payments/get?page=${page}`);
            setPayments(response.data.data); // los datos reales
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
            });
        } catch (error) {
            console.error("Error cargando pagos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        try {
            await axios.post("/api/payments", data);
            fetchPayments();

            Swal.fire({
                icon: "success",
                title: "Pago guardado",
                text: "El pago se registró correctamente.",
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: "top-end"
            });
        } catch (error) {
            console.error("Error guardando pago:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar el pago.",
                confirmButtonColor: "#e3342f"
            });
        }
    };

    const handleDelete = async (payment) => {
        const confirmacion = await Swal.fire({
            title: `¿Eliminar pago ID ${payment.id}?`,
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        try {
            await axios.delete(`/api/payments/${payment.id}`);
            fetchPayments();

            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "El pago ha sido eliminado.",
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: "top-end"
            });
        } catch (error) {
            console.error("Error eliminando pago:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar el pago.",
                confirmButtonColor: "#e3342f"
            });
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Pagos" />

            <div className="container p-4 mx-auto">
                <h1 className="text-2xl font-bold mb-4">Gestión de Pagos</h1>

                <PaymentForm onSubmit={handleSubmit} />

                <div className="mt-6">
                    {loading ? (
                        <p>Cargando pagos...</p>
                    ) : payments.length > 0 ? (
                        <>
                            <PaymentTable payments={payments} onDelete={handleDelete} />
                            <div className="flex justify-center gap-2 mt-4">
                                {pagination.current_page > 1 && (
                                    <button
                                        onClick={() => fetchPayments(pagination.current_page - 1)}
                                        className="border rounded px-3 py-1"
                                    >
                                        « Anterior
                                    </button>
                                )}
                                <span className="bg-blue-500 rounded text-white px-3 py-1">
                                    Página {pagination.current_page}
                                </span>
                                {pagination.current_page < pagination.last_page && (
                                    <button
                                        onClick={() => fetchPayments(pagination.current_page + 1)}
                                        className="border rounded px-3 py-1"
                                    >
                                        Siguiente »
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">No hay pagos registrados.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

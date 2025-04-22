import React from "react";

export default function PaymentTable({ payments, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto text-left w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">ID</th>
                        <th className="p-2">Cliente</th>
                        <th className="p-2">Membresía</th>
                        <th className="p-2">Monto</th>
                        <th className="p-2">Método</th>
                        <th className="p-2">Referencia</th>
                        <th className="p-2">Fecha</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id} className="border-b">
                            <td className="p-2">{payment.id}</td>
                            <td className="p-2">{payment.client?.name}</td>
                            <td className="p-2">{payment.membership?.id}</td>
                            <td className="p-2">${payment.amount}</td>
                            <td className="p-2">{payment.payment_method}</td>
                            <td className="p-2">{payment.reference}</td>
                            <td className="p-2">{payment.payment_date}</td>
                            <td className="p-2">
                                <button
                                    className="bg-red-500 rounded text-white px-2 py-1"
                                    onClick={() => onDelete(payment)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

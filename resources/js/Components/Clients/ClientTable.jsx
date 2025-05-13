import React from "react";

export default function ClientTable({ clients, onEdit, onDelete, onConfirmDelete, onCreateMembership, onViewMembership }) {
    return (
        <table className="table-auto border border-collapse border-gray-200 text-center w-full">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-200 px-4 py-2">ID</th>
                    <th className="border border-gray-200 px-4 py-2">Nombre</th>
                    <th className="border border-gray-200 px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {clients.map((client) => (
                    <tr key={client.id}>
                        <td className="border border-gray-200 px-4 py-2">{client.id}</td>
                        <td className="border border-gray-200 px-4 py-2">{client.name || "Sin Nombre"}</td>
                        <td className="border border-gray-200 text-center px-4 py-2">
                            <div className="flex flex-wrap justify-center gap-2">
                                {/* Botón de Editar */}
                                <button
                                    className="flex bg-yellow-500 rounded text-white gap-2 hover:bg-yellow-600 items-center px-3 py-1 transition"
                                    onClick={() => onEdit(client)}
                                >
                                    <i className="bi bi-pencil"></i>
                                    <span className="hidden md:inline">Editar</span>
                                </button>

                                {/* Botón de Eliminar */}
                                <button
                                    className="flex bg-red-500 rounded text-white gap-2 hover:bg-red-600 items-center px-3 py-1 transition"
                                    onClick={() => onConfirmDelete(client)}
                                >
                                    <i className="bi bi-trash"></i>
                                    <span className="hidden md:inline">Eliminar</span>
                                </button>

                                <button
                                    className="bg-green-500 rounded text-white px-2 py-1"
                                    onClick={() => {
                                        if (client.membership) {
                                            onViewMembership(client); // mostrar modal resumen
                                        } else {
                                            onCreateMembership(client); // abrir formulario nuevo
                                        }
                                    }}
                                >
                                    <span className="hidden md:inline">
                                        {client.membership ? "Ver Membresía" : "Asignar Membresía"}
                                    </span>
                                </button>

                            </div>
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
}

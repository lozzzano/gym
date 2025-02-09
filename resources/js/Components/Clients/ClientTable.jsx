import React from "react";

export default function ClientTable({ clients, onEdit, onDelete }) {
    return (
        <table className="table-auto w-full border-collapse border border-gray-200 text-center">
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
                        <td className="border border-gray-200 px-4 py-2 text-center">
                            <div className="flex flex-wrap justify-center gap-2">
                                {/* Botón de Editar */}
                                <button
                                    className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                    onClick={() => onEdit(client)}
                                >
                                    <i className="bi bi-pencil"></i>
                                    <span className="hidden md:inline">Editar</span>
                                </button>

                                {/* Botón de Eliminar */}
                                <button
                                    className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    onClick={() => onDelete(client)}
                                >
                                    <i className="bi bi-trash"></i>
                                    <span className="hidden md:inline">Eliminar</span>
                                </button>
                            </div>
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
}

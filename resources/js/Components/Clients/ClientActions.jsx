import React from "react";

export default function ClientActions({ onOpenModal, onEdit, onDelete, actionType }) {
    return actionType === "crear" ? (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onOpenModal}>
            <i className="bi bi-plus"></i> Crear Cliente
        </button>
    ) : (
        <>
            <button
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                onClick={onEdit}
            >
                Editar
            </button>
            <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={onDelete}
            >
                Eliminar
            </button>
        </>
    );
}

import React from "react";

export default function MembershipActions({ membership, onEdit, onDelete }) {
    return (
        <div className="flex space-x-2">
            {/* Botón Editar */}
            <button
                className="bg-yellow-500 text-white px-2 py-1 rounded"
                onClick={() => onEdit(membership)}
            >
                ✏️
            </button>

            {/* Botón Eliminar */}
            <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => onDelete(membership)}
            >
                🗑️
            </button>
        </div>
    );
}

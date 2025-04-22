import React from "react";

export default function MembershipTypeActions({ membershipType, onEdit, onDelete }) {
    return (
        <div className="flex space-x-2">
            <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => onEdit(membershipType)}
            >
                ✏️ Editar
            </button>
            <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => onDelete(membershipType)}
            >
                🗑 Eliminar
            </button>
        </div>
    );
}

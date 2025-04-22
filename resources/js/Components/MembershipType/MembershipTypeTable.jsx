import React from "react";
import MembershipTypeActions from "./MembershipTypeAction";

export default function MembershipTypeTable({ membershipTypes, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Duración (Meses)</th>
                        <th className="px-4 py-2">Precio</th>
                        <th className="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {membershipTypes.length > 0 ? (
                        membershipTypes.map((type) => (
                            <tr key={type.id} className="border-b">
                                <td className="px-4 py-2">{type.id}</td>
                                <td className="px-4 py-2">{type.name}</td>
                                <td className="px-4 py-2">{type.duration}</td>
                                <td className="px-4 py-2">${type.price}</td>
                                <td className="px-4 py-2">
                                    <MembershipTypeActions
                                        membershipType={type}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-gray-500 py-4">
                                No hay tipos de membresía registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

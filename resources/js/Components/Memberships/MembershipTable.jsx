import React from "react";
import MembershipActions from "./MembershipActions";

export default function MembershipTable({ memberships, onEdit, onDelete }) {
    return (
        <table className="w-full border-collapse border border-gray-300 text-center">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Cliente</th>
                    <th className="border p-2">Tipo</th>
                    <th className="border p-2">Estado</th>
                    <th className="border p-2">Precio</th>
                    <th className="border p-2">Acciones</th>
                </tr>
            </thead>
            <tbody className="uppercase">
                {memberships.map((membership) => (
                    <tr key={membership.id} className="text-center">
                        <td className="border p-2">{membership.id}</td>
                        <td className="border p-2">{membership.client?.name || "N/A"}</td>
                        <td className="border p-2">{membership.membership_type?.name || "N/A"}</td>
                        <td className="border p-2">{membership.status}</td>
                        <td className="border p-2">${membership.price}</td>
                        <td className="border p-2">
                            <MembershipActions 
                                membership={membership}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

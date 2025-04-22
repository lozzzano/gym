import React, { useEffect, useState } from "react";
import ClientTable from "./ClientTable";
import { Link } from "@inertiajs/react";
import axios from "axios";

export default function PaginatedClientTable({ onEdit, onDelete, onCreateMembership, onViewMembership, onRefetchClients, }) {
    const [clients, setClients] = useState({ data: [], links: [] });
    const [loading, setLoading] = useState(false);

    // Almacena la URL actual para mantener la página en la recarga
    const [currentUrl, setCurrentUrl] = useState("/api/clients/get");

    // Función para obtener los datos con paginación
    const fetchClients = async (url = "/api/clients/get") => {
        setLoading(true);
        setCurrentUrl(url); // Guarda la URL actual
        try {
            const response = await axios.get(url);
            setClients(response.data);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar los clientes al montar el componente
    useEffect(() => {
        fetchClients();
    }, []);

    // Función para recargar los clientes en tiempo real
    const refetchClients = () => {
        fetchClients(currentUrl);
    };

    const handleConfirmDelete = async (client) => {
        await onDelete(client);      // Esto ejecuta handleConfirmDelete de Index.jsx
        refetchClients();            // Esto actualiza la tabla paginada
      };      

    return (
        <div>
            {loading ? (
                <p className="text-center text-gray-500">Cargando...</p>
            ) : (
                <>
                    <ClientTable
                    clients={clients.data}
                    onEdit={onEdit}
                    onConfirmDelete={handleConfirmDelete} 
                    onCreateMembership={onCreateMembership}
                    onViewMembership={onViewMembership}
                    />


                    {/* Paginación */}
                    {clients.links && (
                        <nav className="flex justify-center mt-4">
                            <ul className="-space-x-px inline-flex items-center">
                                {clients.links.map((link, index) => (
                                    <li key={index}>
                                        {link.url ? (
                                            <button
                                                onClick={() => fetchClients(link.url)}
                                                className={`px-3 py-2 ml-1 border text-sm rounded-md ${
                                                    link.active
                                                        ? "bg-blue-500 text-white border-blue-500"
                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                className="bg-white border border-gray-300 rounded-md text-gray-500 ml-1 px-3 py-2"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
}

import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ClientTable from "@/Components/Clients/ClientTable";
import ClientForm from "@/Components/Clients/ClientForm";
import { Head } from "@inertiajs/react";
import Modal from "@/Components/Common/Modal";
import axios from "axios";

export default function Index({ clients: initialClients }) {
    const [clients, setClients] = useState(initialClients || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Abrir el modal
    const handleOpenModal = (type, client = {}) => {
        setModalType(type);
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setModalType("");
        setSelectedClient(null);
        setIsModalOpen(false);
    };

    // Guardar cliente (crear o editar)
    const handleSave = async (data) => {
        try {
            let response;
            if (modalType === "crear") {
                response = await axios.post("/api/clients", data);
                //console.log("Nuevo cliente creado:", response.data);
                setClients((prevClients) => [...prevClients, response.data]);
            } else if (modalType === "editar") {
                response = await axios.put(`/api/clients/${selectedClient.id}`, data);
                //console.log("Cliente actualizado desde el servidor:", response.data);

                // Aseguramos que el cliente actualizado se inserte correctamente en el estado
                const updatedClient = response.data.data || response.data; // Ajustar según la estructura
                setClients((prevClients) =>
                    prevClients.map((client) =>
                        client.id === updatedClient.id ? updatedClient : client
                    )
                );
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar el cliente:", error);
            alert("Error al guardar el cliente.");
        }
    };

    // Confirmar eliminación
    const handleConfirmDelete = (client) => {
        setSelectedClient(client);
        setIsConfirmOpen(true); // Abrir modal de confirmación
    };

    // Eliminar cliente
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/clients/${selectedClient.id}`);
            setClients((prevClients) =>
                prevClients.filter((client) => client.id !== selectedClient.id)
            ); // Eliminar cliente de la lista
            setIsConfirmOpen(false); // Cerrar confirmación
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
            alert("Error al eliminar el cliente.");
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Clientes" />
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleOpenModal("crear")}
                    >
                        <i className="bi bi-plus"></i> Nuevo Cliente
                    </button>
                </div>

                {/* Tabla de Clientes */}
                {clients.length > 0 ? (
                    <ClientTable
                        clients={clients}
                        onEdit={(client) => handleOpenModal("editar", client)}
                        onDelete={(client) => handleConfirmDelete(client)}
                    />
                ) : (
                    <p className="text-center text-gray-500">No hay clientes disponibles</p>
                )}

                {/* Modal */}
                <Modal show={isModalOpen} onClose={handleCloseModal}>
                    {modalType === "crear" || modalType === "editar" ? (
                        <ClientForm
                            client={selectedClient}
                            onSubmit={handleSave}
                        />
                    ) : null}
                </Modal>

                {/* Confirmación de eliminación */}
                <Modal show={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
                    <div>
                        <p>
                            ¿Estás seguro de que deseas eliminar al cliente{" "}
                            <strong>{selectedClient?.name}</strong>?
                        </p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleDelete}
                            >
                                Eliminar
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}

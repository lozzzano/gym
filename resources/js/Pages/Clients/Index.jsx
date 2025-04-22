import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PaginatedClientTable from "@/Components/Clients/PaginatedClientTable";
import ClientTable from "@/Components/Clients/ClientTable";
import ClientForm from "@/Components/Clients/ClientForm";
import MembershipForm from "@/Components/Memberships/MembershipForm";
import FacialRegister from '@/Components/FacialRegister';
import { Head } from "@inertiajs/react";
import Modal from "@/Components/Common/Modal";
import axios from "axios";

export default function Index({ clients: initialClients }) {
    const [clients, setClients] = useState(initialClients || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState(null);
    const [selectedMembershipClient, setSelectedMembershipClient] = useState(null);
    const [isMembershipInfoModalOpen, setIsMembershipInfoModalOpen] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Abrir el modal
    const handleOpenModal = (type, client = null) => {
        console.log("Abriendo modal con tipo:", type);
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

    // Abrir modal de membresía
    const handleOpenMembershipModal = (client) => {
        setSelectedClient(client);
        setIsMembershipModalOpen(true);
    };

    // Cerrar modal de membresía
    const handleCloseMembershipModal = () => {
        setSelectedClient(null);
        setIsMembershipModalOpen(false);
    };

    const handleCreateMembership = (client) => {
        if (client.membership) {
            alert("Este cliente ya tiene una membresía.");
            return;
        }
    
        setSelectedClient(client);
        setSelectedMembership({
            client_id: client.id,
            type: "mensual",
            price: 0,
            status: "active"
        });
        setIsMembershipModalOpen(true);
    };
    
    
    const handleSaveMembership = async (data) => {
        try {
            let response;
            if (!selectedClient.membership) {
                // Crear nueva
                response = await axios.post("/api/memberships", data);
            } else {
                // Editar membresía existente
                response = await axios.put(`/api/memberships/${selectedClient.membership.id}`, data);
            }
    
            handleCloseMembershipModal();
        } catch (error) {
            console.error("Error al guardar la membresía:", error);
            alert("Error al guardar la membresía.");
        }
    };     
    
    const handleViewMembership = (client) => {
        setSelectedMembershipClient(client);
        setIsMembershipInfoModalOpen(true);
    };
    
    const handleCloseMembershipInfoModal = () => {
        setSelectedMembershipClient(null);
        setIsMembershipInfoModalOpen(false);
    };    

    // Guardar cliente (crear o editar)
    const handleSave = async (data) => {
        try {
            let response;
            if (modalType === "crear") {
                response = await axios.post("/api/clients", data);
                console.log("Nuevo cliente creado:", response.data);
    
                // Extraer correctamente los datos del cliente
                const newClient = response.data.data || response.data;
                setClients((prevClients) => [...prevClients, newClient]);
    
            } else if (modalType === "editar") {
                response = await axios.put(`/api/clients/${selectedClient.id}`, data);
                console.log("Cliente actualizado desde el servidor:", response.data);
    
                const updatedClient = response.data.data || response.data;
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

    const getMembershipStatus = () => {
        if (!selectedMembershipClient?.membership) {
          return <span className="text-red-600">Sin membresía</span>;
        }
      
        switch (selectedMembershipClient.membership.status) {
          case 'expired':
            return <span className="text-yellow-600">Expirada</span>;
          case 'suspended':
            return <span className="text-red-500">Suspendida</span>;
          case 'active':
          default:
            return <span className="text-green-600">Activa</span>;
        }
      };      

    return (
        <AuthenticatedLayout>
            <Head title="Clientes" />
            <div className="container p-4 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
                    <button
                        className="bg-blue-500 rounded text-white px-4 py-2"
                        onClick={() => handleOpenModal("crear", null)}
                    >
                        <i className="bi bi-plus"></i> Nuevo Cliente
                    </button>
                    {/* Botón para abrir el modal */}
                    <button
                        onClick={() => setShowRegisterModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Registrar nuevo cliente con rostro
                    </button>

                    {/* Modal de registro facial */}
                    <Modal show={showRegisterModal} onClose={() => setShowRegisterModal(false)} maxWidth="2xl">
                        <FacialRegister onSuccess={() => setShowRegisterModal(false)} setClients={setClients} />
                    </Modal>
                </div>

                {/* Tabla de Clientes */}
                {true ? (
                <PaginatedClientTable
                    onEdit={(client) => handleOpenModal("editar", client)}
                    onDelete={(client) => handleConfirmDelete(client)}
                    onCreateMembership={handleCreateMembership}
                    onViewMembership={handleViewMembership}
                    clients={clients}
                />
                ) : (
                    <p className="text-center text-gray-500">No hay clientes disponibles</p>
                )}

                {/* Modal */}
                <Modal show={isModalOpen} onClose={handleCloseModal}>
                    {modalType === "crear" || modalType === "editar" ? (
                        <ClientForm
                            key={modalType} // Esto fuerza el re-render cuando cambia modalType
                            client={selectedClient}
                            modalType={modalType}
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
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                className="bg-red-500 rounded text-white px-4 py-2"
                                onClick={handleDelete}
                            >
                                Eliminar
                            </button>
                            <button
                                className="bg-gray-300 rounded px-4 py-2"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </Modal>

               {/* Modal de Crear/Editar Membresía */}
               <Modal show={isMembershipModalOpen} onClose={handleCloseMembershipModal}>
                    <MembershipForm
                        client={selectedClient} // Pasa el cliente seleccionado directamente
                        membership={selectedMembership || { client_id: selectedClient?.id || "", type: "mensual", price: 0, status: "active" }} // Evita valores nulos
                        modalType={modalType}
                        onSubmit={handleSaveMembership}
                        onClose={handleCloseMembershipModal}
                    />
                </Modal>

                {/* modal de reporte de membresia */}
                <Modal show={isMembershipInfoModalOpen} onClose={handleCloseMembershipInfoModal}>
                    {selectedMembershipClient && (
                        <div className="p-4 space-y-2">
                            <h2 className="text-lg font-bold">Detalle de Membresía</h2>
                            <p><strong>Cliente:</strong> {selectedMembershipClient.name}</p>
                            <p><strong>Inicio:</strong> {selectedMembershipClient.membership.formatted_start_date}</p>
                            <p><strong>Precio:</strong> ${selectedMembershipClient.membership.price}</p>
                            <p><strong>Estado:</strong> {getMembershipStatus()}</p>
                            <p><strong>Debe pagar:</strong> ${selectedMembershipClient.membership.must_pay}</p>
                            <button
                                onClick={handleCloseMembershipInfoModal}
                                className="bg-blue-500 rounded text-white mt-3 px-4 py-2"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </Modal>
                
            </div>
        </AuthenticatedLayout>
    );
}

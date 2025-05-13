import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MembershipTable from "@/Components/Memberships/MembershipTable";
import MembershipForm from "@/Components/Memberships/MembershipForm";
import MembershipTypeTable from "@/Components/MembershipType/MembershipTypeTable";
import MembershipTypeForm from "@/Components/MembershipType/MembershipTypeForm";
import { Head } from "@inertiajs/react";
import Modal from "@/Components/Common/Modal";
import axios from "axios";

export default function Index({ memberships: initialMemberships }) {
    const [memberships, setMemberships] = useState(initialMemberships || []);
    const [membershipTypes, setMembershipTypes] = useState([]); // Estado para tipos de membresía
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedMembership, setSelectedMembership] = useState(null);
    const [selectedMembershipType, setSelectedMembershipType] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    console.log(memberships);

    // Cargar tipos de membresía al montar el componente
    useEffect(() => {
        axios.get("/api/memberships/get")
          .then(response => {
            console.log("Respuesta completa de la API:", response.data);
            if (response.data && Array.isArray(response.data.data)) {
              setMemberships(response.data.data); // Extraer solo el array dentro de "data"
            } else {
              console.error("La API no devolvió un array válido.");
              setMemberships([]); // Evitar undefined
            }
          })
          .catch(error => {
            console.error("Error al cargar membresías:", error);
            setMemberships([]);
          });

          axios.get("/api/membership-types")
          .then(response => setMembershipTypes(response.data))
          .catch(error => console.error("Error al cargar tipos de membresía:", error));
      }, []);
      
    const reloadMemberships = () => {
      axios.get("/api/memberships/get")
        .then(response => {
          console.log("Recargando membresías:", response.data);
          if (response.data && Array.isArray(response.data.data)) {
            setMemberships(response.data.data); // Asegurar que siempre es un array
          } else {
            console.error("Error: La API no devolvió un array válido.");
            setMemberships([]);
          }
        })
        .catch(error => console.error("Error al recargar membresías:", error));
    };
      

    // Abrir modal para membresías
    const handleOpenMembershipModal = (type, membership = null) => {
        setModalType(type);
        setSelectedMembership(membership);
        setIsModalOpen(true);
    };

    // Abrir modal para tipos de membresía
    const handleOpenMembershipTypeModal = (type, membershipType = {}) => {
        setModalType(type);
        setSelectedMembershipType(membershipType);
        setIsModalOpen(true);
    };    

    // Cerrar modal
    const handleCloseModal = () => {
        setModalType("");
        setSelectedMembership(null);
        setSelectedMembershipType(null);
        setIsModalOpen(false);
    };

    // Guardar membresía
    const handleSaveMembership = async (data) => {
        try {
          let response;
          if (modalType === "crear") {
            response = await axios.post("/api/memberships", data);
          } else if (modalType === "editar") {
            response = await axios.put(`/api/memberships/${selectedMembership.id}`, data);
          }
          
          handleCloseModal();
          reloadMemberships(); // Recargar la lista después de la operación
        } catch (error) {
          console.error("Error al guardar la membresía:", error);
          alert("Error al guardar la membresía.");
        }
      };         

    // Guardar tipo de membresía
    const handleSaveMembershipType = async (data) => {
        try {
            let response;
            if (modalType === "crear") {
                response = await axios.post("/api/membership-types", data);
                const newType = response.data.data || response.data; // Asegúrate de acceder correctamente a los datos
                setMembershipTypes((prev) => [...prev, newType]);
            } else if (modalType === "editar") {
                response = await axios.put(`/api/membership-types/${selectedMembershipType.id}`, data);
                const updatedType = response.data.data || response.data;
                setMembershipTypes((prev) =>
                    prev.map((t) => (t.id === updatedType.id ? updatedType : t))
                );
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar el tipo de membresía:", error);
            alert("Error al guardar el tipo de membresía.");
        }
    };    

    // Confirmar eliminación de un tipo de membresía
    const handleConfirmDeleteMembershipType = (membershipType) => {
        setSelectedMembershipType(membershipType);
        setIsConfirmOpen(true);
    };

    // Eliminar tipo de membresía
    const handleDeleteMembershipType = async () => {
        try {
            await axios.delete(`/api/membership-types/${selectedMembershipType.id}`);
            setMembershipTypes((prev) => prev.filter((t) => t.id !== selectedMembershipType.id));
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("Error al eliminar el tipo de membresía:", error);
            alert("Error al eliminar el tipo de membresía.");
        }
    };

    // Confirmar eliminación de membresía
    const handleConfirmDelete = (membership) => {
        setSelectedMembership(membership);
        setIsConfirmOpen(true);
    };

    // Eliminar membresía
    const handleDelete = async () => {
        try {
          await axios.delete(`/api/memberships/${selectedMembership.id}`);
          setIsConfirmOpen(false);
          reloadMemberships(); // Recargar desde la API después de eliminar
        } catch (error) {
          console.error("Error al eliminar la membresía:", error);
          alert("Error al eliminar la membresía.");
        }
      };      

    return (
        <AuthenticatedLayout>
            <Head title="Membresías" />
            <div className="container p-4 mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Gestión de Membresías</h1>
                </div>

                {/* Tabla de Membresías */}
                <h2 className="text-xl font-semibold mb-2 mt-6">Membresías Asignadas</h2>
                {memberships.length > 0 ? (
                    <MembershipTable
                        memberships={memberships}
                        onEdit={(m) => handleOpenMembershipModal("editar", m)}
                        onDelete={(m) => handleConfirmDelete(m)}
                    />
                ) : (
                    <p className="text-center text-gray-500">No hay membresías asignadas.</p>
                )}

                {/* Tabla de Tipos de Membresías */}
                <div className="flex justify-between items-center mb-3 mt-6">
                    <h2 className="text-xl font-semibold">Tipos de Membresías</h2>
                    <button
                        className="bg-green-500 rounded text-white px-4 py-2"
                        onClick={() => handleOpenMembershipTypeModal("crear")}
                    >
                        + Nuevo Tipo de Membresía
                    </button>
                </div>
                {membershipTypes.length > 0 ? (
                    <MembershipTypeTable
                        membershipTypes={membershipTypes}
                        onEdit={(t) => handleOpenMembershipTypeModal("editar", t)}
                        onDelete={handleConfirmDeleteMembershipType}
                    />
                ) : (
                    <p className="text-center text-gray-500">No hay tipos de membresías registrados.</p>
                )}

                {/* Modal de Crear/Editar Membresías */}
                <Modal show={isModalOpen} onClose={handleCloseModal}>
                    {modalType === "crear" || modalType === "editar" ? (
                        selectedMembership ? (
                            <MembershipForm membership={selectedMembership} modalType={modalType} onSubmit={handleSaveMembership} onClose={handleCloseModal} />
                        ) : selectedMembershipType ? (
                            <MembershipTypeForm membershipType={selectedMembershipType} modalType={modalType} onSubmit={handleSaveMembershipType} onClose={handleCloseModal} />
                        ) : null
                    ) : null}
                </Modal>

                {/* Confirmación de Eliminación */}
                {/* Confirmación de Eliminación */}
                <Modal show={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
                    <div>
                        {selectedMembership ? (
                            <p>¿Estás seguro de que deseas eliminar la membresía de <strong>{selectedMembership?.client?.name}</strong>?</p>
                        ) : selectedMembershipType ? (
                            <p>¿Estás seguro de que deseas eliminar el tipo de membresía <strong>{selectedMembershipType?.name}</strong>?</p>
                        ) : null}
                        
                        <div className="flex justify-end mt-4 space-x-2">
                            {selectedMembership && (
                                <button className="bg-red-500 rounded text-white px-4 py-2" onClick={handleDelete}>
                                    Eliminar
                                </button>
                            )}
                            {selectedMembershipType && (
                                <button className="bg-red-500 rounded text-white px-4 py-2" onClick={handleDeleteMembershipType}>
                                    Eliminar
                                </button>
                            )}
                            <button className="bg-gray-300 rounded px-4 py-2" onClick={() => setIsConfirmOpen(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </Modal>

            </div>
        </AuthenticatedLayout>
    );
}

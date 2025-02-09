import React from "react";
import InputLabel from "@/Components/Common/InputLabel";
import TextInput from "@/Components/Common/TextInput";
import PrimaryButton from "@/Components/Common/PrimaryButton";

export default function ClientForm({ client, modalType, onSubmit }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries()); // Convierte formData a objeto
        onSubmit(data); // Envía los datos al método padre
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow">

            {/* Título del formulario */}
            <h4 className="text-primary mb-3">{modalType === "crear" ? "Crear Cliente" : "Actualizar Cliente"}</h4>
            <hr />

            {/* Campos del formulario */}
            <div className="mb-3">
                <InputLabel htmlFor="name" value="Nombre" />
                <TextInput
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Escribe el nombre completo"
                    defaultValue={client?.name || ""}
                    required
                />
            </div>

            <div className="mb-3">
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Correo electrónico"
                    defaultValue={client?.email || ""}
                    required
                />
            </div>

            <div className="mb-3">
                <InputLabel htmlFor="phone" value="Teléfono" />
                <TextInput
                    id="phone"
                    name="phone"
                    type="text"
                    className="form-control"
                    placeholder="Número de teléfono"
                    defaultValue={client?.phone || ""}
                    required
                />
            </div>

            <div className="mb-3">
                <InputLabel htmlFor="address" value="Dirección" />
                <textarea
                    id="address"
                    name="address"
                    className="form-control"
                    placeholder="Dirección completa"
                    defaultValue={client?.address || ""}
                    rows="3"
                ></textarea>
            </div>

            <div className="mb-3">
                <InputLabel htmlFor="birthdate" value="Fecha de Nacimiento" />
                <TextInput
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    className="form-control"
                    defaultValue={client?.birthdate || ""}
                />
            </div>

            {/* Botón */}
            <div className="d-flex justify-content-end mt-4">
                <PrimaryButton type="submit" className="px-4">
                    {modalType === "crear" ? (
                        <>
                            <i className="bi bi-plus-circle me-2"></i>Crear
                        </>
                    ) : (
                        <>
                            <i className="bi bi-pencil me-2"></i>Actualizar
                        </>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
}

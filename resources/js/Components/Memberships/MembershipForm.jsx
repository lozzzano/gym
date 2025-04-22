import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MembershipForm({ membership = {}, modalType, onSubmit, onClose }) {
    const [membershipTypes, setMembershipTypes] = useState([]);

    useEffect(() => {
        axios.get("/api/membership-types")
            .then(response => setMembershipTypes(response.data))
            .catch(error => console.error("Error cargando tipos de membresía:", error));
    }, []);

    const [form, setForm] = useState({
        membership_type_id: membership?.membership_type_id || "",
        client_id: membership?.client_id || "",
        start_date: membership?.start_date || new Date().toISOString().split("T")[0],
        price: membership?.price || 0,
        status: membership?.status || "active",
    });

    // Actualizar el precio cuando se seleccione un tipo de membresía
    const handleChange = (e) => {
        const { name, value } = e.target;

        let newPrice = form.price;
        if (name === "membership_type_id") {
            const selectedType = membershipTypes.find(type => type.id == value);
            newPrice = selectedType ? selectedType.price : 0;
        }

        setForm({ ...form, [name]: value, price: newPrice });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.client_id) {
            alert("Error: No se ha seleccionado un cliente.");
            return;
        }
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {modalType === "crear" ? "Nueva Membresía" : "Editar Membresía"}
            </h2>

            {/* Tipo de Membresía */}
            <label className="block mb-2">Tipo de Membresía</label>
            <select
                name="membership_type_id"
                value={form.membership_type_id}
                onChange={handleChange}
                className="border p-2 w-full"
                required
            >
                <option value="">Selecciona un tipo</option>
                {membershipTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                        {type.name} - {type.duration} meses
                    </option>
                ))}
            </select>

            {/* Fecha de inicio */}
            <label className="block mb-2">Fecha de Inicio</label>
            <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="border p-2 w-full"
                required
            />

            {/* Precio (Automático) */}
            <label className="block mb-2">Precio</label>
            <input
                type="number"
                name="price"
                value={form.price}
                readOnly // El usuario no puede editarlo manualmente
                className="border p-2 w-full bg-gray-200"
            />

            {/* Estado */}
            <label className="block mb-2">Estado</label>
            <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border p-2 w-full"
            >
                <option value="active">Activa</option>
                <option value="expired">Expirada</option>
                <option value="suspended">Suspendida</option>
            </select>

            {/* Botones */}
            <div className="flex justify-end space-x-2 mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {modalType === "crear" ? "Crear" : "Actualizar"}
                </button>
                <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}

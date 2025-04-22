import React, { useState } from "react";

export default function MembershipTypeForm({ membershipType = {}, modalType, onSubmit, onClose }) {
    const [form, setForm] = useState({
        name: membershipType?.name || "",
        duration: membershipType?.duration || 1,
        price: membershipType?.price || 0,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {modalType === "crear" ? "Nuevo Tipo de Membresía" : "Editar Tipo de Membresía"}
            </h2>

            <label className="block mb-2">Nombre</label>
            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 w-full"
                required
            />

            <label className="block mb-2">Duración (Meses)</label>
            <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="border p-2 w-full"
                required
            />

            <label className="block mb-2">Precio</label>
            <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="border p-2 w-full"
                required
            />

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

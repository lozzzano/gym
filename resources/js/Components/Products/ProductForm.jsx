import React, { useState, useEffect } from "react";

export default function ProductForm({ product = {}, onSubmit, modalType }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    // Efecto para actualizar los datos cuando `product` cambia
    useEffect(() => {
        if (modalType === "editar" && product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                stock: product.stock || "",
            });
        } else {
            // Si es "crear", limpiar el formulario
            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
            });
        }
    }, [modalType, product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Descripción</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    rows="3"
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium">Precio</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    step="0.01"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Stock</label>
                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                    required
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {modalType === "crear" ? "Crear" : "Actualizar"}
                </button>
            </div>
        </form>
    );
}

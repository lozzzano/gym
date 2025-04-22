import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductSaleForm({ membership, onClose }) {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        product_id: "",
        quantity: 1,
    });

    useEffect(() => {
        axios.get("/api/products/get")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error al obtener productos", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("/api/product-sales/store", {
            ...form,
            membership_id: membership.id,
        }).then(res => {
            alert("Producto cargado a la membresía");
            onClose();
        }).catch(err => {
            console.error("Error al guardar producto", err);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <select name="product_id" value={form.product_id} onChange={handleChange} required className="border w-full p-2">
                <option value="">Selecciona un producto</option>
                {products.map(product => (
                    <option key={product.id} value={product.id}>
                        {product.name} - ${product.price}
                    </option>
                ))}
            </select>

            <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="1"
                className="border w-full p-2"
                placeholder="Cantidad"
                required
            />

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Cargar Producto
            </button>
        </form>
    );
}

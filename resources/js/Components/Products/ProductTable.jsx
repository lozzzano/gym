import React from "react";

export default function ProductTable({ products, onEdit, onDelete }) {
    return (
        <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-200 px-4 py-2">ID</th>
                    <th className="border border-gray-200 px-4 py-2">Nombre</th>
                    <th className="border border-gray-200 px-4 py-2">Precio</th>
                    <th className="border border-gray-200 px-4 py-2">Stock</th>
                    <th className="border border-gray-200 px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td className="border border-gray-200 px-4 py-2">{product.id}</td>
                        <td className="border border-gray-200 px-4 py-2">{product.name}</td>
                        <td className="border border-gray-200 px-4 py-2">${product.price}</td>
                        <td className="border border-gray-200 px-4 py-2">{product.stock}</td>
                        <td className="border border-gray-200 px-4 py-2">
                            <div className="flex justify-center space-x-2">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                    onClick={() => onEdit(product)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => onDelete(product)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

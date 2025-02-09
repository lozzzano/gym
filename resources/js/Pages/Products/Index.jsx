import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProductTable from "@/Components/Products/ProductTable";
import ProductForm from "@/Components/Products/ProductForm";
import Modal from "@/Components/Common/Modal";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function Index({ products: initialProducts }) {
    const [products, setProducts] = useState(initialProducts || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // Abrir el modal
    const handleOpenModal = (type, product = null) => {
        setModalType(type);
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setModalType("");
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    // Guardar producto (crear o editar)
    const handleSave = async (data) => {
        try {
            let response;
            if (modalType === "crear") {
                response = await axios.post("/api/products", data);
                const newProduct = response.data.data || response.data; // Ajustar según la estructura del backend
                setProducts((prevProducts) => [...prevProducts, newProduct]);
            } else if (modalType === "editar") {
                response = await axios.put(`/api/products/${selectedProduct.id}`, data);
                const updatedProduct = response.data.data || response.data; // Ajustar según la estructura del backend
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === updatedProduct.id ? updatedProduct : product
                    )
                );
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            alert("Error al guardar el producto.");
        }
    };
    

    // Confirmar eliminación
    const handleConfirmDelete = (product) => {
        setSelectedProduct(product);
        setIsConfirmOpen(true);
    };

    // Eliminar producto
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/products/${selectedProduct.id}`);
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product.id !== selectedProduct.id)
            );
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("Error al eliminar el producto.");
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Productos" />
            
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Gestión de Productos</h1>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleOpenModal("crear")}
                    >
                        + Nuevo Producto
                    </button>
                </div>

                {/* Tabla de Productos */}
                <ProductTable
                    products={products}
                    onEdit={(product) => handleOpenModal("editar", product)}
                    onDelete={(product) => handleConfirmDelete(product)}
                />

                {/* Modal de Crear/Editar */}
                <Modal show={isModalOpen} onClose={handleCloseModal}>
                    {modalType === "crear" || modalType === "editar" ? (
                        <ProductForm
                            product={selectedProduct}
                            modalType={modalType}
                            onSubmit={handleSave}
                        />
                    ) : null}
                </Modal>

                {/* Confirmación de Eliminación */}
                <Modal show={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
                    <div>
                        <p>
                            ¿Estás seguro de que deseas eliminar el producto <strong>{selectedProduct?.name}</strong>?
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

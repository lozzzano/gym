import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProductTable from "@/Components/Products/ProductTable";
import ProductForm from "@/Components/Products/ProductForm";
import Modal from "@/Components/Common/Modal";
import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import axios from "axios";

export default function Index({ products: initialProducts }) {
    const [pagination, setPagination] = useState({
        data: [],
        current_page: 1,
        last_page: 1,
        links: [],
      });
      
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        fetchProducts(); // carga la primera página
      }, []);      

      const fetchProducts = async (page = 1) => {
        try {
          const response = await axios.get(`/api/products/get?page=${page}`);
          setPagination(response.data);
        } catch (error) {
          console.error("Error al cargar productos:", error);
        }
      };
      
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
          } else if (modalType === "editar") {
            response = await axios.put(`/api/products/${selectedProduct.id}`, data);
          }
      
          handleCloseModal();
          fetchProducts(pagination.current_page); // Recargar la página actual
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
          setIsConfirmOpen(false);
          fetchProducts(pagination.current_page); // Recargar la página actual
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
          alert("Error al eliminar el producto.");
        }
      };      

      return (
        <AuthenticatedLayout>
          <Head title="Productos" />
      
          <div className="container p-4 mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Gestión de Productos</h1>
              <button
                className="bg-blue-500 rounded text-white px-4 py-2"
                onClick={() => handleOpenModal("crear")}
              >
                + Nuevo Producto
              </button>
            </div>
      
            {/* Tabla de Productos */}
            {pagination.data.length > 0 ? (
              <>
                <ProductTable
                  products={pagination.data}
                  onEdit={(product) => handleOpenModal("editar", product)}
                  onDelete={(product) => handleConfirmDelete(product)}
                />
      
                {/* Paginación estilo Laravel */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {pagination.links.map((link, index) => (
                    <button
                      key={index}
                      disabled={!link.url}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      className={`px-3 py-1 rounded border text-sm transition-all
                        ${link.active ? "bg-blue-500 text-white" : "bg-white text-gray-700"}
                        ${!link.url ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
                      `}
                      onClick={() => {
                        if (link.url) {
                          const url = new URL(link.url);
                          const page = url.searchParams.get("page");
                          fetchProducts(page);
                        }
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">No hay productos disponibles</p>
            )}
      
            {/* Modal de Crear/Editar */}
            <Modal show={isModalOpen} onClose={handleCloseModal}>
              {(modalType === "crear" || modalType === "editar") && (
                <ProductForm
                  product={selectedProduct}
                  modalType={modalType}
                  onSubmit={handleSave}
                />
              )}
            </Modal>
      
            {/* Confirmación de Eliminación */}
            <Modal show={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
              <div>
                <p>
                  ¿Estás seguro de que deseas eliminar el producto{" "}
                  <strong>{selectedProduct?.name}</strong>?
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
          </div>
        </AuthenticatedLayout>
      );
      
}

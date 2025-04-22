import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function QrList({ products }) {
    const handleDownload = (product) => {
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = product.qr_code_image;

        img.onload = () => {
            canvas.width = 400;
            canvas.height = 500;
            const ctx = canvas.getContext("2d");

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, 50, 20, 300, 300);

            ctx.fillStyle = "#000";
            ctx.font = "16px Arial";
            ctx.fillText(`Producto: ${product.name}`, 20, 350);
            ctx.fillText(`Descripción: ${product.description}`, 20, 380);
            ctx.fillText(`Precio: $${product.price}`, 20, 410);

            const link = document.createElement("a");
            link.download = `${product.name.replace(/ /g, "_")}_qr.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
    };

    return (
        <AuthenticatedLayout>
            <Head title="Códigos QR de Productos" />

            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Productos con Código QR</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.data.map((product) => (
                        <div key={product.id} className="border rounded p-4 text-center shadow">
                            <h2 className="font-semibold text-lg">{product.name}</h2>
                            <p className="text-gray-600 text-sm">{product.description}</p>
                            <p className="text-blue-600 font-bold mt-1">${product.price}</p>
                            <img
                                src={product.qr_code_image}
                                alt={`QR de ${product.name}`}
                                className="mx-auto my-2"
                                style={{ width: 200, height: 200 }}
                            />
                            <p className="text-xs text-gray-500">{product.qr_code}</p>
                            <button
                                onClick={() => handleDownload(product)}
                                className="mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                                Descargar QR
                            </button>
                        </div>
                    ))}
                </div>

                {/* Paginación */}
                <div className="flex justify-center gap-2 mt-6">
                    {products.prev_page_url && (
                        <Link
                            href={products.prev_page_url}
                            className="border rounded px-3 py-1 hover:bg-gray-100"
                        >
                            « Anterior
                        </Link>
                    )}
                    <span className="bg-blue-500 text-white px-4 py-1 rounded">
                        Página {products.current_page}
                    </span>
                    {products.next_page_url && (
                        <Link
                            href={products.next_page_url}
                            className="border rounded px-3 py-1 hover:bg-gray-100"
                        >
                            Siguiente »
                        </Link>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

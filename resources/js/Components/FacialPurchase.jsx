import React, { useState } from "react";
import QrScanner from "@/Components/QrScanner";
import axios from "axios";
import Swal from "sweetalert2";

export default function FacialPurchase() {
    const [carrito, setCarrito] = useState([]);
    const [scannedCode, setScannedCode] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleScan = async (qrCode) => {
        if (qrCode === scannedCode) return;
        setScannedCode(qrCode);

        try {
            const res = await axios.get(`/api/products/scan/${qrCode}`);
            const producto = res.data;

            setCarrito((prev) => {
                const existe = prev.find((p) => p.id === producto.id);
                if (existe) {
                    return prev.map((p) =>
                        p.id === producto.id ? { ...p, quantity: p.quantity + 1 } : p
                    );
                }
                return [...prev, { ...producto, quantity: 1 }];
            });
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Producto agregado: ${producto.name}`,
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            });
        } catch (err) {
            Swal.fire("Producto no encontrado", "Escanea un producto válido.", "warning");
        }

        setTimeout(() => setScannedCode(null), 2000);
    };

    const aumentarCantidad = (id) => {
        setCarrito(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };
    
    const disminuirCantidad = (id) => {
        setCarrito(prev => prev.map(item =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ));
    };
    
    const eliminarProducto = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };    

    const finalizarCompra = async () => {
        if (carrito.length === 0) {
            Swal.fire("Carrito vacío", "Escanea productos antes de continuar.", "info");
            return;
        }
    
        const confirmar = await Swal.fire({
            title: "¿Finalizar compra?",
            text: "Se activará el reconocimiento facial para identificar al cliente.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Iniciar"
        });
    
        if (!confirmar.isConfirmed) return;
    
        try {
            setLoading(true);
    
            // Captura de imagen del rostro
            const video = document.createElement("video");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            await video.play();
    
            const canvas = document.createElement("canvas");
            canvas.width = 300;
            canvas.height = 300;
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, 300, 300);
    
            const imageBlob = await new Promise((resolve) => {
                canvas.toBlob(resolve, "image/jpeg");
            });
    
            stream.getTracks().forEach((track) => track.stop());
    
            // Prepara datos como FormData (es archivo, no base64)
            const formData = new FormData();
            formData.append("imagen", imageBlob, "captura.jpg");
    
            const recog = await axios.post("/facial-recognition", formData);
            const cliente = recog.data.cliente;
    
            if (!cliente || !cliente.membership || !recog.data.acceso) {
                throw new Error("No se detectó un cliente válido o sin membresía activa.");
            }
    
            // Mostrar confirmación con info del cliente
            const confirmarDatos = await Swal.fire({
                title: `Confirmar compra de ${cliente.name}`,
                html: `
                    <p><strong>Membresía:</strong> ${cliente.membership?.membership_type?.name}</p>
                    <p><strong>Productos:</strong></p>
                    <ul style="text-align:left">${carrito.map(p => `<li>${p.name} × ${p.quantity}</li>`).join("")}</ul>
                    <p class="mt-2"><strong>Total:</strong> $${total.toFixed(2)}</p>
                `,
                showCancelButton: true,
                confirmButtonText: "Confirmar venta"
            });
    
            if (!confirmarDatos.isConfirmed) return;
    
            // Registrar venta
            const venta = await axios.post("/api/facial-sale", {
                client_id: cliente.id,
                carrito: carrito.map(p => ({
                    id: p.id,
                    quantity: p.quantity,
                    qr_code: p.qr_code,
                }))
            });
    
            Swal.fire("¡Venta registrada!", `Total: $${venta.data.total}`, "success");
            setCarrito([]);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.message || "No se pudo procesar la compra.", "error");
        } finally {
            setLoading(false);
        }
    };    

    const total = carrito.reduce((acc, p) => acc + p.price * p.quantity, 0);

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Escanea productos y finaliza con rostro</h2>

            <QrScanner onScan={handleScan} />

            <div className="border p-4 rounded bg-white shadow">
                <h3 className="font-semibold mb-2">🛒 Carrito:</h3>
                {carrito.length > 0 ? (
                    <>
                        <ul className="list-disc ml-6">
                        {carrito.map((item) => (
                            <li key={item.id} className="flex justify-between items-center">
                                <span>{item.name} × {item.quantity} = ${item.price * item.quantity}</span>
                                <div className="flex space-x-2">
                                    <button onClick={() => disminuirCantidad(item.id)} className="px-2 my-1 bg-gray-200">-</button>
                                    <button onClick={() => aumentarCantidad(item.id)} className="px-2 my-1 bg-gray-200">+</button>
                                    <button onClick={() => eliminarProducto(item.id)} className="px-2 my-1 bg-red-500 text-white">🗑️</button>
                                </div>
                            </li>
                        ))}

                        </ul>
                        <p className="text-right font-bold mt-2">Total: ${total.toFixed(2)}</p>
                        <div className="text-right mt-4">
                            <button
                                onClick={finalizarCompra}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                            >
                                Finalizar compra con rostro
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">Aún no has escaneado ningún producto.</p>
                )}
            </div>
        </div>
    );
}

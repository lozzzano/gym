import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QrScanner({ onScan }) {
    const scannerRef = useRef(null);
    const html5QrCode = useRef(null);
    const cooldown = 3000;
    const pauseLock = useRef(false);

    const handleDetected = async (text) => {
        if (pauseLock.current) return;
        pauseLock.current = true;

        try {
            console.log("[SCAN] Detectado:", text);
            await onScan(text);

            if (html5QrCode.current) {
                await html5QrCode.current.pause();
                console.log("[SCAN] Pausado");
                setTimeout(async () => {
                    try {
                        await html5QrCode.current.resume();
                        console.log("[SCAN] Reanudado");
                        pauseLock.current = false;
                    } catch (e) {
                        console.warn("[SCAN] No se pudo reanudar:", e.message);
                    }
                }, cooldown);
            }
        } catch (err) {
            console.warn("[SCAN] Error durante escaneo:", err);
            pauseLock.current = false;
        }
    };

    useEffect(() => {
        const start = async () => {
            const id = scannerRef.current.id;
            html5QrCode.current = new Html5Qrcode(id);

            try {
                const cameras = await Html5Qrcode.getCameras();
                if (!cameras.length) throw new Error("No hay cámaras disponibles");

                await html5QrCode.current.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: 250 },
                    handleDetected
                );
                console.log("[SCAN] Escáner iniciado");
            } catch (e) {
                console.error("[SCAN] Error al iniciar:", e.message);
            }
        };

        start();

        return () => {
            html5QrCode.current?.stop()
                .then(() => html5QrCode.current.clear())
                .then(() => console.log("[SCAN] Escáner detenido"))
                .catch((err) => console.warn("[SCAN] Error al detener:", err.message));
        };
    }, []);

    return (
        <div
            ref={scannerRef}
            id="qr-scanner"
            className="w-full max-w-md mx-auto mb-6 rounded overflow-hidden shadow"
            style={{ height: "300px" }}
        />
    );
}

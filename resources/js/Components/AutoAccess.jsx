import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AutoAccess = () => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const cooldownRef = useRef(false);
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [loading, setLoading] = useState(false);

  const iniciarCamara = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCamaraActiva(true);

    // Activar escaneo automático
    intervalRef.current = setInterval(() => {
      if (!cooldownRef.current) {
        capturarFotoYEnviar();
      }
    }, 8000);
  };

  const apagarCamara = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    clearInterval(intervalRef.current);
    setCamaraActiva(false);
  };

  const capturarFotoYEnviar = async () => {
    if (loading) return;
    setLoading(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('imagen', blob, 'rostro.jpg');

      try {
        cooldownRef.current = true;
        setTimeout(() => {
            cooldownRef.current = false;
        }, 10000);
        const response = await axios.post('/facial-recognition-auto', formData);
        const data = response.data;

        const tipo = data.tipo === 'salida' ? '👋 Hasta luego' : '✅ Bienvenido';
        let texto = `Cliente: ${data.name}`;
        if (data.entrada) texto += `\nEntrada: ${data.entrada}`;
        if (data.salida) texto += `\nSalida: ${data.salida}`;
        if (data.tiempo) texto += `\nTiempo: ${data.tiempo}`;

        Swal.fire({
          icon: data.alerta ? 'warning' : 'success',
          title: tipo,
          text: data.alerta ? `${texto}\n⚠️ ${data.alerta}` : texto,
          timer: 5000,
          toast: false,
          position: 'center',
          showConfirmButton: false
        });

      } catch (error) {
        console.error('No reconocido o error:', error);
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6">
      <h2 className="text-3xl font-bold text-center">Reconocimiento Automático</h2>

      <video ref={videoRef} autoPlay className="rounded-md border w-full max-w-xl" />

      <button
        onClick={camaraActiva ? apagarCamara : iniciarCamara}
        className={`px-4 py-2 rounded text-white font-semibold ${
          camaraActiva ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {camaraActiva ? 'Detener cámara' : 'Iniciar cámara'}
      </button>

      {camaraActiva && (
        <p className="text-gray-500 text-sm">Escaneando cada 8 segundos... (pausa 10s después de detectar)</p>
      )}
    </div>
  );
};

export default AutoAccess;

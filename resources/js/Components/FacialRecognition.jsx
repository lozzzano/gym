import React, { useRef, useState } from 'react';

const FacialRecognition = () => {
  const videoRef = useRef(null);
  const [mensaje, setMensaje] = useState('');

  const iniciarCamara = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capturarFoto = async () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('imagen', blob, 'foto.jpg');

      const response = await fetch('/facial-recognition', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMensaje(data.mensaje);
    }, 'image/jpeg');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl space-y-4">
      <h2 className="text-2xl font-bold mb-4">Escaneo Facial</h2>

      <video ref={videoRef} autoPlay className="w-full rounded-md border" />

      <div className="flex space-x-4 mt-4">
        <button onClick={iniciarCamara} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Iniciar cámara
        </button>
        <button onClick={capturarFoto} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          Escanear rostro
        </button>
      </div>

      {mensaje && <p className="mt-4 text-center text-lg font-semibold">{mensaje}</p>}
    </div>
  );
};

export default FacialRecognition;

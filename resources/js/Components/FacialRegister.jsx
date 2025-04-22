import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const FacialRegister = ({ onSuccess, setClients }) => {
  const videoRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    address: '',
    status: 'active',
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const iniciarCamara = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const apagarCamara = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrarCliente = () => {
    setLoading(true);
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('imagen', blob, 'rostro.jpg');

      try {
        const response = await axios.post('/facial-register', formData);
        setMensaje(response.data.mensaje);

        const nuevoCliente = response.data.cliente;
        if (setClients && nuevoCliente) {
          setClients((prev) => [...prev, nuevoCliente]);
        }

        // Mostrar toast de éxito
        Swal.fire({
            icon: 'success',
            title: 'Cliente registrado',
            text: response.data.mensaje,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
        });

        // Apagar cámara y cerrar modal
        apagarCamara();

        // 👇 Llama al callback si existe para cerrar modal
        if (onSuccess) onSuccess();
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Ocurrió un error inesperado.";
        setMensaje(errorMsg);
      
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: errorMsg,
          confirmButtonColor: '#e3342f',
        });
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Registro Facial</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" placeholder="Nombre" onChange={handleChange} className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Correo" onChange={handleChange} className="border p-2 rounded" />
        <input type="tel" name="phone" placeholder="Teléfono" onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="birthdate" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="address" placeholder="Dirección" onChange={handleChange} className="border p-2 rounded md:col-span-2" />
        <select name="status" onChange={handleChange} className="border p-2 rounded md:col-span-2">
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      <video ref={videoRef} autoPlay className="w-full rounded-md border" />

      <div className="flex gap-4 mt-4">
        <button onClick={iniciarCamara} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Iniciar cámara
        </button>
        <button
          onClick={registrarCliente}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Registrando...' : 'Registrar cliente'}
        </button>
      </div>

      {mensaje && <p className="mt-4 text-center text-red-600 font-medium">{mensaje}</p>}
    </div>
  );
};

export default FacialRegister;

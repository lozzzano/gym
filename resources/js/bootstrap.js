import axios from 'axios';

// Configura el encabezado X-Requested-With
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Agrega el token CSRF desde la meta etiqueta
const token = document.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found. Ensure the meta tag exists in your HTML.');
}

// Configura las credenciales para solicitudes cross-origin
axios.defaults.withCredentials = true;

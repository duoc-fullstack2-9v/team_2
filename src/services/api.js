// src/services/api.js
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


// Cliente Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false
});


// Función genérica opcional (por si quieres usarla)
async function apiRequest(method, url, data = null) {
  try {
    const resp = await api({
      method,
      url,
      data,
    });
    return resp.data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error desconocido";


    throw new Error(mensaje);
  }
}


// ------------------------------------------------------
// ENDPOINTS
// ------------------------------------------------------


// Auth
export const authApi = {
  registro: (payload) => apiRequest("post", "/api/auth/registro", payload),
  login: (payload) => apiRequest("post", "/api/auth/login", payload),
};


// Turnos
export const turnosApi = {
  crear: (payload) => apiRequest("post", "/api/turnos", payload),


  listarPorUsuario: (usuarioId) =>
    apiRequest("get", `/api/turnos/usuario/${usuarioId}`),


  actualizar: (turnoId, payload, usuarioId) =>
    apiRequest("put", `/api/turnos/${turnoId}?usuarioId=${usuarioId}`, payload),


  eliminar: (turnoId, usuarioId) =>
    apiRequest("delete", `/api/turnos/${turnoId}?usuarioId=${usuarioId}`),
};

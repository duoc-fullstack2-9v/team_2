// src/services/session.js
const KEY = "tuturnoUser";


export function saveUserSession(payload) {
  // El backend manda { token, usuarioId, nombre, rol }
  const { token, nombre, rol } = payload;
  const id = payload.id ?? payload.usuarioId; // por si después lo cambias a "id"


  const data = { id, nombre, rol, token };
  localStorage.setItem(KEY, JSON.stringify(data));
}


export function getUserSession() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}


export function clearUserSession() {
  localStorage.removeItem(KEY);
}



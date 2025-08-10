export const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
export async function authHeaders(){ const token = localStorage.getItem('token'); return token? { Authorization: 'Bearer '+token } : {}; }

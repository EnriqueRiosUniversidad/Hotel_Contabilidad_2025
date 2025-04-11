import { jwtDecode } from 'jwt-decode'; // ✅ Esta es la forma correcta con Vite


const TOKEN_KEY = 'auth_token';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = '/login';
}

export function isTokenValid() {
  const token = getToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now(); // Exp está en segundos, Date.now() en ms
  } catch {
    return false;
  }
}

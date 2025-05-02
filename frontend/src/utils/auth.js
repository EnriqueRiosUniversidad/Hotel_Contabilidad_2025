import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';

// Guarda el token en localStorage
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Obtiene el token desde localStorage
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Elimina el token y redirige al login
export function logout() {
  localStorage.removeItem(TOKEN_KEY);

  window.location.href = '/login';
  localStorage.removeItem("periodoId");
  window.location.href = '/login';
  
}

// Verifica si el token existe y no ha expirado
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

  
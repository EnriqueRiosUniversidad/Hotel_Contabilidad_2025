// src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import AgregarCuenta from '../pages/AgregarCuenta';
import { isTokenValid } from '../utils/auth';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={isTokenValid() ? <Home /> : <Navigate to="/login" />} />
      <Route path="/cuentas" element={isTokenValid() ? <AgregarCuenta /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;

  // src/routes/AppRoutes.jsx

  import { Routes, Route, Navigate } from 'react-router-dom';
  import Login from '../pages/Login';
  import Home from '../pages/Home';
  import AgregarCuenta from '../pages/AgregarCuenta';
    
  import LibroDiario from '../pages/LibroDiario/LibroDiario';
  import AgregarLibro from '../pages/LibroDiario/AgregarLibro';
  import DetalleLibro from '../pages/LibroDiario/DetalleLibro';


  import { isTokenValid } from '../utils/auth';



  function AppRoutes() {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isTokenValid() ? <Home /> : <Navigate to="/login" />} />
        <Route path="/cuentas" element={isTokenValid() ? <AgregarCuenta /> : <Navigate to="/login" />} />
        <Route path="/libro-diario" element={<LibroDiario />} />
        <Route path="/agregar-libro" element={<AgregarLibro />} />
        <Route path="/detalle-libro/:asientoId" element={<DetalleLibro />} />

      </Routes>
    );
  }

  export default AppRoutes;

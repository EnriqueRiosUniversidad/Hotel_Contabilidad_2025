// src/components/Navbar.jsx

import { logout } from '../utils/auth';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="d-flex flex-column vh-100 p-3 text-white" style={{ width: '250px', backgroundColor: '#a8e6cf' }}>
      <h4 className="text-center text-dark mb-4">📚 Contabilidad</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="#" className="nav-link text-dark">📘 Libro Diario</Link>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link text-dark">📗 Libro Mayor</Link>
        </li>
        <li className="nav-item">
          <Link to="/cuentas" className="nav-link text-dark">➕ Agregar Plan de Cuenta</Link>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link text-dark">📝 Agregar Asiento</Link>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link text-dark">📊 Balance de Sumas y Saldos</Link>
        </li>
        <li className="nav-item">
          <Link to="#" className="nav-link text-dark">📈 Balance de Resultados</Link>
        </li>
      </ul>

      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100" onClick={logout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Navbar;
  
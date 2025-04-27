import { logout } from '../utils/auth';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <div className="d-flex flex-column vh-100 p-3 text-white" style={{ width: '250px', backgroundColor: '#a8e6cf' }}>
      <h4 className="text-center text-dark mb-4">📚 Contabilidad</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/libro-diario"
            className={({ isActive }) =>
              `nav-link text-dark ${isActive ? 'active fw-bold bg-light rounded border' : ''}`
            }
          >
            📘 Libro Diario
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/libro-mayor"
            className={({ isActive }) =>
              `nav-link text-dark ${isActive ? 'active fw-bold bg-light rounded border' : ''}`
            }
          >
            📗 Libro Mayor
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/cuentas"
            className={({ isActive }) =>
              `nav-link text-dark ${isActive ? 'active fw-bold bg-light rounded border' : ''}`
            }
          >
            ➕ Agregar Plan de Cuenta
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/agregar-libro"
            className={({ isActive }) =>
              `nav-link text-dark ${isActive ? 'active fw-bold bg-light rounded border' : ''}`
            }
          >
            📝 Agregar Asiento
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/balance-sumas"
            className={({ isActive }) =>
              `nav-link text-dark ${isActive ? 'active fw-bold bg-light rounded border' : ''}`
            }
          >
            📊 Balance de Sumas y Saldos
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/balance-resultados"
            className={({ isActive }) =>
              `nav-link text-dark ${isActive ? 'active fw-bold bg-light rounded border' : ''}`
            }
          >
            📈 Balance de Resultados
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100" onClick={logout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Navbar;

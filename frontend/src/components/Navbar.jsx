import { logout } from '../utils/auth';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <div
      className="d-flex flex-column position-fixed top-0 start-0 vh-100 p-2 text-white"
      style={{
        width: '270px',
        backgroundColor: '#73c768be',
        zIndex: 1050,
        overflowY: 'auto',
        borderRight: '1px solid #35e735c1',
      }}
    >
      <div className="text-center mb-3">
        <img src="/menu.png" alt="Logo" style={{ width: '90px', height: '90px' }} />
      </div>

      <h4 className="text-center text-dark mb-4">Contabilidad</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/libro-diario"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive
                ? 'bg-success text-white fw-bold rounded border border-success'
                : 'text-dark'}`
            }
          >
            📘 Libro Diario
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/libro-mayor"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive
                ? 'bg-success text-white fw-bold rounded border border-success'
                : 'text-dark'}`
            }
          >
            📗 Libro Mayor
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/cuentas"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive
                ? 'bg-success text-white fw-bold rounded border border-success'
                : 'text-dark'}`
            }
          >
            <img
              src="mas.png"
              alt="Agregar"
              style={{ width: '20px', height: '20px', marginRight: '10px' }}
            />
            Agregar Plan de Cuenta
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/agregar-libro"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive
                ? 'bg-success text-white fw-bold rounded border border-success'
                : 'text-dark'}`
            }
          >
            📝 Agregar Asiento
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/balance-sumas"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive
                ? 'bg-success text-white fw-bold rounded border border-success'
                : 'text-dark'}`
            }
          >
            📊 Balance de Sumas y Saldos
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/balance-resultados"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive
                ? 'bg-success text-white fw-bold rounded border border-success'
                : 'text-dark'}`
            }
          >
            📈 Balance de Resultados
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Navbar;

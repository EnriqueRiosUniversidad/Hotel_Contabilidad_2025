import { logout } from '../utils/auth';

function Navbar() {
  return (
    <div className="d-flex flex-column vh-100 p-3 text-white" style={{ width: '250px', backgroundColor: '#a8e6cf' }}>
      <h4 className="text-center text-dark mb-4">Contabilidad</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a href="#" className="nav-link text-dark">📘 Libro Diario</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-dark">📗 Libro Mayor</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-dark">➕ Agregar Plan de Cuenta</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-dark">📝 Agregar Asiento</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-dark">📊 Balance de Sumas y Saldos</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-dark">📈 Balance de Resultados</a>
        </li>
      </ul>

      <div className="mt-auto">
        <button className="btn btn-outline-danger w-100" onClick={logout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Navbar;

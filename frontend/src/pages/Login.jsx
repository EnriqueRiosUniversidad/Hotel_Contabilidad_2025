import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';
import config from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) throw new Error('Credenciales inválidas');
      const data = await res.json();
      saveToken(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      {/* Columna izquierda con imagen */}
      <div className="col-md-6 d-none d-md-block p-0">
        <img
          src="/inicio.jpg"
          alt="Fondo"
          className="img-fluid vh-100 w-100 object-fit-cover"
        />
      </div>

      {/* Columna derecha con el formulario */}
      <div className="col-md-6 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: '#73c768be' }}>
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded shadow border border-success"
          style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(5px)',
          }}
        >
          <div className="text-center mb-4">
            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{ width: '56px', height: '56px' }}>
              <i className="bi bi-bar-chart-fill fs-4"></i>
            </div>
            <h2 className="fw-bold mt-3">Bienvenido</h2>
            <p className="text-muted">Sistema Contable - Inicio de sesión</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger text-center py-2">
              {error}
            </div>
          )}

          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-success">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
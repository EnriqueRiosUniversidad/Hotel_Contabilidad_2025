import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';
import config from '../config';

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
    
      <div className="col-md-6 d-none d-md-block p-0">
        <img
          src="/inicio.jpg"
          alt="Fondo"
          className="img-fluid vh-100 w-100 object-fit-cover"
        />
      </div>


      <div className="col-md-6 d-flex align-items-center justify-content-center"
  style={{ backgroundColor: '#73c768be' }} >
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded shadow border border-success"
          style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            backdropFilter: 'blur(5px)' 
          }}
          
        >
          <div className="text-center mb-3">
          <div className="flex flex-col items-center space-y-4">
          <div className="bg-verde-bosque text-white rounded-full w-14 h-14 flex items-center justify-center shadow">
            <i className="bi bi-bar-chart-fill text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold texto-principal">Bienvenido</h2>
          <p className="text-sm text-gray-600">Sistema Contable - Inicio de sesión</p>
        </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Usuario:</label>
            <input
              type="text"
              className="form-control"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-1 text-center">
              {error}
            </div>
          )}

          <div className="d-grid">
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

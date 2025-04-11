// src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://hotel-contabilidad-35ebeef89ac8.herokuapp.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) throw new Error('Credenciales inválidas');

      const data = await res.json();
      saveToken(data.token);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container d-flex vh-100 justify-content-center align-items-center" style={{ backgroundColor: '#a8e6cf' }}>
      <form className="bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-success w-100" type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;

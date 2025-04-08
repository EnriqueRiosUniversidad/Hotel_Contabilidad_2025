// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  const payload = {
    identifier,
    password,
  };

  console.log("Enviando login con:", payload); // 👀 Verifica lo que se manda

  try {
    const res = await api.post('/auth/login', payload);
    console.log("Respuesta del servidor:", res.data); // 👀
    localStorage.setItem('token', res.data.token);
    navigate('/home');
  } catch (error) {
    console.error("Error al hacer login:", error.response?.data || error.message);
    alert('Usuario o contraseña incorrectos');
  }
};


  return (
    <div className="flex h-screen">
  {/* Imagen */}
  <div
    className="w-1/2 bg-cover bg-center"
    style={{ backgroundImage: 'url(/tu-imagen.jpg)' }}
  ></div>

  {/* Formulario */}
  <div className="w-1/2 flex flex-col items-center justify-center p-10" style={{ backgroundColor: '#ACF29F' }}>
    <img src="/logo.png" className="w-40 mb-4" />
    <h2 className="text-2xl font-bold mb-4 text-[#2E473D] text-center">Bienvenido</h2>

    <form onSubmit={handleLogin} className="w-full max-w-sm">
      <input
        type="text"
        placeholder="Usuario"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="input input-bordered w-full mb-4 bg-[#F4FFF0] text-[#2E473D] border-[#7DC57C]"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full mb-4 bg-[#F4FFF0] text-[#2E473D] border-[#7DC57C]"
      />
      <button
        type="submit"
        className="btn w-full"
        style={{ backgroundColor: '#7DC57C', color: '#fff', border: 'none' }}
      >
        Ingresar
      </button>
    </form>
  </div>
</div>

  );
};

export default Login;

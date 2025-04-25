import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { saveToken } from "../utils/auth";
import "../styles/variables.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [periodo, setPeriodo] = useState("2025");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Credenciales inválidas");
      }

      const data = await res.json();
      saveToken(data.token); // Guarda token en localStorage o donde necesites
      navigate("/inicio");   // Redirige al home
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-verde-claro">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md space-y-6 border border-green-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-verde-bosque text-white rounded-full w-14 h-14 flex items-center justify-center shadow">
            <i className="bi bi-bar-chart-fill text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold texto-principal">Bienvenido</h2>
          <p className="text-sm text-gray-600">Sistema Contable - Inicio de sesión</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block texto-principal mb-1">Usuario</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block texto-principal mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>

          <div>
            <label htmlFor="periodo" className="block texto-principal mb-1">Periodo Fiscal</label>
            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full px-4 py-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-verde-bootstrap text-white py-2 rounded hover:bg-green-700 transition"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { getToken } from '../utils/auth';

function Home() {
  const [periodoId, setPeriodoId] = useState(() => localStorage.getItem("periodoId") || "1");

  useEffect(() => {
    localStorage.setItem("periodoId", periodoId);

    const token = getToken();

    Promise.all([
      api.get(`/plancuentas/plan/${periodoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      api.get(`/librodiario/${periodoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([cuentasRes, asientosRes]) => {
        localStorage.setItem("cuentas_" + periodoId, JSON.stringify(cuentasRes.data));
        localStorage.setItem("asientos_" + periodoId, JSON.stringify(asientosRes.data));
        localStorage.setItem("actualizarAsientos", "false");
      })
      .catch((err) => {
        console.error("Error al precargar datos:", err);
      });
  }, [periodoId]);

  return (
    <div className="d-flex">
      <Navbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <h1>Bienvenido al Sistema Contable</h1>
        <p>Aquí puedes gestionar tus libros, balances y más.</p>

        <div className="mt-4">
          <label htmlFor="periodo" className="form-label">Seleccionar Período Contable</label>
          <select
            id="periodo"
            className="form-select"
            value={periodoId}
            onChange={(e) => setPeriodoId(e.target.value)}
          >
            <option value="1">2025 - Enero a Diciembre</option>
            <option value="2">2026 - Enero a Diciembre</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Home;

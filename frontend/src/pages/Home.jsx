import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { getToken } from '../utils/auth';

function Home() {
  const [periodoId, setPeriodoId] = useState(() => localStorage.getItem("periodoId") || "1");
  const [periodos, setPeriodos] = useState([]);

  const mesNombre = (mes) => {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[mes - 1] || "Mes inválido";
  };

  useEffect(() => {
    const token = getToken();

    api.get('/plancuentas/periodos', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const periodosData = res.data?.filter(p => p?.periodoId && p?.anio) || [];
        setPeriodos(periodosData);

        const existe = periodosData.some(p => p.periodoId?.toString() === periodoId);
        if (periodosData.length > 0 && !existe) {
          const nuevoId = periodosData[0].periodoId.toString();
          if (periodoId !== nuevoId) {
            setPeriodoId(nuevoId);
            localStorage.setItem("periodoId", nuevoId);
          }
        }
      })
      .catch(err => {
        console.error("Error al obtener períodos:", err);
      });
  }, []);

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
            {periodos.map((p) => (
              <option key={p.periodoId} value={p.periodoId}>
                {p.anio} - {mesNombre(p.mesInicio)} a {mesNombre(p.mesFin)}
              </option>
            ))}
          </select>
        </div>

        {/* Dashboard visual de ingresos vs egresos, flujo y compras */}
        <div className="d-flex gap-4 mt-5 flex-wrap">
          <DashboardIngresosEgresos />
          <DashboardFlujoCaja />
        </div>
      </div>
    </div>
  );
}

export default Home;

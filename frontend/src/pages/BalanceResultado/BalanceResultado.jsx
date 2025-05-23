import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

const BalanceResultado = () => {
  const [registros, setRegistros] = useState([]);
  const [periodoId, setPeriodoId] = useState(() => localStorage.getItem("periodoId") || "1");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    api.get(`/balance-resultado/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRegistros(res.data))
      .catch(err => {
        console.error("Error al cargar balance:", err);
        alert("No se pudo cargar el Balance de Resultados.");
      });
  }, [periodoId]);

  const getRowClass = (tipo) => {
    if (tipo === "seccion") return "table-success fw-bold";
    if (tipo === "total") return "table-info fw-bold";
    return "";
  };

  const getTextAlign = (tipo) => {
    if (tipo === "seccion") return "text-start";
    return "text-end";
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-4" style={{ marginLeft: "270px" }}>
        <h4 className="mb-3">📘 Estado de Resultados</h4>
        <div className="mb-3">
          <label className="form-label">Período</label>
          <select
            className="form-select w-auto"
            value={periodoId}
            onChange={(e) => {
              setPeriodoId(e.target.value);
              localStorage.setItem("periodoId", e.target.value);
            }}
          >
            <option value="1">2025</option>
            <option value="2">2024</option>
          </select>
        </div>

        <table className="table table-bordered text-end align-middle">
          <thead className="table-secondary text-center">
            <tr>
              <th>CUENTA</th>
              <th>MONTO</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((item, i) => (
              <tr key={i} className={getRowClass(item.tipo)}>
                <td className={getTextAlign(item.tipo)}>{item.cuenta}</td>
                <td>{item.monto != null ? item.monto.toLocaleString() : ""}</td>
              </tr>
            ))}
            {registros.length === 0 && (
              <tr>
                <td colSpan="2" className="text-muted text-center">No hay datos para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceResultado;

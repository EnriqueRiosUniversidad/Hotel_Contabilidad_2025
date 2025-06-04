import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

  const CuentaItem = ({ cuenta, nivel }) => {
  const [colapsado, setColapsado] = useState(false);
  const tieneHijos = cuenta.hijos && cuenta.hijos.length > 0;

  const format = (valor) => `Gs ${Number(valor || 0).toLocaleString("es-PY")}`;

  return (
    <div>
      <div
        className={`d-flex align-items-center py-1 border-start ps-3 ${
          nivel === 0 ? "fw-bold bg-success bg-opacity-10 rounded" : ""
        }`}
        style={{ marginLeft: `${nivel * 20}px` }}
      >
        {tieneHijos ? (
          <span
            onClick={() => setColapsado(!colapsado)}
            className="me-2 fw-bold text-success"
            style={{ cursor: "pointer", width: "20px" }}
          >
            {colapsado ? "▶" : "▼"}
          </span>
        ) : (
          <span style={{ width: "20px" }}></span>
        )}

        <div className="d-flex w-100 gap-2">
          <span className="w-20 text-monospace">{cuenta.codigo}</span>
          <span className="w-25">{cuenta.nombre}</span>
          <span className="w-15 text-end text-monospace">{format(cuenta.debe)}</span>
          <span className="w-15 text-end text-monospace">{format(cuenta.haber)}</span>
          <span className="w-15 text-end text-monospace">{format(cuenta.saldo)}</span>
        </div>
      </div>

      {!colapsado &&
        cuenta.hijos.map((hijo) => (
          <CuentaItem key={hijo.codigo} cuenta={hijo} nivel={nivel + 1} />
        ))}
    </div>
  );
};


const BalanceGeneral = () => {
  const [cuentas, setCuentas] = useState([]);
  const [periodoId, setPeriodoId] = useState(() => localStorage.getItem("periodoId") || "1");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    api
      .get(`/plancuentas/balance-general/tree/${periodoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCuentas(res.data))
      .catch((err) => {
        console.error("Error al cargar el balance general:", err);
        alert("No se pudo cargar el balance general.");
      });
  }, [periodoId]);

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container-fluid py-3" style={{ marginLeft: "270px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-success fw-bold">Balance General</h2>
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="periodo" className="fw-bold">Período:</label>
            <select
              id="periodo"
              className="form-select form-select-sm"
              value={periodoId}
              onChange={(e) => {
                setPeriodoId(e.target.value);
                localStorage.setItem("periodoId", e.target.value);
              }}
            >
              <option value="1">2025</option>
              <option value="2">2026</option>
              {/* Más períodos si hace falta */}
            </select>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-3 border border-success">
          <div className="d-flex fw-bold border-bottom pb-2 mb-2 text-success gap-2">
  <span className="w-20">Código</span>
  <span className="w-25">Nombre</span>
  <span className="w-15 text-end">Debe</span>
  <span className="w-15 text-end">Haber</span>
  <span className="w-15 text-end">Saldo</span>
</div>


          {cuentas.map((cuenta) => (
            <CuentaItem key={cuenta.codigo} cuenta={cuenta} nivel={0} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BalanceGeneral;
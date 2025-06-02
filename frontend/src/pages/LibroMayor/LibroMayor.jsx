import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const LibroMayor = () => {
  const [cuentas, setCuentas] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [periodoId] = useState(() => localStorage.getItem("periodoId") || "1");

  const [codigo, setCodigo] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const handleInputCodigo = (e) => {
    const valor = e.target.value;
    setCodigo(valor);
    const key = "cuentas_" + periodoId;
    const cache = JSON.parse(localStorage.getItem(key) || "[]");
    const sugeridas = cache.filter(c =>
      c.codigo.toLowerCase().startsWith(valor.toLowerCase()) && c.imputable
    );
    setSugerencias(sugeridas);
  };

  const seleccionarCuenta = (cuenta) => {
    setCodigo(cuenta.codigo);
    setCuentaSeleccionada(cuenta);
    setSugerencias([]);
  };

  const buscarUnaCuenta = () => {
    const token = localStorage.getItem("auth_token");
    if (!codigo || !desde || !hasta) {
      alert("Completá código y fechas.");
      return;
    }

    setMostrarTodas(false);
    api.get(`/libro-mayor/cuenta`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { periodoId, codigo, desde, hasta }
    })
      .then(res => setFiltrados(res.data))
      .catch(err => {
        console.error("Error:", err);
        alert("No se pudo filtrar la cuenta.");
      });
  };

  const buscarTodasLasCuentas = () => {
    const token = localStorage.getItem("auth_token");
    if (!desde || !hasta) {
      alert("Completá las fechas.");
      return;
    }

    setMostrarTodas(true);
    api.get(`/libro-mayor/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { desde, hasta } // backend puede ignorar si aún no filtra por fecha
    })
      .then(res => setCuentas(res.data))
      .catch(err => {
        console.error("Error al cargar todas:", err);
        alert("No se pudo cargar el Libro Mayor.");
      });
  };

  const renderTabla = (datos, totalDebe, totalHaber, saldo) => (
    <table className="table table-bordered text-center align-middle">
      <thead style={{ backgroundColor: "#d4ede1", fontWeight: "bold" }}>
        <tr>
          <th>Fecha</th>
          <th>Descripción</th>
          <th>Debe</th>
          <th>Haber</th>
        </tr>
      </thead>
      <tbody>
        {datos.map((r, i) => (
          <tr key={i}>
            <td>{r.fecha}</td>
            <td>{r.descripcion}</td>
            <td>{r.debe?.toLocaleString() || 0}</td>
            <td>{r.haber?.toLocaleString() || 0}</td>
          </tr>
        ))}
        <tr style={{ backgroundColor: "#f8edc6", fontWeight: "bold" }}>
          <td colSpan="2">Totales</td>
          <td>{totalDebe.toLocaleString()}</td>
          <td>{totalHaber.toLocaleString()}</td>
        </tr>
        <tr style={{ backgroundColor: "#d8f3f9", fontWeight: "bold" }}>
          <td colSpan="3">Saldo</td>
          <td style={{ color: saldo >= 0 ? "green" : "red" }}>
            {saldo.toLocaleString()}
          </td>
        </tr>
      </tbody>
    </table>
  );

  const renderFiltrada = () => {
    const totalDebe = filtrados.reduce((acc, r) => acc + (r.debe || 0), 0);
    const totalHaber = filtrados.reduce((acc, r) => acc + (r.haber || 0), 0);
    const saldo = totalDebe - totalHaber;

    return (
      <div className="mb-5">
        <h5 className="text-success mb-3 fs-5 fw-bold">
          {codigo} - {cuentaSeleccionada?.nombre || ""}
        </h5>
        {renderTabla(filtrados, totalDebe, totalHaber, saldo)}
      </div>
    );
  };

  const renderTodas = () =>
    cuentas.map((cuenta, i) => {
      const movimientos = cuenta.movimientos || [];
      const totalDebe = movimientos.reduce((acc, r) => acc + (r.debe || 0), 0);
      const totalHaber = movimientos.reduce((acc, r) => acc + (r.haber || 0), 0);
      const saldo = totalDebe - totalHaber;

      return (
        <div key={i} className="mb-5">
          <h5 className="text-success mb-3 fs-5 fw-bold">
            {cuenta.cuentaCodigo.codigo} - {cuenta.cuentaNombre}
          </h5>
          {renderTabla(movimientos, totalDebe, totalHaber, saldo)}
        </div>
      );
    });

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-4" style={{ marginLeft: "270px" }}>
        <h4 className="mb-4">📗 Libro Mayor</h4>

        {/* FILTRO */}
        <div className="mb-4">
          <h5>🔎 Filtros</h5>
          <div className="row g-2 align-items-center">
            <div className="col-md-3 position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Código de cuenta"
                value={codigo}
                onChange={handleInputCodigo}
              />
              {sugerencias.length > 0 && (
                <ul className="list-group position-absolute w-100 z-3">
                  {sugerencias.map((c) => (
                    <li
                      key={c.codigo}
                      className="list-group-item list-group-item-action"
                      onClick={() => seleccionarCuenta(c)}
                      style={{ cursor: "pointer" }}
                    >
                      {c.codigo} - {c.nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" onClick={buscarUnaCuenta}>
                Buscar cuenta
              </button>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-success w-100" onClick={buscarTodasLasCuentas}>
                Mostrar todas las cuentas
              </button>
            </div>
          </div>
        </div>

        {/* RESULTADOS */}
        {mostrarTodas ? renderTodas() : filtrados.length > 0 && renderFiltrada()}
      </div>
    </div>
  );
};

export default LibroMayor;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";

function AgregarLibro() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const periodoId = localStorage.getItem("periodoId");

  const [asiento, setAsiento] = useState(state || {
    fecha: "",
    descripcion: "",
    tipoAsiento: "REGULAR",
    periodoId: parseInt(periodoId),
    detalles: [],
  });

  const [detalle, setDetalle] = useState({
    cuentaCodigo: "",
    cuentaPeriodoContableId: parseInt(periodoId),
    debe: 0,
    haber: 0,
  });

  const [cuentas, setCuentas] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [errorBalance, setErrorBalance] = useState("");

  useEffect(() => {
    const key = "cuentas_" + periodoId;
    const cache = localStorage.getItem(key);
    if (cache) {
      setCuentas(JSON.parse(cache));
    }
  }, [periodoId]);

  const handleCuentaInput = (e) => {
    const valor = e.target.value;
    setDetalle({ ...detalle, cuentaCodigo: valor });
    const filtradas = cuentas.filter(
      (c) =>
        c.codigo.startsWith(valor) &&
        c.imputable === true
    );
    setSugerencias(filtradas);
  };

  const seleccionarCuenta = (cuenta) => {
    setDetalle({
      ...detalle,
      cuentaCodigo: cuenta.codigo,
      cuentaPeriodoContableId: parseInt(periodoId),
    });
    setSugerencias([]);
  };

  const agregarDetalle = () => {
    if (!detalle.cuentaCodigo) return;
    setAsiento((prev) => ({
      ...prev,
      detalles: [...prev.detalles, detalle],
    }));
    setDetalle({
      cuentaCodigo: "",
      cuentaPeriodoContableId: parseInt(periodoId),
      debe: 0,
      haber: 0,
    });
  };

  const eliminarDetalle = (index) => {
    const copia = [...asiento.detalles];
    copia.splice(index, 1);
    setAsiento({ ...asiento, detalles: copia });
  };

  const validarPartidaDoble = () => {
    const debeTotal = asiento.detalles.reduce((acc, d) => acc + d.debe, 0);
    const haberTotal = asiento.detalles.reduce((acc, d) => acc + d.haber, 0);
    return debeTotal === haberTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarPartidaDoble()) {
      setErrorBalance("Debe y Haber no coinciden.");
      return;
    }
    setErrorBalance("");
    axios
      .post("/librodiario", asiento, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        localStorage.setItem("actualizarAsientos", "true");
        navigate("/librodiario");
      })
      .catch((err) => console.error("Error al guardar asiento:", err));
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <h2>Agregar Asiento Contable</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Fecha</label>
            <input
              type="date"
              className="form-control"
              value={asiento.fecha}
              onChange={(e) => setAsiento({ ...asiento, fecha: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label>Descripción</label>
            <input
              type="text"
              className="form-control"
              value={asiento.descripcion}
              onChange={(e) => setAsiento({ ...asiento, descripcion: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label>Tipo</label>
            <select
              className="form-control"
              value={asiento.tipoAsiento}
              onChange={(e) => setAsiento({ ...asiento, tipoAsiento: e.target.value })}
            >
              <option value="REGULAR">REGULAR</option>
              <option value="AJUSTE">AJUSTE</option>
            </select>
          </div>

          <h5>Detalle del Asiento</h5>
          <div className="row g-2 mb-3 position-relative">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Código cuenta"
                value={detalle.cuentaCodigo}
                onChange={handleCuentaInput}
              />
              {sugerencias.length > 0 && (
                <ul className="list-group position-absolute z-3 w-100">
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
            <div className="col">
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Debe"
                value={detalle.debe}
                onChange={(e) => setDetalle({ ...detalle, debe: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="col">
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Haber"
                value={detalle.haber}
                onChange={(e) => setDetalle({ ...detalle, haber: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-primary" onClick={agregarDetalle}>
                +
              </button>
            </div>
          </div>

          {errorBalance && <div className="alert alert-danger">{errorBalance}</div>}

          <ul className="list-group mb-3">
            {asiento.detalles.map((d, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {d.cuentaCodigo} — Debe: {d.debe} / Haber: {d.haber}
                <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarDetalle(index)}>🗑️</button>
              </li>
            ))}
          </ul>

          <button type="submit" className="btn btn-success">Guardar</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/librodiario")}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default AgregarLibro;
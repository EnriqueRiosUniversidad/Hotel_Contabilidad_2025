import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function LibroDiario() {
  const [asientos, setAsientos] = useState([]);
  const [search, setSearch] = useState("");
  const periodoId = localStorage.getItem("periodoId");
  const token = localStorage.getItem("auth_token");
  const navigate = useNavigate();

  useEffect(() => {
    const actualizar = localStorage.getItem("actualizarAsientos") === "true";
    const cacheKey = "asientos_" + periodoId;

    if (!actualizar && localStorage.getItem(cacheKey)) {
      setAsientos(JSON.parse(localStorage.getItem(cacheKey)));
    } else {
      cargarAsientos();
    }
  }, []);

  const cargarAsientos = () => {
    api.get(`/librodiario/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setAsientos(res.data);
        localStorage.setItem("asientos_" + periodoId, JSON.stringify(res.data));
        localStorage.setItem("actualizarAsientos", "false");
      })
      .catch((err) => console.error("Error al obtener asientos:", err));
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este asiento?")) return;

    api.delete(`/librodiario/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert("Asiento eliminado correctamente");
        setAsientos((prev) => prev.filter((a) => a.id !== id));
        localStorage.setItem("actualizarAsientos", "true");
      })
      .catch(() => alert("Error al eliminar el asiento"));
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-3" style={{ marginLeft: "270px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Libro Diario</h4>
          <button className="btn btn-success btn-sm" onClick={() => navigate("/agregar-libro")}>
            Agregar nuevo
          </button>
        </div>

        <div className="row align-items-center mb-4">
          <div className="col-md-4"></div>
          <div className="col-md-4 text-center">
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Buscar por fecha"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="input-group-text">🔍</span>
            </div>
          </div>
          <div className="col-md-4 text-end">
            <select
              className="form-select form-select-sm w-auto d-inline-block"
              onChange={(e) => {
                if (e.target.value === "excel") exportToExcel();
                if (e.target.value === "pdf") exportToPDF();
                if (e.target.value === "xml") exportToXML();
              }}
            >
              <option value="">Exportar</option>
              <option value="excel">Exportar a Excel</option>
              <option value="pdf">Exportar a PDF</option>
              <option value="xml">Exportar a XML</option>
            </select>
          </div>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtrado.map((asiento) => (
              <tr key={asiento.id}>
                <td>{asiento.fecha}</td>
                <td>{asiento.descripcion}</td>
                <td>{asiento.tipoAsiento}</td>
                <td>
                  <button className="btn btn-info btn-sm me-1" onClick={() => navigate(`/detalle-libro/${asiento.id}`)}>Ver</button>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => navigate(`/agregar-libro/${asiento.id}`)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(asiento.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LibroDiario;

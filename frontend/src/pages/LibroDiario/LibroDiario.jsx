import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function LibroDiario() {
  const [asientos, setAsientos] = useState([]);
  const [filtro, setFiltro] = useState("");
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(asientos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LibroDiario");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "LibroDiario.xlsx");
  };

  const exportToXML = () => {
    let xml = "<?xml version='1.0' encoding='UTF-8'?>\n<LibroDiario>\n";
    asientos.forEach((item) => {
      xml += "  <Asiento>\n";
      Object.entries(item).forEach(([key, value]) => {
        xml += `    <${key}>${value}</${key}>\n`;
      });
      xml += "  </Asiento>\n";
    });
    xml += "</LibroDiario>";
    const blob = new Blob([xml], { type: "application/xml" });
    saveAs(blob, "LibroDiario.xml");
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <h2>Libro Diario</h2>

        <div className="d-flex justify-content-between align-items-end mb-3 flex-wrap gap-3">
          <div>
            <label htmlFor="buscar" className="form-label">Buscar Asiento</label>
            <input
              type="search"
              id="buscar"
              className="form-control"
              placeholder="Buscar por descripción, tipo o cuenta"
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Exportar</label>
            <select
              className="form-select form-select-sm"
              onChange={(e) => {
                if (e.target.value === "excel") exportToExcel();
                if (e.target.value === "xml") exportToXML();
              }}
            >
              <option value="">Exportar</option>
              <option value="excel">Excel</option>
              <option value="xml">XML</option>
            </select>

            <button
              className="btn btn-success btn-sm mt-2 w-100"
              onClick={() => navigate("/agregar-libro")}
            >
              Agregar Asiento
            </button>
          </div>
        </div>

        <table className="table table-bordered table-hover text-center">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              <th>Código de Cuenta</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {asientos
              .filter((a) =>
                a.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
                a.tipoAsiento.toLowerCase().includes(filtro.toLowerCase()) ||
                a.detalles?.[0]?.cuentaCodigo?.toLowerCase().includes(filtro.toLowerCase())
              )
              .map((asiento) => (
                <tr key={asiento.id}>
                  <td>{asiento.fecha}</td>
                  <td>{asiento.detalles?.[0]?.cuentaCodigo || "N/D"}</td>
                  <td>{asiento.descripcion}</td>
                  <td>{asiento.tipoAsiento}</td>
                  <td>
                    <button
                      className="btn btn-outline-secondary btn-sm me-1"
                      onClick={() => navigate(`/detalle-libro/${asiento.id}`)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm me-1"
                      onClick={() => navigate(`/agregar-libro/${asiento.id}`)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleEliminar(asiento.id)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
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

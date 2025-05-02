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
    api
      .get(`/librodiario/${periodoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAsientos(res.data))
      .catch((err) => console.error("Error al obtener asientos:", err));
  }, [periodoId]);

  const filtrado = asientos.filter((item) =>
    item.fecha.toLowerCase().includes(search.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtrado);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LibroDiario");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "LibroDiario.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Libro Diario", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["#", "Tipo", "Fecha", "Descripción", "Total"]],
      body: filtrado.map((item) => [
        item.id,
        item.tipoAsiento,
        item.fecha,
        item.descripcion,
        item.total,
      ]),
      theme: "striped",
      styles: { fontSize: 10 },
    });
    doc.save("LibroDiario.pdf");
  };

  const exportToXML = () => {
    let xml = "<?xml version='1.0' encoding='UTF-8'?>\n<LibroDiario>\n";
    filtrado.forEach((item) => {
      xml += "  <Item>\n";
      Object.keys(item).forEach((key) => {
        if (key !== "asiento") {
          xml += `    <${key}>${item[key]}</${key}>\n`;
        }
      });
      xml += "  </Item>\n";
    });
    xml += "</LibroDiario>";
    const blob = new Blob([xml], { type: "application/xml" });
    saveAs(blob, "LibroDiario.xml");
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este registro?")) return;
    api
      .delete(`/librodiario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setAsientos(asientos.filter((a) => a.id !== id)))
      .catch((err) => console.error("Error al eliminar asiento:", err));
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
                  <button
                    className="btn btn-info btn-sm me-1"
                    onClick={() => navigate(`/detalle-libro/${asiento.id}`)}
                  >
                    Ver
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm me-1"
                    onClick={() => navigate("/editar-libro", { state: { registro: asiento } })}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleEliminar(asiento.id)}
                  >
                    Eliminar
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
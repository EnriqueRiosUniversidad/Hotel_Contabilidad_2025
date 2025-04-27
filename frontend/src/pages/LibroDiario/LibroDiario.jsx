import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Navbar from '../../components/Navbar'; // Ajusta la ruta si tu Navbar.jsx está en otra carpeta

const LibroDiario = () => {
  const [search, setSearch] = useState("");
  const [registros, setRegistros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const datosIniciales = [
      {
        id: 1,
        tipo: "Manual",
        fecha: "2025-03-21",
        descripcion: "Venta de Mercadería",
        total: "1.100.000",
        asiento: [
          { id: 1, cod: "111", cuenta: "Venta de Mercadería", debe: "1.100.000", haber: "" },
          { id: 2, cod: "212", cuenta: "Caja", debe: "", haber: "1.000.000" },
          { id: 3, cod: "301", cuenta: "IVA 10%", debe: "", haber: "100.000" },
        ],
      },
      {
        id: 2,
        tipo: "Automatico",
        fecha: "2025-03-20",
        descripcion: "Adelanto de saldo",
        total: "15.000.000",
        asiento: [
          { id: 1, cod: "111", cuenta: "Sueldos a pagar", debe: "15.000.000", haber: "" },
          { id: 2, cod: "212", cuenta: "Caja", debe: "", haber: "15.000.000" },
        ],
      },
      {
        id: 3,
        tipo: "Manual",
        fecha: "2025-03-19",
        descripcion: "Ingreso por servicio técnico",
        total: "2.500.000",
        asiento: [
          { id: 1, cod: "400", cuenta: "Servicios", debe: "2.500.000", haber: "" },
          { id: 2, cod: "212", cuenta: "Caja", debe: "", haber: "2.500.000" },
        ],
      },
      {
        id: 4,
        tipo: "Manual",
        fecha: "2025-03-18",
        descripcion: "Compra de mercadería",
        total: "5.000.000",
        asiento: [
          { id: 1, cod: "110", cuenta: "Mercaderías", debe: "5.000.000", haber: "" },
          { id: 2, cod: "212", cuenta: "Caja", debe: "", haber: "5.000.000" },
        ],
      },
    ];

    const datosGuardados = JSON.parse(localStorage.getItem("libroDiario"));

    if (!Array.isArray(datosGuardados) || datosGuardados.length === 0) {
      localStorage.setItem("libroDiario", JSON.stringify(datosIniciales));
      setRegistros(datosIniciales);
    } else {
      setRegistros(datosGuardados);
    }
  }, []);

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      const nuevosRegistros = registros.filter((item) => item.id !== id);
      setRegistros(nuevosRegistros);
      localStorage.setItem("libroDiario", JSON.stringify(nuevosRegistros));
    }
  };

  const filtrado = registros.filter((item) =>
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
        item.tipo,
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

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-3">
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

        <table className="table table-hover">
          <thead>
            <tr className="table-active">
              <th>#</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Total</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrado.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.tipo}</td>
                <td>{item.fecha}</td>
                <td>{item.descripcion}</td>
                <td>{item.total}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => navigate("/detalle-libro", { state: { registro: item } })}
                  >
                    Ver
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => navigate("/editar-libro", { state: { registro: item } })}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleEliminar(item.id)}
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
};

export default LibroDiario;

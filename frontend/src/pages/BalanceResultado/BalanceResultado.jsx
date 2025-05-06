// src/pages/BalanceSYS.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BalanceResultado = () => {
  const [registros, setRegistros] = useState([]);
  const [periodoId, setPeriodoId] = useState("1");

  useEffect(() => {
    const datosResultado = [
      { cuenta: "Ingresos Operacionales", tipo: "seccion" },
      { cuenta: "Ventas de Habitaciones", monto: 200000000 },
      { cuenta: "Servicios Adicionales(Spa, Restaurante, etc.)", monto: 50000000 },
      { cuenta: "Otros Ingresos", monto: 10000000 },
      { cuenta: "Total de Ingresos", monto: 260000000, tipo: "total" },
      { cuenta: "Costos Operativos", tipo: "seccion" },
      { cuenta: "Costo de Servicios Prestados", monto: 95000000 },
      { cuenta: "Gastos de Mantenimiento", monto: 20000000 },
      { cuenta: "Sueldos y salarios", monto: 60000000 },
      { cuenta: "Suministros", monto: 10000000 },
      { cuenta: "Otros Gastos Operativos", monto: 60000000 },
      { cuenta: "Total de Costos Operativos", monto: 190000000, tipo: "total" },
      { cuenta: "Utilidad Operativa", monto: 70000000 },
      { cuenta: "Gastos Financieros", monto: 15000000 },
      { cuenta: "Utilidad Antes de Impuestos", monto: 55000000 },
      { cuenta: "Utilidad con Impuestos", monto: 105000000 },
    ];
    setRegistros(datosResultado);
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registros);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultado");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "BalanceResultado.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Estado de Resultados", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["Cuenta", "Monto"]],
      body: registros.map((r) => [r.cuenta, r.monto !== undefined ? r.monto.toLocaleString() : ""]),
      styles: { fontSize: 8 },
      theme: "grid",
    });
    doc.save("BalanceResultado.pdf");
  };

  const exportToXML = () => {
    let xml = "<?xml version='1.0' encoding='UTF-8'?>\n<EstadoResultado>\n";
    registros.forEach((item) => {
      xml += "  <Cuenta>\n";
      Object.entries(item).forEach(([key, value]) => {
        xml += `    <${key}>${value}</${key}>\n`;
      });
      xml += "  </Cuenta>\n";
    });
    xml += "</EstadoResultado>";
    const blob = new Blob([xml], { type: "application/xml" });
    saveAs(blob, "BalanceResultado.xml");
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-3" style={{ marginLeft: "270px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-3">Estado de Resultados</h4>
          <div className="d-inline-flex gap-3 align-items-center">
            <div>
              <label htmlFor="periodo" className="form-label">Seleccionar Período Contable</label>
              <select
                id="periodo"
                className="form-select form-select-sm d-inline-block"
                value={periodoId}
                onChange={(e) => setPeriodoId(e.target.value)}
              >
                <option value="1">2025 - Enero a Diciembre</option>
                <option value="2">2024 - Enero a Diciembre</option>
              </select>
            </div>
            <div>
              <select
                className="form-select form-select-sm d-inline-block"
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
        </div>
        <table className="table table-bordered text-start align-middle">
          <thead className="table-success">
            <tr>
              <th>Cuenta</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr key={i} className={r.tipo === "seccion" ? "fw-bold" : r.tipo === "total" ? "table-light" : ""}>
                <td>{r.cuenta}</td>
                <td>{r.monto !== undefined ? r.monto.toLocaleString() : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceResultado;
// src/pages/BalanceResultado.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const BalanceResultado = () => {
  const [registros, setRegistros] = useState([]);
  const [periodoId, setPeriodoId] = useState("1");
  const [mostrarGrafico, setMostrarGrafico] = useState(false);

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
      head: [["#", "Cuenta", "Monto"]],
      body: registros.map((r, i) => [i + 1, r.cuenta, r.monto !== undefined ? r.monto.toLocaleString() : ""]),
      styles: { fontSize: 8 },
      theme: "grid",
    });
    doc.setFontSize(12);
    doc.text(`TOTAL: ${utilidadNeta.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`${mensajeResultado}`, 14, doc.lastAutoTable.finalY + 20);
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

  const utilidadNeta = registros.find(r => r.cuenta === "Utilidad con Impuestos")?.monto || 0;
  const resultadoColor = utilidadNeta > 0 ? "text-success" : "text-danger";
  const mensajeResultado = utilidadNeta > 0 ? "¡Este período fue rentable!" : "¡Este período tuvo pérdida!";

  const cuentasGraficables = registros.filter(r => r.monto !== undefined && !r.tipo);

  const chartData = {
    labels: cuentasGraficables.map(r => r.cuenta),
    datasets: [
      {
        label: "Montos",
        data: cuentasGraficables.map(r => r.monto),
        backgroundColor: [
          "#007bff", "#fd7e14", "#6c757d", "#28a745",
          "#ffc107", "#dc3545", "#17a2b8", "#6610f2",
          "#20c997", "#e83e8c", "#343a40", "#f8f9fa"
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          padding: 10
        }
      }
    }
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
                  e.target.selectedIndex = 0;
                }}
              >
                <option value="">Exportar</option>
                <option value="excel">Exportar a Excel</option>
                <option value="pdf">Exportar a PDF</option>
                <option value="xml">Exportar a XML</option>
              </select>
              <button type="button" className="btn btn-link" onClick={() => setMostrarGrafico(!mostrarGrafico)}>
                Ver Gráfico
              </button>
            </div>
          </div>
        </div>

        {mostrarGrafico && (
          <div className="mb-4" style={{ height: "480px", width: "480px", margin: "0 auto" }}>
            <h5>Distribución de Montos</h5>
            <Pie data={chartData} options={chartOptions} />
          </div>
        )}

        <table className="table table-bordered text-start align-middle">
          <thead className="table-success">
            <tr>
              <th>NRO</th>
              <th>Cuenta</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr key={i} className={r.tipo === "seccion" ? "fw-bold" : r.tipo === "total" ? "table-light" : ""}>
                <td>{i + 1}</td>
                <td>{r.cuenta}</td>
                <td>{r.monto !== undefined ? r.monto.toLocaleString() : ""}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} className="text-end fw-bold">TOTAL</td>
              <td className={`fw-bold ${resultadoColor}`}>{utilidadNeta.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={3} className={`text-center fw-bold ${resultadoColor}`}>
                {mensajeResultado}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceResultado;
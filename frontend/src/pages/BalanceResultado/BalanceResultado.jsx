import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BalanceResultado = () => {
  const [registros, setRegistros] = useState([]);
  const [periodoId] = useState(() => localStorage.getItem("periodoId") || "1");
  const [mostrarReporte, setMostrarReporte] = useState(false);

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

  const formatMonto = (valor) => {
    return valor != null ? valor.toLocaleString('es-PY') : "";
  };

  const exportToExcel = () => {
    const headers = ["cuenta", "monto"];
    const data = registros.map(r => [r.cuenta, r.monto || 0]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultado");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "BalanceResultado.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Estado de Resultados", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["Cuenta", "Monto"]],
      body: registros.map((item) => [item.cuenta, item.monto || ""]),
      styles: { fontSize: 10 },
      theme: "grid",
    });
    doc.save("BalanceResultado.pdf");
  };

  const exportToXML = () => {
    let xml = "<?xml version='1.0' encoding='UTF-8'?>\n<BalanceResultado>\n";
    registros.forEach((item) => {
      xml += "  <Registro>\n";
      xml += `    <Cuenta>${item.cuenta}</Cuenta>\n`;
      xml += `    <Monto>${item.monto}</Monto>\n`;
      xml += "  </Registro>\n";
    });
    xml += "</BalanceResultado>";
    const blob = new Blob([xml], { type: "application/xml" });
    saveAs(blob, "BalanceResultado.xml");
  };

  const chartData = {
    labels: registros.map(r => r.cuenta),
    datasets: [
      {
        label: 'Monto',
        backgroundColor: 'rgba(20, 134, 45, 0.6)',
        data: registros.map(r => r.monto || 0),
      }
    ]
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-4" style={{ marginLeft: "270px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-center text-success fw-bold" style={{ fontFamily: "Georgia, serif" }}>Balance de Resultado</h2>
          <div className="d-inline-flex gap-3 align-items-center">
            <div>
            </div>
            <div>
              <select className="form-select form-select-sm" onChange={(e) => {
                const value = e.target.value;
                if (value === "excel") exportToExcel();
                if (value === "pdf") exportToPDF();
                if (value === "xml") exportToXML();
                e.target.selectedIndex = 0;
              }}>
                <option value="">Exportar</option>
                <option value="excel">Excel</option>
                <option value="xml">XML</option>
              </select>
              <button type="button" className="btn btn-link" onClick={() => setMostrarReporte(!mostrarReporte)}>Ver Gráfico</button>
            </div>
          </div>
        </div>

        {mostrarReporte && <div className="mb-4"><Bar data={chartData} /></div>}

        <table className="table table-bordered align-middle text-start">
          <thead className="table-secondary">
            <tr>
              <th>CUENTA</th>
              <th>MONTO</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((item, i) => (
              <tr key={i} className={getRowClass(item.tipo)}>
                <td>{item.cuenta}</td>
                <td>{formatMonto(item.monto)}</td>
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

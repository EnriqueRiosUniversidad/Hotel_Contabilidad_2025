import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
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
import api from "../../api/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BalanceSYS = () => {
  const [registros, setRegistros] = useState([]);
  const [periodoId, setPeriodoId] = useState(() => localStorage.getItem("periodoId") || "1");
  const [mostrarReporte, setMostrarReporte] = useState(false);

  const cargarDatos = () => {
    const token = localStorage.getItem("auth_token");
    api.get(`/libro-mayor/balance-sumas-saldos/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setRegistros(res.data);
    }).catch(err => {
      console.error("Error al cargar balance:", err);
      alert("Error al cargar el Balance de Sumas y Saldos.");
    });
  };

  useEffect(() => {
    cargarDatos();
  }, [periodoId]);

  const exportToExcel = () => {
  const headers = [
    "codigo",
    "cuenta",
    "debe",
    "haber",
    "saldoDebe",
    "saldoHaber",
  ];

  // Datos + totales
  const data = registros.map(r => [
    r.codigo,
    r.cuenta,
    r.debe || 0,
    r.haber || 0,
    r.saldoDebe || 0,
    r.saldoHaber || 0,
  ]);

  // Calcular totales
  const totalDebe = data.reduce((acc, r) => acc + r[2], 0);
  const totalHaber = data.reduce((acc, r) => acc + r[3], 0);
  const totalSaldoDebe = data.reduce((acc, r) => acc + r[4], 0);
  const totalSaldoHaber = data.reduce((acc, r) => acc + r[5], 0);

  data.push([
    "Totales",
    "",
    totalDebe,
    totalHaber,
    totalSaldoDebe,
    totalSaldoHaber,
  ]);

  // Crear hoja
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Opcional: ajustar ancho de columnas
  worksheet["!cols"] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Balance");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(dataBlob, "BalanceDeSumasYSaldos.xlsx");
};

  const exportToPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Balance de Sumas y Saldos", 14, 15);
  autoTable(doc, {
    startY: 25,
    head: [["#", "CUENTA", "Debe", "Haber", "Saldo Debe", "Saldo Haber"]],
    body: registros.map((item, index) => [
      index + 1,
      item.cuenta,
      item.debe || "",
      item.haber || "",
      item.saldoDebe || "",
      item.saldoHaber || "",
    ]),
    styles: { fontSize: 8 },
    theme: "grid",
  });
  doc.save("BalanceDeSumaYSaldo.pdf");
};


  const exportToXML = () => {
    let xml = "<?xml version='1.0' encoding='UTF-8'?>\n<Balance>\n";
    registros.forEach((item) => {
      xml += "  <Cuenta>\n";
      Object.entries(item).forEach(([key, value]) => {
        xml += `    <${key}>${value}</${key}>\n`;
      });
      xml += "  </Cuenta>\n";
    });
    xml += "</Balance>";
    const blob = new Blob([xml], { type: "application/xml" });
    saveAs(blob, "BalanceDeSumaYSaldo.xml");
  };

  const totalDebe = registros.reduce((sum, r) => sum + (r.debe || 0), 0);
  const totalHaber = registros.reduce((sum, r) => sum + (r.haber || 0), 0);
  const totalSaldoDebe = registros.reduce((sum, r) => sum + (r.saldoDebe || 0), 0);
  const totalSaldoHaber = registros.reduce((sum, r) => sum + (r.saldoHaber || 0), 0);

  const resultadoEjercicio = totalSaldoDebe - totalSaldoHaber;

  const resultadoStyle = {
    color: resultadoEjercicio >= 0 ? 'green' : 'red',
    fontWeight: 'bold'
  };

  const chartData = {
    labels: registros.map(r => r.cuenta),
    datasets: [
      {
        label: 'Debe',
        backgroundColor: 'rgba(151, 209, 43, 0.6)',
        data: registros.map(r => r.debe || 0),
      },
      {
        label: 'Haber',
        backgroundColor: 'rgba(75, 112, 236, 0.6)',
        data: registros.map(r => r.haber || 0),
      },
    ]
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container py-3" style={{ marginLeft: "270px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-3">Balance de Sumas y Saldos</h4>
          <div className="d-inline-flex gap-3 align-items-center">
            <div>
              <label htmlFor="periodo" className="form-label">Seleccionar Período</label>
              <select
                id="periodo"
                className="form-select form-select-sm"
                value={periodoId}
                onChange={(e) => {
                  setPeriodoId(e.target.value);
                  localStorage.setItem("periodoId", e.target.value);
                }}
              >
                <option value="1">2025 - Ene a Dic</option>
                <option value="2">2024 - Ene a Dic</option>
              </select>
            </div>
            <div>
              <select
                className="form-select form-select-sm"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "excel") exportToExcel();
                  if (value === "pdf") exportToPDF();
                  if (value === "xml") exportToXML();
                  e.target.selectedIndex = 0;
                }}
              >
                <option value="">Exportar</option>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
                <option value="xml">XML</option>
              </select>
              <button type="button" className="btn btn-link" onClick={() => setMostrarReporte(!mostrarReporte)}>
                Ver Gráfico
              </button>
            </div>
          </div>
        </div>

        {mostrarReporte && (
          <div className="mb-4">
            <Bar data={chartData} />
          </div>
        )}

        <table className="table table-bordered text-center align-middle">
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>CUENTA</th>
              <th>Debe</th>
              <th>Haber</th>
              <th>Saldo Debe</th>
              <th>Saldo Haber</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.cuenta}</td>
                <td>{item.debe}</td>
                <td>{item.haber}</td>
                <td>{item.saldoDebe}</td>
                <td>{item.saldoHaber}</td>
              </tr>
            ))}
            <tr className="table-info">
              <td colSpan={2}><strong>Totales</strong></td>
              <td>{totalDebe}</td>
              <td>{totalHaber}</td>
              <td>{totalSaldoDebe}</td>
              <td>{totalSaldoHaber}</td>
            </tr>
            <tr className="table-success">
              <td colSpan={5} className="text-end"><strong>Resultado del ejercicio</strong></td>
              <td style={resultadoStyle}>{resultadoEjercicio}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceSYS;

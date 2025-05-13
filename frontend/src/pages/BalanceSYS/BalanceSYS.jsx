// src/pages/BalanceSYS.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
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

const BalanceSYS = () => {
  const [registros, setRegistros] = useState([]);
  const [periodoId, setPeriodoId] = useState("1");
  const [mostrarReporte, setMostrarReporte] = useState(false);

  useEffect(() => {
    const datosIniciales = [
      { cuenta: "Caja", debe: 5000, haber: 5000 },
      { cuenta: "Mercaderías", debe: 4000, haber: 6000 },
      { cuenta: "Documentos a cobrar", debe: 3500, haber: 3500 },
      { cuenta: "Banco Litoral c/c", debe: 12400, haber: 3950, saldoDebe: 8450 },
      { cuenta: "Inmuebles", debe: 7000, saldoDebe: 7000 },
      { cuenta: "Proveedores", haber: 510, saldoHaber: 510 },
      { cuenta: "Capital Social", haber: 20000, saldoHaber: 20000 },
      { cuenta: "Valores a Depositar", debe: 7400, haber: 7400 },
      { cuenta: "Descuentos Concedidos", debe: 100, saldoDebe: 100 },
      { cuenta: "Ventas", haber: 4000, saldoHaber: 4000, ganancias: 4000 },
      { cuenta: "CMV", debe: 600, haber: 600 },
      { cuenta: "Obligaciones a pagar", haber: 500, saldoHaber: 500 },
      { cuenta: "Rodados", debe: 2000, saldoDebe: 2000 },
    ];
    setRegistros(datosIniciales);
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registros);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Balance");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "BalanceDeSumaYSaldo.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Balance de Sumas y Saldos", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["#", "NOMBRE DE LAS CUENTAS", "Debe", "Haber", "Saldo Debe", "Saldo Haber"]],
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
  const totalGanancias = registros.reduce((sum, r) => sum + (r.ganancias || 0), 0);
  const totalPerdidas = registros.reduce((sum, r) => sum + (r.perdidas || 0), 0);
  const resultadoEjercicio = totalGanancias - totalPerdidas;

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
              <label htmlFor="periodo" className="form-label">
                Seleccionar Período Contable
              </label>
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
                  const value = e.target.value;
                  if (value === "excel") exportToExcel();
                  if (value === "pdf") exportToPDF();
                  if (value === "xml") exportToXML();
                  e.target.selectedIndex = 0; // Reset selector
                }}
              >
                <option value="">Exportar</option>
                <option value="excel">Exportar a Excel</option>
                <option value="pdf">Exportar a PDF</option>
                <option value="xml">Exportar a XML</option>
              </select>
              <button button type="button" class="btn btn-link" onClick={() => setMostrarReporte(!mostrarReporte)}>
                Ver Grafico
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
              <th>NRO</th>
              <th>NOMBRE DE LAS CUENTAS</th>
              <th colSpan={2}>SUMAS</th>
              <th colSpan={2}>SALDOS</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th>Debe</th>
              <th>Haber</th>
              <th>Debe</th>
              <th>Haber</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.cuenta}</td>
                <td>{item.debe || ""}</td>
                <td>{item.haber || ""}</td>
                <td>{item.saldoDebe || ""}</td>
                <td>{item.saldoHaber || ""}</td>
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
              <td colSpan={5} className="text-end"><strong>Resultados del ejercicio</strong></td>
              <td style={resultadoStyle}>{resultadoEjercicio}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceSYS;

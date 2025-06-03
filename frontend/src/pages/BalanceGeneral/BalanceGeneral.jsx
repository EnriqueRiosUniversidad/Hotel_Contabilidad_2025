// MODIFICADO para mostrar como tabla completa, con gráfico comparativo y selector de período
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BalanceGeneral = () => {
  const [registros, setRegistros] = useState([]);
  const [periodoId, setPeriodoId] = useState(() => localStorage.getItem("periodoId") || "1");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    api.get(`/plancuentas/balance-general/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setRegistros(res.data))
      .catch((err) => {
        console.error("Error al cargar balance:", err);
        alert("No se pudo cargar el Balance General.");
      });
  }, [periodoId]);

  const agruparPor = (tipo) => registros.filter((r) => r.tipo === tipo);
  const totalPorTipo = (tipo) => agruparPor(tipo).reduce((acc, r) => acc + r.monto, 0);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registros);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Balance");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "BalanceGeneral.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Balance General", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["Cuenta", "Monto"]],
      body: registros.map(item => [item.cuenta, item.monto.toLocaleString()]),
      styles: { fontSize: 8 },
      theme: "grid"
    });
    doc.save("BalanceGeneral.pdf");
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
    saveAs(blob, "BalanceGeneral.xml");
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container-fluid py-3" style={{ marginLeft: "270px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-center text-success fw-bold" style={{ fontFamily: "Georgia, serif" }}>Balance General</h2>
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
                <option value="2">2026 - Enero a Diciembre</option>
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
                <option value="xml">Exportar a XML</option>
              </select>
            </div>
          </div>
        </div>

        <table className="table table-bordered w-100">
          <thead className="text-center table-success">
            <tr>
              <th>Cuenta</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan="2" className="fw-bold table-success">Activos</td></tr>
            {agruparPor("ACTIVO").map((item, index) => (
              <tr key={index}>
                <td>{item.cuenta}</td>
                <td className="text-end">{item.monto.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="fw-bold table-info">
              <td>Total Activo</td>
              <td className="text-end">{totalPorTipo("ACTIVO").toLocaleString()}</td>
            </tr>

            <tr><td colSpan="2" className="fw-bold table-success">Pasivo</td></tr>
            {agruparPor("PASIVO").map((item, index) => (
              <tr key={index}>
                <td>{item.cuenta}</td>
                <td className="text-end">{item.monto.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="fw-bold table-info">
              <td>Total Pasivo</td>
              <td className="text-end">{totalPorTipo("PASIVO").toLocaleString()}</td>
            </tr>

            <tr><td colSpan="2" className="fw-bold table-success">Patrimonio Neto</td></tr>
            {agruparPor("PATRIMONIO").map((item, index) => (
              <tr key={index}>
                <td>{item.cuenta}</td>
                <td className="text-end">{item.monto.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="fw-bold table-info">
              <td>Total Patrimonio Neto</td>
              <td className="text-end">{totalPorTipo("PATRIMONIO").toLocaleString()}</td>
            </tr>
            <tr className="fw-bold table-info">
              <td>Total Pasivo y Patrimonio Neto</td>
              <td className="text-end">{(totalPorTipo("PATRIMONIO") + totalPorTipo("PASIVO")).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-5 mb-4 d-flex justify-content-center">
          <div style={{ width: "500px" }}>
            <h5 className="text-center">Comparativo de Activo vs Pasivo y Patrimonio Neto</h5>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[
                  { nombre: 'Activo', monto: totalPorTipo("ACTIVO") },
                  { nombre: 'Pasivo', monto: totalPorTipo("PASIVO") },
                  { nombre: 'Patrimonio Neto', monto: totalPorTipo("PATRIMONIO") },
                ]}
                margin={{ top: 10, right: 40, left: 3, bottom: 1 }}
                barCategoryGap={50}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} Gs`} />
                <Legend />
                <Bar dataKey="monto" name="Monto" fill="#158550" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-5 mb-4 d-flex justify-content-center">
  <div style={{ width: "600px" }}>
    <h5 className="text-center">Comparativo de Activo vs Pasivo y Patrimonio</h5>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={[
          {
            nombre: 'Activo',
            monto: totalPor("ACTIVO", "CIRCULANTE") + totalPor("ACTIVO", "NO_CIRCULANTE"),
          },
          {
            nombre: 'Pasivo',
            monto: totalPor("PASIVO", "CIRCULANTE") + totalPor("PASIVO", "NO_CIRCULANTE"),
          },
          {
            nombre: 'Patrimonio',
            monto: totalPor("PATRIMONIO", "NO_CLASIFICADO"),
          },
        ]}
        margin={{ top: 20, right: 40, left: 0, bottom: 5 }}
        barCategoryGap={50}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" />
        <YAxis tickFormatter={(value) => value.toLocaleString()} />
        <Tooltip formatter={(value) => `${value.toLocaleString()} Gs`} />
        <Legend />
        <Bar dataKey="monto" name="Monto" fill="#73c768" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>



      </div>


    </div>
  );
};

export default BalanceGeneral;

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
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setRegistros(res.data))
      .catch((err) => {
        console.error("Error al cargar balance:", err);
        alert("No se pudo cargar el Balance General.");
      });
  }, [periodoId]);

  const agruparPor = (tipo, subtipo) =>
    registros.filter(r => r.tipo === tipo && r.subtipo === subtipo);

  const totalPor = (tipo, subtipo) =>
    agruparPor(tipo, subtipo).reduce((acc, r) => acc + r.monto, 0);

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
      head: [["Cuenta", "Tipo", "Subtipo", "Monto"]],
      body: registros.map(item => [item.cuenta, item.tipo, item.subtipo, item.monto.toLocaleString()]),
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
      <div className="container py-3" style={{ marginLeft: "270px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-3">Balance General</h4>
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
                <option value="pdf">Exportar a PDF</option>
                <option value="xml">Exportar a XML</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-success">
              <tr>
                <th>Cuenta</th><th>Monto</th>
                <th>Cuenta</th><th>Monto</th>
                <th>Patrimonio Neto</th><th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(
                agruparPor("ACTIVO", "CIRCULANTE").length,
                agruparPor("PASIVO", "CIRCULANTE").length,
                agruparPor("PATRIMONIO", "NO_CLASIFICADO").length
              ) }).map((_, i) => (
                <tr key={`row-circulante-${i}`}>
                  <td>{agruparPor("ACTIVO", "CIRCULANTE")[i]?.cuenta || ''}</td>
                  <td>{agruparPor("ACTIVO", "CIRCULANTE")[i]?.monto.toLocaleString() || ''}</td>
                  <td>{agruparPor("PASIVO", "CIRCULANTE")[i]?.cuenta || ''}</td>
                  <td>{agruparPor("PASIVO", "CIRCULANTE")[i]?.monto.toLocaleString() || ''}</td>
                  <td>{agruparPor("PATRIMONIO", "NO_CLASIFICADO")[i]?.cuenta || ''}</td>
                  <td>{agruparPor("PATRIMONIO", "NO_CLASIFICADO")[i]?.monto.toLocaleString() || ''}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total Activo Circulante</strong></td>
                <td>{totalPor("ACTIVO", "CIRCULANTE").toLocaleString()}</td>
                <td><strong>Total Pasivo Circulante</strong></td>
                <td>{totalPor("PASIVO", "CIRCULANTE").toLocaleString()}</td>
                <td><strong>Total Patrimonio Neto</strong></td>
                <td>{totalPor("PATRIMONIO", "NO_CLASIFICADO").toLocaleString()}</td>
              </tr>

              {agruparPor("ACTIVO", "NO_CIRCULANTE").map((r, i) => (
                <tr key={`anc-${i}`}>
                  <td>{r.cuenta}</td><td>{r.monto.toLocaleString()}</td>
                  <td colSpan="4"></td>
                </tr>
              ))}

              <tr>
                <td><strong>Total Activo No Circulante</strong></td>
                <td>{totalPor("ACTIVO", "NO_CIRCULANTE").toLocaleString()}</td>
                <td colSpan="4"></td>
              </tr>

              <tr className="table-success">
                <td><strong>Total Activo</strong></td>
                <td><strong>{(
                  totalPor("ACTIVO", "CIRCULANTE") +
                  totalPor("ACTIVO", "NO_CIRCULANTE")
                ).toLocaleString()}</strong></td>
                <td colSpan="4"></td>
              </tr>

              <tr>
                <td colSpan="2"></td>
                <td><strong>Total Pasivo No Circulante</strong></td>
                <td>{totalPor("PASIVO", "NO_CIRCULANTE").toLocaleString()}</td>
                <td></td>
                <td></td>
              </tr>

              <tr className="table-success">
                <td colSpan="4"></td>
                <td><strong>Total Pasivo y Patrimonio Neto</strong></td>
                <td><strong>{(
                  totalPor("PASIVO", "CIRCULANTE") +
                  totalPor("PASIVO", "NO_CIRCULANTE") +
                  totalPor("PATRIMONIO", "NO_CLASIFICADO")
                ).toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
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

// src/pages/BalanceSYS.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BalanceGeneral = () => {
  const [registros, setRegistros] = useState([]);
  const [periodoId, setPeriodoId] = useState("1");

  useEffect(() => {
    const datosBalance = [
      { cuenta: "Caja y Bancos", tipo: "Activo Circulante", monto: 50000000 },
      { cuenta: "Cuentas por Cobrar (Clientes)", tipo: "Activo Circulante", monto: 30000000 },
      { cuenta: "Inventarios (Alimentos y Bebidas)", tipo: "Activo Circulante", monto: 10000000 },
      { cuenta: "Otros Activos Circulantes", tipo: "Activo Circulante", monto: 5000000 },
      { cuenta: "Propiedades, Planta y Equipo", tipo: "Activo No Circulante", monto: 200000000 },
      { cuenta: "Inmuebles (Edificio y Terreno)", tipo: "Activo No Circulante", monto: 180000000 },
      { cuenta: "Equipos y Mobiliario", tipo: "Activo No Circulante", monto: 20000000 },
      { cuenta: "Cuentas por Pagar a Corto Plazo", tipo: "Pasivo Circulante", monto: 15000000 },
      { cuenta: "Proveedores", tipo: "Pasivo Circulante", monto: 20000000 },
      { cuenta: "Deudas a Corto Plazo", tipo: "Pasivo Circulante", monto: 5000000 },
      { cuenta: "Préstamos a Largo Plazo", tipo: "Pasivo No Circulante", monto: 20000000 },
      { cuenta: "Otros Pasivos No Circulantes", tipo: "Pasivo No Circulante", monto: 10000000 },
      { cuenta: "Capital Social", tipo: "Patrimonio Neto", monto: 142500000 },
      { cuenta: "Resultados Acumulados", tipo: "Patrimonio Neto", monto: 282500000 }
    ];
    setRegistros(datosBalance);
  }, []);

  const agruparPorTipo = (tipo) => registros.filter(r => r.tipo === tipo);
  const totalPorTipo = (tipo) => agruparPorTipo(tipo).reduce((acc, r) => acc + r.monto, 0);

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
      head: [["Cuenta", "Tipo", "Monto"]],
      body: registros.map(item => [item.cuenta, item.tipo, item.monto.toLocaleString()]),
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
                agruparPorTipo("Activo Circulante").length,
                agruparPorTipo("Pasivo Circulante").length,
                agruparPorTipo("Patrimonio Neto").length
              ) }).map((_, i) => (
                <tr key={`row-${i}`}>
                  <td>{agruparPorTipo("Activo Circulante")[i]?.cuenta || ''}</td>
                  <td>{agruparPorTipo("Activo Circulante")[i]?.monto?.toLocaleString() || ''}</td>
                  <td>{agruparPorTipo("Pasivo Circulante")[i]?.cuenta || ''}</td>
                  <td>{agruparPorTipo("Pasivo Circulante")[i]?.monto?.toLocaleString() || ''}</td>
                  <td>{agruparPorTipo("Patrimonio Neto")[i]?.cuenta || ''}</td>
                  <td>{agruparPorTipo("Patrimonio Neto")[i]?.monto?.toLocaleString() || ''}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total Activo Circulante</strong></td>
                <td>{totalPorTipo("Activo Circulante").toLocaleString()}</td>
                <td><strong>Total Pasivo Circulante</strong></td>
                <td>{totalPorTipo("Pasivo Circulante").toLocaleString()}</td>
                <td><strong>Total Patrimonio Neto</strong></td>
                <td>{totalPorTipo("Patrimonio Neto").toLocaleString()}</td>
              </tr>
              {agruparPorTipo("Activo No Circulante").map((r, i) => (
                <tr key={`anc-${i}`}>
                  <td>{r.cuenta}</td><td>{r.monto.toLocaleString()}</td>
                  <td colSpan="4"></td>
                </tr>
              ))}
              <tr>
                <td><strong>Total Activo No Circulante</strong></td>
                <td>{totalPorTipo("Activo No Circulante").toLocaleString()}</td>
                <td colSpan="4"></td>
              </tr>
              <tr className="table-success">
                <td><strong>Total Activo</strong></td>
                <td><strong>{(totalPorTipo("Activo Circulante") + totalPorTipo("Activo No Circulante")).toLocaleString()}</strong></td>
                <td colSpan="4"></td>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <td><strong>Total Pasivo No Circulante</strong></td>
                <td>{totalPorTipo("Pasivo No Circulante").toLocaleString()}</td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-success">
                <td colSpan="4"></td>
                <td><strong>Total Pasivo y Patrimonio Neto</strong></td>
                <td><strong>{(totalPorTipo("Pasivo Circulante") + totalPorTipo("Pasivo No Circulante") + totalPorTipo("Patrimonio Neto")).toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BalanceGeneral;

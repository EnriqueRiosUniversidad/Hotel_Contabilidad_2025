import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const BalanceGeneral = () => {
  const [cuentas, setCuentas] = useState([]);
  const [periodoId, setPeriodoId] = useState(() => localStorage.getItem("periodoId") || "1");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    api
      .get(`/plancuentas/balance-general/tree/${periodoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCuentas(flattenCuentas(res.data)))
      .catch((err) => {
        console.error("Error al cargar el balance general:", err);
        alert("No se pudo cargar el balance general.");
      });
  }, [periodoId]);

  const flattenCuentas = (cuentas) => {
    const lista = [];
    const recorrer = (cuenta) => {
      lista.push(cuenta);
      if (cuenta.hijos) {
        cuenta.hijos.forEach((hijo) => recorrer(hijo));
      }
    };
    cuentas.forEach((cuenta) => recorrer(cuenta));
    return lista;
  };

  const format = (valor) => `Gs ${Number(valor || 0).toLocaleString("es-PY")}`;

  const totalActivo = cuentas.filter((c) => c.codigo?.startsWith("1")).reduce((acc, c) => acc + (c.saldo || 0), 0);
  const totalPasivoPatrimonio = cuentas.filter((c) => c.codigo?.startsWith("2") || c.codigo?.startsWith("3")).reduce((acc, c) => acc + (c.saldo || 0), 0);

  const dataGrafico = [
    { nombre: "Activo", monto: totalActivo },
    { nombre: "Pasivo + Patrimonio", monto: totalPasivoPatrimonio },
  ];

  const calcularTotalesPorGrupo = (codigoInicial) => {
    const grupo = cuentas.filter((c) => c.codigo?.startsWith(codigoInicial));
    return {
      debe: grupo.reduce((acc, c) => acc + (c.debe || 0), 0),
      haber: grupo.reduce((acc, c) => acc + (c.haber || 0), 0),
      saldo: grupo.reduce((acc, c) => acc + (c.saldo || 0), 0),
    };
  };

  const exportToExcel = () => {
    const data = cuentasOrdenadas.map((c) => ({
      Código: c.codigo,
      Nombre: c.nombre,
      Debe: c.debe,
      Haber: c.haber,
      Saldo: c.saldo,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Balance General");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `balance_general_${periodoId}.xlsx`);
  };

  const exportToXML = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Cuentas>\n';
    cuentasOrdenadas.forEach((cuenta) => {
      xml += `  <Cuenta>\n`;
      xml += `    <Codigo>${cuenta.codigo}</Codigo>\n`;
      xml += `    <Nombre>${cuenta.nombre}</Nombre>\n`;
      xml += `    <Debe>${cuenta.debe}</Debe>\n`;
      xml += `    <Haber>${cuenta.haber}</Haber>\n`;
      xml += `    <Saldo>${cuenta.saldo}</Saldo>\n`;
      xml += `  </Cuenta>\n`;
    });
    xml += `</Cuentas>`;

    const blob = new Blob([xml], { type: "application/xml" });
    saveAs(blob, `balance_general_${periodoId}.xml`);
  };

  const totalGrupo1 = calcularTotalesPorGrupo("1");
  const totalGrupo2 = calcularTotalesPorGrupo("2");
  const totalGrupo3 = calcularTotalesPorGrupo("3");

  const cuentasOrdenadas = [...cuentas].sort((a, b) => a.codigo.localeCompare(b.codigo));

  return (
    <div className="d-flex">
      <Navbar />
      <div className="container-fluid py-3" style={{ marginLeft: "270px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-success fw-bold">Balance General</h2>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "excel") exportToExcel();
                if (value === "xml") exportToXML();
                e.target.selectedIndex = 0;
              }}
            >
              <option value="">Exportar</option>
              <option value="excel">Excel</option>
              <option value="xml">XML</option>
            </select>
            <label htmlFor="periodo" className="fw-bold ms-2">Período:</label>
            <select
              id="periodo"
              className="form-select form-select-sm"
              value={periodoId}
              onChange={(e) => {
                setPeriodoId(e.target.value);
                localStorage.setItem("periodoId", e.target.value);
              }}
            >
              <option value="1">2025</option>
              <option value="2">2026</option>
            </select>
          </div>
        </div>

        {/* Tabla principal */}
        <div className="bg-white rounded shadow-sm p-3 border border-success mb-4">
          <table className="table table-bordered table-hover">
            <thead className="table-success text-center">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th className="text-end">Debe</th>
                <th className="text-end">Haber</th>
                <th className="text-end">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {cuentasOrdenadas.map((cuenta) => (
                <tr key={cuenta.codigo}>
                  <td className="text-monospace">{cuenta.codigo}</td>
                  <td>{cuenta.nombre}</td>
                  <td className="text-end text-monospace">{format(cuenta.debe)}</td>
                  <td className="text-end text-monospace">{format(cuenta.haber)}</td>
                  <td className="text-end text-monospace">{format(cuenta.saldo)}</td>
                </tr>
              ))}
              <tr className="table-success fw-bold">
                <td colSpan="2">Total Activo</td>
                <td className="text-end text-monospace">{format(totalGrupo1.debe)}</td>
                <td className="text-end text-monospace">{format(totalGrupo1.haber)}</td>
                <td className="text-end text-monospace">{format(totalGrupo1.saldo)}</td>
              </tr>
              <tr className="table-success fw-bold">
                <td colSpan="2">Total Pasivo</td>
                <td className="text-end text-monospace">{format(totalGrupo2.debe)}</td>
                <td className="text-end text-monospace">{format(totalGrupo2.haber)}</td>
                <td className="text-end text-monospace">{format(totalGrupo2.saldo)}</td>
              </tr>
              <tr className="table-success fw-bold">
                <td colSpan="2">Total Patrimonio Neto</td>
                <td className="text-end text-monospace">{format(totalGrupo3.debe)}</td>
                <td className="text-end text-monospace">{format(totalGrupo3.haber)}</td>
                <td className="text-end text-monospace">{format(totalGrupo3.saldo)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabla resumen final */}
        <div className="bg-white rounded shadow-sm p-3 border border-dark mb-4">
          <h5 className="text-center fw-bold text-success mb-3">Resumen Total por Grupo</h5>
          <table className="table table-bordered text-center">
            <thead className="table-success">
              <tr>
                <th>Total Activo</th>
                <th>Total Pasivo</th>
                <th>Total Patrimonio Neto</th>
                <th>Total General</th>
              </tr>
            </thead>
            <tbody>
              <tr className="fw-bold">
                <td className="text-end text-monospace">{format(totalGrupo1.saldo)}</td>
                <td className="text-end text-monospace">{format(totalGrupo2.saldo)}</td>
                <td className="text-end text-monospace">{format(totalGrupo3.saldo)}</td>
                <td className="text-end text-monospace">
                  {format(totalGrupo1.saldo + totalGrupo2.saldo + totalGrupo3.saldo)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded shadow-sm p-3 border border-success d-flex justify-content-center">
          <div style={{ width: "500px" }}>
            <h5 className="text-center text-success mb-3">
              Comparación: Activo vs Pasivo + Patrimonio
            </h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip formatter={(value) => format(value)} />
                <Legend />
                <Bar dataKey="monto" fill="#198754" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceGeneral;

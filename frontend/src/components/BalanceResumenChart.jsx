import { useEffect, useState } from "react";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BalanceResumenChart = () => {
  const [registros, setRegistros] = useState([]);
  const periodoId = localStorage.getItem("periodoId");
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    api.get(`/plancuentas/balance-general/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setRegistros(res.data))
      .catch((err) => console.error("Error al cargar balance resumen:", err));
  }, [periodoId]);

  const totalPorTipo = (tipo) =>
    registros.filter((r) => r.tipo === tipo).reduce((acc, r) => acc + r.monto, 0);

  const data = [
    { nombre: 'Activo', monto: totalPorTipo("ACTIVO") },
    { nombre: 'Pasivo', monto: totalPorTipo("PASIVO") },
    { nombre: 'Patrimonio Neto', monto: totalPorTipo("PATRIMONIO") },
  ];

return (
  <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>
    <h6 className="text-center">Balance General</h6>
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 100, left: 50, bottom: 8 }} // <-- Aumentado left
      >
        <CartesianGrid strokeDasharray="10 8" />
        <XAxis dataKey="nombre" />
        <YAxis tickFormatter={(v) => v.toLocaleString()} />
        <Tooltip formatter={(v) => `${v.toLocaleString()} Gs`} />
        <Legend />
        <Bar dataKey="monto" fill="#158550" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
};

export default BalanceResumenChart;

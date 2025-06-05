// src/components/PieChartBalance.jsx
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../api/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartBalance = () => {
  const [totalDebe, setTotalDebe] = useState(0);
  const [totalHaber, setTotalHaber] = useState(0);
  const periodoId = localStorage.getItem("periodoId");
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    api.get(`/libro-mayor/balance-sumas-saldos/${periodoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const data = res.data || [];
      const debe = data.reduce((sum, r) => sum + (r.debe || 0), 0);
      const haber = data.reduce((sum, r) => sum + (r.haber || 0), 0);
      setTotalDebe(debe);
      setTotalHaber(haber);
    }).catch((err) => {
      console.error("Error al cargar el balance:", err);
    });
  }, [periodoId]);

  const pieData = {
    labels: ["Debe", "Haber"],
    datasets: [
      {
        label: "Distribución",
        data: [totalDebe, totalHaber],
        backgroundColor: ["#84c68f", "#5680e9"],
        borderColor: ["#4CAF50", "#3f51b5"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h5 className="text-center fw-bold">Distribución Debe vs Haber</h5>
      <Pie data={pieData} />
    </div>
  );
};

export default PieChartBalance;

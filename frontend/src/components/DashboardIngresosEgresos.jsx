import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardIngresosEgresos = () => {
  const ingresos = 282500000;
  const egresos = 70000000;

  const data = {
    labels: ["Ingresos", "Egresos"],
    datasets: [
      {
        data: [ingresos, egresos],
        backgroundColor: ["#198754", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 16,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="card p-4 shadow-sm mb-4 border-success" style={{ maxWidth: "500px" }}>
      <h6 className="text-center mb-3 text-success">Ingresos vs Egresos (últimos 7 días) </h6>
      <div style={{ height: "280px", width: "400px", margin: "0 auto" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardIngresosEgresos;
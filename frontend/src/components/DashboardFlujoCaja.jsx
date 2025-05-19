import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardFlujoCaja = () => {
  const labels = ["1", "2", "3", "4", "5", "6", "7"];
  const data = {
    labels,
    datasets: [
      {
        label: "Flujo neto (₲)",
        data: [2000000, 3500000, -1500000, 1000000, -500000, 2200000, 0],
        backgroundColor: "#0d6efd",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return value >= 0 ? `₲ ${value / 1000000}M` : `₲ -${Math.abs(value / 1000000)}M`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="card p-3 shadow-sm border-primary" style={{ width: "480px", height: "360px" }}>
      <h6 className="text-center text-primary">Balance de Resultado (últimos 7 días)</h6>
      <div style={{ height: "500px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardFlujoCaja;
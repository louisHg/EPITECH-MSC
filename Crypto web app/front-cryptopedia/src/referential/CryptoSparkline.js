import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
  elements: {
    point: {
      radius: 0,
    },
    chartArea: {
      backgroundColor: "#1A2421",
    },
  },
};

export default function CryptoSparkline({ sparkline, variation }) {
  const newData = sparkline.filter((value, index) => {
    if (index % 4 == 0) return value;
  });
  const data = {
    labels: Array.from({ length: newData.length }, (value, index) => index),
    datasets: [
      {
        label: "Dataset 1",
        data: sparkline,
        borderColor: variation > 0 ? "#22c55e" : "#dc2626",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div
      className="chart-sparkline"
      style={{
        width: "180px",
        height: "60px",
      }}
    >
      <Line options={options} data={data} />
    </div>
  );
}

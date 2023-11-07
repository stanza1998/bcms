import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "",
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Revenue",
      data: [
        3300, 24000, 2345, 2000, 20000, 18000, 9000, 19000, 18500, 10000, 75000,
        4000,
      ],
      backgroundColor: "#01aced",
    },
  ],
};

export function NormalLineGraph() {
  return (
    <div style={{ width: "100%" }}>
      <Bar options={options} data={data} />
    </div>
  );
}

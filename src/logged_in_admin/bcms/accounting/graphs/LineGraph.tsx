import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
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
  Filler,
  Legend
);

export const options = {
  responsive: true,
  with: 400,
  maintainAspectRatio: false,
  innerHeight: 800,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Revenue Trend",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: "Revenue",
      data: [
        220, 210, 212, 213, 233, 244, 230, 221, 231, 243, 233, 220, 200, 201,
      ],
      borderColor: "#01aced",
      backgroundColor: "#000c37",
    },
  ],
};

export function NormalLineGraph() {
  return (

      <Line options={options} data={data} />

  );
}

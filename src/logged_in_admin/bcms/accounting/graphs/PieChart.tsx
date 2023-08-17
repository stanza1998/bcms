import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Paid", "Pending", "Overdue"],
  datasets: [
    {
      label: "Distribution of invoices by status (paid, pending, overdue)",
      data: [212, 119, 103],
      backgroundColor: ["#000c37", "#01aced", "red"],
      borderColor: ["#fff", "#fff", "#fff"],
      borderWidth: 1,
    },
  ],
};

export function PieChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // This prevents the chart from maintaining a specific aspect ratio
    // Set the height of the chart
  };
  return <Pie data={data} options={options} width={400} height={400} />;
}

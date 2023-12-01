import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IProps {
  closed: number;
  opened: number;
  completed: number;
}

export const MaintenananceRequestChart = ({
  closed,
  opened,
  completed,
}: IProps) => {
  const data = {
    labels: ["Closed", "Opened", "Completed"],
    datasets: [
      {
        label: "Maintenance Request Status Chart",
        data: [closed, opened, completed],
        backgroundColor: ["grey", "blue", "green"],
        borderColor: ["white", "white", "white"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <Pie data={data} />;
    </>
  );
};

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IProps {
  low: number;
  medium: number;
  high: number;
}

export const AnnouncementDistribution = ({ low, medium, high }: IProps) => {
  const data = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Notices priority level distribution chart",
        data: [low, medium, high],
        backgroundColor: ["yellow", "blue", "red"],
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

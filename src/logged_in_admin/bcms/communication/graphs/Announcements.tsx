import React, { useEffect } from "react";
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
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const AnnouncementGraph = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.communication.announcement.getAll(me.property, "");
      }
    };
    getData();
  }, [api.communication.announcement, me?.property]);

  const low = store.communication.announcements.all.filter(
    (a) => a.asJson.priorityLevel === "LOW"
  ).length;
  const medium = store.communication.announcements.all.filter(
    (a) => a.asJson.priorityLevel === "MEDIUM"
  ).length;
  const high = store.communication.announcements.all.filter(
    (a) => a.asJson.priorityLevel === "HIGH"
  ).length;

  const options = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Announcement Priority Level Measures",
      },
    },
  };

  const labels = [""];

  const data = {
    labels,
    datasets: [
      {
        label: "LOW",
        data: [low],
        borderColor: "yellow",
        backgroundColor: "yellow",
      },
      {
        label: "MEDIUM",
        data: [medium],
        borderColor: "blue",
        backgroundColor: "blue",
      },
      {
        label: "HIGH",
        data: [high],
        borderColor: "red",
        backgroundColor: "red",
      },
    ],
  };

  return <Bar options={options} data={data} />;
});

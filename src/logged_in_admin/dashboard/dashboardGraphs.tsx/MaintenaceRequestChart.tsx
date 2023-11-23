import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useAppContext } from "../../../shared/functions/Context";

ChartJS.register(ArcElement, Tooltip, Legend);

export const MaintenananceRequestChart = () => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;

  const closed = store.maintenance.maintenance_request.all.filter(
    (a) => a.asJson.status === "Closed"
  ).length;
  const opened = store.maintenance.maintenance_request.all.filter(
    (a) => a.asJson.status === "Opened"
  ).length;
  const completed = store.maintenance.maintenance_request.all.filter(
    (a) => a.asJson.status === "Completed"
  ).length;

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        // await api.communication.announcement.getAll(me.property, "");
        await api.maintenance.maintenance_request.getAll(me.property);
      }
    };
    getData();
  }, [
    api.communication.announcement,
    api.maintenance.maintenance_request,
    me?.property,
  ]);

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

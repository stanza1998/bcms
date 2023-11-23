import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";

ChartJS.register(ArcElement, Tooltip, Legend);

export const AnnouncementDistribution = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;

  const low = store.communication.announcements.all.filter(
    (a) => a.asJson.priorityLevel === "LOW"
  ).length;
  const medium = store.communication.announcements.all.filter(
    (a) => a.asJson.priorityLevel === "MEDIUM"
  ).length;
  const high = store.communication.announcements.all.filter(
    (a) => a.asJson.priorityLevel === "HIGH"
  ).length;

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.communication.announcement.getAll(me.property, "");
        // await api.maintenance.maintenance_request.getAll(me.property);
      }
    };
    getData();
  }, [
    api.communication.announcement,
    api.maintenance.maintenance_request,
    me?.property,
  ]);

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
});

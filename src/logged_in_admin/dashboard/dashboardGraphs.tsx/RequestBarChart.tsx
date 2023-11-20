import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "../../../shared/functions/Context";

const COLORS = ["grey", "blue", "green"];

const RequestBarChat = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;

  const closed = store.maintenance.maintenance_request.all.filter(
    (r) => r.asJson.status === "Closed"
  ).length;
  const opened = store.maintenance.maintenance_request.all.filter(
    (r) => r.asJson.status === "Opened"
  ).length;
  const completed = store.maintenance.maintenance_request.all.filter(
    (r) => r.asJson.status === "Completed"
  ).length;

  const data = [
    {
      name: "Jan",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Feb",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Mar",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Apr",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "May",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Jun",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Jul",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Aug",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Sep",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Oct",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Nov",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
    {
      name: "Descember",
      Closed: closed,
      Opened: opened,
      Complete: completed,
    },
  ];

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.maintenance.maintenance_request.getAll(me.property);
      }
    };
    getData();
  }, [api.maintenance.maintenance_request, me?.property]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart width={800} height={400} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Bar dataKey="Closed" fill={COLORS[0]} />
        <Bar dataKey="Opened" fill={COLORS[1]} />
        <Bar dataKey="Complete" fill={COLORS[2]} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export default RequestBarChat;

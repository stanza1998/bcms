import React, { PureComponent } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Opened",
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: "Pending",
    uv: 868,
    pv: 967,
    amt: 1506,
  },
  {
    name: "In-Progress",
    uv: 1397,
    pv: 1098,
    amt: 989,
  },
  {
    name: "Closed",
    uv: 1480,
    pv: 1200,
    amt: 1228,
  },
];

export default class RequestBarChat extends PureComponent {
  static demoUrl = "https://codesandbox.io/s/vertical-composed-chart-w6fni";

  render() {
    return (
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart
          layout="vertical"
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
          barCategoryGap={3}
          barGap={3}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" scale="band" interval={0} />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" barSize={20} fill="#000c37" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

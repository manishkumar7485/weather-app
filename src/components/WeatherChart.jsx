/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./WeatherChart.css";

const chartOptions = {
  temperature: {
    title: "🌡 Temperature Trend",
    key: "temperature",
    color: "#ff6b6b",
    unit: "°C",
  },
  humidity: {
    title: "💧 Humidity",
    key: "humidity",
    color: "#4dabf7",
    unit: "%",
  },
  windSpeed: {
    title: "💨 Wind Speed",
    key: "windSpeed",
    color: "#51cf66",
    unit: "m/s",
  },
  rainChance: {
    title: "🌧 Rain Chance",
    key: "rainChance",
    color: "#845ef7",
    unit: "%",
  },
};

const WeatherChart = ({ data = [] }) => {
  const [selected, setSelected] = useState("temperature");

  if (!data.length) return null;

  const current = chartOptions[selected];

  return (
    <div className="weather-chart glass">
      <div className="chart-header">
        <h2>{current.title}</h2>

        <div className="chart-tabs">
          {Object.keys(chartOptions).map((key) => (
            <button
              key={key}
              className={selected === key ? "active" : ""}
              onClick={() => setSelected(key)}
            >
              {chartOptions[key].title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradient">
              <stop offset="5%" stopColor={current.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={current.color} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" opacity={0.2} />

          <XAxis
            dataKey="time"
            tick={{ fill: "#fff" }}
          />

          <YAxis
            tick={{ fill: "#fff" }}
          />

          <Tooltip
            formatter={(value) => [`${value} ${current.unit}`, current.title]}
          />

          <Area
            type="monotone"
            dataKey={current.key}
            stroke={current.color}
            fill="url(#gradient)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
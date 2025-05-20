import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import ConfirmCreateOption from "./ConfirmCreateOption";

type OptionData = {
  option_price: number;
  strike_price: number;
  current_price: number;
  volatility: number;
  prices: [number, number][]; // [timestamp, price]
};

type PricePoint = {
  time: string;
  price: number;
};

type OptionsDataViewerProps = {
  data: OptionData;
  formData: any
};

type MetricProps = {
  label: string;
  value: number;
  large?: boolean;
};

const formatTimestamp = (ts: number): string => {
  const date = new Date(ts);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
};

const formatNumber = (n: number): string => {
  return parseFloat(n.toString()).toExponential(3);
};

const Metric: React.FC<MetricProps> = ({ label, value, large }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-400">{label}</span>
    <span className={`font-mono ${large ? "text-2xl" : "text-xl"} text-white`}>
      {formatNumber(value)}
    </span>
  </div>
);

const OptionsDataViewer: React.FC<OptionsDataViewerProps> = ({ data, formData }) => {
  const { option_price, strike_price, current_price, volatility, prices } = data;

  const priceData: PricePoint[] = prices.map(([timestamp, price]) => ({
    time: formatTimestamp(timestamp),
    price,
  }));

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-2xl shadow-xl space-y-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-white">Options Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Metric label="Option Price" value={option_price} large />
        <Metric label="Strike Price" value={strike_price} />
        <Metric label="Current Price" value={current_price} large />
        <Metric label="Volatility" value={volatility} />
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <CartesianGrid stroke="#444" strokeDasharray="5 5" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" tickFormatter={(v: number) => v.toExponential(2)} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", borderColor: "#555" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value: number) => value.toExponential(6)}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4ade80"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-[40vh] overflow-scroll">
        <pre className="mt-4 bg-gray-800 p-3 rounded text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      <ConfirmCreateOption formData={formData} optionData={data} />
    </div>

  );
};

export default OptionsDataViewer;

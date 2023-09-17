import {
  Cell,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import BasicSection from "@/components/sections/BasicSection";

const data = [
  {
    name: "Jan",
    total: 8000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 2000,
  },
];
const COLORS = ["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900"];
const getColorByIdx = (idx: number) => COLORS[idx % COLORS.length];

export const ProductSellChart = () => {
  return (
    <BasicSection title="Sell Graph">
      <div>
        <ResponsiveContainer
          width="100%"
          aspect={16 / 9}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke="#000000"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#000000"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `৳ ${value}`}
            />
            <Bar
              dataKey="total"
              fill="#2f02ef"
              radius={[4, 4, 0, 0]}>
              {data.map((_, entryIdx) => {
                return (
                  <Cell
                    key={entryIdx}
                    fill={getColorByIdx(entryIdx)}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BasicSection>
  );
};

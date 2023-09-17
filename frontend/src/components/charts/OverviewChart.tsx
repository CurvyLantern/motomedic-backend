import { Center, SimpleGrid } from "@mantine/core";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Legend,
  Line,
} from "recharts";
import { format, eachMonthOfInterval, subYears } from "date-fns";
import BasicSection from "@/components/sections/BasicSection";

function getDateOfPast(yearsAgo: number) {
  const currentDate = new Date();
  const pastDate = subYears(currentDate, yearsAgo);
  return pastDate;
}
const allMonths = eachMonthOfInterval({
  end: new Date(),
  start: getDateOfPast(2),
}).map((date) => format(date, "MMMM-yyyy"));

const allSaleData = allMonths.map((date) => ({
  date: date,
  sold: Math.floor(Math.random() * 30000) + 20000,
  profit: Math.floor(Math.random() * 10000) + 30000,
}));

// const gradientOffset = () => {
//   const dataMax = Math.max(...allSaleData.map((i) => i.sold));
//   const dataMin = Math.min(...allSaleData.map((i) => i.sold));

//   if (dataMax <= 0) {
//     return 0;
//   }
//   if (dataMin >= 0) {
//     return 1;
//   }

//   return dataMax / (dataMax - dataMin);
// };

// const off = gradientOffset();

export const OverviewChart = () => {
  return (
    <BasicSection title="Company Overview">
      <SimpleGrid
        cols={1}
        style={{ position: "relative" }}>
        <Center>
          <ResponsiveContainer
            width="95%"
            aspect={16 / 9}
            minHeight={"300px"}>
            <LineChart
              style={{
                overflow: "visible",
              }}
              data={allSaleData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                height={110}
                angle={-60}
                textAnchor="end"
                dataKey="date"
                fontSize={12}
                fontWeight={600}
              />
              <YAxis
                dataKey="sold"
                fontSize={14}
                fontWeight={600}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sold"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </Center>
        <Center>
          <ResponsiveContainer
            width="95%"
            aspect={16 / 9}>
            <AreaChart
              style={{
                overflow: "visible",
              }}
              data={allSaleData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                height={150}
                angle={-60}
                textAnchor="end"
                dataKey="date"
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="sold"
                fill="#ff00ee"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#82ca9d"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Center>
      </SimpleGrid>

      {/* <ResponsiveContainer width="100%" aspect={16 / 9}>
                <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <defs>
                        <linearGradient
                            id="splitColor"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset={off}
                                stopColor="green"
                                stopOpacity={1}
                            />
                            <stop
                                offset={off}
                                stopColor="red"
                                stopOpacity={1}
                            />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="uv"
                        stroke="#000"
                        fill="url(#splitColor)"
                    />
                </AreaChart>
            </ResponsiveContainer> */}
    </BasicSection>
  );
};

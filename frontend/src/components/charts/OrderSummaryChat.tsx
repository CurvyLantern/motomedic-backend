import BasicSection from "@/components/sections/BasicSection";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Select, Stack, Text, Group, Table } from "@mantine/core";

// const data = [
//     { name: "Group A", total: 400 },
//     { name: "Group B", total: 300 },
//     { name: "Group C", total: 300 },
//     { name: "Group D", total: 200 },
// ];

const data = {
    7: [
        {
            name: "completed",
            total: 80,
        },
        {
            name: "cancelled",
            total: 10,
        },
        {
            name: "pending",
            total: 15,
        },
        {
            name: "refunded",
            total: 2,
        },
    ],
    30: [
        {
            name: "completed",
            total: 590,
        },
        {
            name: "cancelled",
            total: 30,
        },
        {
            name: "pending",
            total: 38,
        },
        {
            name: "refunded",
            total: 4,
        },
    ],
    365: [
        {
            name: "completed",
            total: 7000,
        },
        {
            name: "cancelled",
            total: 210,
        },
        {
            name: "pending",
            total: 450,
        },
        {
            name: "refunded",
            total: 150,
        },
    ],
};
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
type RenderCustomizedLabelProps = {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index?: number;
};
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: RenderCustomizedLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
const getColorByIdx = (idx: number) => COLORS[idx % COLORS.length];
export const OrderSummaryChart = () => {
    const [selectedRange, setSelectedRange] = useState<keyof typeof data>(7);
    const chartData = data[selectedRange];
    const totalValueCount = chartData.reduce((t, item) => t + item.total, 0);
    const ths = chartData.map((item, itemIdx) => {
        return (
            <th
                style={{
                    backgroundColor: getColorByIdx(itemIdx),
                    color: "white",
                }}
                key={itemIdx}
            >
                {item.name}
            </th>
        );
    });
    const tDatas = chartData.map((item, itemIdx) => {
        return <td key={itemIdx}>{item.total}</td>;
    });

    return (
        <BasicSection title="Order Summary">
            <div>
                <Select
                    onChange={(value) => {
                        const v = Number(value) as unknown as 7 | 30 | 365;
                        setSelectedRange(v);
                    }}
                    label="Select Range"
                    value={String(selectedRange)}
                    data={[
                        {
                            label: "Last 7 days",
                            value: "7",
                        },
                        {
                            label: "Last 1 month",
                            value: "30",
                        },
                        {
                            label: "Last 1 year",
                            value: "365",
                        },
                    ]}
                />
            </div>
            <div>
                <ResponsiveContainer width="100%" aspect={16 / 9}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius="80%"
                            fill="#8884d8"
                            dataKey="total"
                        >
                            {chartData.map((_, entryIdx) => (
                                <Cell
                                    key={`cell-${entryIdx}`}
                                    fill={getColorByIdx(entryIdx)}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <Table
                horizontalSpacing="xl"
                verticalSpacing="sm"
                highlightOnHover
                withBorder
                withColumnBorders
            >
                <thead>
                    <tr>
                        {ths}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {tDatas}
                        <td>{totalValueCount}</td>
                    </tr>
                </tbody>
            </Table>
            <Stack>
                <Text
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    Total : {totalValueCount}
                </Text>

                <Stack>
                    {chartData.map((item, itemIdx) => {
                        return (
                            <Group key={itemIdx} align="center">
                                <div
                                    style={{
                                        width: 10,
                                        height: 10,
                                        backgroundColor: getColorByIdx(itemIdx),
                                    }}
                                ></div>
                                <Text transform="capitalize">{item.name}</Text>

                                <p
                                    style={{
                                        marginLeft: "auto",
                                    }}
                                >
                                    {item.total}
                                </p>
                            </Group>
                        );
                    })}
                </Stack>
            </Stack>
        </BasicSection>
    );
};

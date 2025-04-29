"use client";

import { TrendingUp } from "lucide-react";
import {
  LabelList,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

// Define the data type to match user's data structure
export type JenisData = {
  jenis: string;
  total: string;
  totalINT: string;
  fill?: string;
};

// Define props interface
interface ChartPieProps {
  data: JenisData[];
  title?: string;
  description?: string;
  trendingValue?: number;
  footerText?: string;
  useTransformation?: boolean;
  minSize?: number;
}

const generateChartConfig = (data: JenisData[]): ChartConfig => {
  const config: Record<string, any> = {
    totalINT: {
      label: "Total",
    },
  };

  // Add jenis entries to config
  data.forEach((item, index) => {
    config[item.jenis] = {
      label: item.jenis,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
  });

  return config as ChartConfig;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-2 border rounded shadow-sm">
        <p className="font-bold">{data.jenis}</p>
        <p>Total: {parseInt(data.total).toLocaleString("id-ID")}</p>
        <p>Persentase: {data.percentage}</p>
      </div>
    );
  }
  return null;
};

export function PieChartComp({
  data,
  title,
  description = "Berdasarkan Total Harga",
  trendingValue,
  footerText = "Menampilkan total harga per jenis",
  useTransformation = true,
  minSize = 10,
}: ChartPieProps) {
  const chartConfig = useMemo(() => generateChartConfig(data), [data]);

  const processedData = useMemo(() => {
    // Calculate total sum for percentage
    const totalSum = data.reduce(
      (sum, item) => sum + Number.parseFloat(item.totalINT),
      0
    );

    return data.map((item, index) => {
      const value = Number.parseFloat(item.totalINT);
      const percentage = (value / totalSum) * 100;

      let transformedValue = value;
      if (useTransformation) {
        transformedValue = Math.sqrt(value);

        const maxValue = Math.max(
          ...data.map((d) => Number.parseFloat(d.totalINT))
        );
        const minValue = Math.max(value, (minSize / 100) * maxValue);
      }

      return {
        ...item,
        value: transformedValue, // Use transformed value for visualization
        actualValue: value, // Keep original value for tooltip
        percentage: percentage.toFixed(1) + "%",
        fill: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
  }, [data, useTransformation, minSize]);

  // Calculate if we should use outer labels based on data size

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={processedData}
                dataKey="value"
                nameKey="jenis"
                cx="50%"
                cy="50%"
                outerRadius={"80%"}
                className="overflow-visible"
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="percentage"
                  position="inside"
                  fill="#ffffff"
                  stroke="none"
                  className="font-medium text-lg "
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {trendingValue && (
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending {trendingValue > 0 ? "up" : "down"} by{" "}
            {Math.abs(trendingValue)}% this month{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}

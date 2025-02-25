import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { FaChartArea } from "react-icons/fa";

type RadialProps = {
  chartData: { month: string; desktop: number; mobile: number }[];
  title?: string;
  description?: string;
  timeframe?: string;
  showLegend?: boolean;
  percentageChange?: number;
  highlightColor?: string;
  animate?: boolean;
  maxValue?: number;
  showLabels?: boolean;
  customTooltip?: boolean;
};

const defaultChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Radial({
  chartData,
  title = "Radial Chart - Stacked",
  timeframe = "Showing total visitors for the last 6 months",
}: RadialProps) {
  const [alignLeft, setAlignLeft] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setAlignLeft(currentPath.endsWith("/"));
  }, []);

  const totalVisitors = chartData.reduce(
    (acc, data) => acc + data.desktop + data.mobile,
    0
  );

  return (
    <Card className="flex flex-col">
      <CardHeader
        className={`flex flex-row items-center ${
          alignLeft ? "justify-start" : "justify-center"
        }`}
      >
        <FaChartArea
          className={`${alignLeft ? "" : "hidden"} text-yellow-300 mr-1`}
        ></FaChartArea>
        <CardTitle
          className={` text-xl ${alignLeft ? "text-left" : "text-center"}`}
        >
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent
        className={`flex flex-1 pb-0 ${
          alignLeft
            ? "flex-row justify-between items-center"
            : "flex-col items-center"
        }`}
      >
        {alignLeft ? (
          <div className={`${alignLeft ? "text-left" : "text-center"} w-full`}>
            <div className="flex items-center gap-2 font-medium leading-none mb-3">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              {timeframe}
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <ChartContainer
          config={defaultChartConfig}
          className={`aspect-square w-full max-w-[250px] ${
            alignLeft ? "" : "mx-auto"
          }`}
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          dy="-10"
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          dy="20"
                          className="fill-muted-foreground text-sm"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="desktop"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-desktop)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mobile"
              fill="var(--color-mobile)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      {alignLeft ? (
        <div></div>
      ) : (
        <CardFooter className="flex-col gap-2 text-sm text-center">
          <div className="flex items-center justify-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">{timeframe}</div>
        </CardFooter>
      )}
    </Card>
  );
}

export default Radial;

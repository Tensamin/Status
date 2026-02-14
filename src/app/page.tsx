"use client";

// Package Imports
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Components
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Types
type Check = {
  t: string;
  ok: boolean;
  code: number;
  rt: number;
};

type Data = {
  id: string;
  name: string;
  url: string;
  checks: Check[];
};

// Main
const chartConfig = {
  responseTime: {
    label: "Response Time (ms)",
    color: "var(--chart-1)",
  },
  online: {
    label: "Online",
    color: "var(--chart-2)",
  },
  offline: {
    label: "Offline",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type Site = {
  id: string;
  name: string;
  url: string;
};

const baseUrl =
  "https://raw.githubusercontent.com/Tensamin/tensamin.github.io/refs/heads/main/data";

import sites from "../../sites.json";

export default function Home() {
  const [siteData, setSiteData] = useState<Record<string, Data>>({});

  useEffect(() => {
    (sites as Site[]).forEach((site) => {
      fetch(`${baseUrl}/${site.id}.json`)
        .then((response) => response.json())
        .then((data: Data) =>
          setSiteData((prev) => ({ ...prev, [site.id]: data })),
        );
    });

    // Reload every 10 minutes
    setTimeout(() => {
      window.location.reload();
    }, 600000);
  }, []);

  return (
    <div className="flex flex-col gap-15 p-15">
      <p className="text-4xl font-bold">Tensamin Status</p>
      <div className="flex flex-col gap-5 w-full">
        {(sites as Site[]).map((site) => {
          const data = siteData[site.id];
          return (
            data && (
              <Chart
                key={site.id}
                checks={data.checks}
                url={site.url}
                title={site.name}
              />
            )
          );
        })}
      </div>
    </div>
  );
}

function Chart({
  checks,
  url,
  title,
}: {
  checks: Check[];
  url: string;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-50 w-full">
          <AreaChart accessibilityLayer data={checks}>
            <CartesianGrid vertical={false} />
            <XAxis
              name="Time"
              dataKey="t"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "UTC",
                }).format(new Date(value));
              }}
            />
            <YAxis
              name="Response Time"
              dataKey="rt"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value + "ms"}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => {
                    return new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "UTC",
                    }).format(new Date(value));
                  }}
                />
              }
            />
            <Area
              name="Response"
              dataKey="rt"
              type="natural"
              fill="var(--chart-2)"
              fillOpacity={0.4}
              stroke="var(--chart-2)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <a href={url} className="underline text-xs font-light">
          {url}
        </a>
      </CardFooter>
    </Card>
  );
}

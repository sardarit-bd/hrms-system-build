"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { CalendarDays } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartConfig } from "@/lib/dashboard-utils";
import { motion } from "framer-motion";

export function LeaveStatusChart({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1"
    >
      <Card className="h-full border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
            <CalendarDays size={18} className="text-muted-foreground" />
            Leave Request Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={chartConfig.margin}>
                  <defs>
                    <linearGradient id="colorLeave" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...chartConfig.gridProps} />
                  <XAxis dataKey="name" {...chartConfig.axisProps} />
                  <YAxis {...chartConfig.axisProps} />
                  <Tooltip {...chartConfig.tooltipProps} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--chart-1)"
                    fillOpacity={1}
                    fill="url(#colorLeave)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No leave data available" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

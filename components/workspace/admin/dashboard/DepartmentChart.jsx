"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartConfig } from "@/lib/dashboard-utils";
import { motion } from "framer-motion";

export function DepartmentChart({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1"
    >
      <Card className="h-full border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
            <BarChart3 size={18} className="text-muted-foreground" />
            Employees by Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={chartConfig.margin}>
                  <CartesianGrid {...chartConfig.gridProps} />
                  <XAxis dataKey="name" {...chartConfig.axisProps} dy={10} />
                  <YAxis
                    {...chartConfig.axisProps}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip {...chartConfig.tooltipProps} />
                  <Bar
                    dataKey="employees"
                    radius={[6, 6, 0, 0]}
                    animationDuration={chartConfig.animationDuration}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No department data available" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

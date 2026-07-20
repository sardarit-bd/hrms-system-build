"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const mockGrowthData = [
  { month: "Jan", employees: 45, newHires: 8 },
  { month: "Feb", employees: 52, newHires: 7 },
  { month: "Mar", employees: 58, newHires: 6 },
  { month: "Apr", employees: 65, newHires: 7 },
  { month: "May", employees: 71, newHires: 6 },
  { month: "Jun", employees: 78, newHires: 7 },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border/50 rounded-lg shadow-lg p-3 space-y-2">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {entry.name}:
            </span>
            <span className="text-xs font-bold text-foreground">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function EmployeeGrowthChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 min-w-[300px]"
    >
      <Card className="border-border/50 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <TrendingUp size={18} className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Employee Growth Trend
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monthly workforce analytics
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Last 6 Months
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockGrowthData}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="colorEmployees"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorNewHires"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                  className="opacity-50"
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground ml-1">
                      {value}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="employees"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  fill="url(#colorEmployees)"
                  name="Total Employees"
                  animationDuration={2000}
                />
                <Area
                  type="monotone"
                  dataKey="newHires"
                  stroke="var(--chart-2)"
                  strokeWidth={2.5}
                  fill="url(#colorNewHires)"
                  name="New Hires"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">
                Overall Growth Rate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[var(--chart-2)]">
                +73%
              </span>
              <TrendingUp size={16} className="text-[var(--chart-2)]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

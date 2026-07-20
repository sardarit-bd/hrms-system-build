"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const departmentData = [
  {
    name: "Engineering",
    value: 85,
    fill: "var(--chart-1)",
    employees: 42,
    color: "bg-[var(--chart-1)]",
  },
  {
    name: "Sales",
    value: 72,
    fill: "var(--chart-2)",
    employees: 28,
    color: "bg-[var(--chart-2)]",
  },
  {
    name: "Marketing",
    value: 65,
    fill: "var(--chart-3)",
    employees: 18,
    color: "bg-[var(--chart-3)]",
  },
  {
    name: "HR",
    value: 58,
    fill: "var(--chart-4)",
    employees: 12,
    color: "bg-[var(--chart-4)]",
  },
  {
    name: "Finance",
    value: 45,
    fill: "var(--chart-5)",
    employees: 15,
    color: "bg-[var(--chart-5)]",
  },
];

// Custom Legend Component
const CustomLegend = () => {
  return (
    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border/50">
      {departmentData.map((dept, index) => (
        <motion.div
          key={dept.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2 flex-1 min-w-[140px] p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className={`w-3 h-3 rounded-full ${dept.color}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {dept.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {dept.employees} employees
            </p>
          </div>
          <Badge variant="secondary" className="text-xs font-bold">
            {dept.value}%
          </Badge>
        </motion.div>
      ))}
    </div>
  );
};

export function DepartmentRadialChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex-1 min-w-[300px]"
    >
      <Card className="border-border/50 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20">
                <Building2 size={18} className="text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Department Distribution
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Workforce by department
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="85%"
                data={departmentData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: "var(--muted)" }}
                  dataKey="value"
                  cornerRadius={10}
                  animationDuration={1500}
                  stroke="none"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <CustomLegend />
        </CardContent>
      </Card>
    </motion.div>
  );
}

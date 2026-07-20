"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CountUpText } from "./CountUpText";

const quickStats = [
  {
    label: "New This Month",
    value: 24,
    prefix: "+",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Active Projects",
    value: 18,
    prefix: "",
    color: "text-[var(--chart-2)]",
    bgColor: "bg-[var(--chart-2)]/10",
  },
  {
    label: "Tasks Completed",
    value: 156,
    prefix: "",
    color: "text-[var(--chart-3)]",
    bgColor: "bg-[var(--chart-3)]/10",
  },
  {
    label: "Pending Reviews",
    value: 12,
    prefix: "",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
];

export function QuickStats() {
  return (
    <div className="flex flex-wrap gap-3">
      {quickStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="flex-1 min-w-[150px]"
        >
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} mb-3`}>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${stat.color}`}>
                    {stat.prefix}
                  </span>
                  <CountUpText
                    value={stat.value}
                    duration={2000}
                    className={stat.color}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

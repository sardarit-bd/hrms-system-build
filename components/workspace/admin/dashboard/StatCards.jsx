"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const STAT_CONFIG = [
  {
    key: "unreadNotifications",
    title: "Unread Notifications",
    icon: Bell,
    color: "var(--chart-1)",
    bgColor: "color-mix(in srgb, var(--chart-1) 15%, transparent)",
  },
  {
    key: "activePolicies",
    title: "Active Policies",
    icon: Clock,
    color: "var(--chart-2)",
    bgColor: "color-mix(in srgb, var(--chart-2) 15%, transparent)",
  },
  {
    key: "monthlyPayroll",
    title: "This Month Payroll",
    icon: DollarSign,
    color: "var(--chart-3)",
    bgColor: "color-mix(in srgb, var(--chart-3) 15%, transparent)",
    format: (value) => `$${value.toLocaleString()}`,
  },
];

export function StatCards({ statsData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-wrap gap-4"
    >
      {STAT_CONFIG.map((stat) => {
        const Icon = stat.icon;
        const value = statsData?.[stat.key] || 0;
        const displayValue = stat.format ? stat.format(value) : value;

        return (
          <Card
            key={stat.key}
            className="flex-1 min-w-[240px] border-border/50"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {displayValue}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </motion.div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { CountUpText } from "./CountUpText";

const attendanceStats = [
  {
    label: "Present Today",
    value: 142,
    icon: CheckCircle2,
    textColor: "text-[var(--chart-2)]",
    bgColor: "bg-[var(--chart-2)]/10",
    barColor: "bg-[var(--chart-2)]",
    percentage: 85,
  },
  {
    label: "On Leave",
    value: 18,
    icon: XCircle,
    textColor: "text-destructive",
    bgColor: "bg-destructive/10",
    barColor: "bg-destructive",
    percentage: 11,
  },
  {
    label: "Late Arrival",
    value: 7,
    icon: AlertCircle,
    textColor: "text-[var(--chart-3)]",
    bgColor: "bg-[var(--chart-3)]/10",
    barColor: "bg-[var(--chart-3)]",
    percentage: 4,
  },
];

export function AttendanceOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock size={16} className="text-primary" />
            </div>
            Today's Attendance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {attendanceStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-1 p-4 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon size={18} className={stat.textColor} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {stat.percentage}%
                    </span>
                  </div>
                  <div className="mb-2">
                    <CountUpText
                      value={stat.value}
                      suffix=""
                      duration={1500}
                      className={stat.textColor}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${stat.barColor}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

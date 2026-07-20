"use client";

import { Card, CardContent } from "../../../ui/card";
import { motion } from "framer-motion";
import { CountUpText } from "@/components/workspace/admin/dashboard/CountUpText";

export function KpiCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendValue,
  rawValue,
}) {
  const colorConfig = {
    blue: {
      bg: "var(--info)",
      bgLight: "var(--info)",
      text: "var(--info-foreground)",
      border: "var(--info)",
    },
    green: {
      bg: "var(--success)",
      bgLight: "var(--success)",
      text: "var(--success-foreground)",
      border: "var(--success)",
    },
    purple: {
      bg: "var(--chart-2)",
      bgLight: "var(--chart-2)",
      text: "var(--sidebar-primary-foreground)",
      border: "var(--chart-2)",
    },
    cyan: {
      bg: "var(--chart-4)",
      bgLight: "var(--chart-4)",
      text: "var(--sidebar-primary-foreground)",
      border: "var(--chart-4)",
    },
    orange: {
      bg: "var(--warning)",
      bgLight: "var(--warning)",
      text: "var(--warning-foreground)",
      border: "var(--warning)",
    },
    emerald: {
      bg: "var(--success)",
      bgLight: "var(--success)",
      text: "var(--success-foreground)",
      border: "var(--success)",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  const numericValue = (() => {
    if (rawValue !== undefined) return rawValue;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const extracted = parseInt(value.replace(/[^0-9]/g, ""));
      return extracted || 0;
    }
    return 0;
  })();

  const { prefix, suffix } = (() => {
    if (typeof value === "string") {
      return {
        prefix: value.match(/^\D+/)?.[0] || "",
        suffix: value.match(/\D+$/)?.[0] || "",
      };
    }
    return { prefix: "", suffix: "" };
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="h-full border-border/50 bg-card hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <motion.div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: `${config.bg}15`,
                  border: `1px solid ${config.bg}30`,
                }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={22} style={{ color: config.bg }} />
              </motion.div>

              {trend && (
                <motion.div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor:
                      trend === "up" ? `${config.bg}15` : `${config.border}15`,
                    color:
                      trend === "up" ? config.bg : "var(--muted-foreground)",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span>{trend === "up" ? "↑" : "↓"}</span>
                  <span>{trendValue}%</span>
                </motion.div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-3xl font-bold text-foreground tracking-tight">
                {prefix && <span className="text-2xl">{prefix}</span>}
                <CountUpText value={numericValue} duration={2000} />
                {suffix && <span className="text-2xl">{suffix}</span>}
              </p>
            </motion.div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

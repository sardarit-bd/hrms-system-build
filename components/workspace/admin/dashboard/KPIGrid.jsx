"use client";

import { motion } from "framer-motion";
import { KpiCard } from "./KpiCard";
import { KPI_CONFIG, TREND_DATA } from "@/lib/dashboard-utils";
import * as Icons from "lucide-react";

export function KPIGrid({ stats }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-4"
    >
      {KPI_CONFIG.map((config) => {
        const IconComponent = Icons[config.icon];
        const trend = TREND_DATA[config.key];

        return (
          <div key={config.key} className="flex-1 min-w-60">
            <KpiCard
              title={config.title}
              value={config.format(stats[config.key])}
              icon={IconComponent}
              color={config.color}
              trend={trend?.trend}
              trendValue={trend?.value}
            />
          </div>
        );
      })}
    </motion.div>
  );
}

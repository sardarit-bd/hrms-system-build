"use client";

import { motion } from "framer-motion";
import { useCountUpFormatted } from "@/hooks/useCountUp";

export function CountUpText({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
}) {
  const { count } = useCountUpFormatted(value, { prefix, suffix, duration });

  return (
    <motion.span
      key={count}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {count}
    </motion.span>
  );
}

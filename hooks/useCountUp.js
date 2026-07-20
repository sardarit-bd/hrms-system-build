"use client";

import { useState, useEffect } from "react";

export function useCountUp(end, duration = 2000, startOnMount = true) {
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (!startOnMount) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsCounting(false);
      }
    };

    setIsCounting(true);
    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startOnMount]);

  return { count, isCounting };
}

export function useCountUpFormatted(end, options = {}) {
  const {
    duration = 2000,
    prefix = "",
    suffix = "",
    startOnMount = true,
  } = options;
  const { count, isCounting } = useCountUp(end, duration, startOnMount);

  const formatted = `${prefix}${count.toLocaleString()}${suffix}`;

  return { count: formatted, isCounting };
}

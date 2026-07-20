"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default async function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background dark:bg-slate-950">
      <div className="text-center">
        {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-primary dark:bg-blue-600 rounded-full mb-4">
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        </div> */}
        <p className="text-foreground dark:text-white font-medium">
          Loading HRMS...
        </p>
      </div>
    </div>
  );
}

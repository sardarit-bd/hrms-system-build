"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, FileJson, Printer, Download } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function ExportSection() {
  const handleExport = (format) => {
    gooeyToast.info(`Export ${format}`, {
      description: `Report is being generated in ${format} format.`,
      duration: 2000,
    });
    // TODO: Implement actual export logic with API
  };

  const exportOptions = [
    {
      label: "Export PDF",
      icon: FileText,
      format: "PDF",
      color: "bg-red-100 text-red-700 hover:bg-red-200",
    },
    {
      label: "Export Excel",
      icon: FileSpreadsheet,
      format: "Excel",
      color: "bg-green-100 text-green-700 hover:bg-green-200",
    },
    {
      label: "Export CSV",
      icon: FileJson,
      format: "CSV",
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
    {
      label: "Print Report",
      icon: Printer,
      format: "Print",
      color: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-medium flex items-center gap-2">
          <Download size={16} className="sm:w-4 sm:h-4" />
          Export Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {exportOptions.map((option) => (
            <Button
              key={option.format}
              variant="outline"
              onClick={() => handleExport(option.format)}
              className={`gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm ${option.color}`}
            >
              <option.icon size={14} className="sm:w-4 sm:h-4" />
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4">
          Export current report data in your preferred format. All data is real-time from the HRMS system.
        </p>
      </CardContent>
    </Card>
  );
}
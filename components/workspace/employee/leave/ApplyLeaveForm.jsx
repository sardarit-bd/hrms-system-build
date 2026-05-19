"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CalendarDays } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

const leaveSchema = z.object({
  leave_type_id: z.string().min(1, "Please select a leave type"),
  from_date: z.string().min(1, "Start date is required"),
  to_date: z.string().min(1, "End date is required"),
  reason: z.string().optional(),
  project_id: z.string().optional(),
}).refine((data) => {
  if (data.from_date && data.to_date) {
    return new Date(data.from_date) <= new Date(data.to_date);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["to_date"],
});

export default function ApplyLeaveForm({ leaveTypes, onSuccess }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leave_type_id: "",
      from_date: "",
      to_date: "",
      reason: "",
      project_id: "",
    },
  });

  const fromDate = watch("from_date");
  const toDate = watch("to_date");

  const calculateDays = () => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    const payload = {
      leave_type_id: parseInt(data.leave_type_id),
      from_date: data.from_date,
      to_date: data.to_date,
      reason: data.reason || null,
    };
    
    if (data.project_id) {
      payload.project_id = parseInt(data.project_id);
    }

    try {
      const response = await apiRequest("/leave/requests", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.status) {
        gooeyToast.success("Leave Request Submitted", {
          description: "Your leave request has been submitted for approval.",
          duration: 4000,
        });
        
        reset();
        onSuccess();
      }
    } catch (error) {
      gooeyToast.error("Submission Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const totalDays = calculateDays();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <CalendarDays size={16} />
          Apply for Leave
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label htmlFor="leave_type_id">Leave Type <span className="text-red-500">*</span></Label>
            <Select onValueChange={(v) => setValue("leave_type_id", v)}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()} className="cursor-pointer">
                    {type.name} ({type.max_days_per_year} days/year)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leave_type_id && (
              <p className="text-xs text-red-500">{errors.leave_type_id.message}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_date">From Date <span className="text-red-500">*</span></Label>
              <Input
                id="from_date"
                type="date"
                {...register("from_date")}
                className="cursor-pointer"
              />
              {errors.from_date && (
                <p className="text-xs text-red-500">{errors.from_date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="to_date">To Date <span className="text-red-500">*</span></Label>
              <Input
                id="to_date"
                type="date"
                {...register("to_date")}
                className="cursor-pointer"
              />
              {errors.to_date && (
                <p className="text-xs text-red-500">{errors.to_date.message}</p>
              )}
            </div>
          </div>

          {/* Total Days Display */}
          {totalDays > 0 && (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Days: <span className="font-semibold text-gray-900 dark:text-white">{totalDays} day(s)</span>
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              {...register("reason")}
              placeholder="Please provide reason for leave..."
              rows={3}
              className="cursor-text"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="cursor-pointer"
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Submit Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
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
import { Loader2, Clock } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

const hourLogSchema = z.object({
  project_id: z.string().min(1, "Please select a project"),
  log_date: z.string().min(1, "Date is required"),
  hours_logged: z.string().min(1, "Hours worked is required"),
  description: z.string().optional(),
}).refine((data) => {
  const hours = parseFloat(data.hours_logged);
  return !isNaN(hours) && hours >= 0.5 && hours <= 24;
}, {
  message: "Hours must be between 0.5 and 24",
  path: ["hours_logged"],
});

export default function SubmitHourLogForm({ projects, onSuccess }) {
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
    resolver: zodResolver(hourLogSchema),
    defaultValues: {
      project_id: "",
      log_date: new Date().toISOString().split("T")[0],
      hours_logged: "",
      description: "",
    },
  });

  const selectedProjectId = watch("project_id");
  const selectedProject = projects.find(p => p.id.toString() === selectedProjectId);
  const isHourlyProject = selectedProject?.type === "hourly";

  const onSubmit = async (data) => {
    if (!isHourlyProject) {
      gooeyToast.error("Invalid Project", {
        description: "Hour logs can only be submitted for hourly type projects.",
      });
      return;
    }

    setLoading(true);
    
    const payload = {
      project_id: parseInt(data.project_id),
      log_date: data.log_date,
      hours_logged: parseFloat(data.hours_logged),
      description: data.description || null,
    };

    try {
      const response = await apiRequest("/hour-logs", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.status) {
        gooeyToast.success("Hour Log Submitted", {
          description: `${data.hours_logged} hours logged successfully.`,
          duration: 3000,
        });
        
        reset({
          project_id: "",
          log_date: new Date().toISOString().split("T")[0],
          hours_logged: "",
          description: "",
        });
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

  // Filter hourly projects only
  const hourlyProjects = projects.filter(p => p.type === "hourly");

  if (hourlyProjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Clock size={16} />
            Submit Hour Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm text-center py-4">
            No hourly projects assigned. Hour logs can only be submitted for hourly projects.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Clock size={16} />
          Submit Hour Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project_id">Project <span className="text-red-500">*</span></Label>
            <Select onValueChange={(v) => setValue("project_id", v)}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {hourlyProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()} className="cursor-pointer">
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.project_id && (
              <p className="text-xs text-red-500">{errors.project_id.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="log_date">Date <span className="text-red-500">*</span></Label>
            <Input
              id="log_date"
              type="date"
              {...register("log_date")}
              className="cursor-pointer"
            />
            {errors.log_date && (
              <p className="text-xs text-red-500">{errors.log_date.message}</p>
            )}
          </div>

          {/* Hours Worked */}
          <div className="space-y-2">
            <Label htmlFor="hours_logged">Hours Worked <span className="text-red-500">*</span></Label>
            <Input
              id="hours_logged"
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              placeholder="e.g., 6.5"
              {...register("hours_logged")}
              className="cursor-text"
            />
            {errors.hours_logged && (
              <p className="text-xs text-red-500">{errors.hours_logged.message}</p>
            )}
            <p className="text-xs text-gray-500">Minimum 0.5 hours, maximum 24 hours</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Work Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe the work done..."
              rows={3}
              className="cursor-text"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D3A88] hover:bg-[#142558] cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Submit Hour Log
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
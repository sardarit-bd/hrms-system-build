"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  client_name: z.string().min(1, "Client name is required"),
  description: z.string().optional(),
  project_manager_id: z.string().min(1, "Project manager is required"),
  type: z.string().min(1, "Project type is required"),
  total_budget: z.string().min(1, "Budget is required"),
  currency: z.string().min(1, "Currency is required"),
  exchange_rate_snapshot: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  deadline: z.string().min(1, "Deadline is required"),
});

export default function CreateProjectDialog({ open, onOpenChange, onSuccess, projectManagers, channels }) {
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
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      client_name: "",
      description: "",
      project_manager_id: "",
      type: "single",
      total_budget: "",
      currency: "USD",
      exchange_rate_snapshot: "110.5",
      start_date: new Date().toISOString().split("T")[0],
      deadline: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        total_budget: parseFloat(data.total_budget),
        exchange_rate_snapshot: parseFloat(data.exchange_rate_snapshot),
      };
      
      const response = await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.status) {
        gooeyToast.success("Project Created", {
          description: `${data.name} has been added successfully.`,
        });
        reset();
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      gooeyToast.error("Creation Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" {...register("name")} placeholder="e.g., E-Commerce Platform" className="cursor-text" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input id="client_name" {...register("client_name")} placeholder="e.g., ABC Corp" className="cursor-text" />
              {errors.client_name && <p className="text-xs text-red-500">{errors.client_name.message}</p>}
            </div>

            {/* Project Manager */}
            <div className="space-y-2">
              <Label>Project Manager</Label>
              <Select onValueChange={(v) => setValue("project_manager_id", v)}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select project manager" />
                </SelectTrigger>
                <SelectContent>
                  {projectManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id.toString()} className="cursor-pointer">
                      {manager.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project_manager_id && <p className="text-xs text-red-500">{errors.project_manager_id.message}</p>}
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select defaultValue="single" onValueChange={(v) => setValue("type", v)}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single" className="cursor-pointer">Single Payment</SelectItem>
                  <SelectItem value="milestone" className="cursor-pointer">Milestone Based</SelectItem>
                  <SelectItem value="hourly" className="cursor-pointer">Hourly</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="total_budget">Total Budget</Label>
              <Input id="total_budget" type="number" step="0.01" {...register("total_budget")} placeholder="50000" className="cursor-text" />
              {errors.total_budget && <p className="text-xs text-red-500">{errors.total_budget.message}</p>}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select defaultValue="USD" onValueChange={(v) => setValue("currency", v)}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD" className="cursor-pointer">USD ($)</SelectItem>
                  <SelectItem value="EUR" className="cursor-pointer">EUR (€)</SelectItem>
                  <SelectItem value="GBP" className="cursor-pointer">GBP (£)</SelectItem>
                  <SelectItem value="BDT" className="cursor-pointer">BDT (৳)</SelectItem>
                </SelectContent>
              </Select>
              {errors.currency && <p className="text-xs text-red-500">{errors.currency.message}</p>}
            </div>

            {/* Exchange Rate */}
            <div className="space-y-2">
              <Label htmlFor="exchange_rate_snapshot">Exchange Rate Snapshot</Label>
              <Input id="exchange_rate_snapshot" type="number" step="0.01" {...register("exchange_rate_snapshot")} placeholder="110.5" className="cursor-text" />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" type="date" {...register("start_date")} className="cursor-pointer" />
              {errors.start_date && <p className="text-xs text-red-500">{errors.start_date.message}</p>}
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" {...register("deadline")} className="cursor-pointer" />
              {errors.deadline && <p className="text-xs text-red-500">{errors.deadline.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register("description")} placeholder="Project description..." rows={3} className="cursor-text" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer">
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
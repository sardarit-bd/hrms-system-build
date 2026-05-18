"use client";

import { useEffect, useState } from "react";
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

const editProjectSchema = z.object({
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
  status: z.string().optional(),
});

export default function EditProjectDialog({ open, onOpenChange, project, onSuccess, projectManagers }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProjectSchema),
  });

  useEffect(() => {
    if (project && open) {
      reset({
        name: project.name,
        client_name: project.client_name || "",
        description: project.description || "",
        project_manager_id: project.project_manager_id?.toString() || "",
        type: project.type,
        total_budget: project.total_budget?.toString(),
        currency: project.currency,
        exchange_rate_snapshot: project.exchange_rate_snapshot?.toString() || "",
        start_date: project.start_date,
        deadline: project.deadline,
        status: project.status,
      });
    }
  }, [project, open, reset]);

  const onSubmit = async (data) => {
    if (!project) return;
    
    setLoading(true);
    try {
      const payload = {
        ...data,
        total_budget: parseFloat(data.total_budget),
        exchange_rate_snapshot: parseFloat(data.exchange_rate_snapshot) || null,
      };
      
      const response = await apiRequest(`/projects/${project.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response.status) {
        gooeyToast.success("Project Updated", {
          description: `${data.name} has been updated successfully.`,
        });
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" {...register("name")} className="cursor-text" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input id="client_name" {...register("client_name")} className="cursor-text" />
              {errors.client_name && <p className="text-xs text-red-500">{errors.client_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Project Manager</Label>
              <Select onValueChange={(v) => setValue("project_manager_id", v)} defaultValue={project.project_manager_id?.toString()}>
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
            </div>

            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select onValueChange={(v) => setValue("type", v)} defaultValue={project.type}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single" className="cursor-pointer">Single Payment</SelectItem>
                  <SelectItem value="milestone" className="cursor-pointer">Milestone Based</SelectItem>
                  <SelectItem value="hourly" className="cursor-pointer">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_budget">Total Budget</Label>
              <Input id="total_budget" type="number" step="0.01" {...register("total_budget")} className="cursor-text" />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select onValueChange={(v) => setValue("currency", v)} defaultValue={project.currency}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="exchange_rate_snapshot">Exchange Rate</Label>
              <Input id="exchange_rate_snapshot" type="number" step="0.01" {...register("exchange_rate_snapshot")} className="cursor-text" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" type="date" {...register("start_date")} className="cursor-pointer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" {...register("deadline")} className="cursor-pointer" />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select onValueChange={(v) => setValue("status", v)} defaultValue={project.status}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing" className="cursor-pointer">Ongoing</SelectItem>
                  <SelectItem value="delivered" className="cursor-pointer">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="cursor-pointer">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} className="cursor-text" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer">
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
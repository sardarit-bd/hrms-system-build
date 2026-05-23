"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

const MILESTONE_STATUS = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  missed: { label: "Missed", color: "bg-red-100 text-red-700" },
};

export default function MilestonesManager({ open, onOpenChange, project, onSuccess, milestones: externalMilestones, inline = false }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState(externalMilestones || []);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    milestone_value: "",
    currency: "USD",
  });

  const fetchMilestones = async () => {
    if (!project) return;
    try {
      const response = await apiRequest(`/milestones?project_id=${project.id}`);
      if (response.status && response.data) {
        setMilestones(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch milestones:", error);
    }
  };

  const handleCreateMilestone = async () => {
    if (!formData.title || !formData.due_date || !formData.milestone_value) {
      gooeyToast.error("Missing Fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        project_id: project.id,
        title: formData.title,
        description: formData.description || null,
        due_date: formData.due_date,
        milestone_value: parseFloat(formData.milestone_value),
        currency: formData.currency,
      };

      const response = await apiRequest("/milestones", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.status) {
        gooeyToast.success("Milestone Created", {
          description: `${formData.title} has been added.`,
        });
        setShowCreateForm(false);
        setFormData({
          title: "",
          description: "",
          due_date: "",
          milestone_value: "",
          currency: "USD",
        });
        if (externalMilestones) {
          onSuccess?.();
        } else {
          fetchMilestones();
        }
      }
    } catch (error) {
      gooeyToast.error("Creation Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMilestone = async () => {
    if (!editingMilestone) return;

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        milestone_value: parseFloat(formData.milestone_value),
        currency: formData.currency,
      };

      const response = await apiRequest(`/milestones/${editingMilestone.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response.status) {
        gooeyToast.success("Milestone Updated", {
          description: `${formData.title} has been updated.`,
        });
        setEditingMilestone(null);
        setFormData({
          title: "",
          description: "",
          due_date: "",
          milestone_value: "",
          currency: "USD",
        });
        if (externalMilestones) {
          onSuccess?.();
        } else {
          fetchMilestones();
        }
      }
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMilestone = async (milestone) => {
    if (!confirm(`Are you sure you want to delete "${milestone.title}"?`)) return;

    try {
      const response = await apiRequest(`/milestones/${milestone.id}`, {
        method: "DELETE",
      });

      if (response.status) {
        gooeyToast.success("Milestone Deleted", {
          description: `${milestone.title} has been removed.`,
        });
        if (externalMilestones) {
          onSuccess?.();
        } else {
          fetchMilestones();
        }
      }
    } catch (error) {
      gooeyToast.error("Delete Failed", {
        description: error.message,
      });
    }
  };

  const handleStatusUpdate = async (milestone, action) => {
    try {
      const endpoint = `/milestones/${milestone.id}/${action}`;
      const response = await apiRequest(endpoint, { method: "PATCH" });

      if (response.status) {
        gooeyToast.success("Status Updated", {
          description: `${milestone.title} has been marked as ${action}.`,
        });
        if (externalMilestones) {
          onSuccess?.();
        } else {
          fetchMilestones();
        }
      }
    } catch (error) {
      gooeyToast.error("Update Failed", {
        description: error.message,
      });
    }
  };

  const startEdit = (milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      title: milestone.title,
      description: milestone.description || "",
      due_date: milestone.due_date,
      milestone_value: milestone.milestone_value?.toString(),
      currency: milestone.currency,
    });
  };

  const cancelEdit = () => {
    setEditingMilestone(null);
    setFormData({
      title: "",
      description: "",
      due_date: "",
      milestone_value: "",
      currency: "USD",
    });
  };

  const getStatusBadge = (status) => {
    const config = MILESTONE_STATUS[status];
    return (
      <Badge className={`${config?.color} cursor-default`}>
        {config?.label || status}
      </Badge>
    );
  };

  const Content = () => (
    <div className="space-y-6">
      {/* Milestones List */}
      {milestones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No milestones created yet</p>
          <p className="text-sm mt-1">Add milestones to track project progress</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((milestone) => (
                <TableRow key={milestone.id}>
                  <TableCell className="font-medium">{milestone.title}</TableCell>
                  <TableCell>{milestone.due_date}</TableCell>
                  <TableCell>{milestone.milestone_value?.toLocaleString()} {milestone.currency}</TableCell>
                  <TableCell>{getStatusBadge(milestone.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {milestone.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(milestone, "complete")}
                            className="p-1 rounded hover:bg-green-100 transition-colors cursor-pointer"
                            title="Mark Complete"
                          >
                            <CheckCircle size={16} className="text-green-600" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(milestone, "missed")}
                            className="p-1 rounded hover:bg-red-100 transition-colors cursor-pointer"
                            title="Mark Missed"
                          >
                            <XCircle size={16} className="text-red-600" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => startEdit(milestone)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(milestone)}
                        className="p-1 rounded hover:bg-red-100 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Form */}
      {(showCreateForm || editingMilestone) && (
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-semibold mb-4">
            {editingMilestone ? "Edit Milestone" : "Add New Milestone"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Milestone title"
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>Milestone Value</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.milestone_value}
                onChange={(e) => setFormData({ ...formData, milestone_value: e.target.value })}
                placeholder="Amount"
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD" className="cursor-pointer">USD ($)</SelectItem>
                  <SelectItem value="EUR" className="cursor-pointer">EUR (€)</SelectItem>
                  <SelectItem value="GBP" className="cursor-pointer">GBP (£)</SelectItem>
                  <SelectItem value="BDT" className="cursor-pointer">BDT (৳)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="cursor-text"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCreateForm(false);
                cancelEdit();
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={editingMilestone ? handleUpdateMilestone : handleCreateMilestone}
              disabled={loading}
              className="bg-[#1D3A88] hover:bg-[#142558] cursor-pointer"
            >
              {loading ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              {editingMilestone ? "Update" : "Create"} Milestone
            </Button>
          </div>
        </div>
      )}

      {!showCreateForm && !editingMilestone && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm(true)}
          className="w-full cursor-pointer"
        >
          <Plus size={14} className="mr-2" />
          Add Milestone
        </Button>
      )}
    </div>
  );

  if (inline) {
    return <Content />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Milestones - {project?.name}</DialogTitle>
          <DialogDescription>
            Track project milestones and their completion status
          </DialogDescription>
        </DialogHeader>
        <Content />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
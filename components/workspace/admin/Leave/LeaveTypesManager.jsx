"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Edit, Trash2, Plus, RefreshCw } from "lucide-react";
import { gooeyToast } from "@/components/ui/goey-toaster";

export default function LeaveTypesManager({ leaveTypes, onLeaveTypesChange }) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    max_days_per_year: 14,
    is_paid: true,
  });

  const handleOpenCreate = () => {
    setEditingType(null);
    setFormData({
      name: "",
      max_days_per_year: 14,
      is_paid: true,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (type) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      max_days_per_year: type.max_days_per_year,
      is_paid: type.is_paid,
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!editingType) return;

    setLoading(true);
    try {
      await apiRequest(`/leave/types/${editingType.id}`, { method: "DELETE" });

      gooeyToast.success("Leave Type Deleted", {
        description: `${editingType.name} has been removed.`,
      });

      setDeleteDialogOpen(false);
      setEditingType(null);
      onLeaveTypesChange();
    } catch (error) {
      gooeyToast.error("Delete Failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      gooeyToast.error("Missing Field", {
        description: "Leave type name is required.",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingType) {
        await apiRequest(`/leave/types/${editingType.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        gooeyToast.success("Leave Type Updated", {
          description: `${formData.name} has been updated.`,
        });
      } else {
        await apiRequest("/leave/types", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        gooeyToast.success("Leave Type Created", {
          description: `${formData.name} has been added.`,
        });
      }

      setDialogOpen(false);
      onLeaveTypesChange();
    } catch (error) {
      console.log("LEAVE TYPE ERROR:", error);

      const validationMessage =
        error?.errors?.name?.[0] ||
        error?.data?.errors?.name?.[0] ||
        error?.response?.data?.errors?.name?.[0] ||
        error?.message ||
        "Something went wrong";

      gooeyToast.error(editingType ? "Update Failed" : "Creation Failed", {
        description: validationMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (leaveTypes.length === 0) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Leave Types</CardTitle>

            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="cursor-pointer"
            >
              <Plus size={14} className="mr-2" />
              Add Leave Type
            </Button>
          </CardHeader>

          <CardContent className="text-center py-12">
            <p className="text-gray-500">No leave types configured</p>

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenCreate}
              className="mt-4 cursor-pointer"
            >
              Add your first leave type
            </Button>
          </CardContent>
        </Card>

        {/* Create/Edit Leave Type Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingType ? "Edit Leave Type" : "Add Leave Type"}
              </DialogTitle>

              <DialogDescription>
                Fill in the details to create a new leave type.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Leave Type Name</Label>

                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Sick Leave"
                    required
                    className="cursor-text border border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_days">Maximum Days per Year</Label>

                  <Input
                    id="max_days"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.max_days_per_year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_days_per_year: parseInt(e.target.value),
                      })
                    }
                    className="cursor-text border border-gray-300"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer"
                >
                  {loading ? "Saving..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">Leave Types</CardTitle>
          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="cursor-pointer"
          >
            <Plus size={14} className="mr-2" />
            Add Leave Type
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Max Days/Year</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.max_days_per_year}</TableCell>
                    <TableCell>
                      <Badge
                        variant={type.is_paid ? "default" : "outline"}
                        className="cursor-default"
                      >
                        {type.is_paid ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {type.created_at
                        ? new Date(type.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel className="cursor-default">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleOpenEdit(type)}
                          >
                            <Edit size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => {
                              setEditingType(type);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Leave Type Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Leave Type" : "Add Leave Type"}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? "Update the leave type details below."
                : "Fill in the details to create a new leave type."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Leave Type Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Sick Leave, Casual Leave"
                  required
                  className="cursor-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_days">Maximum Days per Year</Label>
                <Input
                  id="max_days"
                  type="number"
                  min="1"
                  max="365"
                  value={formData.max_days_per_year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_days_per_year: parseInt(e.target.value),
                    })
                  }
                  className="cursor-text"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label>Paid Leave</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.is_paid === true}
                      onChange={() =>
                        setFormData({ ...formData, is_paid: true })
                      }
                      className="cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.is_paid === false}
                      onChange={() =>
                        setFormData({ ...formData, is_paid: false })
                      }
                      className="cursor-pointer"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? "Saving..." : editingType ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Leave Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{editingType?.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="cursor-pointer border border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Eye } from "lucide-react";

export default function TeamCard({ team, onViewDetails }) {
  const memberCount = team.members_count || team.members?.length || 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center">
              <Users size={24} className="text-[#C9A84C]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {team.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="cursor-default">
                  {memberCount} {memberCount === 1 ? "Member" : "Members"}
                </Badge>
                {team.has_leader && (
                  <Badge className="bg-blue-100 text-blue-700 cursor-default">
                    Team Leader Assigned
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(team)}
            className="gap-2 cursor-pointer"
          >
            <Eye size={14} />
            Team Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
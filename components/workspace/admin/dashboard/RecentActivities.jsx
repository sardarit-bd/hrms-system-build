"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";
import { Bell, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getActivityIcon } from "./getActivityIcon";
import { getActivityColor } from "./getActivityColor";

export function RecentActivities({ activities }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex-1"
    >
      <Card className="h-full border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Bell size={18} className="text-muted-foreground" />
              Recent Activities
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1 h-auto py-1"
              asChild
            >
              <Link href="/workspace/admin/notifications">
                View All <ArrowRight size={12} />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{
                      backgroundColor: `${getActivityColor(activity.type)}20`,
                    }}
                  >
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                  {activity.status && (
                    <Badge
                      variant="outline"
                      className="text-xs flex-shrink-0"
                      style={{
                        borderColor: getActivityColor(activity.type),
                        color: getActivityColor(activity.type),
                      }}
                    >
                      {activity.status.replace("_", " ")}
                    </Badge>
                  )}
                </motion.div>
              ))
            ) : (
              <EmptyState message="No recent activities" />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

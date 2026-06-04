import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase, Building2, Mail, Phone, MapPin, Clock } from "lucide-react";

export function ProfileOverview({ profile }) {
  const infoCards = [
    {
      title: "Contact Information",
      icon: Mail,
      items: [
        { label: "Email", value: profile.email, icon: Mail },
        { label: "Phone", value: profile.phone || "Not provided", icon: Phone },
        { label: "Location", value: profile.location || "Not specified", icon: MapPin },
      ],
    },
    {
      title: "Work Information",
      icon: Briefcase,
      items: [
        { label: "Department", value: profile.department || "Not assigned", icon: Building2 },
        { label: "Designation", value: profile.designation || "General Manager", icon: Briefcase },
        { label: "Employee Code", value: profile.employee_code || "N/A", icon: Clock },
      ],
    },
    // {
    //   title: "Employment Details",
    //   icon: Calendar,
    //   items: [
    //     { label: "Joining Date", value: profile.joining_date || "Not available", icon: Calendar },
    //     { label: "Role", value: profile.role?.replace(/_/g, " ") || "General Manager", icon: Badge },
    //   ],
    // },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* <Card className="bg-white dark:bg-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {profile.department || "General Management"}
                </p>
              </div>
              <Building2 size={32} className="text-[#1D3A88] opacity-60" />
            </div>
          </CardContent>
        </Card> */}

        {/* <Card className="bg-white dark:bg-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge className={`mt-1 ${profile.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {profile.status || "Active"}
                </Badge>
              </div>
              <Clock size={32} className="text-[#1D3A88] opacity-60" />
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {infoCards.map((card, idx) => (
          <Card key={idx} className="bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <card.icon size={18} className="text-[#1D3A88]" />
                {card.title}
              </CardTitle>
              <CardDescription>Your {card.title.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {card.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <item.icon size={16} className="text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
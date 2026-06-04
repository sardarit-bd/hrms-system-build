// components/gm/personal-info.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar, Globe, Users } from "lucide-react";

export function PersonalInfo({ profile }) {
  const personalFields = [
    { label: "Full Name", value: profile.full_name, icon: User },
    { label: "Email Address", value: profile.email, icon: Mail },
    { label: "Phone Number", value: profile.phone || "Not provided", icon: Phone },
    { label: "Date of Birth", value: profile.date_of_birth || "Not provided", icon: Calendar },
    { label: "Gender", value: profile.gender || "Not specified", icon: Users },
    { label: "Address", value: profile.address || "Not provided", icon: MapPin },
    { label: "Nationality", value: profile.nationality || "Not specified", icon: Globe },
  ];

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={18} className="text-[#1D3A88]" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Your personal and contact details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalFields.map((field, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <field.icon size={18} className="text-[#1D3A88] mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">{field.label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {field.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
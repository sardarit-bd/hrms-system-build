import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

export function ProfileHeader({
  profileData,
  getUserInitial,
  getStatusColor,
  getRoleLabel,
  onImageChange,
}) {
  const fileInputRef = useRef(null);

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-[#1B2B4B] to-[#2A3D6B] dark:from-slate-800 dark:to-slate-900 px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-white/20">
              <AvatarImage
                src={profileData.profile_image || profileData.avatar || ""}
                alt={profileData.full_name}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#C9A84C] text-[#1B2B4B] text-2xl font-bold">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Camera size={14} className="text-[#1B2B4B]" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">
              {profileData.full_name}
            </h2>

            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <Badge className={getStatusColor(profileData.status)}>
                {profileData.status?.charAt(0).toUpperCase() +
                  profileData.status?.slice(1)}
              </Badge>

              <span className="text-white/70 text-sm">
                {getRoleLabel(profileData.role)}
              </span>

              <span className="text-white/50 text-sm font-mono">
                {profileData.employee_code || "No code"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
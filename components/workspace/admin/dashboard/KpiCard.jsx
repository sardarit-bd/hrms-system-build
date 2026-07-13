import {Card, CardContent} from "../../../ui/card"
export function KpiCard({ title, value, icon: Icon, color }) {
    const colorClasses = {
      blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600",
      green: "bg-green-50 dark:bg-green-950/30 text-green-600",
      purple: "bg-purple-50 dark:bg-purple-950/30 text-purple-600",
      cyan: "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600",
      orange: "bg-orange-50 dark:bg-orange-950/30 text-orange-600",
      emerald: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600",
    };
  
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon size={18} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs text-gray-500 mt-1">{title}</p>
        </CardContent>
      </Card>
    );
  }
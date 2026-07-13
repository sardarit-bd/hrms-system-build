import { Button } from "../../../ui/button";
import { Card, CardContent, } from "../../../ui/card";

export function ActionCard({ title, description, buttonText, onClick, icon: Icon }) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Icon size={16} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {title}
              </p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            className="cursor-pointer"
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    );
  }
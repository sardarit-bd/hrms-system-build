import { AlertCircle } from "lucide-react";

export function EmptyState({ message }) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle size={32} className="text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    );
  }
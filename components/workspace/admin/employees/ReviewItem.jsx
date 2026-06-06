export function ReviewItem({ label, value }) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 dark:text-white">{value}</p>
      </div>
    );
  }
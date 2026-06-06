export function getActivityColor(type) {
    const colors = {
      leave: "orange",
      user: "emerald",
      project: "blue",
    };
    return colors[type] || "gray";
  }
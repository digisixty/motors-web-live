import React from "react";

function DateRenderer({ date }: { date: string }) {
  if (!date) return null;
  return <span>{new Date(date).toLocaleDateString()}</span>;
}

export default DateRenderer;

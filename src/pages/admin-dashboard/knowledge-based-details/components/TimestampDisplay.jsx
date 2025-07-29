import { Calendar, Clock } from "lucide-react";

export function TimestampDisplay({ timestamp, size = "sm" }) {
  // Parse the timestamp
  const [datePart, timePart] = timestamp.split(' ');
  
  const iconSize = size === "sm" ? 12 : 14;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  
  return (
    <div className="flex flex-col space-x-1">
      {/* Calendar icon + Date */}
      <div className="flex items-center space-x-1">
        <Calendar className={`h-${iconSize === 12 ? '3' : '4'} w-${iconSize === 12 ? '3' : '4'} text-blue-500`} />
        <span className={`${textSize} text-blue-700 font-medium`}>
          {datePart}
        </span>
      </div>
      
      {/* Clock icon + Time */}
      <div className="flex items-center space-x-1">
        <Clock className={`h-${iconSize === 12 ? '3' : '4'} w-${iconSize === 12 ? '3' : '4'} text-gray-500`} />
        <span className={`${textSize} text-gray-600`}>
          {timePart}
        </span>
      </div>
    </div>
  );
}
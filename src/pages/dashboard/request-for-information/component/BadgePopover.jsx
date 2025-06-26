import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext } from "react";
import { RequestInfoContext } from "../context/RequestInfoContext";

function BadgePopover({ notifications, name, icon }) {
  const { templates } = useContext(RequestInfoContext)
  return (
    <div className="flex items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Badge
            variant="secondary"
            className="text-xs border border-blue-500 bg-blue-200 px-3"
          >
            {name}
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-40 min-w-fit p-2">
          <ul className="space-y-1">
            {name === "DocGen" && (<li className="px-2 py-1 text-sm flex items-center gap-x-3 hover:bg-gray-100 rounded cursor-pointer">{templates}</li>)}
            {notifications.length > 0 && notifications.map((item, index) => (
              <li
                key={index}
                className="px-2 py-1 text-sm flex items-center gap-x-3 hover:bg-gray-100 rounded cursor-pointer"
              >
                {icon}
                <span className="font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default BadgePopover;

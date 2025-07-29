import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext } from "react";
import { RequestInfoContext } from "../context/RequestInfoContext";
import { Bot, Minus } from "lucide-react";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";

function BadgePopover({ notifications, name, icon, onRemove }) {
  const { templates } = useContext(RequestInfoContext);
  const { isBotOpen, setIsBotOpen } = useContext(GlobalContext);
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
                className="px-2 py-1 text-sm flex items-center justify-between gap-x-3 hover:bg-gray-100 rounded cursor-pointer"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="flex items-center gap-x-2">
                  {icon}
                <span className="font-semibold">{item}</span>
                </span>
                <Bot onClick={()=>setIsBotOpen(!isBotOpen)} className="h-4 w-4 group-hover:animate-bounce text-gray-600"/>
                </div>
                
               {
                notifications.length > 1 && (
                   <Minus onClick={(e) => {
                      e.stopPropagation();
                      if (onRemove) {
                        onRemove(item);
                      }
                    }}  className="w-3 h-3 text-red-800" />
                )
               }
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default BadgePopover;

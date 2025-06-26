// /components/review-tasks/SignedOffBadge.jsx
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PenTool } from "lucide-react";

export function SignedOffBadge({ doc, isDocumentSigned }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          className={`cursor-pointer ${
            isDocumentSigned(doc.id)
              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
              : doc.status === "approved"
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-200 text-gray-800 hover:bg-gray-100"
          }`}
        >
          <PenTool className="h-3 w-3 mr-1" />
          {doc.status === "approved" ? "Signed-off" : "Rejected"}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">
            {doc.status === "approved" ? "Approval" : "Rejection"} Details
          </h4>

          {/* Display signature image */}
          <div className="border rounded p-2 bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">Signature:</p>
            <img
              src={"/sig.png"}
              alt="Signature"
              className="max-h-26 object-contain"
            />
          </div>

          <div className="border rounded p-2">
            <p className="text-xs text-gray-500 mb-1">Reason:</p>
            <p className="text-sm">
              {doc.status === "approved"
                ? "All requirements met. Document aligns with our security protocols and has been thoroughly reviewed."
                : "Incomplete technical specifications in maintenance procedures. Additional detail required in sections 4-6."}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
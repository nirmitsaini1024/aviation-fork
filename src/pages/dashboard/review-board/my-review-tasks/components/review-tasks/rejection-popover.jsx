// /components/review-tasks/RejectionPopover.jsx
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { XCircle } from "lucide-react";
import SignatureComponent from "../signature-component";

export function RejectionPopover({
  doc,
  documentToAction,
  setDocumentToAction,
  rejectPopoverOpen,
  setRejectPopoverOpen,
  rejectionReason,
  setRejectionReason,
  rejectionSignature,
  setRejectionSignature,
  handleReject,
  handleRejectionSignatureSave
}) {
  return (
    <Popover
      open={rejectPopoverOpen && documentToAction === doc.id}
      onOpenChange={(open) => {
        if (!open) {
          setRejectionReason("");
          setRejectionSignature(null);
        }
        setRejectPopoverOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button 
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Reject"
          onClick={() => {
            setDocumentToAction(doc.id);
            setRejectPopoverOpen(true);
          }}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" side="left" align="center">
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-center">
            Reject Document
          </h4>
          
          {/* Compact signature section */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">
              Digital Signature Required:
            </p>
            <div className="border rounded p-2 bg-gray-50">
              <SignatureComponent
                onSave={handleRejectionSignatureSave}
                compact={true}
              />
            </div>
          </div>

          {/* Compact reason section */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">
              Rejection Reason:
            </p>
            <Textarea
              placeholder="Enter rejection reason..."
              className="min-h-16 text-xs resize-none"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          
          {/* Compact button section */}
          <div className="flex justify-end space-x-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-7"
              onClick={() => {
                setRejectionReason("");
                setRejectionSignature(null);
                setDocumentToAction(null);
                setRejectPopoverOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-7"
              onClick={() => handleReject(doc.id)}
              disabled={!rejectionReason.trim() || !rejectionSignature}
            >
              Reject
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
// /components/review-tasks/ApprovalPopover.jsx
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import SignatureComponent from "../signature-component";

export function ApprovalPopover({
  doc,
  documentToAction,
  setDocumentToAction,
  approvePopoverOpen,
  setApprovePopoverOpen,
  approvalReason,
  setApprovalReason,
  approvalSignature,
  setApprovalSignature,
  handleApprove,
  handleApprovalSignatureSave
}) {
  return (
    <Popover
      open={approvePopoverOpen && documentToAction === doc.id}
      onOpenChange={(open) => {
        if (!open) {
          setApprovalReason("");
          setApprovalSignature(null);
        }
        setApprovePopoverOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
          title="Approve"
          onClick={() => {
            setDocumentToAction(doc.id);
            setApprovePopoverOpen(true);
          }}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" side="left" align="center">
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-center">
            Approve Document
          </h4>
          
          {/* Compact signature section */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">
              Digital Signature Required:
            </p>
            <div className="border rounded p-2 bg-gray-50">
              <SignatureComponent
                onSave={handleApprovalSignatureSave}
                compact={true}
              />
            </div>
          </div>

          {/* Compact reason section */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">
              Approval Reason:
            </p>
            <Textarea
              placeholder="Enter approval reason..."
              className="min-h-16 text-xs resize-none"
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
            />
          </div>
          
          {/* Compact note */}
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border">
            <span className="font-medium">Note:</span> Group reviews become public
          </p>
          
          {/* Compact button section */}
          <div className="flex justify-end space-x-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-7"
              onClick={() => {
                setApprovalReason("");
                setApprovalSignature(null);
                setDocumentToAction(null);
                setApprovePopoverOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-7"
              onClick={() => handleApprove(doc.id)}
              disabled={!approvalReason.trim() || !approvalSignature}
            >
              Approve
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
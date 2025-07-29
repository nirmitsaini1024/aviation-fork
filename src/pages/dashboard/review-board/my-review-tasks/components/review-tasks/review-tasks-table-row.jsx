// /components/review-tasks/ReviewTasksTableRow.jsx
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Eye,
  ChevronUp,
  ChevronDown,
  PenTool,
  Calendar,
  Clock,
  FileText,
  AlertCircle
} from "lucide-react";
import { TimestampDisplay } from "./time-stamp-display";
import { ApprovalPopover } from "./approval-popover";
import { RejectionPopover } from "./rejection-popover";
import { SignedOffBadge } from "./signed-off-badge";
import { SectionRows } from "./section-rows";
import {
  ExpandableComments,
  ExpandedCommentsContent,
} from "@/pages/dashboard/review-board/my-review-tasks/components/comment-section";

export function ReviewTasksTableRow({ 
  doc, 
  index,
  selectedDocuments,
  toggleDocumentSelection,
  expandedDocumentSections,
  toggleSectionsExpansion,
  expandedCommentRows,
  setExpandedCommentRows,
  documentToAction,
  setDocumentToAction,
  approvePopoverOpen,
  setApprovePopoverOpen,
  rejectPopoverOpen,
  setRejectPopoverOpen,
  approvalReason,
  setApprovalReason,
  rejectionReason,
  setRejectionReason,
  approvalSignature,
  setApprovalSignature,
  rejectionSignature,
  setRejectionSignature,
  handleApprove,
  handleReject,
  handleApprovalSignatureSave,
  handleRejectionSignatureSave,
  getStatusColor,
  getStatusIcon,
  getAiSummary,
  getAiSentiment,
  isDocumentSigned,
  user
}) {

  return (
    <>
      <TableRow key={doc.id} className="hover:bg-gray-50 cursor-pointer border-t-[1px] border-gray-400">
        <TableCell>
          <Checkbox
            checked={selectedDocuments.includes(doc.id)}
            onCheckedChange={() => toggleDocumentSelection(doc.id)}
            aria-label={`Select ${doc.name}`}
          />
        </TableCell>
        
        {/* Review Details */}
        <TableCell className="w-[320px]">
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 font-medium mb-1">
              <Badge className="bg-blue-200 text-blue-700">Modifications</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium flex items-center min-w-0 flex-1">
                <div className="text-sm font-medium flex-grow pr-2">
                  {doc.name.length > 50
                    ? `${doc.name.substring(0, 50)}...`
                    : doc.name}
                </div>
              </div>
              <div className="flex flex-col space-x-1 justify-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label="View full reference text"
                    >
                      <Eye size={16} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 max-h-64 overflow-y-auto">
                    <div className="text-sm text-gray-700">
                      {doc.name}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <button
                  className="p-1 rounded-full hover:bg-blue-100 transition-colors h-fit"
                  onClick={() => toggleSectionsExpansion(doc.id)}
                >
                  {expandedDocumentSections === doc.id ? (
                    <ChevronUp size={18} className="text-blue-500" />
                  ) : (
                    <ChevronDown size={18} className="text-blue-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="w-[140px]">
          <div className={`inline-flex p-2 rounded-md text-xs font-medium max-w-full ${
            doc.reviewerType === 'user' 
              ? "bg-purple-100 text-purple-800" 
              : "bg-indigo-100 text-indigo-800"
          }`}>
            <span className="break-words leading-tight">
              {doc.reviewerName}
            </span>
          </div>
        </TableCell>

        <TableCell className="w-[150px]">
          <TimestampDisplay timestamp={doc.createdAt} size="sm" />
        </TableCell>

        <TableCell className="w-[150px]">
          <TimestampDisplay timestamp={doc.lastUpdated} size="sm" />
        </TableCell>

        <TableCell className="w-[110px]">
          <Badge className={getStatusColor(doc.status)}>
            {getStatusIcon(doc.status)}
            <span className="truncate">
              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
            </span>
          </Badge>
        </TableCell>
        
        {/* AI Analysis */}
        <TableCell className="w-[120px]">
          {/* Commented out for now as in original code */}
        </TableCell>
        
        <TableCell className="w-[100px]">
          {doc.status === "pending" || doc.status === "expired" ? (
            <div className="flex space-x-1 justify-center">
              <ApprovalPopover
                doc={doc}
                documentToAction={documentToAction}
                setDocumentToAction={setDocumentToAction}
                approvePopoverOpen={approvePopoverOpen}
                setApprovePopoverOpen={setApprovePopoverOpen}
                approvalReason={approvalReason}
                setApprovalReason={setApprovalReason}
                approvalSignature={approvalSignature}
                setApprovalSignature={setApprovalSignature}
                handleApprove={handleApprove}
                handleApprovalSignatureSave={handleApprovalSignatureSave}
              />

              <RejectionPopover
                doc={doc}
                documentToAction={documentToAction}
                setDocumentToAction={setDocumentToAction}
                rejectPopoverOpen={rejectPopoverOpen}
                setRejectPopoverOpen={setRejectPopoverOpen}
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                rejectionSignature={rejectionSignature}
                setRejectionSignature={setRejectionSignature}
                handleReject={handleReject}
                handleRejectionSignatureSave={handleRejectionSignatureSave}
              />
            </div>
          ) : (
            <SignedOffBadge 
              doc={doc}
              isDocumentSigned={isDocumentSigned}
            />
          )}
        </TableCell>
      </TableRow>

      {/* Flight Manual sections expansion */}
      <SectionRows
        doc={doc}
        expandedDocumentSections={expandedDocumentSections}
        expandedCommentRows={expandedCommentRows}
        setExpandedCommentRows={setExpandedCommentRows}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
        getAiSummary={getAiSummary}
        getAiSentiment={getAiSentiment}
        user={user}
      />

      {/* Expanded comments row */}
      {expandedCommentRows.includes(doc.id) && (
        <TableRow>
          <TableCell colSpan={7} className="p-0">
            <ExpandedCommentsContent
              documentId={doc.id}
              user={user}
              getSummary={() => getAiSummary(doc.id)}
              getSentiment={() => getAiSentiment(doc.id)}
              allowRating={true}
              readOnly={doc.status !== 'pending' && doc.status !== 'expired'}
              isUserLevelTask={doc.reviewerType === 'user'}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
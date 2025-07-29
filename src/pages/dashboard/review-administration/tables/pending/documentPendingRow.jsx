import React from "react";
import {
  Trash2,
  Edit,
  FileText,
  List,
  Clock,
  Eye,
  EllipsisVertical,
  Pencil,
  CircleMinus,
  ChevronDown,
  FileIcon,
  User,
  Building,
  Briefcase,
  X,
} from "lucide-react";
import { Badge } from "../../../../../components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Button } from "../../../../../components/ui/button";
import SignatureComponent from "../../sub-component/signature/signature-component";
import { Textarea } from "../../../../../components/ui/textarea";

import { sampleApprovalNodes } from "../mock-data/review";
import { DocumentBadgesSection } from "../../common/shared-tabs-utils";

// Import helper functions
import {
  formatTimestamp,
  truncate,
  getDocumentName,
  getFileTypeBadge,
  getStatusBadge,
  isDocumentInReview,
  isReferenceDocument,
  shouldShowActionsColumn,
  shouldShowReviewPanel,
} from "./documentPendingHelpers";

function DocumentPendingRow({
  doc,
  selectedTab,
  isSubmitted,
  hasDocumentsInReview,
  summaryData,
  // State props
  openDescriptionDropDown,
  setOpenDescriptionDropdown,
  isEditDescription,
  setIsEditDescription,
  description,
  setDescription,
  expandedApprovalCycle,
  setExpandedApprovalCycle,
  editWorkflowOpen,
  setEditWorkflowOpen,
  showRejectUI,
  setShowRejectUI,
  rejectionReason,
  setRejectionReason,
  rejectionSignature,
  setRejectionSignature,
  deletePopoverOpen,
  setDeletePopoverOpen,
  expandedSummary,
  // Event handlers
  handleDocDescription,
  handleView,
  handleEditClick,
  handleCompare,
  handleRejectionSignatureSave,
  handleConfirmEditWorkflow,
  handleDeleteDocument,
}) {
  const docName = getDocumentName(doc);
  const inReview = isDocumentInReview(doc);
  const isReference = isReferenceDocument(doc);
  const showActions = shouldShowActionsColumn(doc, selectedTab, isSubmitted);
  const showReviewPanel = shouldShowReviewPanel(
    doc,
    selectedTab,
    hasDocumentsInReview
  );

  console.log("doc is: ", doc);

  return (
    <React.Fragment key={doc.id}>
      <tr className="border-t-[1px] border-gray-400 hover:bg-gray-50">
        <td className="px-2 py-1">
          <div className="flex items-center">
            {doc.fileType === "pdf" ? (
              <FileIcon className="w-4 h-4 text-red-600 mr-1" />
            ) : (
              <FileText className="w-4 h-4 text-blue-600 mr-1" />
            )}
            <span className="font-medium">
              {docName} {getFileTypeBadge(doc)}
            </span>
            <div className="py-2 ml-1">{getStatusBadge(doc)}</div>
          </div>

          {/* Document badges section */}
          {doc.type && (
            <DocumentBadgesSection
              doc={doc}
              showType={true}
              showDomain={true}
              showCategory={true}
              className="inline-flex items-center gap-1.5 ml-1"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <div className="flex mt-1.5 ml-4 items-center gap-5 flex-wrap">
            <button
              onClick={() => handleView(doc)}
              className="text-blue-600 hover:cursor-pointer hover:text-blue-800 flex items-center text-xs"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>

            {(doc.fileType === "docx" || doc.fileType === "doc") && (
              <>
                <button
                  onClick={() => handleEditClick(doc?.id)}
                  disabled={inReview}
                  className={`flex items-center text-xs hover:cursor-pointer ${
                    inReview
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-yellow-600 hover:text-yellow-800"
                  }`}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      disabled={inReview}
                      className={`flex items-center text-xs hover:cursor-pointer ${
                        inReview
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-4" align="start">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">
                        Confirm Deletion
                      </h4>
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this document?
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletePopoverOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            handleDeleteDocument(doc);
                            setDeletePopoverOpen(false);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>
        </td>

        <td className="relative">
          <Popover
            open={openDescriptionDropDown === doc.id}
            onOpenChange={(open) => {
              if (open) {
                setOpenDescriptionDropdown(doc.id);
              } else {
                setOpenDescriptionDropdown(null);
              }
            }}
          >
            <PopoverTrigger asChild>
              <div className="relative z-10 p-3 w-36 max-w-36  cursor-pointer rounded">
                <div>
                  {doc.description ? (
                    <p
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenDescriptionDropdown(
                          openDescriptionDropDown === doc.id ? null : doc.id
                        );
                      }}
                      className="text-sm text-gray-800 break-words hyphens-auto leading-relaxed w-full"
                    >
                      {truncate(doc.description, 25)}
                    </p>
                  ) : (
                    <p
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenDescriptionDropdown(
                          openDescriptionDropDown === doc.id ? null : doc.id
                        );
                      }}
                      className="text-sm text-gray-500 break-words hyphens-auto leading-relaxed italic w-full"
                    >
                      {truncate(
                        "No description available for this document.",
                        30
                      )}
                    </p>
                  )}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[450px] max-h-[300px] border-blue-300 shadow-lg border-1 overflow-y-auto z-50"
              side="right"
              sideOffset={-40}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div>
                <div className="flex justify-between items-center pb-3 border-b w-full">
                  <h4 className="font-semibold text-sm text-blue-700">
                    Document Description
                  </h4>
                  <div className="flex gap-x-4 items-center">
                    <Pencil
                      className="text-blue-400 w-5 h-5 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation(), setIsEditDescription(true);
                        doc.description && setDescription(doc.description);
                      }}
                    />
                    <X
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation(),
                          setOpenDescriptionDropdown(false),
                          setIsEditDescription(false);
                      }}
                    />
                  </div>
                </div>
                {doc.description ? (
                  <>
                    {isEditDescription ? (
                      <>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Write your description here..."
                          className="border border-blue-400 focus:border-blue-300 focus:outline-none focus:ring-0 focus:ring-transparent w-full rounded-sm h-32 p-2 resize-none"
                        />
                        <div className="flex gap-4 justify-end">
                          <button
                            onClick={handleDocDescription}
                            className="bg-blue-400 text-black px-4 py-2 rounded-md hover:bg-blue-500 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(),
                                setIsEditDescription(false);
                            }}
                            className="bg-white text-black border border-black px-4 py-2 rounded-md hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-700 pt-3 leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {isEditDescription ? (
                      <>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Write your description here..."
                          className="border border-blue-400 focus:border-blue-300 focus:outline-none focus:ring-0 focus:ring-transparent w-full rounded-sm h-32 p-2 resize-none"
                        />
                        <div className="flex gap-4 justify-end">
                          <button
                            onClick={handleDocDescription}
                            className="bg-blue-400 text-black px-6 py-2 rounded-md hover:bg-blue-500 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(),
                                setIsEditDescription(false);
                            }}
                            className="bg-white text-black border border-black px-4 py-2 rounded-md hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-700 pt-5 leading-relaxed">
                        No description available for this document.
                      </p>
                    )}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </td>

        {/* Owner Column */}
        <td className="px-4 py-3">
          {doc.owner && (
            <div className="space-y-1">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">
                  {doc.owner.officer}
                </span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm">{doc.owner.department}</span>
                {doc.domain && (
                  <Badge className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {doc.domain}
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                <span className="text-sm">{doc.owner.title}</span>
              </div>
            </div>
          )}
        </td>

        <td className="py-2 px-3">
          <p className="font-normal flex gap-2 items-center text-zinc-700">
            <Clock size={14} />
            <span title={doc.uploadedAt}>
              {formatTimestamp(doc.uploadedAt)}
            </span>
          </p>
        </td>

        <td className="py-3 px-4">
          <p className="font-normal flex gap-2 items-center text-zinc-700">
            <Clock size={14} />
            <span title={doc.lastActionTS}>
              {formatTimestamp(doc.lastActionTS)}
            </span>
          </p>
        </td>

        <td className="py-3 px-4">
          <button
            onClick={() => handleCompare(doc)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded flex items-center"
          >
            <List className="w-4 h-4 mr-1" />
            Compare
          </button>
        </td>

        {/* Actions Column - Only show when conditions are met */}
        {showActions && (
          <td className="py-3 pl-4">
            <Popover>
              <PopoverTrigger asChild>
                <EllipsisVertical size={16} className="cursor-pointer" />
              </PopoverTrigger>
              {!showRejectUI ? (
                <PopoverContent className="w-60 mr-4">
                  <div className="space-y-2">
                    <Popover
                      open={editWorkflowOpen}
                      onOpenChange={setEditWorkflowOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setEditWorkflowOpen(true)}
                        >
                          <Pencil size={16} className="mr-2" />
                          Edit Review Process
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4 mr-4">
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm">
                            Confirm Edit Workflow
                          </h4>
                          <p className="text-sm text-gray-500">
                            <p className="font-medium">
                              Review is already in process.
                            </p>
                            Are you sure you want to edit the workflow?
                          </p>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditWorkflowOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() =>
                                handleConfirmEditWorkflow(doc.id)
                              }
                            >
                              Yes, Confirm
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={() => setShowRejectUI(true)}
                    >
                      <CircleMinus size={16} className="mr-2" />
                      Deactivate Review Process
                    </Button>
                  </div>
                </PopoverContent>
              ) : (
                <PopoverContent className="w-80 p-4 mr-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-red-500">Deactivate</h4>
                    <p className="text-sm text-gray-500">
                      Please sign below to deactivate this section.
                    </p>

                    <SignatureComponent
                      onSave={handleRejectionSignatureSave}
                    />

                    <p className="text-sm text-gray-500 mt-2">
                      Please provide a reason for deactivating this section.
                    </p>
                    <Textarea
                      placeholder="Enter reason..."
                      className="min-h-24"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRejectionReason("");
                          setRejectionSignature(null);
                          setShowRejectUI(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => setShowRejectUI(false)}
                        disabled={
                          !rejectionReason.trim() || !rejectionSignature
                        }
                      >
                        Confirm Deactivation
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              )}
            </Popover>
          </td>
        )}

        {/* Review Panel Column - Only show when conditions are met */}
        {showActions && (
          <td className="px-4 py-3 text-center">
            <button
              onClick={() =>
                setExpandedApprovalCycle(
                  expandedApprovalCycle === doc.id ? null : doc.id
                )
              }
              className="p-2 rounded hover:bg-gray-200 flex items-center justify-center mx-auto"
              title="Review Panel"
            >
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  expandedApprovalCycle === doc.id ? "rotate-180" : ""
                }`}
              />
            </button>
          </td>
        )}
      </tr>

      {/* Review Panel Expansion Row - Only show when conditions are met */}
      {showReviewPanel && expandedApprovalCycle === doc.id && (
        <tr>
          <td
            colSpan={hasDocumentsInReview ? 8 : 6}
            className="px-4 py-2 bg-gray-50 border-b border-gray-200"
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-400">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Attributes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-400">
                  {sampleApprovalNodes.map((node) => (
                    <tr
                      key={node.id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              node.type === "user"
                                ? "bg-blue-500"
                                : node.type === "group"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          <div className="text-sm font-medium text-gray-900">
                            {node.label}
                          </div>
                          <Badge
                            className={`ml-2 ${
                              node.type === "user"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : node.type === "group"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {node.type === "user"
                              ? "User"
                              : node.type === "group"
                              ? "Group"
                              : "Approval"}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-md ${
                            node.status === "Assigned" ||
                            node.status === "Initiated"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              node.status === "Assigned" ||
                              node.status === "Initiated"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          ></span>
                          {node.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {node.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="flex items-center group"
                            >
                              <span
                                className={`bg-blue-50 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-l-md border-r border-blue-200 group-hover:bg-blue-100 transition-colors ${
                                  index % 3 === 1
                                    ? "bg-green-50 text-green-800 border-green-200 group-hover:bg-green-100"
                                    : index % 3 === 2
                                    ? "bg-purple-50 text-purple-800 border-purple-200 group-hover:bg-purple-100"
                                    : ""
                                }`}
                              >
                                {attr.name}
                              </span>
                              <span
                                className={`bg-white text-gray-700 text-xs px-2 py-0.5 rounded-r-md border ${
                                  index % 3 === 1
                                    ? "border-green-100 border-l-0 group-hover:border-green-200"
                                    : index % 3 === 2
                                    ? "border-purple-100 border-l-0 group-hover:border-purple-200"
                                    : "border-blue-100 border-l-0 group-hover:border-blue-200"
                                } transition-colors`}
                              >
                                {attr.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}

      {/* Summary Expansion Row */}
      {expandedSummary === doc.id && summaryData && (
        <tr>
          <td
            colSpan={hasDocumentsInReview ? 6 : 4}
            className="px-4 py-2 bg-gray-50 border-b border-gray-200"
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-white p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {summaryData.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">
                      Review Content Selected:
                    </span>{" "}
                    {summaryData.reviewContentSelected}
                  </p>
                </div>

                <div className="space-y-4">
                  {summaryData.reviewGroups.map((group) => (
                    <div
                      key={group.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
                        <h4 className="font-medium text-gray-700">
                          {group.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Approved At: {formatTimestamp(group.approvedAt)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {group.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        {group.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium text-gray-800">
                                  {comment.title}
                                </h5>
                                <p className="text-xs text-gray-500">
                                  By {comment.user} •{" "}
                                  {formatTimestamp(comment.timestamp)}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              {comment.content}
                            </p>

                            {comment.replies.length > 0 && (
                              <div className="ml-6 mt-3 space-y-2 border-l-2 border-gray-200 pl-4">
                                {comment.replies.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="bg-gray-50 p-3 rounded-md border border-gray-200"
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <p className="text-xs text-gray-500">
                                        Reply by {reply.user} •{" "}
                                        {formatTimestamp(reply.timestamp)}
                                      </p>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      {reply.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default DocumentPendingRow;
// /components/review-tasks/ReviewTasksTable.jsx
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ReviewTasksTableHeader } from "./review-tasks-table-header";
import { ReviewTasksTableRow } from "./review-tasks-table-row";

export function ReviewTasksTable({
  selectedDocuments,
  toggleSelectAll,
  sortedData,
  filteredDocuments,
  sortColumn,
  sortDirection,
  columnFilters,
  handleSort,
  handleFilterChange,
  filterStatus,
  reviewerTypeFilter,
  setReviewerTypeFilter,
  // Table row props
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
    <div className="rounded-lg border-1 border-gray-400 shadow-sm bg-white overflow-x-auto">
      
      {filterStatus !== "all" && <div className="p-4 bg-blue-50 flex space-x-2">
        {["All", "User", "Group"].map((tab) => (
          <button
            key={tab}
            onClick={() => setReviewerTypeFilter(tab.toLowerCase())}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
              reviewerTypeFilter === tab.toLowerCase()
                ? "bg-blue-600  text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab} Tasks
          </button>
        ))}
      </div>}
      <Table>
        <ReviewTasksTableHeader
          selectedDocuments={selectedDocuments}
          filteredDocuments={filteredDocuments}
          toggleSelectAll={toggleSelectAll}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleSort={handleSort}
          handleFilterChange={handleFilterChange}
          filterStatus={filterStatus}
        />

        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No documents found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((doc, index) => (
              <ReviewTasksTableRow
                key={doc.id}
                doc={doc}
                index={index}
                selectedDocuments={selectedDocuments}
                toggleDocumentSelection={toggleDocumentSelection}
                expandedDocumentSections={expandedDocumentSections}
                toggleSectionsExpansion={toggleSectionsExpansion}
                expandedCommentRows={expandedCommentRows}
                setExpandedCommentRows={setExpandedCommentRows}
                documentToAction={documentToAction}
                setDocumentToAction={setDocumentToAction}
                approvePopoverOpen={approvePopoverOpen}
                setApprovePopoverOpen={setApprovePopoverOpen}
                rejectPopoverOpen={rejectPopoverOpen}
                setRejectPopoverOpen={setRejectPopoverOpen}
                approvalReason={approvalReason}
                setApprovalReason={setApprovalReason}
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                approvalSignature={approvalSignature}
                setApprovalSignature={setApprovalSignature}
                rejectionSignature={rejectionSignature}
                setRejectionSignature={setRejectionSignature}
                handleApprove={handleApprove}
                handleReject={handleReject}
                handleApprovalSignatureSave={handleApprovalSignatureSave}
                handleRejectionSignatureSave={handleRejectionSignatureSave}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getAiSummary={getAiSummary}
                getAiSentiment={getAiSentiment}
                isDocumentSigned={isDocumentSigned}
                user={user}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
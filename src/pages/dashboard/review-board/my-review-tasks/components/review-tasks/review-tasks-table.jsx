// /components/review-tasks/ReviewTasksTable.jsx
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
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
  // Pagination props
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  handlePageChange,
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
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
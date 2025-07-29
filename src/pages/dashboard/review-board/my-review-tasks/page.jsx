// Updated page.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { 
  filterDocuments, 
  sortDocuments, 
  getStatusColor, 
  getStatusIcon, 
  getAiSummary, 
  getAiSentiment 
} from "./utils/review-tasks-utils";

import { ReviewTasksStatusTabs } from "./components/review-tasks/review-tasks-status-tabs";
import { ReviewTasksTable } from "./components/review-tasks/review-tasks-table";
import { documentsToReview } from "./mock-data/documents-to-review";
import { flightManualSections } from "./mock-data/flight-manual-sections";

export default function ReviewTasksPage({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [documentToAction, setDocumentToAction] = useState(null);
  const [approvePopoverOpen, setApprovePopoverOpen] = useState(false);
  const [rejectPopoverOpen, setRejectPopoverOpen] = useState(false);
  const [expandedCommentRows, setExpandedCommentRows] = useState([]);
  const [approvalSignature, setApprovalSignature] = useState(null);
  const [rejectionSignature, setRejectionSignature] = useState(null);
  const [documentSignatures, setDocumentSignatures] = useState({});
  const [expandedDocumentSections, setExpandedDocumentSections] = useState(null);
    
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [filterStatus, setFilterStatus] = useState(
    tabParam ? (tabParam === "all" ? "expired" : "pending") : "pending"
  );

  const [reviewerTypeFilter, setReviewerTypeFilter] = useState(
    tabParam && ["group", "user", "all"].includes(tabParam) ? tabParam : "all"
  );

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle column filter change
  const handleFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Filter and sort data
  const filteredDocuments = filterDocuments(
    documentsToReview, 
    searchQuery, 
    filterStatus, 
    reviewerTypeFilter, 
    columnFilters
  );
  const sortedData = sortDocuments(filteredDocuments, sortColumn, sortDirection);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);


  // Page change handler  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Toggle document selection
  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  // Toggle select all documents
  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id));
    }
  };

  // Toggle flight manual sections expansion
  const toggleSectionsExpansion = (docId) => {
    if (expandedDocumentSections === docId) {
      setExpandedDocumentSections(null);
    } else {
      setExpandedDocumentSections(docId);
    }
  };

  // Handler for approval signature
  const handleApprovalSignatureSave = (signatureURL) => {
    setApprovalSignature(signatureURL);
  };

  // Handler for rejection signature
  const handleRejectionSignatureSave = (signatureURL) => {
    setRejectionSignature(signatureURL);
  };

  // Handle document approval with reason and signature
  const handleApprove = (docId) => {
    if (!approvalSignature) {
      alert("Please sign the document before approving.");
      return;
    }

    console.log(`Approved document ${docId} with reason: ${approvalReason}`);
    console.log(`Signature provided: ${approvalSignature ? "Yes" : "No"}`);

    // Store the signature and reason for this document
    setDocumentSignatures((prev) => ({
      ...prev,
      [docId]: {
        status: "approved",
        signature: approvalSignature,
        reason: approvalReason,
      },
    }));

    alert(`Document approved with reason: ${approvalReason}`);
    setApprovalReason("");
    setApprovalSignature(null);
    setDocumentToAction(null);
    setApprovePopoverOpen(false);
  };

  // Handle document rejection with reason and signature
  const handleReject = (docId) => {
    if (!rejectionSignature) {
      alert("Please sign the document before rejecting.");
      return;
    }

    console.log(`Rejected document ${docId} with reason: ${rejectionReason}`);
    console.log(`Signature provided: ${rejectionSignature ? "Yes" : "No"}`);

    // Store the signature and reason for this document
    setDocumentSignatures((prev) => ({
      ...prev,
      [docId]: {
        status: "rejected",
        signature: rejectionSignature,
        reason: rejectionReason,
      },
    }));

    alert(`Document rejected with reason: ${rejectionReason}`);
    setRejectionReason("");
    setRejectionSignature(null);
    setDocumentToAction(null);
    setRejectPopoverOpen(false);
  };

  // Check if document is signed
  const isDocumentSigned = (docId) => {
    return documentSignatures[docId] !== undefined;
  };

  // AI analysis functions
  const getDocumentAiSummary = (docId) => {
    return getAiSummary(docId, documentsToReview, flightManualSections);
  };

  const getDocumentAiSentiment = (docId) => {
    return getAiSentiment(docId, documentsToReview, flightManualSections);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <h1 className="text-2xl font-bold text-gray-800">Tasks Review Center</h1>
      
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search tasks by name, reference, or comments..."
          className="pl-10 h-12 bg-white shadow-sm border-gray-300 focus:border-blue-500"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Status Tabs */}
      <ReviewTasksStatusTabs
        tabParam={tabParam}
        setFilterStatus={setFilterStatus}
        filterStatus={filterStatus}
        setReviewerTypeFilter={setReviewerTypeFilter}
        reviewerTypeFilter={reviewerTypeFilter}
      />

      {/* Table Section */}
      <ReviewTasksTable
        selectedDocuments={selectedDocuments}
        toggleSelectAll={toggleSelectAll}
        sortedData={paginatedData}
        filteredDocuments={filteredDocuments}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        columnFilters={columnFilters}
        handleSort={handleSort}
        handleFilterChange={handleFilterChange}
        filterStatus={filterStatus}
        reviewerTypeFilter={reviewerTypeFilter}
        setReviewerTypeFilter={setReviewerTypeFilter}
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
        getAiSummary={getDocumentAiSummary}
        getAiSentiment={getDocumentAiSentiment}
        isDocumentSigned={isDocumentSigned}
        user={user}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={sortedData.length}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}
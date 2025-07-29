import React, { useContext, useState, useMemo } from "react";
import { DocumentContext } from "../../contexts/DocumentContext";
import { FullPagePopup } from "../../common/shared-utils";
import DocumentPendingRow from "./documentPendingRow";
import { sampleData, sampleSummaryData } from "../mock-data/review";
import { mockReferenceDocuments } from "../mock-data/review";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";

// Import helper functions
import {
  normalizeStatus,
  shouldShowActionsColumn,
  filterDocuments,
  checkHasBothVersions,
  checkHasDocumentsInReview,
  getTableHeaderConfig,
} from "./documentPendingHelpers";
import { SearchableColumnHeader } from "../components/searchable-column-header";
import UniversalDocumentViewer from "@/components/universal-document-viewer";

function DocumentPendingTable({ 
  setActiveStep, 
  setIsBotOpen,
  sortColumn,
  sortDirection,
  columnFilters = {},
  handleSort,
  handleFilterChange
}) {
  const {
    documents,
    approvedDocuments,
    disapprovedDocuments,
    referenceDocuments,
    deactivateDocument,
    setCurrentDocId,
    updateDocumentReviewStatus,
    isSubmitted,
    setDocuments,
  } = useContext(DocumentContext);

  // State management
  const [isWebViewerLoaded, setIsWebViewerLoaded] = useState(false);
  const [isComparePopupOpen, setIsComparePopupOpen] = useState(false);
  const [isViewerPopupOpen, setIsViewerPopupOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedTab, setSelectedTab] = useState("working");
  const [viewerType, setViewerType] = useState(null);
  const [expandedApprovalCycle, setExpandedApprovalCycle] = useState(null);
  const [editWorkflowOpen, setEditWorkflowOpen] = useState(false);
  const [confirmEditWorkflow, setConfirmEditWorkflow] = useState(false);
  const [showRejectUI, setShowRejectUI] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionSignature, setRejectionSignature] = useState(null);
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState(null);
  const [openDescriptionDropDown, setOpenDescriptionDropdown] = useState(null);
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [localSampleData, setLocalSampleData] = useState(sampleData);
  const [summaryData, setSummaryData] = useState(sampleSummaryData);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const status = "pending";

  // Event handlers
  const handleDocDescription = (e) => {
    e.stopPropagation();

    const isContextDoc = documents.some(
      (doc) => doc.id == openDescriptionDropDown
    );

    if (isContextDoc) {
      const updatedData = documents.map((obj) => {
        if (obj.id == openDescriptionDropDown) {
          return { ...obj, description: description };
        }
        return obj;
      });
      setDocuments(updatedData);
    } else {
      const updatedSampleData = localSampleData.map((obj) => {
        if (obj.id == openDescriptionDropDown) {
          return { ...obj, description: description };
        }
        return obj;
      });
      setLocalSampleData(updatedSampleData);
    }

    setIsEditDescription(false);
    setDescription("");
  };

  const handleWebViewerLoad = () => {
    setIsWebViewerLoaded(true);
  };

  const handleCompare = (document) => {
    setSelectedDoc(document);
    setIsComparePopupOpen(true);
  };

  const handleView = (document) => {
    console.log("clicked");
    setSelectedDoc(document);
    setViewerType(document.fileType);
    setIsViewerPopupOpen(true);
  };

  const handleEditClick = (docId) => {
    if (setActiveStep) {
      setActiveStep(1);
      setCurrentDocId(docId);
    }
  };

  const handleRejectionSignatureSave = (signature) => {
    setRejectionSignature(signature);
  };

  const handleConfirmEditWorkflow = (docId) => {
    console.log("Edit workflow confirmed");
    setEditWorkflowOpen(false);
    setConfirmEditWorkflow(false);
    console.log(docId);
    setCurrentDocId(docId);
    setActiveStep(1);
  };

  const handleDeleteDocument = (doc) => {
    if (deactivateDocument) {
      deactivateDocument(doc.id);
    }
    setDeletePopoverOpen(false);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Computed values using helper functions
  const allDocs = useMemo(() => {
    const contextDocs = documents ? documents.map(normalizeStatus) : [];
    const normalizedSampleData = localSampleData.map(normalizeStatus);

    if (referenceDocuments && referenceDocuments.length > 0) {
      return [...contextDocs, ...normalizedSampleData];
    }

    return [...contextDocs, ...normalizedSampleData];
  }, [documents, referenceDocuments, localSampleData]);

  const filteredDocs = useMemo(() => {
    let docs = filterDocuments(allDocs, status, selectedTab);

    // Apply column filters
    if (Object.keys(columnFilters).length > 0) {
      docs = docs.filter((doc) => {
        return Object.entries(columnFilters).every(([key, value]) => {
          if (!value) return true;
          
          let fieldValue = "";
          switch (key) {
            case "title":
            case "name":
              fieldValue = doc.title || doc.name || "";
              break;
            case "description":
              fieldValue = doc.description || "";
              break;
            case "owner":
              fieldValue = doc.owner?.officer || "";
              break;
            case "department":
              fieldValue = doc.owner?.department || "";
              break;
            case "uploadedAt":
              fieldValue = doc.uploadedAt || "";
              break;
            case "lastActionTS":
              fieldValue = doc.lastActionTS || "";
              break;
            case "category":
              fieldValue = doc.category || "";
              break;
            case "type":
              fieldValue = doc.type || "";
              break;
            default:
              fieldValue = String(doc[key] || "");
          }
          
          return fieldValue.toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return docs;
  }, [allDocs, selectedTab, status, columnFilters]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredDocs;

    return [...filteredDocs].sort((a, b) => {
      let aValue = "";
      let bValue = "";

      switch (sortColumn) {
        case "title":
        case "name":
          aValue = a.title || a.name || "";
          bValue = b.title || b.name || "";
          break;
        case "description":
          aValue = a.description || "";
          bValue = b.description || "";
          break;
        case "owner":
          aValue = a.owner?.officer || "";
          bValue = b.owner?.officer || "";
          break;
        case "department":
          aValue = a.owner?.department || "";
          bValue = b.owner?.department || "";
          break;
        default:
          aValue = String(a[sortColumn] || "");
          bValue = String(b[sortColumn] || "");
      }

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [filteredDocs, sortColumn, sortDirection]);

  const hasBothVersions = useMemo(() => {
    return checkHasBothVersions(allDocs);
  }, [allDocs]);

  const hasDocumentsInReview = useMemo(() => {
    return checkHasDocumentsInReview(sortedData);
  }, [sortedData]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Render document row using the separate DocumentPendingRow component
  const renderDocumentRow = (doc) => {
    return (
      <DocumentPendingRow
        key={doc.id}
        doc={doc}
        selectedTab={selectedTab}
        isSubmitted={isSubmitted}
        hasDocumentsInReview={hasDocumentsInReview}
        summaryData={summaryData}
        // State props
        openDescriptionDropDown={openDescriptionDropDown}
        setOpenDescriptionDropdown={setOpenDescriptionDropdown}
        isEditDescription={isEditDescription}
        setIsEditDescription={setIsEditDescription}
        description={description}
        setDescription={setDescription}
        expandedApprovalCycle={expandedApprovalCycle}
        setExpandedApprovalCycle={setExpandedApprovalCycle}
        editWorkflowOpen={editWorkflowOpen}
        setEditWorkflowOpen={setEditWorkflowOpen}
        showRejectUI={showRejectUI}
        setShowRejectUI={setShowRejectUI}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        rejectionSignature={rejectionSignature}
        setRejectionSignature={setRejectionSignature}
        deletePopoverOpen={deletePopoverOpen}
        setDeletePopoverOpen={setDeletePopoverOpen}
        expandedSummary={expandedSummary}
        // Event handlers
        handleDocDescription={handleDocDescription}
        handleView={handleView}
        handleEditClick={handleEditClick}
        handleCompare={handleCompare}
        handleRejectionSignatureSave={handleRejectionSignatureSave}
        handleConfirmEditWorkflow={handleConfirmEditWorkflow}
        handleDeleteDocument={handleDeleteDocument}
      />
    );
  };

  const tableHeaderConfig = getTableHeaderConfig(status);

  // Helper function to get document URL
  const getDocumentUrl = (doc, type = 'single') => {
    if (type === 'compare') {
      return doc.finalCopy || '/sample-1.pdf';
    }
    // Return appropriate URL based on file type
    if (doc.fileType === 'docx' || doc.fileType === 'doc') {
      return '/sample-table-2.docx'; // Replace with actual document URL
    }
    return '/sample.pdf'; // Replace with actual document URL
  };

  const getCompareDocumentUrl = (doc) => {
    return doc.workingCopy || '/sample-changes2.pdf';
  };

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden border-1 border-gray-400">
      <div
        className={`p-4 border-b border-gray-200 ${tableHeaderConfig.bgColor}`}
      >
        <h2 className={`text-lg font-semibold ${tableHeaderConfig.textColor}`}>
          {tableHeaderConfig.title}
        </h2>

        <div className="mt-4 flex space-x-2">
          {["working", "final", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
                selectedTab === tab
                  ? "bg-blue-600  text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "working"
                ? "Working Copies"
                : tab === "final"
                ? "Final Version"
                : "All Documents"}
            </button>
          ))}
        </div>
      </div>

      {paginatedData.length === 0 ? (
        <div className="text-center text-gray-500">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-50 text-left">
              <tr className="border-b bg-blue-600 border-gray-200">
                <SearchableColumnHeader
                  title="Document Name"
                  column="title"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <SearchableColumnHeader
                  title="Description"
                  column="description"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <SearchableColumnHeader
                  title="Owner"
                  column="owner"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <SearchableColumnHeader
                  title="Uploaded TS"
                  column="uploadedAt"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <SearchableColumnHeader
                  title="Last Action TS"
                  column="lastActionTS"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <th className="px-4 py-3 font-semibold text-gray-50">
                  Compare
                </th>
                {/* Conditionally show Actions header based on documents */}
                {paginatedData.some((doc) => shouldShowActionsColumn(doc, selectedTab, isSubmitted)) && (
                  <th className="px-4 py-3 font-semibold text-gray-50">
                    Actions
                  </th>
                )}
                {/* Conditionally show Review Panel header */}
                {paginatedData.some((doc) => shouldShowActionsColumn(doc, selectedTab, isSubmitted)) && (
                  <th className="px-4 py-3 font-semibold text-gray-50 text-center w-32">
                    Review Panel
                  </th>
                )}
              </tr>
            </thead>
          </table>
          {Object.keys(columnFilters).length > 0 
            ? "No documents found matching your search criteria."
            : selectedTab === "working"
            ? "No working copies found."
            : selectedTab === "final"
            ? "No final versions found."
            : "No documents found."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-50 text-left">
              <tr className="border-b bg-blue-600 border-gray-200">
                <SearchableColumnHeader
                  title="Document Name"
                  column="title"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <SearchableColumnHeader
                  title="Description"
                  column="description"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <SearchableColumnHeader
                  title="Owner"
                  column="owner"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <SearchableColumnHeader
                  title="Uploaded TS"
                  column="uploadedAt"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <SearchableColumnHeader
                  title="Last Action TS"
                  column="lastActionTS"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <th className="px-4 py-3 font-semibold text-gray-50">
                  Compare
                </th>
                {/* Conditionally show Actions header based on documents */}
                {paginatedData.some((doc) => shouldShowActionsColumn(doc, selectedTab, isSubmitted)) && (
                  <th className="px-4 py-3 font-semibold text-gray-50">
                    Actions
                  </th>
                )}
                {/* Conditionally show Review Panel header */}
                {paginatedData.some((doc) => shouldShowActionsColumn(doc, selectedTab, isSubmitted)) && (
                  <th className="px-4 py-3 font-semibold text-gray-50 text-center w-32">
                    Review Panel
                  </th>
                )}
              </tr>
            </thead>
            <tbody>{paginatedData.map(renderDocumentRow)}</tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"} transition-colors`}
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
                        className={`cursor-pointer transition-colors ${
                          currentPage === page 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "hover:bg-blue-50"
                        }`}
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
                  className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"} transition-colors`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Compare Popup using Universal Viewer */}
      <FullPagePopup
        isOpen={isComparePopupOpen}
        onClose={() => setIsComparePopupOpen(false)}
        title="Document Comparison"
      >
        {selectedDoc && (
          <UniversalDocumentViewer
            documentUrl={getDocumentUrl(selectedDoc, 'compare')}
            compareDocument={getCompareDocumentUrl(selectedDoc)}
            mode="compare"
            documentType={selectedDoc.fileType}
            height="100%"
            onLoadComplete={handleWebViewerLoad}
            onError={(error) => console.error('Error loading comparison:', error)}
          />
        )}
      </FullPagePopup>

      {/* View Popup using Universal Viewer */}
      <FullPagePopup
        isOpen={isViewerPopupOpen}
        onClose={() => {
          setIsViewerPopupOpen(false);
          setIsWebViewerLoaded(false);
        }}
        title={`Document Viewer - ${selectedDoc?.title || selectedDoc?.name || 'Document'}`}
      >
        {selectedDoc && (
          <>
            {!isWebViewerLoaded && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-gray-600">Loading document viewer...</p>
                </div>
              </div>
            )}

            <div
              className={`transition-opacity duration-300 ${
                isWebViewerLoaded ? "opacity-100 h-full" : "opacity-0"
              }`}
            >
              <UniversalDocumentViewer
                documentUrl={getDocumentUrl(selectedDoc)}
                documentType={selectedDoc.fileType}
                mode="single"
                enableEditing={selectedDoc.fileType === 'docx' || selectedDoc.fileType === 'doc'}
                height="100%"
                onLoadComplete={handleWebViewerLoad}
                onError={(error) => console.error('Error loading document:', error)}
              />
            </div>
          </>
        )}
      </FullPagePopup>
    </div>
  );
}

export default DocumentPendingTable;
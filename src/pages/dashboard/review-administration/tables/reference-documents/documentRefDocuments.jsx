import React, { useContext, useState, useMemo } from "react";
import { DocumentContext } from "../../contexts/DocumentContext";
import {
  FileText,
  Clock,
  Eye,
  FileIcon,
  User,
  Building,
  Briefcase,
  Bot,
  X,
  Pencil,
} from "lucide-react";
import PDFViewer from "../../sub-component/doc-reviewer/pdf-viewer";
import { Badge } from "../../../../../components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import PDFViewerPendingTable from "../../sub-component/doc-reviewer/pdf-viewer-with-pending-table";
import { FullPagePopup } from "../../common/shared-utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../../components/ui/tooltip";
import { sampleData, sampleSummaryData } from "../mock-data/review";
import { mockReferenceDocuments } from "../mock-data/review";
import { DocumentBadgesSection } from "../../common/shared-tabs-utils";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";

// Import helper functions
import {
  formatTimestamp,
  truncate,
  normalizeStatus,
  getDocumentName,
  getFileTypeBadge,
  getStatusBadge,
  isReferenceDocument,
  filterDocuments,
  getTableHeaderConfig,
} from "./documentRefDocsHelpers";
import { SearchableColumnHeader } from "../components/searchable-column-header";

function DocumentRefDocumentTable({ 
  setIsBotOpen,
  sortColumn,
  sortDirection,
  columnFilters = {},
  handleSort,
  handleFilterChange
}) {
  const {
    documents,
    referenceDocuments,
    setDocuments,
  } = useContext(DocumentContext);

  // State management
  const [isWebViewerLoaded, setIsWebViewerLoaded] = useState(false);
  const [isViewerPopupOpen, setIsViewerPopupOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [viewerType, setViewerType] = useState(null);
  const [openDescriptionDropDown, setOpenDescriptionDropdown] = useState(null);
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [localSampleData, setLocalSampleData] = useState(sampleData);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const status = "reference";
  const selectedTab = "all"; 

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

  const handleView = (document) => {
    console.log("clicked");
    setSelectedDoc(document);
    setViewerType(document.fileType);
    setIsViewerPopupOpen(true);
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

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Main render function for document rows
  const renderDocumentRow = (doc) => {
    const docName = getDocumentName(doc);
    const isReference = isReferenceDocument(doc);

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
                {isReference ? "View Doc" : "View"}
              </button>
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

          {/* Owner Column with the new design */}
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

          {/* Action Column for Reference Documents - Ask AI functionality */}
          <td className="px-4 py-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Bot
                  className="mx-auto h-4 w-4 cursor-pointer"
                  onClick={() => {
                    setIsBotOpen(true);
                  }}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-gray-50 px-2 text-gray-800 border-gray-300 border">
                Ask AI
              </TooltipContent>
            </Tooltip>
          </td>
        </tr>
      </React.Fragment>
    );
  };

  const tableHeaderConfig = getTableHeaderConfig(status);

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden border-1 border-gray-400">
      <div
        className={`p-4 border-b border-gray-200 ${tableHeaderConfig.bgColor}`}
      >
        <h2 className={`text-lg font-semibold ${tableHeaderConfig.textColor}`}>
          {tableHeaderConfig.title}
        </h2>
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
                <th className="px-4 py-3 font-semibold text-gray-50">
                  Action
                </th>
              </tr>
            </thead>
          </table>
          {Object.keys(columnFilters).length > 0 
            ? "No reference documents found matching your search criteria."
            : "No reference documents found."}
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
                <th className="px-4 py-3 font-semibold text-gray-50">
                  Action
                </th>
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

      <FullPagePopup
        isOpen={isViewerPopupOpen}
        onClose={() => {
          setIsViewerPopupOpen(false), setIsWebViewerLoaded(false);
        }}
      >
        {selectedDoc && viewerType === "pdf" && (
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
              <PDFViewer onLoadComplete={handleWebViewerLoad} />
            </div>
          </>
        )}
        {selectedDoc && (viewerType === "docx" || viewerType === "doc") && (
          <>
            {!isWebViewerLoaded && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-gray-600">Loading document viewer...</p>
                </div>
              </div>
            )}

            <div>
              <PDFViewerPendingTable onLoadComplete={handleWebViewerLoad} />
            </div>
          </>
        )}
      </FullPagePopup>
    </div>
  );
}

export default DocumentRefDocumentTable;
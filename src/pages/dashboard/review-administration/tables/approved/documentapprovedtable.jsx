import React, { useState, useMemo } from "react";
import { FileText, Eye, Clock, UsersRound, CornerDownRight, UserPen, ClipboardList, Bot, Briefcase, Building, User, ChevronDown, X } from "lucide-react";

import { Badge } from "../../../../../components/ui/badge";
import { Button } from "../../../../../components/ui/button";
import { documentData } from "@/mock-data/review-adm-approved-table";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { SearchableColumnHeader } from "../components/searchable-column-header";

import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../../components/ui/tooltip";

import { approvalNodes } from "../mock-data/approved";
import { approverData } from "../mock-data/approved";
import { referenceTexts } from "../mock-data/approved";
import { mockReferenceDocuments } from "../mock-data/approved";
import { mockDocumentReferences } from "../mock-data/approved";
import { cctData } from "../mock-data/approved";
import { DocumentBadgesSection } from "../../common/shared-tabs-utils";

import { ReferenceDocumentsPopover } from "../../common/shared-utils";
import { FullPagePopup } from "../../common/shared-utils";
import { ReferenceDocumentsDialog } from "../../common/shared-utils";

// Import helper functions
import {
  truncate,
  formatTimestamp,
  getReferenceDocuments,
  handleRemoveReferenceDocument,
  toggleReferencePopover,
  handleReviewCycleClick,
  handleSaveReferenceDocuments,
  handleOpenReferenceDialog,
  handleWebViewerLoad,
  handleSummaryClick,
  handleCommentedCopyClick,
  handleClosePopup,
  handleCommentedCopyClosePopup,
  renderNodeBadge,
  renderNodeStatus,
  renderAttributeStyle,
  renderNodeTypeIndicator,
} from "./approvedHelpers";
import UniversalDocumentViewer from "@/components/universal-document-viewer";

const DocumentApprovedTable = ({ 
  setIsBotOpen,
  sortColumn,
  sortDirection,
  columnFilters = {},
  handleSort,
  handleFilterChange
}) => {
  // State management
  const [documents, setDocuments] = useState(documentData);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isFullPagePopupOpen, setIsFullPagePopupOpen] = useState(false);
  const [isCommentedOpen, setIsCommentedCopyOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isWebViewerLoaded, setIsWebViewerLoaded] = useState(false);
  const [openDescriptionDropDown, setOpenDescriptionDropdown] = useState(null);
  const [expandedReviewCycle, setExpandedReviewCycle] = useState(null);
  const [referenceDocsDialogOpen, setReferenceDocsDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [documentReferences, setDocumentReferences] = useState(mockDocumentReferences);
  const [referencePopovers, setReferencePopovers] = useState({});

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filteredDocs = [...documents];

    // Apply column filters
    if (Object.keys(columnFilters).length > 0) {
      filteredDocs = filteredDocs.filter((doc) => {
        return Object.entries(columnFilters).every(([key, value]) => {
          if (!value) return true;
          
          let fieldValue = "";
          switch (key) {
            case "title":
              fieldValue = doc.title || "";
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
            case "approvedAt":
              fieldValue = doc.approvedAt || "";
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

    // Apply sorting
    if (sortColumn && sortDirection) {
      filteredDocs.sort((a, b) => {
        let aValue = "";
        let bValue = "";

        switch (sortColumn) {
          case "title":
            aValue = a.title || "";
            bValue = b.title || "";
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
    }

    return filteredDocs;
  }, [documents, columnFilters, sortColumn, sortDirection]);

  // Event handlers using helper functions
  const onWebViewerLoad = () => handleWebViewerLoad(setIsWebViewerLoaded);

  const onReviewCycleClick = (docId, e) => 
    handleReviewCycleClick(docId, expandedReviewCycle, setExpandedReviewCycle, e);

  const onSummaryClick = (doc) => 
    handleSummaryClick(doc, setSelectedDocument, setIsFullPagePopupOpen);

  const onCommentedCopyClick = () => 
    handleCommentedCopyClick(setIsCommentedCopyOpen);

  const onClosePopup = () => 
    handleClosePopup(setIsFullPagePopupOpen, setSelectedDocument);

  const onCommentedCopyClosePopup = () => 
    handleCommentedCopyClosePopup(setIsCommentedCopyOpen, setIsViewOpen, setIsWebViewerLoaded);

  const onOpenReferenceDialog = (doc) => 
    handleOpenReferenceDialog(doc, setSelectedDoc, setReferenceDocsDialogOpen);

  const onSaveReferenceDocuments = (selectedDocIds) => 
    handleSaveReferenceDocuments(selectedDocIds, selectedDoc, setDocumentReferences);

  const onRemoveReferenceDocument = (docId, refDocId) => 
    handleRemoveReferenceDocument(docId, refDocId, setDocumentReferences);

  const onToggleReferencePopover = (docId) => 
    toggleReferencePopover(docId, setReferencePopovers);

  const getRefDocs = (docId) => 
    getReferenceDocuments(docId, documentReferences, mockReferenceDocuments);

  // UPDATED: Helper functions to get document URLs and types
  const getDocumentUrl = (type = 'final') => {
    switch (type) {
      case 'final':
        return '/sample-table-no-comments.pdf'; // Final copy without comments
      case 'commented':
        return '/sample-table-comments.pdf'; // ← Change this line!
      default:
        return '/sample.pdf';
    }
  };

  const getDocumentType = (doc) => {
    return doc?.fileType || 'pdf';
  };

  return (
    <div className="border-1 border-gray-400 rounded-md w-full overflow-hidden">
      {filteredAndSortedDocuments.length === 0 ? (
        <div className="text-center text-gray-500">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-left ">
              <tr>
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
                  title="Approved TS"
                  column="approvedAt"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <th className="px-4 py-3 font-semibold text-gray-50">Action</th>
                <th className="px-2 py-1 font-semibold text-gray-50 whitespace-nowrap">
                  Review Panel
                </th>
              </tr>
            </thead>
          </table>
          {Object.keys(columnFilters).length > 0 
            ? "No approved documents found matching your search criteria."
            : "No approved documents found."}
        </div>
      ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-left ">
            <tr>
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
                title="Approved TS"
                column="approvedAt"
                width="px-4 py-3 font-semibold text-gray-50"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              <th className="px-4 py-3 font-semibold text-gray-50">Action</th>
              <th className="px-2 py-1 font-semibold text-gray-50 whitespace-nowrap">
                Review Panel
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedDocuments.map((doc) => (
              <React.Fragment key={doc.id}>
                <tr className="border-t-[1px] border-t-gray-400">
                  <td className="">
                    <div className="flex gap-1 px-2 items-center">
                      <FileText className="w-4 h-4 text-[#1a56db] mr-2" />
                      <span className="font-medium">
                        {doc.title}
                        <Badge className="bg-[#fef2f2] text-[#dc2626] text-xs px-2 ml-2">
                          {doc.fileType}
                        </Badge>
                      </span>
                      <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-semibold rounded-md bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-[#16a34a]"></span>
                        Approved
                      </span>
                    </div>
                    {doc.type && (
                      <DocumentBadgesSection
                        doc={doc}
                        showType={true}
                        showDomain={true}
                        showCategory={true}
                        className="mt-1 inline-flex pl-2 mx-auto items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <div className="flex mt-1 px-1 items-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsViewOpen(true);
                        }}
                        className="text-[#1a56db] mr-3 flex items-center text-xs cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Final Copy
                      </button>
                      <button
                        className="text-xs flex gap-1 text-[#1a56db] px-2 py-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSummaryClick(doc);
                        }}
                      >
                        <ClipboardList size={14} />
                        Summary
                      </button>
                      <button
                        className="text-xs flex gap-1 text-[#1a56db] px-2 py-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCommentedCopyClick();
                        }}
                      >
                        <UserPen size={14} />
                        Annotated Doc
                      </button>
                      {/* Reference Documents Popover */}
                      <ReferenceDocumentsPopover
                        isOpen={referencePopovers[doc.id] || false}
                        onOpenChange={() => onToggleReferencePopover(doc.id)}
                        referenceDocuments={getRefDocs(doc.id)}
                        onRemoveDocument={(refDocId) =>
                          onRemoveReferenceDocument(doc.id, refDocId)
                        }
                      />
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
                              <X
                                className="text-red-500 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation(),
                                    setOpenDescriptionDropdown(false);
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 pt-3 leading-relaxed">
                            {doc.description ||
                              "No description available for this document."}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>

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
                  <td className="py-1">
                    <p className="font-normal flex gap-1 items-center text-[#3f3f46]">
                      <Clock size={14} />
                      {formatTimestamp(doc.uploadedAt)}
                    </p>
                  </td>
                  <td className="py-1 px-2">
                    <p className="font-normal flex gap-1 items-center text-[#3f3f46]">
                      <Clock size={14} />
                      {formatTimestamp(doc.approvedAt)}
                    </p>
                  </td>
                  <td>
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
                  {/* Review Panel Cell */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-full flex justify-center items-center ${
                        expandedReviewCycle === doc.id
                          ? "bg-blue-100 text-blue-600"
                          : ""
                      }`}
                      onClick={(e) => onReviewCycleClick(doc.id, e)}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedReviewCycle === doc.id ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </td>
                </tr>

                {/* Review Cycle Expanded Section */}
                {expandedReviewCycle === doc.id && (
                  <tr key={`review-cycle-expanded-${doc.id}`}>
                    <td colSpan={7} className="p-0">
                      <div className="p-4 border-t">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Attributes
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {approvalNodes.map((node) => {
                              const nodeStatus = renderNodeStatus(node.status);
                              return (
                                <tr
                                  key={node.id}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div
                                        className={`w-2 h-2 rounded-full mr-2 ${renderNodeTypeIndicator(node.type)}`}
                                      ></div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {node.label}
                                      </div>
                                      <Badge className={`ml-2 ${renderNodeBadge(node.type)}`}>
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
                                      className={`px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-md ${nodeStatus.containerClass}`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${nodeStatus.dotClass}`}
                                      ></span>
                                      {node.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1.5">
                                      {node.attributes.map((attr, index) => {
                                        const attrStyle = renderAttributeStyle(index);
                                        return (
                                          <div
                                            key={index}
                                            className="flex items-center group"
                                          >
                                            <span
                                              className={`text-xs font-medium px-2 py-0.5 rounded-l-md border-r transition-colors ${attrStyle.nameClass}`}
                                            >
                                              {attr.name}
                                            </span>
                                            <span
                                              className={`bg-white text-gray-700 text-xs px-2 py-0.5 rounded-r-md border transition-colors ${attrStyle.valueClass}`}
                                            >
                                              {attr.value}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {/* All Popup Modals - UPDATED to use UniversalDocumentViewer */}
      <FullPagePopup
        isOpen={isFullPagePopupOpen}
        onClose={onClosePopup}
        title={`${selectedDocument?.title || "Document"} - Review Summary`}
        setIsDownloading={setIsDownloading}
        exportButton={true}
      >
        {/* Keep existing summary content - no changes needed here */}
        <div>
          <div className="w-full border border-[#e5e7eb] border-b-0 overflow-hidden">
            {/* Header */}
            <div className="bg-[#f3f4f6] p-2 border-b border-b-[#d1d5db]">
              <h3 className="font-medium text-lg">Document Details</h3>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-6 text-sm">
              {/* Existing Fields */}
              <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Owner:
              </div>
              <div className="col-span-2 p-2 border-r border-b border-[#e5e7eb] text-[#1a56db]">
                {selectedDocument?.owner?.officer ||
                  selectedDocument?.owner ||
                  "N/A"}
              </div>

              <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Uploaded By:
              </div>
              <div className="col-span-2 p-2 border-b border-[#e5e7eb] text-[#1a56db]">
                {selectedDocument?.uploadedByName ||
                  selectedDocument?.owner?.officer ||
                  "N/A"}
              </div>

              <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Department:
              </div>
              <div className="col-span-2 p-2 border-r border-b border-[#e5e7eb] text-[#1a56db]">
                {selectedDocument?.department ||
                  selectedDocument?.owner?.department ||
                  "N/A"}
              </div>

              <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Uploaded TS:
              </div>
              <div className="col-span-2 p-2 border-b border-[#e5e7eb] text-[#1a56db]">
                {formatTimestamp(selectedDocument?.uploadedAt)}
              </div>

              <div className="col-span-1 p-2 border-r border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Category:
              </div>
              <div className="col-span-2 p-2 border-r border-[#e5e7eb] text-[#1a56db]">
                {selectedDocument?.category || "N/A"}
              </div>

              <div className="col-span-1 p-2 border-r border-[#e5e7eb] font-medium bg-[#f9fafb]">
                File Type:
              </div>
              <div className="col-span-2 p-2 border-[#e5e7eb]">
                {isDownloading ? (
                  <p className="text-[#dc2626] text-xs px-2">pdf</p>
                ) : (
                  <Badge className="bg-[#fef2f2] text-[#dc2626] text-xs px-2">
                    {selectedDocument?.fileType || "N/A"}
                  </Badge>
                )}
              </div>

              {/* Reference Documents Section */}
              <div className="col-span-1 p-2 border-r border-t border-[#e5e7eb] font-medium bg-[#f9fafb]">
                Reference Documents Linked:
              </div>
              <div className="col-span-5 p-2 border-t border-[#e5e7eb] text-[#1a56db] space-y-1 ">
                {selectedDocument?.referenceDocuments?.map((item, index) => (
                  <p key={index} className="">{item}</p>
                ))}
              </div>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium">
                  Change Control Title/Modification
                </th>
                <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium w-72">
                  Review Content Selected
                </th>
                <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium min-w-72">
                  Comments
                </th>
                <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium w-64">
                  Approval Details
                </th>
              </tr>
            </thead>
            <tbody>
              {cctData.map((cct, cctIndex) => (
                <React.Fragment key={cctIndex}>
                  {cct.references.map((ref, refIndex) => {
                    const isFirstRef = refIndex === 0;
                    const reference = referenceTexts[ref];
                    const approver = approverData[ref];

                    return (
                      <tr key={`${cctIndex}-${refIndex}`}>
                        {isFirstRef && (
                          <td
                            className="border border-[#E5E7EB] p-2 align-top"
                            rowSpan={cct.references.length}
                          >
                            <div className="font-medium">{cct.category}</div>
                            {reference && (
                              <div className="mt-2 text-sm text-[#1a56db] border-t pt-2">
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Author:
                                  </span>{" "}
                                  {reference.author}
                                </div>
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Title:
                                  </span>{" "}
                                  {reference.authorTitle}
                                </div>
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Group:
                                  </span>{" "}
                                  {reference.authorGroup}
                                </div>
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Created:
                                  </span>{" "}
                                  {formatTimestamp(reference.timestamp)}
                                </div>
                              </div>
                            )}
                          </td>
                        )}
                        <td className="border border-[#E5E7EB] p-2 align-top">
                          <div className="text-sm text-[#4b5563] whitespace-pre-line">
                            {reference?.text || "No content available"}
                          </div>
                          {reference && (
                            <div className="mt-2 text-sm text-[#2563eb] border-t pt-2">
                              <div>
                                <span className="text-[#000000] font-medium">
                                  Author:
                                </span>{" "}
                                {reference.author}
                              </div>
                              <div>
                                <span className="text-[#000000] font-medium">
                                  Created:
                                </span>{" "}
                                {formatTimestamp(reference.timestamp)}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="border border-[#E5E7EB] p-2 align-top">
                          {selectedDocument?.comments?.length > 0 ? (
                            selectedDocument.comments.map((comment) => (
                              <div key={comment.id} className="mb-4">
                                <div className="bg-[#ffffff] p-3 rounded-md border border-[#e5e7eb]">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-1">
                                      <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            {comment.name}
                                          </span>
                                          {isDownloading ? (
                                            <p className="text-[#000000] text-xs">
                                              {comment.title}
                                            </p>
                                          ) : (
                                            <Badge className="bg-[#e5e7eb] text-[#000000] text-xs">
                                              {comment.title}
                                            </Badge>
                                          )}
                                        </div>
                                        {isDownloading ? (
                                          <p className="text-xs w-fit text-[#2563eb]">
                                            {comment.group}
                                          </p>
                                        ) : (
                                          <Badge className="bg-[#2563eb] text-[#ffffff] text-xs w-fit flex items-center gap-1">
                                            <UsersRound size={12} />
                                            {comment.group}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="mt-2 text-sm">
                                        {comment.comment}
                                      </p>
                                      <p className="text-xs text-[#6b7280] mt-1">
                                        {formatTimestamp(comment.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {comment.replies?.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="ml-6 mt-2 bg-[#eff6ff] p-3 rounded-md border border-[#bfdbfe]"
                                  >
                                    <div className="flex items-start gap-2">
                                      <CornerDownRight
                                        size={16}
                                        className="text-[#4b5563] mt-1"
                                      />
                                      <div className="flex-1">
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                              {reply.name}
                                            </span>
                                            {isDownloading ? (
                                              <p className="text-[#000000] text-xs">
                                                {reply.title}
                                              </p>
                                            ) : (
                                              <Badge className="bg-[#e5e7eb] text-[#000000] text-xs">
                                                {reply.title}
                                              </Badge>
                                            )}
                                          </div>
                                          {isDownloading ? (
                                            <p className="text-xs w-fit text-[#2563eb]">
                                              {reply.group}
                                            </p>
                                          ) : (
                                            <Badge className="bg-[#2563eb] text-[#ffffff] text-xs w-fit flex items-center gap-1">
                                              <UsersRound size={12} />
                                              {reply.group}
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="mt-2 text-sm">
                                          {reply.comment}
                                        </p>
                                        <p className="text-xs text-[#6b7280] mt-1">
                                          {formatTimestamp(reply.timestamp)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-[#6B7280]">
                              No comments available for this document.
                            </div>
                          )}
                        </td>
                        <td className="border border-[#E5E7EB] p-2 align-top">
                          {approver ? (
                            <div className="flex flex-col gap-2">
                              <div className="font-medium">{approver.name}</div>
                              {isDownloading ? (
                                <p className="text-[#000000] text-xs">
                                  {approver.title}
                                </p>
                              ) : (
                                <Badge className="bg-[#e5e7eb] text-[#000000] text-xs">
                                  {approver.title}
                                </Badge>
                              )}
                              {isDownloading ? (
                                <p className="text-xs w-fit text-[#2563eb]">
                                  {approver.group}
                                </p>
                              ) : (
                                <Badge className="bg-[#2563eb] text-[#ffffff] text-xs w-fit flex items-center gap-1">
                                  <UsersRound size={12} />
                                  {approver.group}
                                </Badge>
                              )}
                              <div className="text-sm mt-2 text-[#2563eb]">
                                <span className="text-[#000000] font-medium">
                                  Approved at:
                                </span>{" "}
                                {formatTimestamp(approver.timestamp)}
                              </div>
                              <div className="mt-2 border-t pt-2">
                                <div className="text-xs text-[#6b7280]">
                                  Signature:
                                </div>
                                <img
                                  src={"/sig-2.png"}
                                  alt={`Signature of ${approver.name}`}
                                  className="h-24 object-contain mt-1"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-[#6B7280]">
                              No approval details available.
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </FullPagePopup>

      {/* UPDATED: Annotated/Commented Copy Popup */}
      <FullPagePopup
        isOpen={isCommentedOpen}
        onClose={onCommentedCopyClosePopup}
        title={`Annotated Document`}
      >
        <UniversalDocumentViewer
          documentUrl={getDocumentUrl('commented')}
          documentType="pdf"
          mode="single"
          enableToolbar={true}
          enableSearch={true}
          enableAnnotations={true}
          height="100%"
          onLoadComplete={() => console.log('Commented document loaded')}
          onError={(error) => console.error('Error loading commented document:', error)}
        />
      </FullPagePopup>

      {/* UPDATED: Final Copy Popup */}
      <FullPagePopup
        isOpen={isViewOpen}
        onClose={onCommentedCopyClosePopup}
        title={`Final Copy`}
      >
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
            documentUrl={getDocumentUrl('final')}
            documentType="pdf"
            mode="single"
            enableToolbar={true}
            enableSearch={true}
            enableAnnotations={false} // Final copy is usually read-only
            height="100%"
            onLoadComplete={onWebViewerLoad}
            onError={(error) => console.error('Error loading final document:', error)}
          />
        </div>
      </FullPagePopup>

      {/* Reference Documents Dialog */}
      {referenceDocsDialogOpen && selectedDoc && (
        <ReferenceDocumentsDialog
          isOpen={referenceDocsDialogOpen}
          onClose={() => setReferenceDocsDialogOpen(false)}
          selectedDocIds={documentReferences[selectedDoc.id] || []}
          onSave={onSaveReferenceDocuments}
          currentDocId={selectedDoc.id}
        />
      )}
    </div>
  );
};

export default DocumentApprovedTable;
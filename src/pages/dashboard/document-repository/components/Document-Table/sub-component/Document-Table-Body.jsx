import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MoreHorizontal,
  Bell,
  Check,
  X,
  Bot,
  User,
  Building,
  Briefcase,
  FileText,
  FileSearch,
  CheckCircle,
  XCircle,
  File,
  Clock,
  Calendar,
  Tag,
  ChevronDown,
  Layers,
  Link as LinkIcon,
  List,
  Newspaper,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DocumentViewer } from "@/components/document-viewer";
import PDFTextDiffViewer from "@/components/doc-reviewer-2/main";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ReferenceDocumentsDialog from '../Reference-Document-Dialog';
import ReferenceDocumentsPopover from "../Reference-Document-Popover";
import FileTree from "../File-Tree";
import CategoryView from "../Category-View";
import { FullPagePopup } from "../Miscellaneous";
import { useDocumentTable } from "../../../context/DocumentTableContext";

export const DocumentTableBody = () => {
  const {
    sortedData,
    status,
    expandedCCTRow,
    expandedReviewCycle,
    openRevisionPopovers,
    isOpenDescription,
    referencePopovers,
    viewerOpen,
    viewingDocument,
    isFullPagePopupOpen,
    isComparePopupOpen,
    selectedDoc,
    referenceDocsDialogOpen,
    selectedDocForRef,
    documentReferences,
    selectedCategory,
    selectedCategoryDocuments,
    IsresetFilters,
    setIsBotOpen,
    cctSubCategories,
    setIsResetFilters,
    setSelectedCategory,
    setExpandedCCTRow,
    setExpandedReviewCycle,
    setIsOpenDescription,
    handleRowClick,
    handleReviewCycleClick,
    openDocumentViewer,
    closeDocumentViewer,
    setIsFullPagePopupOpen,
    setIsComparePopupOpen,
    toggleRevisionPopover,
    setOpenRevisionPopovers,
    handleCompare,
    handleOpenReferenceDialog,
    setReferenceDocsDialogOpen,
    handleSaveReferenceDocuments,
    handleRemoveReferenceDocument,
    getReferenceDocuments,
    toggleReferencePopover,
    truncate,
    getDomainBadge,
    getCategoryBadge,
    getStatusColor,
    getStatusIcon,
    getRevisionHistory,
    approvalNodes,
    linkedWithDocs,
    cctFilter
  } = useDocumentTable();

  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <>
      <TableBody>
        {sortedData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6">
              No documents found
            </TableCell>
          </TableRow>
        ) : (
          sortedData.map((doc) => (
            <>
              <TableRow
                key={doc.id}
                className={`cursor-pointer border-t-[1px] border-gray-400 hover:bg-gray-50 ${
                  expandedCCTRow === doc.id ||
                  expandedReviewCycle === doc.id
                    ? "bg-blue-50"
                    : ""
                }`}
                onClick={() => handleRowClick(doc)}
              >
                {/* Document Name Cell */}
                <TableCell
                  className="font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <Link
                          to={`/doc-center/doc-details/${doc.id}`}
                          className="text-blue-600 hover:underline flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          {doc.name}
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDocumentViewer(doc);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 text-gray-500" />
                        </Button>
                        {tab !== "refdoc" && (
                          <Badge
                            className={`flex items-center ${getStatusColor(
                              doc.status
                            )}`}
                          >
                            <span className="mr-1">{getStatusIcon(doc.status)}</span>
                            {doc.status}
                          </Badge>
                        )}
                      </div>
                      {doc.type && (
                        <div
                          className="mt-1 inline-flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Display domain badge */}
                          {getDomainBadge(doc)}

                          <Badge
                            variant="secondary"
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 flex items-center gap-1.5"
                          >
                            <Tag className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">
                              {doc.type}
                            </span>
                          </Badge>

                          {/* Display category badge */}
                          {getCategoryBadge(doc)}
                        </div>
                      )}
                      {status !== "refdoc" && (
                        <div className="flex items-center gap-1 mt-1">
                          {/* Modifications button (conditional) */}
                          {doc.cct && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 py-0.5 text-xs font-medium flex items-center gap-1.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (expandedCCTRow === doc.id) {
                                  setExpandedCCTRow(null);
                                  console.log("In If block");
                                  setIsResetFilters(true);
                                } else {
                                  setExpandedCCTRow(doc.id);
                                  setExpandedReviewCycle(null);
                                  setIsResetFilters(false);
                                  console.log("In else block");
                                  // Auto-select first subcategory if document has CCT data
                                  if (doc.cct) {
                                    const category = doc.cct.category;
                                    const subCategories =
                                      cctSubCategories[category];
                                    if (
                                      subCategories &&
                                      subCategories.length > 0
                                    ) {
                                      setSelectedCategory(
                                        `${category}/${subCategories[0]}`
                                      );
                                    } else {
                                      setSelectedCategory(category);
                                    }
                                  }
                                }
                              }}
                            >
                              <Layers className="h-3.5 w-3.5" />
                              <span>Modifications</span>
                            </Button>
                          )}

                          {/* Always visible Reference Documents button */}
                          {status !== "refdoc" && (
                            <ReferenceDocumentsPopover
                              isOpen={referencePopovers[doc.id] || false}
                              onOpenChange={() =>
                                toggleReferencePopover(doc.id)
                              }
                              referenceDocuments={getReferenceDocuments(
                                doc.id
                              )}
                              onRemoveDocument={(refDocId) =>
                                handleRemoveReferenceDocument(
                                  doc.id,
                                  refDocId
                                )
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Revision Cell (conditional) */}
                {status !== "refdoc" && (
                  <TableCell
                    className="text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Popover
                      open={openRevisionPopovers.includes(doc.id)}
                      onOpenChange={(open) => {
                        if (open) {
                          toggleRevisionPopover(doc.id);
                        } else {
                          setOpenRevisionPopovers((prev) =>
                            prev.filter((id) => id !== doc.id)
                          );
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[800px] max-h-[300px] overflow-y-auto"
                        side="right"
                        align="start"
                        sideOffset={10}
                      >
                        <div className="space-y-4">
                          <h4 className="font-semibold text-sm border-b pb-2 flex justify-between items-center">
                            <span className="text-blue-700">
                              Revision History
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:bg-gray-100"
                              onClick={() => {
                                setOpenRevisionPopovers((prev) =>
                                  prev.filter((id) => id !== doc.id)
                                );
                              }}
                            >
                              <X className="h-3 w-3 text-red-700" />
                            </Button>
                          </h4>
                          <div className="w-full">
                            <table className="w-full text-sm">
                              <thead className="bg-blue-500 rounded-md text-white">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                    Number
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                    Description of change
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                    Page No
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                    Date Submitted
                                  </th>
                                  <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                    Date Approved
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {getRevisionHistory(doc.id).map(
                                  (revision) => (
                                    <tr
                                      key={revision.id}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        {revision.number}
                                      </td>
                                      <td className="px-3 py-2">
                                        {revision.description}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        {revision.pageNumbers}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        {revision.dateSubmitted}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        {revision.dateApproved &&
                                        revision.dateApproved !== "" ? (
                                          <span className="text-gray-800">
                                            {revision.dateApproved}
                                          </span>
                                        ) : (
                                          <span className="text-amber-500 italic">
                                            {status === "approved" ? (
                                              <span className="text-gray-800 not-italic">
                                                22-05-2025
                                              </span>
                                            ) : (
                                              "Pending"
                                            )}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                )}

                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Popover
                    open={isOpenDescription === doc.id}
                    onOpenChange={(open) => {
                      if (open) {
                        setIsOpenDescription(doc.id);
                      } else {
                        setIsOpenDescription(null);
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <div className="relative z-10 py-2  w-28 max-w-28  cursor-pointer rounded">
                        <div>
                          {doc.description ? (
                            <p
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsOpenDescription(
                                  isOpenDescription === doc.id ? null : doc.id
                                );
                              }}
                              className="text-sm text-gray-800 break-words hyphens-auto leading-relaxed w-full"
                            >
                              {truncate(doc.description, 25)}
                            </p>
                          ) : (
                            <p
                              onClick={(e) => {
                                e.stopPropagation();
                                 setIsOpenDescription(
                                  isOpenDescription === doc.id ? null : doc.id
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
                      className="w-[400px] max-h-[300px] overflow-y-auto"
                      side="right"
                      align="start"
                      sideOffset={10}
                    >
                      <div>
                        <h4 className="font-semibold text-sm border-b pb-2 flex justify-between items-center">
                          <span className="text-blue-700">Document Description</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-gray-100"
                            onClick={() => setIsOpenDescription(null)}
                          >
                            <X className="h-3 w-3 text-red-700" />
                          </Button>
                        </h4>
                        <div className="w-full">
                          {doc.description ? (
                            <p>{doc.description}</p>
                          ) : (
                            <p className="text-sm text-gray-700 pt-5 leading-relaxed">
                              No description available for this document.
                            </p>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>

                {/* Owner Cell */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{doc.owner.officer}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-green-600" />
                      <span>{doc.owner.department}</span>
                      {doc.domain && (
                        <Badge className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {doc.domain}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                      <span>{doc.owner.title}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Created At / Uploaded TS Cell */}
                <TableCell
                  className="whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar size={14} className="text-gray-500" />
                      <p>{doc.createdAt}</p>
                    </div>
                    <div className="flex items-center text-xs gap-1 text-gray-600">
                      <Clock size={13} className="text-gray-500" />
                      <p>{doc.createdAtTime}</p>
                    </div>
                  </div>
                </TableCell>

                {tab == "refdoc" && (
                  <TableCell
                    className="whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ml-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[600px] max-h-[250px] overflow-y-auto"
                        side="right"
                        align="start"
                        sideOffset={10}
                      >
                        <div className="space-y-4">
                          <div className="w-full">
                            {linkedWithDocs.length === 0 ? (
                              <p className="text-sm text-gray-500 py-4 text-center">
                                No referenced documents
                              </p>
                            ) : (
                              <table className="w-full text-sm">
                                <thead className="bg-blue-500 rounded-md text-white">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                      Review Document Name
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                      Added By
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                                      Date Added
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {linkedWithDocs.map((doc, index) => (
                                    <tr
                                      key={doc.id}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-3 py-3">
                                        <div className="flex items-center gap-3">
                                          <FileText className="h-4 w-4 text-blue-500" />
                                          <div>
                                            <div className="flex gap-4">
                                              <p className="font-medium line-clamp-1">
                                                {doc.name}
                                              </p>
                                              <div className="flex gap-1">
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-600"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        // This will open /refdoc in a new tab
                                                        window.open(
                                                          "/refdoc",
                                                          "_blank"
                                                        );
                                                      }}
                                                    >
                                                      <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                  </TooltipTrigger>
                                                </Tooltip>
                                              </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                              {doc.type}
                                            </p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                          <span>
                                            {doc.addedBy || "John Doe"}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-3 py-3 whitespace-nowrap">
                                        {doc.dateAdded ? (
                                          <span className="text-gray-800">
                                            {new Date(
                                              doc.dateAdded
                                            ).toLocaleDateString("en-GB")}
                                          </span>
                                        ) : (
                                          <span>
                                            {doc.addedat || "22-05-2025"}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                )}

                {/* Approved TS / Deactivated TS Cell (conditional) */}
                {(tab === "approved" || tab === "disapproved") && (
                  <TableCell
                    className="whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar
                          size={14}
                          className={
                            tab === "approved"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        />
                        <p>
                          {tab === "approved"
                            ? doc.approvedAt || "N/A"
                            : doc.deactivatedAt || "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center text-xs gap-1 text-gray-600">
                        <Clock
                          size={13}
                          className={
                            tab === "approved"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        />
                        <p>
                          {tab === "approved"
                            ? doc.approvedAtTime || "N/A"
                            : doc.deactivatedAtTime || "N/A"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                )}

                {/* Compare Column Cell - only show for approved tab */}
                {status === "approved" && (
                  <TableCell
                    className="py-3 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleCompare(doc)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-1 py-1 rounded flex items-center"
                    >
                      <List className="w-3 h-3 mr-1" />
                      Compare
                    </button>
                  </TableCell>
                )}

                {/* Final vs. Working Copy Cell (conditional) */}
                {tab !== "refdoc" &&
                  tab !== "approved" &&
                  tab !== "disapproved" && (
                    <TableCell
                      className="py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleCompare(doc)}
                        className="bg-blue-500 hover:bg-blue-600 mx-auto text-white text-xs px-2 py-1.5 cursor-pointer rounded flex items-center"
                      >
                        <List className="w-3 h-3 mr-1" />
                        Compare
                      </button>
                    </TableCell>
                  )}

                {/* Action Cell */}
                {status !== "disapproved" && (
                  <TableCell
                    onClick={() => {
                      setIsBotOpen(true);
                    }}
                  >
                    {status !== "active" ? (
                      <Tooltip className="bg-gray-100">
                        <TooltipTrigger asChild>
                          <Bot className="mx-auto h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-50 px-2 text-gray-800 border-gray-300 border">
                          Ask AI
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {status === "refdoc" ||
                            status === "approved" ? null : (
                              <MoreHorizontal className="w-fit h-8 mb-1" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex justify-center items-center"
                            onClick={() => {
                              setIsBotOpen(true);
                            }}
                          >
                            {status === "active" && (
                              <Bot className="mr-1 h-4 w-4" />
                            )}
                            <span>Ask AI</span>
                          </DropdownMenuItem>
                          {status === "active" && (
                            <DropdownMenuItem
                              className="flex justify-center items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenReferenceDialog(doc);
                              }}
                            >
                              <LinkIcon className="mr-1 h-4 w-4" />
                              <span>Ref Doc</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}

                {/* Review Panel Cell (conditional) */}
                {status !== "refdoc" && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-full flex justify-center items-center ${
                        expandedReviewCycle === doc.id
                          ? "bg-blue-100 text-blue-600"
                          : ""
                      }`}
                      onClick={(e) => handleReviewCycleClick(doc.id, e)}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedReviewCycle === doc.id ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </TableCell>
                )}
              </TableRow>

              {/* CCT Expanded Section */}
              {!IsresetFilters && expandedCCTRow === doc.id && (
                <TableRow key={`cct-expanded-${doc.id}`}>
                  <TableCell colSpan={8} className="p-0">
                    <div className="p-4 border-t bg-gray-50">
                      <div className="flex flex-col h-auto">
                        <div className="flex mb-4">
                          <FileTree
                            categories={cctSubCategories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            cctFilter={cctFilter}
                          />
                          <div className="flex-1 overflow-auto pl-4">
                            <CategoryView
                              category={selectedCategory}
                              documents={selectedCategoryDocuments}
                              onViewDocument={openDocumentViewer}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Review Cycle Expanded Section */}
              {expandedReviewCycle === doc.id && (
                <TableRow key={`review-cycle-expanded-${doc.id}`}>
                  <TableCell colSpan={8} className="p-0">
                    <div className="p-4 border-t">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                          {approvalNodes.map((node) => (
                            <tr
                              key={node.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                      node.type === "user"
                                        ? "bg-blue-500"
                                        : node.type === "group"
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
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
                                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
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
                                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                      node.status === "Assigned" ||
                                      node.status === "Initiated"
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
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
                  </TableCell>
                </TableRow>
              )}
            </>
          ))
        )}
      </TableBody>

      {/* Document Viewer Modal */}
      {viewingDocument && viewerOpen && (
        <DocumentViewer
          url={viewingDocument.docUrl}
          filename={viewingDocument.name}
          onClose={closeDocumentViewer}
        />
      )}

      {/* Diff View Popup */}
      <FullPagePopup
        isOpen={isFullPagePopupOpen}
        onClose={() => setIsFullPagePopupOpen(false)}
      >
        <PDFTextDiffViewer />
      </FullPagePopup>

      {/* Compare Popup */}
      <FullPagePopup
        isOpen={isComparePopupOpen}
        onClose={() => setIsComparePopupOpen(false)}
      >
        {selectedDoc && (
          <PDFTextDiffViewer
            oldText={selectedDoc.finalCopy || "Final copy content..."}
            newText={selectedDoc.workingCopy || "Working copy content..."}
          />
        )}
      </FullPagePopup>

      {/* Reference Documents Dialog */}
      {referenceDocsDialogOpen && selectedDocForRef && (
        <ReferenceDocumentsDialog
          isOpen={referenceDocsDialogOpen}
          onClose={() => setReferenceDocsDialogOpen(false)}
          selectedDocIds={documentReferences[selectedDocForRef.id] || []}
          onSave={handleSaveReferenceDocuments}
          currentDocId={selectedDocForRef.id}
        />
      )}
    </>
  );
};
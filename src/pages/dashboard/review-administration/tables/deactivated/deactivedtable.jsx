import React, { useState, useMemo } from "react";
import {FileText, Eye, Clock, User, Building, Briefcase, X, ChevronDown, Info} from "lucide-react";
import { Badge } from "../../../../../components/ui/badge";
import { Button } from "../../../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { sampleDocDeactived } from "../mock-data/deactivated";
import { approvalNodes } from "../mock-data/deactivated";
import { DocumentBadgesSection } from "../../common/shared-tabs-utils";
import { SearchableColumnHeader } from "../components/searchable-column-header";

const DeactivatedDocumentsTable = ({
  sortColumn,
  sortDirection,
  columnFilters = {},
  handleSort,
  handleFilterChange
}) => {
  // Sample data for deactivated documents
  const [documents, setDocuments] = useState(sampleDocDeactived);
  const [openDescriptionDropDown, setOpenDescriptionDropdown] = useState(null);

  // State for expanded review cycles (extracted from DocumentTable)
  const [expandedReviewCycle, setExpandedReviewCycle] = useState(null);

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
            case "deactivatedAt":
              fieldValue = doc.deactivatedAt || "";
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

  // Handle review cycle click (extracted from DocumentTable)
  const handleReviewCycleClick = (docId, e) => {
    e.stopPropagation();
    if (expandedReviewCycle === docId) {
      setExpandedReviewCycle(null);
    } else {
      setExpandedReviewCycle(docId);
    }
  };

  const truncate = (text, length) => {
    if (text.length > length) {
      return (
      <>
        {text.substr(0, length)}...
        <Info className="inline w-3 h-3 ml-1" />
      </>
    );
    }
    else{
       return (
      <>
        {text.substr(0, length)}...
        <Info className="inline w-3 h-3 ml-1" />
      </>
       )
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get file type badge
  const getFileTypeBadge = (doc) => {
    return (
      <Badge className="bg-blue-50 text-blue-600 text-xs px-2">
        {doc.fileType}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (doc) => {
    return (
      <span className="px-2.5 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-md bg-red-100 text-red-800 border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-red-500"></span>
        Deactivated
      </span>
    );
  };

  // Handle view action
  const handleView = (doc) => {
    console.log("View document:", doc.title);
    // Implement view functionality
  };

  // Handle restore action
  const handleRestore = (docId) => {
    console.log("Restore document:", docId);
    // Implement restore functionality
  };

  // Handle permanent delete action
  const handleDelete = (docId) => {
    console.log("Permanently delete document:", docId);
    // Implement delete functionality
  };

  return (
    <div className="border-1 border-gray-400 rounded-lg overflow-hidden">
      {filteredAndSortedDocuments.length === 0 ? (
        <div className="text-center text-gray-500">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-left">
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
                  title="Deactivated TS"
                  column="deactivatedAt"
                  width="px-4 py-3 font-semibold text-gray-50"
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  columnFilters={columnFilters}
                  handleFilterChange={handleFilterChange}
                />
                <th className="px-4 py-3 font-semibold text-gray-50">
                  Review Panel
                </th>
              </tr>
            </thead>
          </table>
          {Object.keys(columnFilters).length > 0 
            ? "No deactivated documents found matching your search criteria."
            : "No deactivated documents found."}
        </div>
      ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-left">
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
                title="Deactivated TS"
                column="deactivatedAt"
                width="px-4 py-3 font-semibold text-gray-50"
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                columnFilters={columnFilters}
                handleFilterChange={handleFilterChange}
              />
              <th className="px-4 py-3 font-semibold text-gray-50">
                Review Panel
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedDocuments.map((doc) => (
              <React.Fragment key={doc.id}>
                <tr className="border-t-[1px] border-gray-400 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium">
                        {doc.title} {getFileTypeBadge(doc)}
                      </span>
                      <div className="py-2">{getStatusBadge(doc)}</div>
                    </div>

                    {/* Updated badges section using the extracted component */}
                    {doc.type && (
                      <DocumentBadgesSection
                        doc={doc}
                        showType={true}
                        showDomain={true}
                        showCategory={true}
                        className="inline-flex items-center gap-1.5 ml-4"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}

                    <div className="flex mt-1.5 ml-6">
                      <button
                        onClick={() => handleView(doc)}
                        className="text-blue-600 hover:text-blue-800 mr-3 flex items-center text-xs"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
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

                  <td>
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
                  </td>
                  <td className="py-3">
                    <p className="font-normal flex gap-2 items-center text-zinc-700">
                      <Clock size={14} />
                      <span title={doc.uploadedAt}>
                        {formatTimestamp(doc.uploadedAt)}
                      </span>
                    </p>
                  </td>
                  <td className="py-3">
                    <p className="font-normal flex gap-2 items-center text-zinc-700">
                      <Clock size={14} />
                      <span title={doc.deactivatedAt}>
                        {formatTimestamp(doc.deactivatedAt)}
                      </span>
                    </p>
                  </td>
                  {/* Review Panel Cell (extracted from DocumentTable) */}
                  <td onClick={(e) => e.stopPropagation()}>
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
                  </td>
                </tr>

                {/* Review Cycle Expanded Section (extracted from DocumentTable) */}
                {expandedReviewCycle === doc.id && (
                  <tr key={`review-cycle-expanded-${doc.id}`}>
                    <td colSpan={6} className="p-0">
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
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeactivatedDocumentsTable;
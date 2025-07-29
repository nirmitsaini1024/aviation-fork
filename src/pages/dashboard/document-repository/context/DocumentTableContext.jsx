import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isWithinInterval } from "date-fns";
import { approvalNodes, cctCategories, cctSubCategories, linkedWithDocs, mockReferenceDocuments } from "../mock-data/Document-Table-constant";
import { enrichedDocuments, parseDocumentDate } from "../components/Document-Table/Miscellaneous";
import { Building, CircleCheckBig, CircleX, Clock, Info, Search, Tag } from 'lucide-react';

const DocumentTableContext = createContext();

export const useDocumentTable = () => {
  const context = useContext(DocumentTableContext);
  if (!context) {
    throw new Error('useDocumentTable must be used within a DocumentTableProvider');
  }
  return context;
};

export const DocumentTableProvider = ({ children, ...props }) => {
  const {
    globalFilter,
    documentTypeFilter,
    documentNameFilter,
    cctFilter,
    domainFilter,
    departmentFilter,
    categoryFilter,
    ownerNameFilter,
    refDocsFilter,
    dateFrom,
    dateTo,
    status,
    IsresetFilters,
    setIsResetFilters,
    setIsBotOpen,
  } = props;

  // Helper function to normalize dates to start of day (moved before usage)
  const normalizeToStartOfDay = (date) => {
    if (!date) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // State management
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const [openRevisionPopovers, setOpenRevisionPopovers] = useState([]);
  const [isFullPagePopupOpen, setIsFullPagePopupOpen] = useState(false);
  const [expandedCCTRow, setExpandedCCTRow] = useState(null);
  const [expandedReviewCycle, setExpandedReviewCycle] = useState(null);
  const [initalRender, setInitialRender] = useState(true);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [selectedCategoryDocuments, setSelectedCategoryDocuments] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const firstCategory = cctCategories[0];
    if (firstCategory && cctSubCategories[firstCategory]?.length > 0) {
      return `${firstCategory}/${cctSubCategories[firstCategory][0]}`;
    }
    return firstCategory || null;
  });
  const [isComparePopupOpen, setIsComparePopupOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isOpenDescription, setIsOpenDescription] = useState(null);
  const [referenceDocsDialogOpen, setReferenceDocsDialogOpen] = useState(false);
  const [selectedDocForRef, setSelectedDocForRef] = useState(null);
  const [documentReferences, setDocumentReferences] = useState({});
  const [referencePopovers, setReferencePopovers] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Effects
  useEffect(() => {
    console.log("Runned UseEffect", {
      globalFilter,
      documentTypeFilter,
      documentNameFilter,
      cctFilter,
      domainFilter,
      departmentFilter,
      categoryFilter,
      dateFrom,
      dateTo,
      status,
    });

    if (initalRender) {
      console.log("Runned");
      setInitialRender(false);
      return;
    }

    const hasActiveFilters =
      (domainFilter !== "all_domains" && domainFilter !== null) ||
      (documentTypeFilter !== "all_types" && documentTypeFilter !== null) ||
      (cctFilter !== "all_cct" && cctFilter !== null) ||
      (documentNameFilter !== "all_documents" && documentNameFilter !== null) ||
      (departmentFilter !== "all_departments" && departmentFilter !== null) ||
      (categoryFilter !== "all_categories" && categoryFilter !== null) ||
      dateFrom ||
      dateTo;

    if (!hasActiveFilters) {
      setExpandedCCTRow(null);
      setExpandedReviewCycle(null);
      return;
    }

    const filteredDocs = enrichedDocuments.filter((doc) => {
      switch (status) {
        case "active":
          if (doc.status !== "In Review") return false;
          break;
        case "refdoc":
          if (doc.status !== "N/A") return false;
          break;
        case "approved":
          if (doc.status !== "Approved") return false;
          break;
        case "disapproved":
          if (doc.status !== "Rejected") return false;
          break;
      }

      if (domainFilter && domainFilter !== "all_domains") {
        if (doc.domain !== domainFilter) return false;
      }

      if (departmentFilter && departmentFilter !== "all_departments") {
        if (doc.owner.department !== departmentFilter) return false;
      }

      if (categoryFilter && categoryFilter !== "all_categories") {
        if (doc.category !== categoryFilter) return false;
      }

      if (documentTypeFilter && documentTypeFilter !== "all_types") {
        if (doc.type.toLowerCase() !== documentTypeFilter.toLowerCase())
          return false;
      }

      if (documentNameFilter && documentNameFilter !== "all_documents") {
        if (doc.name.toLowerCase() !== documentNameFilter.toLowerCase())
          return false;
      }

      if (cctFilter && cctFilter !== "all_cct") {
        if (!doc.cct) return false;
        const matchesCategory =
          doc.cct.category &&
          doc.cct.category.toLowerCase().includes(cctFilter.toLowerCase());
        const matchesSubCategory =
          doc.cct.subCategory &&
          doc.cct.subCategory.toLowerCase().includes(cctFilter.toLowerCase());
        if (!matchesCategory && !matchesSubCategory) return false;
      }

      return true;
    });

    const firstDocWithCCT = filteredDocs.find((doc) => doc.cct);

    if (firstDocWithCCT) {
      setExpandedCCTRow(firstDocWithCCT.id);
      const category = firstDocWithCCT.cct.category;
      const subCategories = cctSubCategories[category];
      if (subCategories && subCategories.length > 0) {
        setSelectedCategory(`${category}/${subCategories[0]}`);
      } else {
        setSelectedCategory(category);
      }
    }
  }, [
    domainFilter,
    documentTypeFilter,
    documentNameFilter,
    cctFilter,
    departmentFilter,
    categoryFilter,
    dateFrom,
    dateTo,
    status,
    initalRender,
  ]);

  useEffect(() => {
    if (selectedCategory) {
      const [category, subCategory] = selectedCategory.split("/");
      const docsInCategory = enrichedDocuments.filter((doc) => {
        if (!doc.cct) return false;
        if (subCategory) {
          return (
            doc.cct.category === category && doc.cct.subCategory === subCategory
          );
        }
        return doc.cct.category === category;
      });
      setSelectedCategoryDocuments(docsInCategory);
    } else if (cctFilter && cctFilter !== "all_cct") {
      const matchingCategory = Object.keys(cctSubCategories).find((cat) =>
        cat.toLowerCase().includes(cctFilter.toLowerCase())
      );

      if (matchingCategory && cctSubCategories[matchingCategory]?.length > 0) {
        setSelectedCategory(
          `${matchingCategory}/${cctSubCategories[matchingCategory][0]}`
        );
      } else if (matchingCategory) {
        setSelectedCategory(matchingCategory);
      }
    }
  }, [selectedCategory, cctFilter]);

  // Computed values
  const isFiltered = Boolean(
    globalFilter ||
      documentTypeFilter ||
      documentNameFilter ||
      cctFilter ||
      domainFilter ||
      departmentFilter ||
      categoryFilter ||
      dateFrom ||
      dateTo ||
      Object.values(columnFilters).some((val) => Boolean(val))
  );

  const filteredData = enrichedDocuments.filter((doc) => {
    switch (status) {
      case "active":
        if (doc.status !== "In Review") return false;
        break;
      case "refdoc":
        if (doc.status !== "N/A") return false;
        break;
      case "approved":
        if (doc.status !== "Approved") return false;
        break;
      case "disapproved":
        if (doc.status !== "Rejected") return false;
        break;
      default:
        break;
    }

    if (globalFilter) {
      const searchableValues = [
        doc.name,
        doc.type,
        doc.createdAt,
        doc.owner.officer,
        doc.owner.department,
        doc.owner.title,
        doc.status,
      ];

      if (
        !searchableValues.some((value) =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      ) {
        return false;
      }
    }

    if (
      documentTypeFilter &&
      documentTypeFilter !== "all_types" &&
      doc.type.toLowerCase() !== documentTypeFilter.toLowerCase()
    ) {
      return false;
    }

    if (
      documentNameFilter &&
      documentNameFilter !== "all_documents" &&
      doc.name.toLowerCase() !== documentNameFilter.toLowerCase()
    ) {
      return false;
    }

    if (domainFilter && domainFilter !== "all_domains") {
      if (doc.domain !== domainFilter) {
        return false;
      }
    }

    if (departmentFilter && departmentFilter !== "all_departments") {
      if (doc.owner.department !== departmentFilter) {
        return false;
      }
    }

    if (categoryFilter && categoryFilter !== "all_categories") {
      if (doc.category !== categoryFilter) {
        return false;
      }
    }

    if (ownerNameFilter && ownerNameFilter !== "all_owners") {
      if (doc.owner.officer !== ownerNameFilter) {
        return false;
      }
    }

    if (refDocsFilter && refDocsFilter !== "all_refdocs") {
      // Placeholder implementation
    }

    if (cctFilter && cctFilter !== "all_cct") {
      if (!doc.cct) return false;

      const matchesCategory =
        doc.cct.category &&
        doc.cct.category.toLowerCase().includes(cctFilter.toLowerCase());
      const matchesSubCategory =
        doc.cct.subCategory &&
        doc.cct.subCategory.toLowerCase().includes(cctFilter.toLowerCase());

      if (!matchesCategory && !matchesSubCategory) {
        return false;
      }
    }

    if (dateFrom || dateTo) {
      const docDate = parseDocumentDate(doc.createdAt);

      if (docDate) {
        // Normalize all dates to start of day to avoid time comparison issues
        const normalizedDocDate = normalizeToStartOfDay(docDate);
        const normalizedDateFrom = dateFrom ? normalizeToStartOfDay(dateFrom) : null;
        const normalizedDateTo = dateTo ? normalizeToStartOfDay(dateTo) : null;

        // Debug logging (remove after fixing)
        console.log('🔍 Date Comparison Debug:', {
          originalDocDate: doc.createdAt,
          parsedDocDate: docDate.toLocaleDateString(),
          normalizedDocDate: normalizedDocDate.toLocaleDateString(),
          filterDateFrom: dateFrom?.toLocaleDateString(),
          normalizedDateFrom: normalizedDateFrom?.toLocaleDateString(),
        });

        if (normalizedDateFrom && normalizedDateTo) {
          return isWithinInterval(normalizedDocDate, { start: normalizedDateFrom, end: normalizedDateTo });
        } else if (normalizedDateFrom) {
          return normalizedDocDate >= normalizedDateFrom;
        } else if (normalizedDateTo) {
          return normalizedDocDate <= normalizedDateTo;
        }
      }
    }

    for (const [key, value] of Object.entries(columnFilters)) {
      if (!value) continue;

      if (key === "owner") {
        const ownerValues = [
          doc.owner.officer,
          doc.owner.department,
          doc.owner.title,
        ];
        if (
          !ownerValues.some((val) =>
            val.toLowerCase().includes(value.toLowerCase())
          )
        ) {
          return false;
        }
      } else if (key === "name") {
        const nameValues = [doc.name, doc.type];
        if (
          !nameValues.some((val) =>
            String(val).toLowerCase().includes(value.toLowerCase())
          )
        ) {
          return false;
        }
      } else {
        const docValue = doc[key];
        if (!String(docValue).toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      }
    }

    return true;
  });

  const allSortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    let aValue, bValue;

    if (sortColumn === "owner") {
      aValue = a.owner.officer;
      bValue = b.owner.officer;
    } else if (sortColumn === "name") {
      aValue = a.name;
      bValue = b.name;
    } else if (
      sortColumn === "createdAt" ||
      sortColumn === "approvedAt" ||
      sortColumn === "deactivatedAt"
    ) {
      const aDate = parseDocumentDate(a[sortColumn] || a.createdAt);
      const bDate = parseDocumentDate(b[sortColumn] || b.createdAt);
      if (aDate && bDate) {
        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }
      return 0;
    } else {
      aValue = a[sortColumn];
      bValue = b[sortColumn];
    }

    aValue = String(aValue);
    bValue = String(bValue);

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(allSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedData = allSortedData.slice(startIndex, endIndex);

  // Utility functions
  const truncate = (text, length) => {
    if (text.length > length) {
      return (
        <>
          {text.substr(0, length)}...
          <Info className='w-3 h-3 text-blue-500 inline ml-0.5' />
        </>
      );
    } else {
      return (
        <>
          {text.substr(0, length)}...
          <span className="inline w-3 h-3 ml-1 text-blue-500">ℹ</span>
        </>
      );
    }
  };

  const getDomainBadge = (doc) => {
    if (!doc.domain) return null;

    const colors = {
      Airport: "bg-blue-100 text-blue-800 border-blue-200",
      Airline: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 border rounded ${
          colors[doc.domain] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        <Building className='w-3.5 h-3.5' />
        <span>{doc.domain}</span>
      </span>
    );
  };

  const getCategoryBadge = (doc) => {
    if (!doc.category) return null;

    const colors = {
      ASP: "bg-purple-100 text-purple-800 border-purple-200",
      AEP: "bg-amber-100 text-amber-800 border-amber-200",
      ACM: "bg-sky-100 text-sky-800 border-sky-200",
      SMS: "bg-rose-100 text-rose-800 border-rose-200",
      "ADFAP (Airport)": "bg-indigo-100 text-indigo-800 border-indigo-200",
      ADFP: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };

    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 border rounded ${
          colors[doc.category] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        <Tag className='h-3.5 w-3.5' />
        <span>{doc.category}</span>
      </span>
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "pending":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "n/a":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "in review":
        return <Clock className='h-3 w-3'/>;
      case "pending":
        return <Search className='h-3 w-3'/>;
      case "approved":
        return <CircleCheckBig className="h-3 w-3 text-green-800" />;
      case "rejected":
        return <CircleX className='h-3 w-3 text-red-800' />;
      case "n/a":
        return <FileText className="h-3 w-3" />;
      default:
        return <Folder className="h-3 w-3" />;
    }
  };

  const getRevisionHistory = (docId) => [
    {
      id: `${docId}-rev1`,
      number: "1",
      description: "Changes in Badge Procedures",
      pageNumbers: "12",
      dateSubmitted: "10-05-2025",
      dateApproved: "14-05-2025",
    },
    {
      id: `${docId}-rev2`,
      number: "2",
      description: "Modification in Airport Boundary",
      pageNumbers: "32",
      dateSubmitted: "15-05-2025",
      dateApproved: "17-05-2025",
    },
    {
      id: `${docId}-rev3`,
      number: "3",
      description: "Airport Security Drill Procedure Changes",
      pageNumbers: "6",
      dateSubmitted: "16-05-2025",
      dateApproved: "",
    },
  ];

  // Event handlers
  const handleFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const handleSelectCategory = useCallback((categoryPath) => {
    setSelectedCategory(categoryPath);
  }, []);

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

  const handleRowClick = (doc) => {
    if (expandedCCTRow === doc.id) {
      setExpandedCCTRow(null);
    } else {
      setExpandedCCTRow(doc.id);
    }
    if (expandedReviewCycle === doc.id) {
      setExpandedReviewCycle(null);
    }
  };

  const handleReviewCycleClick = (docId, e) => {
    e.stopPropagation();
    if (expandedReviewCycle === docId) {
      setExpandedReviewCycle(null);
    } else {
      setExpandedReviewCycle(docId);
    }
    if (expandedCCTRow === docId) {
      setExpandedCCTRow(null);
    }
  };

  const openDocumentViewer = (doc) => {
    setViewingDocument(doc);
    setViewerOpen(true);
  };

  const closeDocumentViewer = () => {
    setViewerOpen(false);
    setViewingDocument(null);
  };

  const openDiffView = () => {
    setDiffOpen(true);
  };

  const closeDiffView = () => {
    setDiffOpen(false);
  };

  const toggleRevisionPopover = (id) => {
    setOpenRevisionPopovers((prev) =>
      prev.includes(id) ? prev.filter((revId) => revId !== id) : [...prev, id]
    );
  };

  const handleCompare = (document) => {
    setSelectedDoc(document);
    setIsComparePopupOpen(true);
  };

  const handleOpenReferenceDialog = (doc) => {
    setSelectedDocForRef(doc);
    setReferenceDocsDialogOpen(true);
  };

  const handleSaveReferenceDocuments = (selectedDocIds) => {
    if (selectedDocForRef) {
      setDocumentReferences((prev) => ({
        ...prev,
        [selectedDocForRef.id]: selectedDocIds,
      }));
    }
  };

  const handleRemoveReferenceDocument = (docId, refDocId) => {
    setDocumentReferences((prev) => ({
      ...prev,
      [docId]: prev[docId].filter((id) => id !== refDocId),
    }));
  };

  const getReferenceDocuments = (docId) => {
    const refIds = documentReferences[docId] || [];
    return mockReferenceDocuments.filter((doc) => refIds.includes(doc.id));
  };

  const toggleReferencePopover = (docId) => {
    setReferencePopovers((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  // Pagination handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const contextValue = {
    // State
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    columnFilters,
    setColumnFilters,
    openRevisionPopovers,
    setOpenRevisionPopovers,
    isFullPagePopupOpen,
    setIsFullPagePopupOpen,
    expandedCCTRow,
    setExpandedCCTRow,
    expandedReviewCycle,
    setExpandedReviewCycle,
    initalRender,
    setInitialRender,
    hoveredDropdown,
    setHoveredDropdown,
    selectedCategoryDocuments,
    setSelectedCategoryDocuments,
    viewerOpen,
    setViewerOpen,
    diffOpen,
    setDiffOpen,
    viewingDocument,
    setViewingDocument,
    selectedCategory,
    setSelectedCategory,
    isComparePopupOpen,
    setIsComparePopupOpen,
    selectedDoc,
    setSelectedDoc,
    isOpenDescription,
    setIsOpenDescription,
    referenceDocsDialogOpen,
    setReferenceDocsDialogOpen,
    selectedDocForRef,
    setSelectedDocForRef,
    documentReferences,
    setDocumentReferences,
    referencePopovers,
    setReferencePopovers,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,

    // Props
    globalFilter,
    documentTypeFilter,
    documentNameFilter,
    cctFilter,
    domainFilter,
    departmentFilter,
    categoryFilter,
    ownerNameFilter,
    refDocsFilter,
    dateFrom,
    dateTo,
    status,
    IsresetFilters,
    setIsResetFilters,
    setIsBotOpen,

    // Computed values
    isFiltered,
    filteredData,
    sortedData,
    allSortedData,

    // Utility functions
    truncate,
    getDomainBadge,
    getCategoryBadge,
    getStatusColor,
    getStatusIcon,
    getRevisionHistory,

    // Event handlers
    handleFilterChange,
    handleSelectCategory,
    handleSort,
    handleRowClick,
    handleReviewCycleClick,
    openDocumentViewer,
    closeDocumentViewer,
    openDiffView,
    closeDiffView,
    toggleRevisionPopover,
    handleCompare,
    handleOpenReferenceDialog,
    handleSaveReferenceDocuments,
    handleRemoveReferenceDocument,
    getReferenceDocuments,
    toggleReferencePopover,
    handlePageChange,

    // Constants
    approvalNodes,
    cctCategories,
    cctSubCategories,
    linkedWithDocs,
    mockReferenceDocuments,
  };

  return (
    <DocumentTableContext.Provider value={contextValue}>
      {children}
    </DocumentTableContext.Provider>
  );
};
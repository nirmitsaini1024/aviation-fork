import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { documents, domains } from "../mock-data/index";
import { categoryOptions, departmentOptions } from "../mock-data";

const DocCenterContext = createContext();

export const DocCenterProvider = ({ children, setIsBotOpen }) => {
  // Get URL search params and navigation
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Filter states
  const [documentType, setDocumentType] = useState("all_types");
  const [documentName, setDocumentName] = useState("all_documents");
  const [cct, setCct] = useState("all_cct");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [domain, setDomain] = useState("all_domains");
  const [department, setDepartment] = useState("all_departments");
  const [category, setCategory] = useState("all_categories");
  const [appliedFilters, setAppliedFilters] = useState({});
  const [IsresetFilters, setIsResetFilters] = useState(true);
  const [documentNameSearch, setDocumentNameSearch] = useState("");
  const [cctSearch, setCctSearch] = useState("");

  // Advanced filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [ownerName, setOwnerName] = useState("all_owners");
  const [refDocs, setRefDocs] = useState("all_refdocs");
  const [ownerNameSearch, setOwnerNameSearch] = useState("");
  const [refDocsSearch, setRefDocsSearch] = useState("");

  // Tab management
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam && ["active", "refdoc", "approved", "disapproved"].includes(tabParam)
      ? tabParam
      : "active"
  );

  // Derived values
  const documentTypes = [...new Set(documents.map((doc) => doc.type))];
  const cctCategories = [
    "Airline Defense Maintenance",
    "Airport Safety and Compliance",
  ];

  // Get owner names based on current tab and existing filters
  const getOwnerNamesForCurrentTab = () => {
    let filteredDocs = documents;
    
    if (activeTab === "active") {
      filteredDocs = documents.filter(doc => doc.status === "In Review");
    } else if (activeTab === "refdoc") {
      filteredDocs = documents.filter(doc => doc.type === "Reference");
    } else if (activeTab === "approved") {
      filteredDocs = documents.filter(doc => doc.status === "Approved");
    } else if (activeTab === "disapproved") {
      filteredDocs = documents.filter(doc => doc.status === "Rejected");
    }
    
    if (appliedFilters.department && appliedFilters.department !== "all_departments") {
      filteredDocs = filteredDocs.filter(doc => doc.owner.department === appliedFilters.department);
    }
    
    return [...new Set(filteredDocs.map(doc => doc.owner.officer))];
  };

  const ownerNames = getOwnerNamesForCurrentTab();
  const refDocuments = [...new Set(documents.filter(doc => doc.type === "Reference").map(doc => doc.name))];

  // Filter document names based on current tab
  const getDocumentNames = () => {
    if (activeTab === "refdoc") {
      return [...new Set(documents.filter(doc => doc.type === "Reference").map((doc) => doc.name))];
    }
    return [...new Set(documents.map((doc) => doc.name))];
  };

  const documentNames = getDocumentNames();

  // Get available departments based on selected domain
  const availableDepartments =
    domain && domain !== "all_domains"
      ? departmentOptions[domain] || []
      : [...Object.values(departmentOptions).flat()];

  // Get available categories based on selected domain
  const availableCategories =
    domain && domain !== "all_domains"
      ? categoryOptions[domain] || []
      : [...Object.values(categoryOptions).flat()];

  // Handle tab changes with URL updates
  const handleTabChange = (value) => {
    setActiveTab(value);
    setDocumentName("all_documents");
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", value);

    navigate(
      {
        pathname: location.pathname,
        search: newParams.toString(),
      },
      { replace: true }
    );
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedFilters({
      documentType: documentType !== "all_types" ? documentType : null,
      documentName: documentName !== "all_documents" ? documentName : null,
      cct: cct !== "all_cct" ? cct : null,
      domain: domain !== "all_domains" ? domain : null,
      department: department !== "all_departments" ? department : null,
      category: category !== "all_categories" ? category : null,
      ownerName: ownerName !== "all_owners" ? ownerName : null,
      refDocs: refDocs !== "all_refdocs" ? refDocs : null,
      dateFrom,
      dateTo,
    });
    setIsResetFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setDocumentType("all_types");
    setDocumentName("all_documents");
    if (activeTab !== "refdoc") {
      setCct("all_cct");
      setRefDocs("all_refdocs");
    }
    setDomain("all_domains");
    setDepartment("all_departments");
    setCategory("all_categories");
    setOwnerName("all_owners");
    setDateFrom(null);
    setDateTo(null);
    setAppliedFilters({});
    setIsResetFilters(true);
    setDocumentNameSearch("");
    setCctSearch("");
    setOwnerNameSearch("");
    setRefDocsSearch("");
  };

  // Effects
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["active", "refdoc", "approved", "disapproved"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    setOwnerName("all_owners");
    setOwnerNameSearch("");
  }, [activeTab, appliedFilters.department, appliedFilters.documentName]);

  useEffect(() => {
    if (domain && domain !== "all_domains") {
      if (
        department !== "all_departments" &&
        !departmentOptions[domain].includes(department)
      ) {
        setDepartment("all_departments");
      }

      if (
        category !== "all_categories" &&
        !categoryOptions[domain].includes(category)
      ) {
        setCategory("all_categories");
      }
    }
  }, [domain, department, category]);

  const contextValue = {
    // Filter states
    documentType,
    setDocumentType,
    documentName,
    setDocumentName,
    cct,
    setCct,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    domain,
    setDomain,
    department,
    setDepartment,
    category,
    setCategory,
    appliedFilters,
    setAppliedFilters,
    IsresetFilters,
    setIsResetFilters,
    documentNameSearch,
    setDocumentNameSearch,
    cctSearch,
    setCctSearch,

    // Advanced filter states
    showAdvancedFilters,
    setShowAdvancedFilters,
    ownerName,
    setOwnerName,
    refDocs,
    setRefDocs,
    ownerNameSearch,
    setOwnerNameSearch,
    refDocsSearch,
    setRefDocsSearch,

    // Tab management
    activeTab,
    setActiveTab,
    handleTabChange,

    // Derived values
    documentTypes,
    documentNames,
    cctCategories,
    ownerNames,
    refDocuments,
    availableDepartments,
    availableCategories,

    // Static data
    domains,
    departmentOptions,
    categoryOptions,

    // Chatbot function
    setIsBotOpen,

    // Actions
    applyFilters,
    resetFilters,
    getOwnerNamesForCurrentTab,
    getDocumentNames,
  };

  return (
    <DocCenterContext.Provider value={contextValue}>
      {children}
    </DocCenterContext.Provider>
  );
};

export const useDocCenter = () => {
  const context = useContext(DocCenterContext);
  if (!context) {
    throw new Error("useDocCenter must be used within a DocCenterProvider");
  }
  return context;
};
import { useState, useEffect } from "react";
import { DocumentTable } from "@/components/document-table";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Tag,
  Layers,
  Search,
  Funnel,
  RefreshCcw,
  LayoutGrid,
  SendToBack,
  Menu,
  User,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { documents } from "@/mock-data/doc-center";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

// Domain and Department Options
const domains = ["Airport", "Airline"];

const departmentOptions = {
  Airport: [
    "TSA",
    "FAA",
    "Airport Security",
    "Airport Operations",
    "Public Safety",
  ],
  Airline: ["Airline Security", "Airline Operations"],
};

const categoryOptions = {
  Airport: ["ASP", "AEP", "ACM", "SMS", "ADFAP (Airport)"],
  Airline: ["ASP", "ADFP"],
};

export default function DocCenter({setIsBotOpen}) {
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
  // Extract tab from URL params or default to "active"
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam &&
      ["active", "refdoc", "approved", "disapproved"].includes(tabParam)
      ? tabParam
      : "active"
  );

  // Add these new state variables after the existing ones
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [ownerName, setOwnerName] = useState("all_owners");
  const [refDocs, setRefDocs] = useState("all_refdocs");
  const [ownerNameSearch, setOwnerNameSearch] = useState("");
  const [refDocsSearch, setRefDocsSearch] = useState("");

  // Get owner names based on current tab and existing filters
  const getOwnerNamesForCurrentTab = () => {
    let filteredDocs = documents;
    
    // Filter by tab/status first
    if (activeTab === "active") {
      filteredDocs = documents.filter(doc => doc.status === "In Review");
    } else if (activeTab === "refdoc") {
      filteredDocs = documents.filter(doc => doc.type === "Reference");
    } else if (activeTab === "approved") {
      filteredDocs = documents.filter(doc => doc.status === "Approved");
    } else if (activeTab === "disapproved") {
      filteredDocs = documents.filter(doc => doc.status === "Rejected");
    }
    
    // Apply other filters if they exist
    if (appliedFilters.domain && appliedFilters.domain !== "all_domains") {
      // You might need to map this based on your domain logic
    }
    
    if (appliedFilters.department && appliedFilters.department !== "all_departments") {
      filteredDocs = filteredDocs.filter(doc => doc.owner.department === appliedFilters.department);
    }
    
    return [...new Set(filteredDocs.map(doc => doc.owner.officer))];
  };

  const ownerNames = getOwnerNamesForCurrentTab();

  const refDocuments = [...new Set(documents.filter(doc => doc.type === "Reference").map(doc => doc.name))];

  // Extract unique document types and names for dropdowns
  const documentTypes = [...new Set(documents.map((doc) => doc.type))];

  // Filter document names based on current tab
  const getDocumentNames = () => {
    if (activeTab === "refdoc") {
      // Only show reference documents
      return [...new Set(documents.filter(doc => doc.type === "Reference").map((doc) => doc.name))];
    }
    // For all other tabs, show all documents
    return [...new Set(documents.map((doc) => doc.name))];
  };

  const documentNames = getDocumentNames();

  // CCT categories
  const cctCategories = [
    "Airline Defense Maintenance",
    "Airport Safety and Compliance",
  ];

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

  // Check for tab parameter in URL when component mounts or URL changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      ["active", "refdoc", "approved", "disapproved"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    // Reset document name when switching to/from reference documents tab
    setDocumentName("all_documents");
    
    // Create a new URLSearchParams object based on current params
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", value);

    // Update the URL without reloading the page
    navigate(
      {
        pathname: location.pathname,
        search: newParams.toString(),
      },
      { replace: true }
    );
  };

  // Reset owner name when tab changes since available owners might be different
  useEffect(() => {
    setOwnerName("all_owners");
    setOwnerNameSearch("");
  }, [activeTab, appliedFilters.department, appliedFilters.documentName]);
  
  // Reset dependent filters when domain changes
  useEffect(() => {
    if (domain && domain !== "all_domains") {
      // Reset department if current selection doesn't belong to the selected domain
      if (
        department !== "all_departments" &&
        !departmentOptions[domain].includes(department)
      ) {
        setDepartment("all_departments");
      }

      // Reset category if current selection doesn't belong to the selected domain
      if (
        category !== "all_categories" &&
        !categoryOptions[domain].includes(category)
      ) {
        setCategory("all_categories");
      }
    }
  }, [domain, department, category]);

  // Function to apply filters
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Document Repositories</h3>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200 shadow-sm p-6 mb-8">
          {/* Main filters - always visible */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 w-full mb-4">
            {/* Domain Filter */} 
            <div className={`space-y-2 ${showAdvancedFilters ? "lg:col-span-3" : "lg:col-span-2"}`}>
              <label htmlFor="domain" className="block text-sm font-medium text-blue-700">
                Document Owner
              </label>
              <div className="w-full">
                <Select
                  id="domain"
                  value={domain}
                  onValueChange={(value) => {
                    setDomain(value);
                  }}
                >
                  <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                    <div className="flex items-center">
                      <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Domain" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_domains">All Domains</SelectItem>
                    {domains.map((dom) => (
                      <SelectItem key={dom} value={dom}>
                        {dom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Department Filter */}
            <div className={`space-y-2 ${showAdvancedFilters ? "lg:col-span-3" : "lg:col-span-2"}`}>
              <label htmlFor="department" className="block text-sm font-medium text-blue-700">
                Department
              </label>
              <div className="w-full">
                <Select id="department" value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                    <div className="flex items-center">
                      <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Department" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_departments">All Departments</SelectItem>
                    {availableDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Filter */}
            <div className={`space-y-2 ${showAdvancedFilters ? "lg:col-span-3" : "lg:col-span-2"}`}>
              <label htmlFor="category" className="block text-sm font-medium text-blue-700">
                Document Category
              </label>
              <div className="w-full">
                <Select id="category" value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_categories">All Categories</SelectItem>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Document Name Filter */}
            <div className={`space-y-2 ${showAdvancedFilters ? "lg:col-span-3" : "lg:col-span-3"}`}>
              <label htmlFor="document-name" className="block text-sm font-medium text-blue-700">
                {activeTab === "refdoc" ? "Reference Document Name" : "Document Name"}
              </label>
              <div className="w-full">
                <Select id="document-name" value={documentName} onValueChange={setDocumentName}>
                  <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder={activeTab === "refdoc" ? "Reference Document Name" : "Document Name"} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search documents..."
                          className="w-full pl-8 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={documentNameSearch}
                          onChange={(e) => setDocumentNameSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <SelectItem value="all_documents">
                      {activeTab === "refdoc" ? "All Reference Documents" : "All Documents"}
                    </SelectItem>
                    {documentNames
                      .filter(name => 
                        name.toLowerCase().includes(documentNameSearch.toLowerCase())
                      )
                      .map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions - when advanced filters are hidden */}
            {!showAdvancedFilters && (
              <div className="space-y-2 lg:col-span-3">
                <label className="block text-sm font-medium text-blue-700">Actions</label>
                <div className="flex gap-1">
                  <Button
                    className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={applyFilters}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button
                    className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={resetFilters}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Filters Toggle */}
          <div className="border-t border-blue-200 pt-4 mt-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="text-sm font-medium text-blue-700">Advanced Filters</div>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 bg-white border-blue-200 hover:bg-blue-50"
                size="sm"
              >
                {showAdvancedFilters ? 
                  <ArrowDownNarrowWide className="h-4 w-4" /> : 
                  <ArrowUpNarrowWide className="h-4 w-4" />
                }
                {showAdvancedFilters ? "Hide" : "Show"}
              </Button>
            </div>
            
            {/* Advanced filters - conditionally shown */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 w-full">
                {/* Owner Name Filter - First */}
                <div className={`space-y-2 ${activeTab === "refdoc" ? "lg:col-span-4" : "lg:col-span-2"}`}>
                  <label htmlFor="owner-name" className="block text-sm font-medium text-blue-700">
                    Owner Name
                  </label>
                  <div className="w-full">
                    <Select id="owner-name" value={ownerName} onValueChange={setOwnerName}>
                      <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Owner" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search owners..."
                              className="w-full pl-8 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={ownerNameSearch}
                              onChange={(e) => setOwnerNameSearch(e.target.value)}
                            />
                          </div>
                        </div>
                        <SelectItem value="all_owners">All Owners</SelectItem>
                        {ownerNames
                          .filter(name => 
                            name.toLowerCase().includes(ownerNameSearch.toLowerCase())
                          )
                          .map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* CCT Filter - only for non-refdoc tabs */}
                {activeTab !== "refdoc" && (
                  <div className="space-y-2 lg:col-span-3">
                    <label htmlFor="cct-category" className="block text-sm font-medium text-blue-700">
                      Change Control Title
                    </label>
                    <div className="w-full">
                      <Select id="cct-category" value={cct} onValueChange={setCct}>
                        <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                          <div className="flex items-center truncate">
                            <SendToBack className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            <SelectValue className="truncate" placeholder="CCT Category" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search CCT categories..."
                                className="w-full pl-8 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={cctSearch}
                                onChange={(e) => setCctSearch(e.target.value)}
                              />
                            </div>
                          </div>
                          <SelectItem value="all_cct">All Change Control Title</SelectItem>
                          {cctCategories
                            .filter(category => 
                              category.toLowerCase().includes(cctSearch.toLowerCase())
                            )
                            .map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Reference Documents Filter - only for non-refdoc tabs */}
                {activeTab !== "refdoc" && (
                  <div className="space-y-2 lg:col-span-3">
                    <label htmlFor="ref-docs" className="block text-sm font-medium text-blue-700">
                      Reference Documents
                    </label>
                    <div className="w-full">
                      <Select id="ref-docs" value={refDocs} onValueChange={setRefDocs}>
                        <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                          <div className="flex items-center">
                            <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Reference Docs" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search reference docs..."
                                className="w-full pl-8 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={refDocsSearch}
                                onChange={(e) => setRefDocsSearch(e.target.value)}
                              />
                            </div>
                          </div>
                          <SelectItem value="all_refdocs">All Reference Docs</SelectItem>
                          {refDocuments
                            .filter(doc => 
                              doc.toLowerCase().includes(refDocsSearch.toLowerCase())
                            )
                            .map((doc) => (
                              <SelectItem key={doc} value={doc}>
                                {doc}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Date From Filter */}
                <div className={`space-y-2 ${activeTab === "refdoc" ? "lg:col-span-3" : "lg:col-span-2"}`}>
                  <label htmlFor="date-from" className="block text-sm font-medium text-blue-700">
                    Date From
                  </label>
                  <div className="w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-from"
                          variant="outline"
                          className="h-10 w-full bg-white border-blue-200 shadow-sm justify-start text-left font-normal hover:border-blue-300"
                        >
                          {dateFrom ? format(dateFrom, "dd/MM/yy") : "Select date"}
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Date To Filter */}
                <div className={`space-y-2 ${activeTab === "refdoc" ? "lg:col-span-3" : "lg:col-span-2"}`}>
                  <label htmlFor="date-to" className="block text-sm font-medium text-blue-700">
                    Date To
                  </label>
                  <div className="w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-to"
                          variant="outline"
                          className="h-10 w-full bg-white border-blue-200 shadow-sm justify-start text-left font-normal hover:border-blue-300"
                        >
                          {dateTo ? format(dateTo, "dd/MM/yy") : "Select date"}
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Actions - when advanced filters are shown */}
                <div className="space-y-2 lg:col-span-12">
                  <label className="block text-sm font-medium text-blue-700">Actions</label>
                  <div className="flex gap-2">
                    <Button
                      className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={applyFilters}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                    <Button
                      className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={resetFilters}
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Status Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* <h2 className="text-xl font-medium text-blue-600 mb-4">
          Document Store
        </h2> */}
        <Tabs
          defaultValue="active"
          className="w-full duration-300 transition-all ease-in-out"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="mb-4 bg-blue-50 w-full">
            <TabsTrigger
              value="active"
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              In Review
            </TabsTrigger>
            <TabsTrigger
              value="refdoc"
              className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              Reference Documents
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Approved
            </TabsTrigger>
            <TabsTrigger
              value="disapproved"
              className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
            >
              Deactivated
            </TabsTrigger>
          </TabsList>

          {/* In Review Tab */}
          <TabsContent value="active">
            <DocumentTable
              documentTypeFilter={appliedFilters.documentType}
              documentNameFilter={appliedFilters.documentName}
              cctFilter={appliedFilters.cct}
              domainFilter={appliedFilters.domain}
              departmentFilter={appliedFilters.department}
              categoryFilter={appliedFilters.category}
              dateFrom={appliedFilters.dateFrom}
              dateTo={appliedFilters.dateTo}
              status="active"
              IsresetFilters={IsresetFilters}
              setIsResetFilters={setIsResetFilters}
              setIsBotOpen={setIsBotOpen}
              ownerNameFilter={appliedFilters.ownerName}
              refDocsFilter={appliedFilters.refDocs}
            />
          </TabsContent>

          {/* Reference Documents Tab */}
          <TabsContent value="refdoc">
            <DocumentTable
              documentTypeFilter={appliedFilters.documentType}
              documentNameFilter={appliedFilters.documentName}
              cctFilter={appliedFilters.cct}
              domainFilter={appliedFilters.domain}
              departmentFilter={appliedFilters.department}
              categoryFilter={appliedFilters.category}
              dateFrom={appliedFilters.dateFrom}
              dateTo={appliedFilters.dateTo}
              status="refdoc"
              IsresetFilters={true}
              setIsResetFilters={setIsResetFilters}
              setIsBotOpen={setIsBotOpen}
              ownerNameFilter={appliedFilters.ownerName}
              refDocsFilter={appliedFilters.refDocs}
            />
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved">
            <DocumentTable
              documentTypeFilter={appliedFilters.documentType}
              documentNameFilter={appliedFilters.documentName}
              cctFilter={appliedFilters.cct}
              domainFilter={appliedFilters.domain}
              departmentFilter={appliedFilters.department}
              categoryFilter={appliedFilters.category}
              dateFrom={appliedFilters.dateFrom}
              dateTo={appliedFilters.dateTo}
              status="approved"
              IsresetFilters={IsresetFilters}
              setIsResetFilters={setIsResetFilters}
              setIsBotOpen={setIsBotOpen}
              ownerNameFilter={appliedFilters.ownerName}
              refDocsFilter={appliedFilters.refDocs}
            />
          </TabsContent>

          {/* Deactivated Tab */}
          <TabsContent value="disapproved">
            <DocumentTable
              documentTypeFilter={appliedFilters.documentType}
              documentNameFilter={appliedFilters.documentName}
              cctFilter={appliedFilters.cct}
              domainFilter={appliedFilters.domain}
              departmentFilter={appliedFilters.department}
              categoryFilter={appliedFilters.category}
              dateFrom={appliedFilters.dateFrom}
              dateTo={appliedFilters.dateTo}
              status="disapproved"
              IsresetFilters={IsresetFilters}
              setIsResetFilters={setIsResetFilters}
              ownerNameFilter={appliedFilters.ownerName}
              refDocsFilter={appliedFilters.refDocs}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

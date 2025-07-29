import {
  Search,
  RefreshCcw,
  Menu,
  LayoutGrid,
  Tag,
  FileText,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  Bot
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDocCenter } from "../context/DocCenterContext";
import { AdvancedFilters } from "./AdvancedFilters";

export const FilterSection = () => {
  const {
    // Filter states
    domain,
    setDomain,
    department,
    setDepartment,
    category,
    setCategory,
    documentName,
    setDocumentName,
    documentNameSearch,
    setDocumentNameSearch,
    
    // Advanced filters
    showAdvancedFilters,
    setShowAdvancedFilters,
    
    // Derived values
    domains,
    availableDepartments,
    availableCategories,
    documentNames,
    activeTab,
    
    // Chatbot function
    setIsBotOpen,
    
    // Actions
    applyFilters,
    resetFilters,
  } = useDocCenter();

  return (
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
          <div className="space-y-2 lg:col-span-3 flex flex-col">
            <label className="block text-sm font-medium text-blue-700 mb-2">Actions</label>
            <div className="flex gap-1 h-10">
              <Button
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white flex-1 min-w-0"
                onClick={applyFilters}
              >
                <Search className="mr-1 h-4 w-4" />
                Search
              </Button>
              <Button
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white flex-1 min-w-0"
                onClick={resetFilters}
              >
                <RefreshCcw className="mr-1 h-4 w-4" />
                Reset
              </Button>
              <Button
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white flex-1 min-w-0"
                onClick={() => setIsBotOpen(true)}
              >
                <Bot className="mr-1 h-4 w-4" />
                Ask AI
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
              <ArrowUpNarrowWide className="h-4 w-4" /> : 
              <ArrowDownNarrowWide className="h-4 w-4" />
            }
            {showAdvancedFilters ? "Hide" : "Show"}
          </Button>
        </div>
        
        {/* Advanced filters - conditionally shown */}
        {showAdvancedFilters && <AdvancedFilters />}
      </div>
    </div>
  );
};
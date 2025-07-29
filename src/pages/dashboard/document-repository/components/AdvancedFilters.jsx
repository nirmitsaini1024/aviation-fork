import {
  Search,
  RefreshCcw,
  User,
  SendToBack,
  Layers,
  Calendar,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useDocCenter } from "../context/DocCenterContext";

export const AdvancedFilters = () => {
  const {
    // Filter states
    ownerName,
    setOwnerName,
    ownerNameSearch,
    setOwnerNameSearch,
    cct,
    setCct,
    cctSearch,
    setCctSearch,
    refDocs,
    setRefDocs,
    refDocsSearch,
    setRefDocsSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    
    // Derived values
    ownerNames,
    cctCategories,
    refDocuments,
    activeTab,
    
    // Chatbot function
    setIsBotOpen,
    
    // Actions
    applyFilters,
    resetFilters,
  } = useDocCenter();

  return (
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
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {dateFrom ? format(dateFrom, "dd/MM/yy") : "Select date"}
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
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {dateTo ? format(dateTo, "dd/MM/yy") : "Select date"}
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
          <Button
            className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsBotOpen(true)}
          >
            <Bot className="mr-2 h-4 w-4" />
            Ask AI
          </Button>
        </div>
      </div>
    </div>
  );
};
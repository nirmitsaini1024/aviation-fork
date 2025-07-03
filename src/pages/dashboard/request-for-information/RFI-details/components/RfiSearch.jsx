import { useContext, useState } from "react";
import useRFISearch from "../hooks/useRFISearch"; // Import the hook
import { categoryOptions, tableAllData } from "../../mock-data/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpWideNarrow,
  Check,
  ChevronsUpDown,
  Menu,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import DatePicker from "../../component/DatePicker";
import { RequestInfoContext } from "../../context/RequestInfoContext";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";
import { departmentOptions } from "@/mock-data/doc-center";

const RFIDetailsSearch = () => {
  const { tableData } = useContext(GlobalContext);
  const {
    searchFilters,
    updateFilter,
    resetFilters,
    performSearch,
    filterOptions,
    searchSummary,
    hasAdvancedFilters,
    isSearchDisabled,
  } = useRFISearch(tableData);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [openAIAgentDropDown, setOpenAIAgentDropDown] = useState(false);
  const [openContentLibraryDocument, setOpenContentLibraryDocument] =
    useState(false);
  const [department, setDepartment] = useState("");
  const [open, setOpen] = useState(false);
  const { setSearchRFIDetails, searchRFIDetails, domain } =
    useContext(RequestInfoContext);

  // Handle agent selection
  const handleAgentSelect = (agentName) => {
    const currentAgents = searchFilters.agents;
    const isSelected = currentAgents.includes(agentName);

    if (isSelected) {
      updateFilter(
        "agents",
        currentAgents.filter((name) => name !== agentName)
      );
    } else {
      updateFilter("agents", [...currentAgents, agentName]);
    }
  };

  const handleAgentRemove = (agentName) => {
    updateFilter(
      "agents",
      searchFilters.agents.filter((name) => name !== agentName)
    );
  };

  const handleAgentClearAll = () => {
    updateFilter("agents", []);
  };

  const handleSearch = () => {
    const results = performSearch();
    console.log("Search Results:", results);
    console.log("Search Summary:", searchSummary);
    setSearchRFIDetails(results);
  };

  const handleReset = () => {
    console.log("In reset function");
    setSearchRFIDetails(tableData);
    resetFilters();
  };

  const handleDomainChange = (value) => {
    updateFilter("domain", value);
    // Category is always 'all_categories', no need to reset it
  };

  // Fixed: Use searchFilters.domain instead of domain from context
  const availableCategories = () => {
    if (!searchFilters.domain || searchFilters.domain === "all_domains") {
      return Object.values(categoryOptions).flat();
    }
    return categoryOptions[searchFilters.domain] || [];
  };

  const handleContentLibrarySelect = (library) => {
    const currentLibraries = searchFilters.contentLibrary;
    const isSelected = currentLibraries.includes(library);

    if (isSelected) {
      updateFilter(
        "contentLibrary",
        currentLibraries.filter((name) => name !== library)
      );
    } else {
      updateFilter("contentLibrary", [...currentLibraries, library]);
    }
  };

  const handleContentLibraryRemove = (library) => {
    updateFilter(
      "contentLibrary",
      searchFilters.contentLibrary.filter((name) => name !== library)
    );
  };

  const handleContentLibraryClearAll = () => {
    updateFilter("contentLibrary", []);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200 shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-6 w-full mb-4">
        

        {/* Domain Filter */}
        <div className="space-y-2">
          <label
            htmlFor="domain"
            className="block text-sm font-medium text-blue-700"
          >
            Domain
          </label>
          <div className="w-full">
            <Select
              value={searchFilters.domain}
              onValueChange={handleDomainChange}
            >
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Domain" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_domains">All Domains</SelectItem>
                {filterOptions.domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Department Filter */}
        <div className="space-y-2">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-blue-700"
          >
            Department
          </label>
          <div className="w-full">
            <Select
              value={department}
              onValueChange={(value) => setDepartment(value)}
              disabled={searchFilters.domain.length === 0}
            >
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Department" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_department">All Department</SelectItem>
                {departmentOptions[searchFilters.domain]?.map(
                  (department, index) => (
                    <SelectItem key={index} value={department}>
                      {department}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Filter  */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-blue-700"
          >
            Category
          </label>
          <div className="w-full">
            <Select
              value={searchFilters.searchedCategory}
              onValueChange={(value) => updateFilter("searchedCategory", value)}
               disabled={searchFilters.domain.length === 0}
            >
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All Categories</SelectItem>
                {availableCategories().map((cat, index) => (
                  <SelectItem key={`${cat}-${index}`} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* RFI Name */}
        <div className="space-y-2">
          <label
            htmlFor="rfiName"
            className="block text-sm font-medium text-blue-700"
          >
            RFI Name
          </label>
          <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300 justify-start"
                >
                  <div className="flex items-center">
                    <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="truncate font-normal">
                      {searchFilters.rfiName
                        ? searchFilters.rfiName
                        : <p className="text-gray-500">RFI Name</p>}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search RFI names..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No RFI found.</CommandEmpty>
                    <CommandGroup>
                      {filterOptions.rfiNames.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={(currentValue) => {
                            updateFilter("rfiName", currentValue);
                            setOpen(false);
                          }}
                        >
                          {option}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              searchFilters.rfiName === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-700">
            Actions
          </label>
          <div className="flex gap-y-1 gap-x-3">
            <Button
              disabled={isSearchDisabled}
              className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleReset}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Search Toggle */}
      <div className="flex gap-x-4 items-center mb-4">
        <p className="font-medium text-blue-800">Advanced Search</p>
        <Button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="border hover:bg-blue-300 border-gray-400 text-gray-800 bg-blue-200"
        >
          {showAdvancedFilters ? (
            <span className="flex items-center gap-x-2">
              <ArrowUpWideNarrow />
              Hide
            </span>
          ) : (
            <span className="flex items-center gap-x-2">
              <ArrowUpWideNarrow className="rotate-180" />
              Show
            </span>
          )}
        </Button>
        {hasAdvancedFilters && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {searchSummary.appliedFilters.length} filters applied
          </Badge>
        )}
      </div>

      {/* Advanced Filters Section */}
      {showAdvancedFilters && (
        <>
          <hr className="my-4 bg-blue-700" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-10 w-full">
            {/* Project Filter */}
            <div className="space-y-2">
              <label
                htmlFor="project"
                className="block text-sm font-medium text-blue-700"
              >
                Project
              </label>
              <div className="w-full">
                <Select
                  value={searchFilters.project}
                  onValueChange={(value) => updateFilter("project", value)}
                >
                  <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                    <div className="flex items-center">
                      <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Projects" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All_Projects">All Projects</SelectItem>
                    {filterOptions.projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Library */}
            <div className="space-y-2">
              <label
                htmlFor="contentLibrary"
                className="block text-sm font-medium text-blue-700"
              >
                Content Library
              </label>
              <div className="w-full overflow-x-hidden">
                <Popover
                  open={openContentLibraryDocument}
                  onOpenChange={setOpenContentLibraryDocument}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="h-auto min-h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300 justify-start p-2"
                    >
                      <div className="flex items-center flex-wrap gap-1 w-full">
                        <Menu className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />

                        {searchFilters.contentLibrary.length === 0 ? (
                          <span className="text-muted-foreground font-normal">
                            Select Content Libraries
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 flex-1">
                            {searchFilters.contentLibrary
                              .slice(0, 1)
                              .map((library) => (
                                <Badge
                                  key={library}
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                                >
                                  <span className="truncate max-w-20">
                                    {library}
                                  </span>
                                  <button
                                    className="ml-1 hover:bg-blue-300 rounded-full p-0.5"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleContentLibraryRemove(library);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            {searchFilters.contentLibrary.length > 1 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-800"
                              >
                                +{searchFilters.contentLibrary.length - 1} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command className="w-full">
                      <CommandInput placeholder="Search Content here..." />
                      <CommandList className="scroll-container w-full">
                        <CommandEmpty>No Content found.</CommandEmpty>
                        <CommandGroup>
                          {searchFilters.contentLibrary.length > 0 && (
                            <div className="px-2 py-1.5 border-b">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleContentLibraryClearAll}
                                className="h-6 text-xs text-muted-foreground hover:text-foreground"
                              >
                                Clear all ({searchFilters.contentLibrary.length}
                                )
                              </Button>
                            </div>
                          )}
                          {filterOptions.contentLibraries.map((library) => {
                            const isSelected =
                              searchFilters.contentLibrary.includes(library);
                            return (
                              <CommandItem
                                key={library}
                                className="text-black cursor-pointer"
                                value={library}
                                onSelect={() =>
                                  handleContentLibrarySelect(library)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {library}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* AI Agents */}
            <div className="space-y-2">
              <label
                htmlFor="aiagents"
                className="block text-sm font-medium text-blue-700"
              >
                AI Agents
              </label>
              <div className="w-full overflow-x-hidden">
                <Popover
                  open={openAIAgentDropDown}
                  onOpenChange={setOpenAIAgentDropDown}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="h-auto min-h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300 justify-start p-2"
                    >
                      <div className="flex items-center flex-wrap gap-1 w-full">
                        <Menu className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />

                        {searchFilters.agents.length === 0 ? (
                          <span className="text-muted-foreground font-normal">
                            Select AI Agents
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 flex-1">
                            {searchFilters.agents
                              .slice(0, 1)
                              .map((agentName) => (
                                <Badge
                                  key={agentName}
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                                >
                                  {agentName}
                                  <button
                                    className="ml-1 hover:bg-blue-300 rounded-full p-0.5"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleAgentRemove(agentName);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            {searchFilters.agents.length > 1 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-800"
                              >
                                +{searchFilters.agents.length - 1} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command className="w-full">
                      <CommandInput placeholder="Search Agents..." />
                      <CommandList className="scroll-container">
                        <CommandEmpty>No Agents found.</CommandEmpty>
                        <CommandGroup>
                          {searchFilters.agents.length > 0 && (
                            <div className="px-2 py-1.5 border-b">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleAgentClearAll}
                                className="h-6 text-xs text-muted-foreground hover:text-foreground"
                              >
                                Clear all ({searchFilters.agents.length})
                              </Button>
                            </div>
                          )}
                          {filterOptions.allAgents.map((agentName) => {
                            const isSelected =
                              searchFilters.agents.includes(agentName);
                            return (
                              <CommandItem
                                key={agentName}
                                className="text-black cursor-pointer"
                                value={agentName}
                                onSelect={() => handleAgentSelect(agentName)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {agentName}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Date Pickers */}
            <DatePicker
              dateHeader={"Start Date"}
              value={searchFilters.startDate}
              onChange={(date) => updateFilter("startDate", date)}
            />
            <DatePicker
              dateHeader={"Completion Date"}
              value={searchFilters.completionDate}
              onChange={(date) => updateFilter("completionDate", date)}
            />
          </div>
        </>
      )}

      {/* Search Summary */}
      {searchSummary.totalRFIs > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-sm text-blue-800">
            Found <strong>{searchSummary.totalQuestions}</strong> questions
            across <strong>{searchSummary.totalRFIs}</strong> RFIs
            {searchSummary.appliedFilters.length > 0 && (
              <span>
                {" "}
                with {searchSummary.appliedFilters.length} filter(s) applied
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default RFIDetailsSearch;

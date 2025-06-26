import { useContext, useMemo, useState } from "react";
import {
  aiAgents,
  AirportDocuments,
  categoryOptions,
  docGenTable,
  domains,
  mockCategories,
} from "../mock-data/constant";
import { RequestInfoContext } from "../context/RequestInfoContext";
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
  UserRoundPen,
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

const Filter = () => {
  const {
    domain,
    setDomain,
    category,
    setCategory,
    templates,
    setTemplates,
    performSearch,
    setSearchResults,
    setSelectedResult,
    selectedAgents,
    onSelectionChange,
    ContentLibrary,
    setContentLibrary,
  } = useContext(RequestInfoContext);
  const disabledSearchButton =
    domain.length === 0 || category.length === 0 || templates.length === 0;
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [openAIAgentDropDown, setOpenAIAgentDropDown] = useState(false);
  const [docGenTemplate, setDocGenTemplate] = useState({ name: "", type: "" });
  const [openContenLibraryDocument, setOpenContentLibraryDocument] =
    useState(false);
  // Get available categories based on selected domain
  const availableCategories = useMemo(() => {
    if (!domain || domain === "all_domains") {
      return Object.values(categoryOptions).flat();
    }
    return categoryOptions[domain] || [];
  }, [domain]);

  const handleSelect = (agentName) => {
    const isSelected = selectedAgents.includes(agentName);

    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedAgents.filter((name) => name !== agentName));
    } else {
      // Add to selection
      onSelectionChange([...selectedAgents, agentName]);
    }
  };

  const handleRemove = (agentName) => {
    onSelectionChange(selectedAgents.filter((name) => name !== agentName));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  // Get available templates based on selected domain and category
  const availableTemplates = useMemo(() => {
    if (!domain || domain === "all_domains") {
      return mockCategories.flatMap((cat) => cat.templates);
    }

    const domainCategory = mockCategories.find((cat) => cat.name === domain);
    if (!domainCategory) return [];

    if (!category || category === "all_categories") {
      return domainCategory.templates;
    }

    return domainCategory.templates.filter(
      (template) =>
        template.name.includes(category) ||
        template.name.toLowerCase().includes(category.toLowerCase())
    );
  }, [domain, category]);

  const handleReset = () => {
    setCategory("");
    setDomain("");
    setTemplates("");
    setSearchResults("");
    setSelectedResult(null);
    setContentLibrary("");
    onSelectionChange([]);
  };

  const handleSearch = () => {
    performSearch();
  };

  const handleDomainChange = (value) => {
    setDomain(value);
    setCategory(""); // Reset category when domain changes
    setTemplates(""); // Reset templates when domain changes
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setTemplates(""); // Reset templates when category changes
  };

  return (
    <div className="bg-gradient-to-r from-blue-50  to-blue-100/50 rounded-lg border border-blue-200 shadow-sm p-6 mb-8">
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
              id="domain"
              value={domain}
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
                {domains.map((dom) => (
                  <SelectItem key={dom} value={dom}>
                    {dom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-blue-700"
          >
            Category
          </label>
          <div className="w-full">
            <Select
              id="category"
              value={category}
              onValueChange={handleCategoryChange}
              disabled={!domain || domain === ""}
            >
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All Categories</SelectItem>
                {availableCategories.map((cat, index) => (
                  <SelectItem key={index} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Templates Filter */}
        <div className="space-y-2">
          <label
            htmlFor="templates"
            className="block text-sm font-medium text-blue-700"
          >
            Templates
          </label>
          <div className="w-full overflow-x-hidden">
            <Select
              id="templates"
              value={templates}
              onValueChange={setTemplates}
              disabled={!domain || domain === ""}
            >
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Templates" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_templates">All Templates</SelectItem>
                {availableTemplates.map((template, index) => (
                  <SelectItem key={index} value={template.name}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* DocGen Template */}
        <div className="space-y-2">
          <label
            htmlFor="docGen_templates"
            className="block text-sm font-medium text-blue-700"
          >
            DocGen Template
          </label>
          <div className="w-full overflow-x-hidden bg-none">
            <Select
              value={docGenTemplate.name}
              onValueChange={setDocGenTemplate}
              disabled={!domain || domain === ""}
            >
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300 focus:border-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select DocGen Template" />
                </div>
              </SelectTrigger>
              <SelectContent className="w-full">
                {docGenTable.map((template, index) => (
                  <SelectItem
                    key={index}
                    value={template.name}
                    className="cursor-pointer hover:bg-blue-50"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font- text-gray-900">
                        {template.name}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2">
                        {template.type}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-700">
            Actions
          </label>
          <div className="flex gap-y-1 gap-x-3">
            <Button
              disabled={disabledSearchButton}
              className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSearch}
            >
              <UserRoundPen className="mr-2 h-4 w-4" />
              Start Authoring
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

      {/* Advanced Features Toggle */}
      <div className="flex gap-x-4 items-center mb-4">
        <p className="font-medium text-blue-800">Advanced Features</p>
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
      </div>

      {/* Advanced Filters Section */}
      {showAdvancedFilters && (
        <>
          <hr className="my-4 bg-blue-700" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-10 w-full">
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
                  open={openContenLibraryDocument}
                  onOpenChange={setOpenContentLibraryDocument}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300 justify-start"
                    >
                      <div className="flex items-center">
                        <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span
                          className={`${
                            ContentLibrary.length === 0
                              ? "text-muted-foreground"
                              : "text-black"
                          } font-normal`}
                        >
                          {ContentLibrary.length === 0
                            ? "Content Library"
                            : ContentLibrary}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command className="w-full">
                      <CommandInput placeholder="Search Content here..." />
                      <CommandList className="scroll-container w-full">
                        <CommandEmpty>No Content found.</CommandEmpty>
                        <CommandGroup>
                          {AirportDocuments.map((option) => (
                            <CommandItem
                              key={option.id}
                              className="text-black"
                              value={option.documentName}
                              onSelect={(currentValue) => {
                                setContentLibrary(
                                  currentValue === ContentLibrary
                                    ? ""
                                    : currentValue
                                );
                                setOpenContentLibraryDocument(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  ContentLibrary === option.documentName
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.documentName}
                            </CommandItem>
                          ))}
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
                      className="h-auto min-h-10  bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300 justify-start p-2"
                    >
                      <div className="flex items-center flex-wrap gap-1 w-full">
                        <Menu className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />

                        {selectedAgents.length === 0 ? (
                          <span className="text-muted-foreground font-normal">
                            Select AI Agents
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 flex-1">
                            {selectedAgents.slice(0, 1).map((agentName) => (
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
                                    handleRemove(agentName);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                            {selectedAgents.length > 1 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-800"
                              >
                                +{selectedAgents.length - 1} more
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
                          {selectedAgents.length > 0 && (
                            <div className="px-2 py-1.5 border-b">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearAll}
                                className="h-6 text-xs text-muted-foreground hover:text-foreground"
                              >
                                Clear all ({selectedAgents.length})
                              </Button>
                            </div>
                          )}
                          {aiAgents.map((option) => {
                            const isSelected = selectedAgents.includes(
                              option.name
                            );
                            return (
                              <CommandItem
                                key={option.id}
                                className="text-black cursor-pointer"
                                value={option.name}
                                onSelect={() => handleSelect(option.name)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {option.name}
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
          </div>
        </>
      )}
    </div>
  );
};
export default Filter;

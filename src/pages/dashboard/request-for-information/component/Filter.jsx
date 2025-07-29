import { useContext, useMemo, useState } from "react";
import {
  aiAgents,
  AirportDocuments,
  categoryOptions,
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
import DatePicker from "./DatePicker";
import ScheduleDateTime from "./ScheduleDateAndTime";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { departmentOptions } from "@/mock-data/doc-center";

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
    docGenTemplate,
    setDocGenTemplate,
    selectedDocGenTypes,
    setSelectedDocGenTypes,
    selectedDepartment,
    setSelectedDepartment,
    docGenTemplateDataList
  } = useContext(RequestInfoContext);
  const disabledSearchButton =
    domain.length === 0 || category.length === 0 || templates.length === 0;
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [openAIAgentDropDown, setOpenAIAgentDropDown] = useState(false);
  const [openContenLibraryDocument, setOpenContentLibraryDocument] =
    useState(false);
  const [openDocGenDropDown, setOpenDocGenDropDown] = useState(false);
  const [multiSelectContentLibrary, setMultiSelectContentLibrary] = useState(
    []
  );

  const handleSelectDocGen = (name, templateType) => {
    console.log("the name and type is: ", name, templateType);

    setSelectedDocGenTypes((prev) => {
      // Find existing template with this name
      const existingTemplateIndex = prev.findIndex(
        (item) => item.name === name
      );
      console.log(existingTemplateIndex);

      if (existingTemplateIndex !== -1) {
        // Template exists, toggle the type
        const existingTemplate = prev[existingTemplateIndex];
        const typeExists = existingTemplate.type.includes(templateType);

        if (typeExists) {
          // Remove the type
          const updatedTypes = existingTemplate.type.filter(
            (type) => type !== templateType
          );

          if (updatedTypes.length === 0) {
            // Remove entire template if no types left
            return prev.filter((_, index) => index !== existingTemplateIndex);
          } else {
            // Update with remaining types
            const newArray = [...prev];
            newArray[existingTemplateIndex] = {
              ...existingTemplate,
              type: updatedTypes,
            };
            return newArray;
          }
        } else {
          // Add the type
          const newArray = [...prev];
          newArray[existingTemplateIndex] = {
            ...existingTemplate,
            type: [...existingTemplate.type, templateType],
          };
          return newArray;
        }
      } else {
        // Template doesn't exist, create new one
        return [
          ...prev,
          {
            name: name,
            type: [templateType],
          },
        ];
      }
    });
    console.log(selectedDocGenTypes);
  };

  const handleRemoveDocGen = (templateName) => {
    setSelectedDocGenTypes((prev) =>
      prev.filter((template) => template.name !== templateName)
    );
  };

  const handleClearAllDocGen = () => {
    setSelectedDocGenTypes([]);
  };

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

  const handleRemoveFromContentLibrary = (content) => {
    setMultiSelectContentLibrary((prev) => {
      return prev.filter((item) => {
        if (item != content) {
          return item;
        }
      });
    });
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
    setDocGenTemplate([]);
    setSelectedDocGenTypes([]);
  };

  const handleSearch = () => {
    console.log(docGenTemplate);
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

        <div className="space-y-2">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-blue-700"
          >
            Department
          </label>
          <div className="w-full">
            <Select
              value={selectedDepartment}
              onValueChange={(value) => setSelectedDepartment(value)}
              disabled={domain.length === 0}
            >
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Department" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_department">All Department</SelectItem>
                {departmentOptions[domain]?.map((department, index) => (
                  <SelectItem key={index} value={department}>
                    {department}
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

        {/* Questioner template Filter */}
        <div className="space-y-2">
          <label
            htmlFor="templates"
            className="block text-sm font-medium text-blue-700"
          >
            Questioner template
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
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-5 gap-x-10 w-full">
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
                        {multiSelectContentLibrary.length === 0 ? (
                          <span className="text-muted-foreground flex items-center gap-x-2 font-normal">
                            <Menu className="h-4 w-4 text-muted-foreground" />
                            Select Content Libraries
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {multiSelectContentLibrary
                              .slice(0, 1)
                              .map((library) => (
                                <Badge
                                  key={library}
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                                >
                                  <span className="truncate max-w-12">
                                    {library}
                                  </span>
                                  <button
                                    className=" hover:bg-blue-300 rounded-full"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemoveFromContentLibrary(library);
                                    }}
                                  >
                                    <X className="h-1 w-1" />
                                  </button>
                                </Badge>
                              ))}
                            {multiSelectContentLibrary.length > 1 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-800"
                              >
                                +{multiSelectContentLibrary.length - 1} more
                              </Badge>
                            )}
                          </div>
                        )}
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
                          {AirportDocuments.map((option) => {
                            const isSelected =
                              multiSelectContentLibrary.includes(
                                option.documentName
                              );
                            return (
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
                                  isSelected
                                    ? handleRemoveFromContentLibrary(
                                        option.documentName
                                      )
                                    : setMultiSelectContentLibrary((prev) => [
                                        ...prev,
                                        option.documentName,
                                      ]);
                                  // setOpenContentLibraryDocument(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {option.documentName}
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
                AI Agents / Orchestration
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

                        {selectedAgents.length === 0 ? (
                          <span className="text-muted-foreground flex items-center gap-x-2 font-normal">
                            <Menu className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            Select AI Agents
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {selectedAgents.slice(0, 1).map((agentName) => (
                              <Badge
                                key={agentName}
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                              >
                                {agentName}
                                <button
                                  className=" hover:bg-blue-300 rounded-full "
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemove(agentName);
                                  }}
                                >
                                  <X className="h-1 w-1" />
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

            {/* DocGen Template */}
            <div className="space-y-2">
              <label
                htmlFor="docGen_templates"
                className="block text-sm font-medium text-blue-700"
              >
                DocGen Template
              </label>
              <div className="w-full overflow-x-hidden">
                <Popover
                  open={openDocGenDropDown}
                  onOpenChange={setOpenDocGenDropDown}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="h-auto min-h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300 justify-start p-2"
                    >
                      <div className="flex items-center flex-wrap gap-1 w-full">

                        {selectedDocGenTypes.length === 0 ? (
                          <span className="text-muted-foreground font-normal flex items-center gap-x-2">
                            <Menu className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            Select DocGen Template
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {selectedDocGenTypes.slice(0, 1).map((template) => (
                              <Badge
                                key={template.name}
                                variant="secondary"
                                className="text-xs min-w-0 max-w-28 bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1 pr-1"
                              >
                                <span
                                  className="text-xs text-blue-700 flex-1 min-w-0 truncate"
                                  title={`${template.name} (${template.type.length})`}
                                >
                                  {template.name} ({template.type.length})
                                </span>
                                <button
                                  className="ml-1 hover:bg-blue-300 rounded-full p-0.5 flex-shrink-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemoveDocGen(template.name);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                            {selectedDocGenTypes.length > 1 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-800"
                              >
                                +{selectedDocGenTypes.length - 1} more
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
                      <CommandList className="scroll-container">
                        <CommandGroup>
                          {selectedDocGenTypes.length > 0 && (
                            <div className="px-2 py-1.5 border-b">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearAllDocGen}
                                className="h-6 text-xs text-muted-foreground hover:text-foreground"
                              >
                                Clear all ({selectedDocGenTypes.length})
                              </Button>
                            </div>
                          )}

                          <Accordion type="multiple" className="w-full">
                            {docGenTemplateDataList.map((template) => (
                              <AccordionItem
                                key={template.id}
                                value={`item-${template.id}`}
                              >
                                <AccordionTrigger className="px-4 py-2 hover:no-underline text-left">
                                  <span className="font-normal text-gray-800">
                                    {template.name}
                                  </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-2">
                                  <div className="space-y-1">
                                    {template.type.map((type) => {
                                      const isSelected =
                                        selectedDocGenTypes.some(
                                          (selected) =>
                                            selected.name === template.name &&
                                            selected.type.includes(type)
                                        );
                                      const uniqueKey = `${template.id}-${type}`;

                                      return (
                                        <div
                                          key={uniqueKey}
                                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                          onClick={() =>
                                            handleSelectDocGen(
                                              template.name,
                                              type
                                            )
                                          }
                                        >
                                          <div className="flex items-center">
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 text-black w-4",
                                                isSelected
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            <span className="text-sm text-gray-700">
                                              {type}
                                            </span>
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                          >
                                            {type}
                                          </Badge>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DatePicker dateHeader={"Start Date"} />
            <DatePicker dateHeader={"Completion Date"} />
            <ScheduleDateTime />
          </div>
        </>
      )}
    </div>
  );
};
export default Filter;

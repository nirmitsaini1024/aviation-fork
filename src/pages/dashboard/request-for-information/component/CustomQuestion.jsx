import { useState, useCallback, useRef, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  HelpCircle,
  Check,
  ChevronsUpDown,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import {
  aiAgents,
  questionCategories,
  selectedAnswerOption,
} from "../mock-data/constant";
import { useSearchForCustomQuestion } from "../hooks/useSearch";
import { RequestInfoContext } from "../context/RequestInfoContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomQuestion({ open, setOpen }) {
  const [inputValue, setInputValue] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const { searchCustomQuestion } = useSearchForCustomQuestion();
  const [openComboBox, setOpenComboBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const [openAIAgentDropDown, setOpenAIAgentDropDown] = useState(false);
  const {
    selectedAgents,
    onSelectionChange,
    customAnswerFormat,
    setCustomAnswerFormat,
  } = useContext(RequestInfoContext);

  // Filter categories based on search term
  const filteredCategories = questionCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenComboBox(false);
      }
    }

    if (openComboBox) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openComboBox]);

  const handleSubmit = useCallback(() => {
    searchCustomQuestion(inputValue, customCategory);
    setOpen(false);
    setInputValue("");
    setCustomCategory("");
  }, [inputValue, customCategory, searchCustomQuestion, setOpen, customAnswerFormat]);

  const handleChangeValue = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleCategorySelect = useCallback((categoryName) => {
    setCustomCategory(categoryName);
    setOpenComboBox(false);
    setSearchTerm("");
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl border-0  rounded-2xl overflow-hidden">
          <div className="bg-blue-500/70 px-6 py-4 -mx-6 -mt-6 mb-6">
            <DialogHeader className="text-gray-900">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 font-semibold" />
                Custom Question
              </DialogTitle>
              <DialogDescription className="mt-1 text-gray-900 font-medium">
                Please add your question to enable more accurate and
                context-specific authoring.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-6 px-1">
            <div className="space-y-3">
              <Label
                htmlFor="category"
                className="text-slate-700 font-medium text-sm"
              >
                Category
              </Label>

              {/* Custom Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="outline"
                  onClick={() => setOpenComboBox(!openComboBox)}
                  className="border-slate-400 w-full rounded-lg justify-between h-11"
                  type="button"
                >
                  <span className="text-left truncate">
                    {customCategory || "Choose a category..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>

                {openComboBox && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl">
                    {/* Search Input */}
                    <div className="p-2 border-b border-slate-200">
                      <Input
                        placeholder="Search category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                      />
                    </div>

                    <div
                      className="max-h-48 overflow-y-scroll overflow-x-hidden"
                      style={{
                        maxHeight: "160px", // 12rem = 192px
                        overflowY: "auto",
                      }}
                    >
                      {filteredCategories.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 text-center">
                          No category found.
                        </div>
                      ) : (
                        filteredCategories.map((cat, index) => (
                          <button
                            key={cat.id || index}
                            onClick={() => handleCategorySelect(cat.name)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-none bg-transparent cursor-pointer flex items-center justify-between"
                          >
                            <span className="font-medium">{cat.name}</span>
                            <Check
                              className={cn(
                                "h-4 w-4",
                                customCategory === cat.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="question"
                className="text-slate-700 font-medium text-sm"
              >
                Your Question
              </Label>
              <Input
                id="question"
                placeholder="Add your question here..."
                value={inputValue}
                onChange={handleChangeValue}
                className="border-slate-400 border-1 outline-0  h-11 rounded-lg"
              />
            </div>

            <div className="flex items-center">
              <div className="flex gap-x-5 items-center w-full">
                <div className="flex items-center  w-[40%]">
                  <div className="w-full">
                    <Select
                      id="answerFormat"
                      value={customAnswerFormat}
                      onValueChange={(value) => {
                        console.log("Selected value:", value);
                        setCustomAnswerFormat(value);
                      }}
                    >
                      <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                        <div className="flex items-center">
                          <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Text" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {selectedAnswerOption.map((dom) => (
                          <SelectItem
                            key={dom.id}
                            value={dom.text}
                          >
                            {dom.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Popover
                  open={openAIAgentDropDown}
                  onOpenChange={setOpenAIAgentDropDown}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="h-10  bg-white w-[50%] border-blue-200 shadow-sm  hover:border-blue-300 focus:ring-blue-300 justify-start p-2"
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

          <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 px-6 py-2 rounded-lg "
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!inputValue || !customCategory}
              className="bg-blue-500 hover:bg-blue-700 text-gray-100 px-6 py-2 rounded-lg shadow-lg hover:shadow-xl  disabled:bg-blue-700 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              Add Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

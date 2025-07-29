import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { assignUser, tableHeader } from "../../mock-data/constant";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BotIcon,
  ChartPie,
  Check,
  ChevronsUpDown,
  Ellipsis,
  FileBarChart,
  FileText,
  Mail,
  Search,
  UserPlus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import handleDownloadFile from "../../utils/DownloadFile";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

export default function RFITable({
  filteredData,
  redirectUserToCreateRFI,
  isBotOpen,
  setIsBotOpen,
  setShowEmailSender,
  selectedRIF,
  openRIFPopOver,
  handlePopoverOpen,
  handleRIFSelection,
  clearRIFSelection,
  searchValue,
  setSearchValue,
  isOpen,
  setIsOpen,
  searchProject,
  setSearchProject,
  openProjectSearchPopOver,
  setProjectSearchPopOver,
  sortOrder,
  handleSort,
  tabType,
}) {
  const getSortIcon = () => {
    switch (sortOrder) {
      case "asc":
        return <ArrowUp className="w-4 h-4" />;
      case "desc":
        return <ArrowDown className="w-4 h-4" />;
      default:
        return <ArrowUpDown className="w-4 h-4" />;
    }
  };

  const getEmptyMessage = () => {
    switch (tabType) {
      case "inprogress":
        return "No In Progress RFIs found.";
      case "completed":
        return "No Completed RFIs found.";
      default:
        return "No RFIs found for this category.";
    }
  };

  const getCompletionDateCell = (rfi) => {
    if (!rfi.data[0]?.completionDate) return "N/A";

    const completionDate = new Date(rfi.data[0].completionDate);
    const today = new Date();
    const isInProgress = completionDate > today;

    if (tabType === "inprogress") {
      return (
        <div className="flex items-center gap-2">
          <span>{completionDate.toLocaleDateString("en-US")}</span>
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            In Progress
          </Badge>
        </div>
      );
    } else if (tabType === "completed") {
      return (
        <div className="flex items-center gap-2">
          <span>{completionDate.toLocaleDateString("en-US")}</span>
          <Badge className="bg-green-100 text-green-800 text-xs">
            Completed
          </Badge>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <span>{completionDate.toLocaleDateString("en-US")}</span>
          {isInProgress ? (
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              In Progress
            </Badge>
          ) : (
            <Badge className="bg-green-100 text-green-800 text-xs">
              Completed
            </Badge>
          )}
        </div>
      );
    }
  };

  const getActionButtons = (rfi) => {
    const isInProgress = rfi.data[0]?.completionDate ? 
      new Date(rfi.data[0].completionDate) > new Date() : false;

    return (
      <div className="grid gap-1">
        <Button
          variant="ghost"
          className="justify-start gap-2 h-auto p-3"
          onClick={() =>
            handleDownloadFile(
              rfi.rfiName ? rfi.rfiName : "document"
            )
          }
        >
          <ChartPie className="h-4 text-blue-700 w-4" />
          <span className="text-gray-800">
            {isInProgress ? "Generate" : "Download"} Risk Report
          </span>
        </Button>
        <Button
          variant="ghost"
          className="justify-start gap-2 h-auto p-3"
          onClick={() =>
            handleDownloadFile(
              rfi.rfiName ? rfi.rfiName : "document"
            )
          }
        >
          <FileText className="h-4 text-blue-700 w-4" />
          <span className="text-gray-800">
            {isInProgress ? "Generate" : "Download"} Report
          </span>
        </Button>
        <Button
          variant="ghost"
          className="justify-start gap-2 h-auto p-3"
          onClick={() =>
            handleDownloadFile(
              rfi.rfiName
                ? rfi.rfiName + "_Summary"
                : "document"
            )
          }
        >
          <FileBarChart className="h-4 text-blue-700 w-4" />
          <span className="text-gray-800">
            {isInProgress ? "Generate" : "Download"} Summary
          </span>
        </Button>
        <Button
          variant="ghost"
          className="justify-start gap-2 h-auto p-3"
          onClick={() =>
            handleDownloadFile(
              rfi.rfiName
                ? rfi.rfiName + "_Category_Report"
                : "document"
            )
          }
        >
          <FileBarChart className="h-4 text-blue-700 w-4" />
          <span className="text-gray-800">
            Category Report
          </span>
        </Button>
        <Button
          variant="ghost"
          className="justify-start gap-2 h-auto p-3"
          onClick={() => setShowEmailSender(true)}
        >
          <Mail className="h-4 text-blue-700 w-4" />
          <span className="text-gray-800">
            Send via Email
          </span>
        </Button>
      </div>
    );
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-700 hover:bg-blue-700">
            {tableHeader.map((item, index) => (
              <TableHead className="text-white font-semibold" key={index}>
                <span className="flex gap-x-2 items-center">
                  {item}
                  {item === "RFI Name" && (
                    <>
                      <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-white/10"
                          >
                            <Search className="w-4 h-4" />
                            <span className="sr-only">Search</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80  p-0" side="top">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="Search RFI Name..."
                              value={searchValue}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setSearchValue(newValue);
                              }}
                              className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              autoFocus
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSort}
                        className={cn(
                          "h-8 w-8 text-white hover:bg-white/10",
                          sortOrder !== "none" && "bg-white/20"
                        )}
                        title={`Sort ${
                          sortOrder === "none"
                            ? "A-Z"
                            : sortOrder === "asc"
                            ? "Z-A"
                            : "None"
                        }`}
                      >
                        {getSortIcon()}
                        <span className="sr-only">Sort RFI Name</span>
                      </Button>
                    </>
                  )}
                  {item === "Project" && (
                    <Popover
                      open={openProjectSearchPopOver}
                      onOpenChange={setProjectSearchPopOver}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white hover:bg-white/10"
                        >
                          <Search className="w-4 h-4" />
                          <span className="sr-only">Search</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80  p-0" side="top">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search Project Name..."
                            value={searchProject}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setSearchProject(newValue);
                            }}
                            className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoFocus
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="border border-gray-300">
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((rfi, index) => (
              <TableRow key={index}>
                <TableCell
                  onClick={() =>
                    redirectUserToCreateRFI(
                      rfi.data,
                      rfi.rfiName,
                      rfi.project
                    )
                  }
                  className="font-medium text-blue-600 underline hover:cursor-pointer"
                >
                  {rfi.rfiName ? rfi.rfiName : "N/A"}
                </TableCell>
                <TableCell className="font-medium">
                  {rfi.project ? rfi.project : "N/A"}
                </TableCell>
                <TableCell>{rfi.data[0]?.domain || "N/A"}</TableCell>
                <TableCell>
                  {rfi.data[0]?.searchedCategory || "N/A"}
                </TableCell>
                <TableCell>
                  {rfi.data[0]?.contentLibrary || "N/A"}
                </TableCell>
                <TableCell>
                  {rfi.data[0]?.agents ? (
                    <div className="flex items-center flex-wrap gap-y-3 py-1 gap-x-3">
                      {rfi.data[0].agents.map((agent, agentIndex) => (
                        <Badge
                          key={agentIndex}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {rfi.data[0]?.startDate
                    ? new Date(rfi.data[0].startDate).toLocaleDateString(
                        "en-US"
                      )
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {getCompletionDateCell(rfi)}
                </TableCell>
                <TableCell>
                  <BotIcon
                    className="w-4 h-4 text-black cursor-pointer"
                    onClick={() => setIsBotOpen(!isBotOpen)}
                  />
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Ellipsis className="w-4 h-4 text-black" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 mr-10">
                      {getActionButtons(rfi)}
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Popover
                    open={openRIFPopOver[index] || false}
                    onOpenChange={(isOpen) =>
                      handlePopoverOpen(index, isOpen)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        className="h-10 min-w-40 max-w-40 shadow hover:opacity-90 active:scale-95 focus-visible:ring-[#405cf5] bg-[#4c66fb] hover:bg-[#405cf5] text-white ease-in-out transition-all duration-300 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePopoverOpen(
                            index,
                            !openRIFPopOver[index]
                          );
                        }}
                      >
                        {!selectedRIF[index] && (
                          <UserPlus className="h-4 w-4 mr-2" />
                        )}
                        {selectedRIF[index] ? `Assigned` : "Assign RIF"}
                        {!selectedRIF[index] && (
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-60 p-0 mr-6"
                      align="start"
                    >
                      <Command>
                        <CommandInput
                          placeholder="Search employees..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            No employee found.
                          </CommandEmpty>
                          <CommandGroup heading="Available Employees">
                            {assignUser && assignUser.length > 0 ? (
                              assignUser.map((option) => (
                                <CommandItem
                                  key={option.id}
                                  value={option.fullName}
                                  onSelect={(currentValue) => {
                                    handleRIFSelection(
                                      index,
                                      currentValue,
                                      option
                                    );
                                  }}
                                  className="flex items-center justify-between p-3 cursor-pointer"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {option.fullName}
                                    </span>
                                  </div>
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      selectedRIF[index] ===
                                        option.fullName
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))
                            ) : (
                              <CommandItem disabled>
                                No employees available
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </CommandList>
                        {selectedRIF[index] && (
                          <div className="border-t p-3 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-600">
                                Currently assigned to:{" "}
                                <span className="font-medium">
                                  {selectedRIF[index]}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => clearRIFSelection(index)}
                                className="text-xs h-6 px-2"
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={tableHeader.length}
                className="h-24 text-center"
              >
                {getEmptyMessage()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
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
  Check,
  ChevronsUpDown,
  Ellipsis,
  FileBarChart,
  FileText,
  Mail,
  Search,
  UserPlus,
} from "lucide-react";
import { useContext, useEffect, useState, useMemo } from "react";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";
import { RequestInfoContext } from "../../context/RequestInfoContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import EmailSender from "../../component/SendEmail";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function TableDetails() {
  const { isBotOpen, setIsBotOpen, tableData, setTableData } =
    useContext(GlobalContext);
  const { setSearchRFIDetails, searchRFIDetails } =
    useContext(RequestInfoContext);
  const [showEmailSender, setShowEmailSender] = useState(false);
  const [selectedRIF, setSelectedRIF] = useState({});
  const [openRIFPopOver, setOpenRIFPopOver] = useState({});
  const [currentTab, setCurrentTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchProject, setSearchProject] = useState("");
  const [openProjectSearchPopOver, setProjectSearchPopOver] = useState(false);
  const [sortOrder, setSortOrder] = useState("none");
  const location = useLocation();
  const navigate = useNavigate();

  const redirectUserToCreateRFI = (data, rfiName, rfiProject) => {
    console.log("In function: ", data);
    navigate("/create-rfi", {
      state: { searchResults: data, rfiName, rfiProject },
    });
  };

  useEffect(() => {
    setSearchRFIDetails(tableData);
  }, [tableData]);

  const handlePopoverOpen = (index, isOpen) => {
    setOpenRIFPopOver((prev) => ({ ...prev, [index]: isOpen }));
  };

  const handleRIFSelection = (index, selectedValue, option) => {
    setSelectedRIF((prev) => ({
      ...prev,
      [index]: selectedValue === prev[index] ? "" : option.fullName,
    }));
    setOpenRIFPopOver((prev) => ({ ...prev, [index]: false }));
  };

  const clearRIFSelection = (index) => {
    setSelectedRIF((prev) => ({ ...prev, [index]: "" }));
    setOpenRIFPopOver((prev) => ({ ...prev, [index]: false }));
  };

  const handleSort = () => {
    if (sortOrder === "none") {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("none");
    }
  };

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

  const filteredData = useMemo(() => {
    if (!searchRFIDetails) return [];

    let filtered = [...searchRFIDetails];

    if (searchValue.trim()) {
      filtered = filtered.filter(
        (rfi) =>
          rfi.rfiName &&
          rfi.rfiName.toLowerCase().includes(searchValue.toLowerCase().trim())
      );
    }

    if (searchProject.trim()) {
      filtered = filtered.filter(
        (rfi) =>
          rfi.project &&
          rfi.project.toLowerCase().includes(searchProject.toLowerCase().trim())
      );
    }

    if (sortOrder !== "none") {
      filtered.sort((a, b) => {
        const nameA = a.rfiName || "";
        const nameB = b.rfiName || "";
        const firstCharA = nameA.charAt(0).toLowerCase();
        const firstCharB = nameB.charAt(0).toLowerCase();

        if (sortOrder === "asc") {
          return firstCharA.localeCompare(firstCharB);
        } else {
          return firstCharB.localeCompare(firstCharA);
        }
      });
    }

    // Then apply tab filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (currentTab) {
      case "inprogress":
        return filtered.filter((rfi) => {
          return rfi.data.some((dataItem) => {
            if (!dataItem.completionDate) return false;
            const completionDate = new Date(dataItem.completionDate);
            return completionDate > today;
          });
        });

      case "completed":
        return filtered.filter((rfi) => {
          return rfi.data.every((dataItem) => {
            if (!dataItem.completionDate) return false;
            const completionDate = new Date(dataItem.completionDate);
            return completionDate <= today;
          });
        });

      case "all":
      default:
        return filtered;
    }
  }, [searchRFIDetails, currentTab, searchValue, searchProject, sortOrder]);

  // Calculate counts for tab labels
  const tabCounts = useMemo(() => {
    if (!searchRFIDetails) return { all: 0, inprogress: 0, completed: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inProgressCount = searchRFIDetails.filter((rfi) => {
      return rfi.data.some((dataItem) => {
        if (!dataItem.completionDate) return false;
        const completionDate = new Date(dataItem.completionDate);
        return completionDate > today;
      });
    }).length;

    const completedCount = searchRFIDetails.filter((rfi) => {
      return rfi.data.every((dataItem) => {
        if (!dataItem.completionDate) return false;
        const completionDate = new Date(dataItem.completionDate);
        return completionDate <= today;
      });
    }).length;

    return {
      all: searchRFIDetails.length,
      inprogress: inProgressCount,
      completed: completedCount,
    };
  }, [searchRFIDetails]);

  return (
    <div className="pt-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList
          className={`grid w-full grid-cols-3 bg-blue-50`}
        >
          <TabsTrigger
            value="all"
            className="flex items-center data-[state=active]:text-white data-[state=active]:bg-blue-500 gap-2"
          >
            All RFI
            <Badge
              variant="secondary"
              className={`ml-1  text-gray-800 bg-gray-100`}
            >
              {tabCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="inprogress"
            className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            In Progress
            <Badge
              variant="secondary"
              className="ml-1 bg-blue-100 text-blue-800"
            >
              {tabCounts.inprogress}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Completed RFI
            <Badge
              variant="secondary"
              className="ml-1 bg-green-100 text-green-800"
            >
              {tabCounts.completed}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-700 hover:bg-blue-700">
                  {tableHeader.map((item, index) => (
                    <TableHead className="text-white font-semibold" key={index}>
                      <span
                        className={`flex gap-x-2 items-center`}
                      >
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
                        {rfi.data[0]?.completionDate ? (
                          <div className="flex items-center gap-2">
                            <span>
                              {new Date(
                                rfi.data[0].completionDate
                              ).toLocaleDateString("en-US")}
                            </span>
                            {new Date(rfi.data[0].completionDate) >
                            new Date() ? (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                In Progress
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Completed
                              </Badge>
                            )}
                          </div>
                        ) : (
                          "N/A"
                        )}
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
                                <FileText className="h-4 text-blue-700 w-4" />
                                <span className="text-gray-800">
                                  {new Date(rfi.data[0].completionDate) >
                                  new Date() ? (
                                    <span>Generate</span>
                                  ) : (
                                    <span>Download</span>
                                  )}{" "}
                                  Report
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
                                  {new Date(rfi.data[0].completionDate) >
                                  new Date() ? (
                                    <span>Generate</span>
                                  ) : (
                                    <span>Download</span>
                                  )}{" "}
                                  Summary
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
                      No RFIs found for this category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="inprogress" className="mt-6">
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
                        <div className="flex items-center gap-2">
                          <span>
                            {rfi.data[0]?.completionDate
                              ? new Date(
                                  rfi.data[0].completionDate
                                ).toLocaleDateString("en-US")
                              : "N/A"}
                          </span>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            In Progress
                          </Badge>
                        </div>
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
                                <FileText className="h-4 text-blue-700 w-4" />
                                <span className="text-gray-800">
                                  Generate Report
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
                                  Generate Summary
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
                                <CommandEmpty>No employee found.</CommandEmpty>
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
                      No In Progress RFIs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
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
                          <div className="flex items-center flex-wrap gap-y-3  py-1 gap-x-3">
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
                        <div className="flex items-center gap-2">
                          <span>
                            {rfi.data[0]?.completionDate
                              ? new Date(
                                  rfi.data[0].completionDate
                                ).toLocaleDateString("en-US")
                              : "N/A"}
                          </span>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Completed
                          </Badge>
                        </div>
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
                                <FileText className="h-4 text-blue-700 w-4" />
                                <span className="text-gray-800">
                                  Download Report
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
                                  Download Summary
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
                                <CommandEmpty>No employee found.</CommandEmpty>
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
                      No Completed RFIs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="absolute">
        {showEmailSender && (
          <EmailSender open={showEmailSender} setOpen={setShowEmailSender} />
        )}
      </div>
    </div>
  );
}

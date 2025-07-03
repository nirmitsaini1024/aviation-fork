import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableHeader, uploadTableHeader } from "../../mock-data/constant";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BotIcon,
  Ellipsis,
  File,
  FileBarChart,
  FileText,
  Info,
  Mail,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useContext, useEffect, useState, useMemo } from "react";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";
import { RequestInfoContext } from "../../context/RequestInfoContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import EmailSender from "../../component/SendEmail";
import handleDownloadFile from "../../utils/DownloadFile";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import DeleteConfirmation from "./DeleteConfirmation";

export default function TableTemplates({
  setShowTemplate,
  setShowUploadFile,
}) {
  const { isBotOpen, setIsBotOpen, tableData } = useContext(GlobalContext);
  const {
    rfiDetailsForUploadTemplate,
    setRfiDetailsForUploadTemplate,
    editTemplateData,
    setEditTemplateData,
  } = useContext(RequestInfoContext);
  const [showEmailSender, setShowEmailSender] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("none");
  const [deleteRow, setDeleteRow] = useState(null);
  const [openActionButtons, setOpenActionButtons] = useState(null);

  const handleViewDocument = () => {
    window.open("/refdoc", "_blank");
  };

  const handleDeleteRow = () => {
    console.log("Clicked on delete: ", deleteRow, rfiDetailsForUploadTemplate);
    setRfiDetailsForUploadTemplate((prev) =>
      prev.filter((item) => {
        if (item.id !== deleteRow) {
          return item;
        }
      })
    );

    setDeleteRow(null);
  };

  const handleEditRow = (rfi) => {
    setEditTemplateData(rfi);
    console.log("RFI for edit is: ", rfi);
    if (rfi.files && rfi.data[0]?.question) {
      setShowTemplate(false);
      return;
    }

    if (!rfi.files) {
      setShowTemplate(false);
      return;
    }

    if (rfi.files) {
      setShowTemplate(false);
      setShowUploadFile(true);
      return;
    }
  };

  useEffect(() => {
    console.log(rfiDetailsForUploadTemplate);
  }, [rfiDetailsForUploadTemplate]);

  // useEffect(() => {
  //   setRfiDetailsForUploadTemplate(tableData);
  // }, [tableData]);

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
    if (!rfiDetailsForUploadTemplate) return [];

    let filtered = [...rfiDetailsForUploadTemplate];

    if (searchValue.trim()) {
      filtered = filtered.filter(
        (rfi) =>
          rfi.rfiName &&
          rfi.rfiName.toLowerCase().includes(searchValue.toLowerCase().trim())
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
    return filtered;
  }, [rfiDetailsForUploadTemplate, searchValue, sortOrder, tableData]);

  return (
    <div className="pt-6">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-700 hover:bg-blue-700">
              {uploadTableHeader.map((item, index) => (
                <TableHead className="text-white font-semibold" key={index}>
                  <span className={`flex gap-x-2 items-center`}>
                    {item}
                    {item === "RFI Template Name" && (
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
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="border border-gray-300">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((rfi, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-blue-600 hover:cursor-pointer">
                    {rfi.rfiName ? rfi.rfiName : "N/A"}
                  </TableCell>
                  <TableCell className="text-sm flex gap-x-2 max-w-36  hover:cursor-pointer">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex items-start gap-x-2 cursor-pointer">
                          <p className="line-clamp-3 flex-1 min-w-0">
                            {rfi.rfiTemplateDescription
                              ? rfi.rfiTemplateDescription
                              : "N/A"}
                          </p>
                          <Info className="w-3 h-3 text-blue-600 hover:cursor-pointer flex-shrink-0 mt-1" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">
                            Full Description
                          </h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {rfi.rfiTemplateDescription
                              ? rfi.rfiTemplateDescription
                              : "No description available"}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>{rfi.data[0]?.domain || "N/A"}</TableCell>
                  <TableCell>{rfi.data[0]?.department || "N/A"}</TableCell>
                  <TableCell>
                    {rfi.data[0]?.searchedCategory || "N/A"}
                  </TableCell>
                  <TableCell>
                    {rfi.files ? (
                      <div
                        className="flex items-center gap-2"
                        onClick={handleViewDocument}
                      >
                        <File className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span
                          title={rfi.files}
                          className="text-sm font-medium truncate max-w-40 text-blue-500 underline hover:cursor-pointer"
                        >
                          {rfi.files}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No files</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-3">
                          {rfi.data && (
                            <Info className="w-4 h-4 text-blue-600" />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-96 max-h-80 overflow-y-auto p-4 scroll-container"
                        side="left"
                      >
                        <div className="space-y-3">
                          <div className="font-semibold text-sm text-gray-900 border-b pb-2">
                            {rfi.data[0]?.question ? (
                              <span className="text-sm font-medium">
                                {rfi.data?.length || 0} Questions
                              </span>
                            ) : (
                              <span className="text-sm font-medium">
                                0 Questions
                              </span>
                            )}
                          </div>
                          {rfi.data &&
                          rfi.data.length > 0 &&
                          rfi.data[0]?.question ? (
                            rfi.data.map((item, questionIndex) => (
                              <div
                                key={questionIndex}
                                className="border-l-2 border-blue-200 pl-3 py-2"
                              >
                                <div className="flex items-start gap-2">
                                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                                    {questionIndex + 1}
                                  </span>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {item.question}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              No questions available
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <BotIcon
                      className="w-4 h-4 text-black cursor-pointer"
                      onClick={() => setIsBotOpen(!isBotOpen)}
                    />
                  </TableCell>
                  <TableCell>
                    <Popover
                      open={openActionButtons === rfi.id}
                      onOpenChange={(isOpen) =>
                        setOpenActionButtons(isOpen ? rfi.id : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setOpenActionButtons(rfi.id)}
                        >
                          <Ellipsis className="w-4 h-4 text-black" />
                        </Button>
                      </PopoverTrigger>
                      {rfi.id === openActionButtons && (
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
                                {new Date(rfi.data[0]?.completionDate) >
                                new Date() ? (
                                  <span>Download</span>
                                ) : (
                                  <span>Download</span>
                                )}{" "}
                                Template File
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start gap-2 h-auto p-3"
                              onClick={() => handleEditRow(rfi)}
                            >
                              <Pencil className="h-4 text-blue-700 w-4" />
                              <span className="text-gray-800">Edit</span>
                            </Button>
                            <p
                              className="w-full"
                              onClick={() => setDeleteRow(rfi.id)}
                            >
                              <DeleteConfirmation onConfirm={handleDeleteRow} />
                            </p>
                          </div>
                        </PopoverContent>
                      )}
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
      <div className="absolute">
        {showEmailSender && (
          <EmailSender open={showEmailSender} setOpen={setShowEmailSender} />
        )}
      </div>
    </div>
  );
}

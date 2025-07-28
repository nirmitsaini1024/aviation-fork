import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableHeader, uploadDocGenTableHeader } from "../../mock-data/constant";
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
import DeleteConfirmation from "../../Upload-Templates/components/DeleteConfirmation";
import { Badge } from "@/components/ui/badge";

export default function DocGenTableTemplates({
  setShowTemplate,
  setShowUploadFile,
}) {
  const { tableData } = useContext(GlobalContext);
  const {
    docGenForUploadTemplate,
    setDocGenForUploadTemplate,
    setEditDocGenData,
    setDocGenTemplateDataList,
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
    console.log("Clicked on delete: ", deleteRow, docGenForUploadTemplate);
    setDocGenForUploadTemplate((prev) =>
      prev.filter((item) => {
        if (item.id !== deleteRow) {
          return item;
        }
      })
    );

    setDocGenTemplateDataList((prev) =>
      prev.filter((item) => {
        if (item.id !== deleteRow) {
          return item;
        }
      })
    );

    setDeleteRow(null);
  };

  const handleEditRow = (rfi) => {
    setEditDocGenData(rfi);
    console.log("DocGen for edit is: ", rfi);
    setShowTemplate(false);
    setShowUploadFile(true);
  };

  useEffect(() => {
    console.log(docGenForUploadTemplate);
  }, [docGenForUploadTemplate]);

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
    if (!docGenForUploadTemplate) return [];

    let filtered = [...docGenForUploadTemplate];

    if (searchValue.trim()) {
      filtered = filtered.filter(
        (rfi) =>
          rfi.name &&
          rfi.name.toLowerCase().includes(searchValue.toLowerCase().trim())
      );
    }

    if (sortOrder !== "none") {
      filtered.sort((a, b) => {
        const nameA = a.name || "";
        const nameB = b.name || "";
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
  }, [docGenForUploadTemplate, searchValue, sortOrder, tableData]);

  return (
    <div className="pt-6">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-700 hover:bg-blue-700">
              {uploadDocGenTableHeader.map((item, index) => (
                <TableHead className="text-white font-semibold" key={index}>
                  <span className={`flex gap-x-2 items-center`}>
                    {item}
                    {item === "DocGen Template Name" && (
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
                          <span className="sr-only">Sort DocGen Name</span>
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
                    {rfi.name ? rfi.name : "N/A"}
                  </TableCell>
                  <TableCell className="text-sm flex gap-x-2 max-w-36  hover:cursor-pointer">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex items-start gap-x-2 cursor-pointer">
                          <p className="line-clamp-3 flex-1 min-w-0">
                            {rfi.docGenTemplateDescription
                              ? rfi.docGenTemplateDescription
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
                            {rfi.docGenTemplateDescription
                              ? rfi.docGenTemplateDescription
                              : "No description available"}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>{rfi.domain || "N/A"}</TableCell>
                  <TableCell>{rfi.department || "N/A"}</TableCell>
                  <TableCell>{rfi.searchedCategory || "N/A"}</TableCell>
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
                    {rfi.type ? (
                      <div className="flex items-center flex-wrap gap-y-3 py-1 gap-x-3">
                        {rfi.type.map((agent, index) => (
                          <Badge
                            key={index}
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
                                  rfi.name ? rfi.name : "document"
                                )
                              }
                            >
                              <FileText className="h-4 text-blue-700 w-4" />
                              <span className="text-gray-800">
                                Download Template File
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
                  No Templates found for this category.
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

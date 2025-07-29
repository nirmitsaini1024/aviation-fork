import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye, FileText, Link, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


const ReferenceDocumentsPopover = ({
  isOpen,
  onOpenChange,
  referenceDocuments,
  onRemoveDocument,
}) => {
  const handleViewDocument = () => {
    window.open("/refdoc", "_blank");
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ml-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Link className="h-3.5 w-3.5" />
          <span>Ref Docs ({referenceDocuments.length})</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[600px] max-h-[250px] overflow-y-auto"
        side="right"
        align="start"
        sideOffset={10}
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-sm border-b pb-2 flex justify-between items-center">
            <span className="text-blue-700">Referenced Documents</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-3 w-3 text-red-700" />
            </Button>
          </h4>
          <div className="w-full">
            {referenceDocuments.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                No referenced documents
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-blue-500 rounded-md text-white">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                      Document
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                      Added By
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase">
                      Date Added
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {referenceDocuments.map((doc, index) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-500 " />
                          <div>
                            <div className="flex gap-4">
                              <p className="font-medium line-clamp-1">
                                {doc.name}
                              </p>
                              <div className="flex gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDocument();
                                      }}
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Document</TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {doc.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{doc.addedBy || "John Doe"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {doc.dateAdded ? (
                          <span className="text-gray-800">
                            {new Date(doc.dateAdded).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        ) : (
                          <span className=" ">22-05-2025</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReferenceDocumentsPopover;
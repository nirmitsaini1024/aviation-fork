import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import html2pdf from "html2pdf.js";
import { FileText, Eye, Link, X, FileDown } from "lucide-react";
import { useRef, useState } from "react";
import UniversalDocumentViewer from "@/components/universal-document-viewer";

export const ReferenceDocumentsPopover = ({
  isOpen,
  onOpenChange,
  referenceDocuments,
}) => {
  const [selectedDocForView, setSelectedDocForView] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleViewDocument = (doc) => {
    setSelectedDocForView(doc);
    setIsViewerOpen(true);
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex gap-1 text-[#1a56db] py-1 font-normal cursor-pointer border-none shadow-none hover:text-blue-600 hover:bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <Link className="h-full w-full" />
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
              <span>Referenced Documents</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-gray-100"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-3 w-3" />
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
                                          handleViewDocument(doc);
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

      {/* Universal Document Viewer for Reference Documents */}
      <FullPagePopup
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedDocForView(null);
        }}
        title={`Reference Document - ${selectedDocForView?.name || 'Document'}`}
      >
        {selectedDocForView && (
          <UniversalDocumentViewer
            documentUrl={selectedDocForView.url || '/sample.pdf'} // Use actual document URL
            documentType={selectedDocForView.type?.toLowerCase() || 'pdf'}
            mode="single"
            enableToolbar={true}
            enableSearch={true}
            enableAnnotations={false} // Usually read-only for reference docs
            height="100%"
            onLoadComplete={() => console.log('Reference document loaded')}
            onError={(error) => console.error('Error loading reference document:', error)}
          />
        )}
      </FullPagePopup>
    </>
  );
};

export const FullPagePopup = ({
  isOpen,
  onClose,
  children,
  title,
  setIsDownloading = () => {},
  exportButton = false,
}) => {
  if (!isOpen) return null;

  const tableRef = useRef();

  const handleExportPDF = async () => {
    const element = tableRef.current;
    console.log("starting");

    const opt = {
      margin: 0.5,
      filename: "documents-summary.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
        allowTaint: true,
        foreignObjectRendering: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };

    try {
      setIsDownloading(true);
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsDownloading(false);
      console.log("ended downloading");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-[#ffffff] w-11/12 max-w-[1400px] h-5/6 rounded-md shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-b-[#1a56db] bg-[#1a56db]">
          <div></div>
          <div className="flex gap-2 items-center">
            {exportButton && (
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  console.log("Export clicked");
                  await handleExportPDF();
                }}
                className="text-white bg-blue-500 hover:bg-blue-600 hover:cursor-pointer px-6 shadow-md flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" /> Export as PDF
              </Button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log("Close clicked");
                onClose();
              }}
              className="text-[#ffffff] hover:text-gray-200 text-3xl font-bold cursor-pointer flex"
            >
              &times;
            </button>
          </div>
        </div>
        <div className="overflow-auto h-[calc(100%-60px)]">
          <div className="p-12" ref={tableRef}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reference Documents Dialog Component
export const ReferenceDocumentsDialog = ({
  isOpen,
  onClose,
  selectedDocIds = [],
  onSave,
  currentDocId,
  availableDocuments = [],
}) => {
  const [tempSelectedIds, setTempSelectedIds] = useState(selectedDocIds);

  const handleDocumentToggle = (docId) => {
    setTempSelectedIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSave = () => {
    onSave(tempSelectedIds);
    onClose();
  };

  // Filter out the current document from the list
  const filteredDocuments = availableDocuments.filter(
    (doc) => doc.id !== currentDocId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Reference Documents</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    id={`doc-${doc.id}`}
                    checked={tempSelectedIds.includes(doc.id)}
                    onCheckedChange={() => handleDocumentToggle(doc.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`doc-${doc.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {doc.name}
                    </label>
                    <p className="text-xs text-gray-500">{doc.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Select</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
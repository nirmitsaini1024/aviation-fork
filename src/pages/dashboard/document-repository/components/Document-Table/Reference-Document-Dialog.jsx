import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { mockReferenceDocuments } from "../../mock-data/Document-Table-constant";
import { Button } from "@/components/ui/button";

const ReferenceDocumentsDialog = ({
  isOpen,
  onClose,
  selectedDocIds,
  onSave,
  currentDocId,
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
  const availableDocuments = mockReferenceDocuments.filter(
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
              {availableDocuments.map((doc) => (
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
        <DialogFooter className="">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Select</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferenceDocumentsDialog
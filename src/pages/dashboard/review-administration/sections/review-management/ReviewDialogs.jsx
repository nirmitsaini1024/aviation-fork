import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// UPDATED: Use UniversalDocumentViewer instead of old viewers
import UniversalDocumentViewer from "@/components/universal-document-viewer";

// FullPagePopup component for document viewing
const FullPagePopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-white w-11/12 max-w-[1400px] h-5/6 rounded-lg shadow-xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-900 text-3xl font-bold z-10"
        >
          &times;
        </button>
        <div className="p-6 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );
};

export default function ReviewDialogs({
  selectedFile,
  setSelectedFile,
  isDialogOpen,
  setIsDialogOpen,
  isViewerPopupOpen,
  setIsViewerPopupOpen,
  viewerFileType,
  setViewerFileType,
  viewerFilePath,
  setViewerFilePath,
}) {
  // ADDED: Loading state for document viewer
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

  // ADDED: Handle document load completion
  const handleDocumentLoad = () => {
    setIsDocumentLoaded(true);
  };

  // ADDED: Reset loading state when popup closes
  const handleCloseViewer = () => {
    setIsViewerPopupOpen(false);
    setIsDocumentLoaded(false);
  };

  return (
    <>
      {/* Image/File Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedFile?.fileName || "File Preview"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedFile && selectedFile.hasImage && (
              <img
                src={selectedFile.filePath || selectedFile.imageSrc}
                alt={selectedFile.fileName || "Image preview"}
                className="w-full rounded"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* UPDATED: Document Viewer Popup using UniversalDocumentViewer */}
      <FullPagePopup
        isOpen={isViewerPopupOpen}
        onClose={handleCloseViewer}
      >
        {viewerFileType === "pdf" || viewerFileType === "docx" || viewerFileType === "doc" ? (
          <div className="h-full flex flex-col">
            {/* <h2 className="text-xl font-bold mb-4">
              {viewerFileType === "pdf" ? "PDF Viewer" : "Document Viewer"}
            </h2> */}
            
            {/* Loading indicator */}
            {!isDocumentLoaded && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-gray-600">Loading document...</p>
                </div>
              </div>
            )}

            {/* UniversalDocumentViewer */}
            <div 
              className={`flex-1 transition-opacity duration-300 ${
                isDocumentLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <UniversalDocumentViewer
                documentUrl={viewerFilePath}
                documentType={viewerFileType}
                mode="single"
                enableToolbar={true}
                enableSearch={true}
                enableAnnotations={viewerFileType === "pdf"}
                enableEditing={viewerFileType === "docx" || viewerFileType === "doc"}
                height="100%"
                width="100%"
                // ADD these configs that work in RefDocPage:
                enableOptimizedWorkers={false}
                useSharedWorker={false}
                onLoadComplete={handleDocumentLoad}
                onError={(error) => {
                  console.error('Error loading document:', error);
                  setIsDocumentLoaded(true);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center p-8 h-full flex items-center justify-center">
            <div>
              <p className="text-gray-600 text-lg mb-2">Cannot preview this file type.</p>
              <p className="text-gray-500 text-sm">
                Supported formats: PDF, DOC, DOCX, and images
              </p>
            </div>
          </div>
        )}
      </FullPagePopup>
    </>
  );
}

// Export the dialog functions for use by other components
export const useDialogFunctions = ({
  setSelectedFile,
  setIsDialogOpen,
  setViewerFileType,
  setViewerFilePath,
  setIsViewerPopupOpen,
}) => {
  const openFileDialog = (file) => {
    setSelectedFile(file);
    setIsDialogOpen(true);
  };

  const openDocumentViewer = (file) => {
    setViewerFileType(file.fileType);
    setViewerFilePath(file.filePath || file.imageSrc);
    setIsViewerPopupOpen(true);
  };

  return { openFileDialog, openDocumentViewer };
};
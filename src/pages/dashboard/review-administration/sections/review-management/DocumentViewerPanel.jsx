import { Button } from "@/components/ui/button";
import { MousePointer2, X, Search } from "lucide-react";
import WebViewerComponent from "../../sub-component/web-viewer/NewWebViewer";

export default function DocumentViewerPanel({
  showLeftPanel,
  showRightPanel,
  webViewerRef,
  isWebViewerLoaded,
  isLoaded,
  currentPage,
  selectedText,
  selectedTextPages,
  entireDocumentSelected,
  addingTo,
  addingToGroupId,
  editingContent,
  activeSearchItem,
  searchText,
  setSelectedText,
  setSelectedTextPages,
  handleWebViewerLoad,
  handlePageChange,
  setEditingContent,
}) {
  const cancelEditSavedContent = () => {
    setEditingContent(null);
  };

  return (
    <div className={`transition-all duration-300 ${
      showLeftPanel
        ? showRightPanel
          ? "lg:w-1/2"
          : "w-full"
        : "lg:w-0 opacity-0 overflow-hidden"
    } relative`}>
      
      <div className="bg-white rounded-xl h-full shadow-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          
          {/* Loading Indicator */}
          {!isWebViewerLoaded && (
            <div className="absolute inset-0 bg-white flex top-[30%] justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                <p className="text-gray-600">Loading document viewer...</p>
              </div>
            </div>
          )}

          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                <p className="text-gray-600">Loading document viewer...</p>
              </div>
            </div>
          )}

          {/* WebViewer Component */}
          <div
            className={`transition-opacity duration-300 h-full ${
              isWebViewerLoaded ? "opacity-100" : "opacity-0"
            }`}
            ref={webViewerRef}
          >
            <WebViewerComponent
              setSelectedText={setSelectedText}
              searchText={searchText}
              onLoadComplete={handleWebViewerLoad}
              initialPage={currentPage}
              setSelectedTextPages={setSelectedTextPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {(addingTo || editingContent) && !entireDocumentSelected && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-center text-blue-700 font-medium animate-pulse">
          {addingTo ? (
            `Select text to add as ${
              addingTo === "review" ? "review" : "related"
            } content ${addingToGroupId ? "to saved group" : ""}`
          ) : (
            <div className="flex flex-col items-center">
              <div>Select text to update the content</div>
              <Button
                onClick={cancelEditSavedContent}
                variant="outline"
                className="mt-2 hover:bg-red-50 border-red-100 text-red-500 hover:text-red-600"
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Editing
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Search Status */}
      {activeSearchItem && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center text-green-700 font-medium">
          <Search className="h-4 w-4 inline-block mr-2" />
          Searching for selected text in document...
          <span className="block text-xs mt-1 text-green-600">
            Click the highlighted text again to clear search
          </span>
        </div>
      )}
    </div>
  );
}
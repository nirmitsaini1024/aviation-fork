import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { DocumentContext } from "@/pages/dashboard/review-administration/contexts/DocumentContext";
import  SaveButton  from "../../sub-component/save-button";
import { TriangleAlert, ChevronLeft, ChevronRight } from "lucide-react";

import DocumentViewerPanel from "./DocumentViewerPanel";
import ContentCreationPanel from "./ContentCreationPanel";
import SavedGroupsPanel from "./SavedGroupsPanel";
import ReviewDialogs, { useDialogFunctions } from "./ReviewDialogs";
import { sampleSavedGroups } from "./mock-data/reviewRelated";
import { availableDocuments } from "./mock-data/reviewRelated";
import ReviewManagementProvider from "./Context/ReviewManagementProvider";
import Chapters from "./sub-component/Chapters";

export default function ReviewManagement() {
  const webViewerRef = useRef(null);
  const { documents, currentDocId } = useContext(DocumentContext);
  const currentDocument = documents.find((doc) => doc.id === currentDocId);
  const isInReview = currentDocument?.reviewStatus == "in review";

  // Panel visibility state
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showLeftPanel, setSHowLeftPanel] = useState(true);

  // Document viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const [isWebViewerLoaded, setIsWebViewerLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  // Document name state
  const [documentName, setDocumentName] = useState("Document.docx");

  // Content selection state
  const [selectedText, setSelectedText] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [selectedTextPages, setSelectedTextPages] = useState(null);
  const [entireDocumentSelected, setEntireDocumentSelected] = useState(false);
  const [activeContentItem, setActiveContentItem] = useState(null);

  // Footer content state
  const [openFooterTextArea, setOpenFooterTextArea] = useState(false);
  const [footerContent, setFooterContent] = useState("");
  const [isEditFooterContent, setIsEditFooterContent] = useState(null);
  const [deleteFooterContent, setDeleteFooterContent] = useState(null);
  const [showFooterContentInReview, setShowFooterContentInReview] = useState("");

  // Content creation state
  const [reviewContent, setReviewContent] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isGroupNameEmpty, setIsGroupNameEmpty] = useState(false);
  const [addingTo, setAddingTo] = useState(null);
  const [addingToGroupId, setAddingToGroupId] = useState(null);
  const [isWritingContent, setIsWritingContent] = useState(null);
  const [manualContent, setManualContent] = useState("");
  const [editingContent, setEditingContent] = useState(null);

  // Entire document state
  const [entireDocumentNote, setEntireDocumentNote] = useState("");
  const [entireDocumentGroupName, setEntireDocumentGroupName] = useState("Entire Document Reference");

  // Reference documents state
  const [contentReferenceDocs, setContentReferenceDocs] = useState({});
  const [referReviewDocuments, setReferReviewDocuments] = useState([]);
  const [showDocSelector, setShowDocSelector] = useState(false);

  // Saved groups state
  const [savedGroups, setSavedGroups] = useState(sampleSavedGroups);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [IseditGroupNameByUsingId, setIsEditGroupNameByUsingId] = useState(null);
  const [confirmDeleteDocument, setConfirmDeleteDocument] = useState(null);
  const [editedGroupName, setEditedGroupName] = useState("");

  // Search state
  const [searchText, setSearchText] = useState("");
  const [searchTextindocx, setSearchTextindocx] = useState("");
  const [activeSearchItem, setActiveSearchItem] = useState(null);

  // Dialog state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewerPopupOpen, setIsViewerPopupOpen] = useState(false);
  const [viewerFileType, setViewerFileType] = useState(null);
  const [viewerFilePath, setViewerFilePath] = useState(null);

  // Event handlers
  const handleWebViewerLoad = useCallback(() => {
    setIsWebViewerLoaded(true);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    sessionStorage.setItem("currentPage", pageNumber);
  }, []);

  // Dialog functions using the custom hook
  const { openFileDialog, openDocumentViewer } = useDialogFunctions({
    setSelectedFile,
    setIsDialogOpen,
    setViewerFileType,
    setViewerFilePath,
    setIsViewerPopupOpen,
  });

  // Critical useEffect for handling selectedText changes and adding content
  useEffect(() => {
    if (selectedText && !entireDocumentSelected) {
      // If we're editing existing content in a saved group
      if (editingContent) {
        const { groupId, contentId } = editingContent;
        // Update the content in the saved group - include the page information
        setSavedGroups(
          savedGroups.map((group) => {
            if (group.id === groupId) {
              return {
                ...group,
                reviewContent: group.reviewContent.map((item) => {
                  if (item.id === contentId) {
                    return {
                      ...item,
                      content: selectedText,
                      page: selectedTextPages ? selectedTextPages : "",
                    };
                  }
                  return item;
                }),
              };
            }
            return group;
          })
        );

        // Reset the editing state
        setEditingContent(null);
        setSelectedText("");
      }
      // If we're adding new content to a new group
      else if (addingTo === "review" && !addingToGroupId) {
        const newId = `review-${Date.now()}`;
        setReviewContent([
          ...reviewContent,
          {
            id: newId,
            content: selectedText,
            page: selectedTextPages ? selectedTextPages : "",
            fileName: "", // No file associated with text selection
            hasImage: false,
            fileType: null,
          },
        ]);
        // Reset states
        setAddingTo(null);
      }
      // If we're adding new content to an existing saved group
      else if (addingTo === "review" && addingToGroupId) {
        const newId = `review-${Date.now()}`;
        const newItem = {
          id: newId,
          content: selectedText,
          page: selectedTextPages ? selectedTextPages : "",
          fileName: "",
          hasImage: false,
          fileType: null,
        };

        // Add the new content to the specified saved group
        setSavedGroups(
          savedGroups.map((group) => {
            if (group.id === addingToGroupId) {
              return {
                ...group,
                reviewContent: [...group.reviewContent, newItem],
              };
            }
            return group;
          })
        );
        // Reset states
        setAddingTo(null);
        setAddingToGroupId(null);
        setSelectedText("");
      }
    }
  }, [
    selectedText,
    addingTo,
    addingToGroupId,
    reviewContent,
    editingContent,
    savedGroups,
    selectedTextPages,
    entireDocumentSelected,
  ]);

  // useEffect for footer content with selected text
  useEffect(() => {
    if (
      selectedText &&
      !entireDocumentSelected &&
      isEditFooterContent !== null
    ) {
      setFooterContent(selectedText);
    }
  }, [selectedText, entireDocumentSelected, isEditFooterContent]);

  const handlePanels = (panel) => {
    if (panel === "left") {
      if (showLeftPanel && showRightPanel) {
        setShowRightPanel(false);
      } else {
        setSHowLeftPanel(true);
        setShowRightPanel(true);
      }
    } else if (panel === "right") {
      if (showLeftPanel && showRightPanel) {
        setSHowLeftPanel(false);
      } else {
        setSHowLeftPanel(true);
        setShowRightPanel(true);
      }
    }
  };

  // Pass all state and handlers to child components
  const sharedProps = {
    // State
    currentDocument,
    currentPage,
    selectedText,
    selectedPage,
    selectedTextPages,
    entireDocumentSelected,
    activeContentItem,
    reviewContent,
    groupName,
    isGroupNameEmpty,
    addingTo,
    addingToGroupId,
    isWritingContent,
    manualContent,
    editingContent,
    entireDocumentNote,
    entireDocumentGroupName,
    contentReferenceDocs,
    referReviewDocuments,
    showDocSelector,
    savedGroups,
    expandedGroups,
    confirmDelete,
    IseditGroupNameByUsingId,
    confirmDeleteDocument,
    editedGroupName,
    searchText,
    searchTextindocx,
    activeSearchItem,
    isWebViewerLoaded,
    isLoaded,
    footerContent,
    openFooterTextArea,
    isEditFooterContent,
    deleteFooterContent,
    showFooterContentInReview,
    availableDocuments,
    documentName,

    // Setters
    setCurrentPage,
    setSelectedText,
    setSelectedPage,
    setSelectedTextPages,
    setEntireDocumentSelected,
    setActiveContentItem,
    setReviewContent,
    setGroupName,
    setIsGroupNameEmpty,
    setAddingTo,
    setAddingToGroupId,
    setIsWritingContent,
    setManualContent,
    setEditingContent,
    setEntireDocumentNote,
    setEntireDocumentGroupName,
    setContentReferenceDocs,
    setReferReviewDocuments,
    setShowDocSelector,
    setSavedGroups,
    setExpandedGroups,
    setConfirmDelete,
    setIsEditGroupNameByUsingId,
    setConfirmDeleteDocument,
    setEditedGroupName,
    setSearchText,
    setSearchTextindocx,
    setActiveSearchItem,
    setIsWebViewerLoaded,
    setIsLoaded,
    setFooterContent,
    setOpenFooterTextArea,
    setIsEditFooterContent,
    setDeleteFooterContent,
    setShowFooterContentInReview,
    setDocumentName,

    // Handlers
    handleWebViewerLoad,
    handlePageChange,
    openFileDialog,
    openDocumentViewer,
  };

  return (
    <ReviewManagementProvider>
    <section>
      <style>
        {`
          .force-enabled {
            opacity: 1 !important;
            pointer-events: auto !important;
          }
        `}
      </style>

      {isInReview && (
        <p className="flex w-full items-center justify-center -mt-4 mb-4 text-red-500 bg-red-100 py-2 rounded-md">
          <TriangleAlert size={16} className="mr-2" />
          You are editing in In-Review Content. This might affect the Review Cycle!!
        </p>
      )}

      <main className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container min-w-full px-10 py-4 flex-1 min-h-0">
          <div className="flex flex-col lg:flex-row gap-8 h-full p-2">
            
            {/* Document Viewer Panel */}
            <DocumentViewerPanel
              showLeftPanel={showLeftPanel}
              showRightPanel={showRightPanel}
              webViewerRef={webViewerRef}
              {...sharedProps}
            />

            {/* Panel Toggle Controls */}
            <div className="relative flex items-center justify-center gap-y-5 flex-col">
              <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px border-l-2 border-dotted border-gray-300" />
              
              <div className="absolute top-1/2 space-y-5">
                <button
                  onClick={() => handlePanels("left")}
                  className={`hover:cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 p-1.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-20 ${
                    showLeftPanel && !showRightPanel && "opacity-0"
                  }`}
                  title="Expand right panel"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>

                <button
                  onClick={() => handlePanels("right")}
                  className={`hover:cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 p-1.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-20 ${
                    !showLeftPanel && showRightPanel && "opacity-0"
                  }`}
                  title="Expand right panel"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content Creation and Management Panel */}
            <div className={`transition-all duration-300 flex flex-col ${
              showRightPanel
                ? showLeftPanel
                  ? "lg:w-1/2"
                  : "w-full"
                : "lg:w-0 opacity-0 overflow-hidden"
            }`}>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-1">
                  
                  {/* Content Creation Panel */}
                  <ContentCreationPanel {...sharedProps} />
                  
                  {/* Saved Groups Panel */}
                  <SavedGroupsPanel {...sharedProps} />
                  
                  <Chapters entireDocumentSelected={entireDocumentSelected}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialogs and Popups */}
        <ReviewDialogs
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          isViewerPopupOpen={isViewerPopupOpen}
          setIsViewerPopupOpen={setIsViewerPopupOpen}
          viewerFileType={viewerFileType}
          setViewerFileType={setViewerFileType}
          viewerFilePath={viewerFilePath}
          setViewerFilePath={setViewerFilePath}
        />

        {/* Fixed Save Button */}
        <SaveButton title={currentDocument?.name} isInReview={isInReview} />
      </main>
    </section>
    </ReviewManagementProvider>
  );
}
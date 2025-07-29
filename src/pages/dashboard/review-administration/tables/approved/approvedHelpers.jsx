import React from "react";
import { Info } from "lucide-react";

// Function to truncate text with info icon
export const truncate = (text, length) => {
  if (text.length > length) {
    return (
      <>
        {text.substr(0, length)}...
        <Info className="inline w-3 h-3 ml-1" />
      </>
    );
  } else {
    return (
      <>
        {text.substr(0, length)}...
        <Info className="inline w-3 h-3 ml-1" />
      </>
    );
  }
};

// Function to format timestamp
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Function to get reference documents by document ID
export const getReferenceDocuments = (docId, documentReferences, mockReferenceDocuments) => {
  const refIds = documentReferences[docId] || [];
  return mockReferenceDocuments.filter((doc) => refIds.includes(doc.id));
};

// Function to handle reference document removal
export const handleRemoveReferenceDocument = (docId, refDocId, setDocumentReferences) => {
  setDocumentReferences((prev) => ({
    ...prev,
    [docId]: prev[docId].filter((id) => id !== refDocId),
  }));
};

// Function to toggle reference popover
export const toggleReferencePopover = (docId, setReferencePopovers) => {
  setReferencePopovers((prev) => ({
    ...prev,
    [docId]: !prev[docId],
  }));
};

// Function to handle review cycle click
export const handleReviewCycleClick = (docId, expandedReviewCycle, setExpandedReviewCycle, e) => {
  e.stopPropagation();
  if (expandedReviewCycle === docId) {
    setExpandedReviewCycle(null);
  } else {
    setExpandedReviewCycle(docId);
  }
};

// Function to handle save reference documents
export const handleSaveReferenceDocuments = (selectedDocIds, selectedDoc, setDocumentReferences) => {
  if (selectedDoc) {
    setDocumentReferences((prev) => ({
      ...prev,
      [selectedDoc.id]: selectedDocIds,
    }));
  }
};

// Function to handle opening reference dialog
export const handleOpenReferenceDialog = (doc, setSelectedDoc, setReferenceDocsDialogOpen) => {
  setSelectedDoc(doc);
  setReferenceDocsDialogOpen(true);
};

// Function to handle web viewer load
export const handleWebViewerLoad = (setIsWebViewerLoaded) => {
  setIsWebViewerLoaded(true);
};

// Function to handle summary click
export const handleSummaryClick = (doc, setSelectedDocument, setIsFullPagePopupOpen) => {
  console.log("Summary clicked for document:", doc);
  setSelectedDocument(doc);
  setIsFullPagePopupOpen(true);
};

// Function to handle commented copy click
export const handleCommentedCopyClick = (setIsCommentedCopyOpen) => {
  setIsCommentedCopyOpen(true);
};

// Function to handle close popup
export const handleClosePopup = (setIsFullPagePopupOpen, setSelectedDocument) => {
  setIsFullPagePopupOpen(false);
  setSelectedDocument(null);
};

// Function to handle commented copy close popup
export const handleCommentedCopyClosePopup = (setIsCommentedCopyOpen, setIsViewOpen, setIsWebViewerLoaded) => {
  setIsCommentedCopyOpen(false);
  setIsViewOpen(false);
  setIsWebViewerLoaded(false);
};

// Function to render node badge based on type
export const renderNodeBadge = (nodeType) => {
  const badgeClasses = {
    user: "bg-blue-100 text-blue-800 border border-blue-200",
    group: "bg-green-100 text-green-800 border border-green-200",
    default: "bg-yellow-100 text-yellow-800 border border-yellow-200"
  };

  const badgeText = {
    user: "User",
    group: "Group",
    default: "Approval"
  };

  return badgeClasses[nodeType] || badgeClasses.default;
};

// Function to render node status
export const renderNodeStatus = (status) => {
  const isAssignedOrInitiated = status === "Assigned" || status === "Initiated";
  
  return {
    containerClass: isAssignedOrInitiated 
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-yellow-100 text-yellow-800 border border-yellow-200",
    dotClass: isAssignedOrInitiated ? "bg-green-500" : "bg-yellow-500"
  };
};

// Function to render attribute styling
export const renderAttributeStyle = (index) => {
  const styles = {
    name: {
      0: "bg-blue-50 text-blue-800 border-blue-200 group-hover:bg-blue-100",
      1: "bg-green-50 text-green-800 border-green-200 group-hover:bg-green-100",
      2: "bg-purple-50 text-purple-800 border-purple-200 group-hover:bg-purple-100"
    },
    value: {
      0: "border-blue-100 border-l-0 group-hover:border-blue-200",
      1: "border-green-100 border-l-0 group-hover:border-green-200",
      2: "border-purple-100 border-l-0 group-hover:border-purple-200"
    }
  };

  const styleIndex = index % 3;
  return {
    nameClass: styles.name[styleIndex] || styles.name[0],
    valueClass: styles.value[styleIndex] || styles.value[0]
  };
};

// Function to render node type indicator
export const renderNodeTypeIndicator = (nodeType) => {
  const typeClasses = {
    user: "bg-blue-500",
    group: "bg-green-500",
    default: "bg-yellow-500"
  };

  return typeClasses[nodeType] || typeClasses.default;
};
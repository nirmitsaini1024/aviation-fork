import { Badge } from "../../../../../components/ui/badge";
import { Info } from "lucide-react";

// Utility function to format timestamp
export function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return timestamp;
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, "0");

    return `${day}-${month}-${year}, ${formattedHours}:${minutes}${ampm}`;
  } catch (error) {
    return timestamp;
  }
}

// Function to truncate text with info icon
export const truncate = (text, length) => {
  if (text.length > length) {
    return (
      <>
        {text.substr(0, length)}...
        <Info className="inline w-3 h-3 ml-1 text-blue-500" />
      </>
    );
  } else {
    return (
      <>
        {text.substr(0, length)}...
        <Info className="inline w-3 h-3 ml-1 text-blue-500" />
      </>
    );
  }
};

// Function to normalize document status
export const normalizeStatus = (doc) => {
  const normalizedDoc = { ...doc };

  if (!normalizedDoc.uploadedAt) {
    normalizedDoc.uploadedAt = new Date().toLocaleString();
  }

  if (normalizedDoc.isReference || normalizedDoc.status === "refdoc") {
    normalizedDoc.status = "refdoc";
    normalizedDoc.reviewStatus = "reference";
    return normalizedDoc;
  }

  if (
    !normalizedDoc.status ||
    normalizedDoc.status === "working" ||
    normalizedDoc.status === "final"
  ) {
    if (normalizedDoc.fileType === "pdf") {
      normalizedDoc.status = "approved";
      normalizedDoc.reviewStatus = normalizedDoc.reviewStatus || "submitted";
    } else if (
      normalizedDoc.fileType === "docx" ||
      normalizedDoc.fileType === "doc"
    ) {
      normalizedDoc.status = "draft review";
      normalizedDoc.reviewStatus =
        normalizedDoc.reviewStatus || "draft review";
    }
  }

  return normalizedDoc;
};

// Function to get document name
export const getDocumentName = (document) => {
  if (document.title) return document.title;
  if (document.file?.name) return document.file.name.replace(/\.[^/.]+$/, "");
  if (document.name) return document.name;
  return `Document ${document.id}`;
};

// Function to get file type badge
export const getFileTypeBadge = (document) => {
  const fileType =
    document.fileType ||
    (document.isReference ? document.actualExtension || "pdf" : "unknown");

  let badgeClass = "";
  switch (fileType) {
    case "pdf":
      badgeClass = "bg-red-50 text-red-600 text-xs";
      break;
    case "docx":
    case "doc":
      badgeClass = "bg-blue-50 text-blue-600 text-xs";
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-800 text-xs";
  }

  return <Badge className={`${badgeClass} px-2`}>{fileType}</Badge>;
};

// Function to get status badge
export const getStatusBadge = (document) => {
  // Fix: Use reviewStatus first, then fall back to status
  const docStatus = document.reviewStatus || document.status || "unknown";

  let badgeClass = "";
  let displayText = "";

  if (
    docStatus === "refdoc" ||
    docStatus === "reference" ||
    document.isReference
  ) {
    badgeClass = "bg-purple-100 text-purple-800";
    displayText = "Reference";
  } else if (docStatus === "pending") {
    badgeClass = "bg-yellow-100 text-yellow-800";
    displayText = "Pending";
  } else if (docStatus === "draft review") {
    badgeClass = "bg-orange-100 text-orange-800";
    displayText = "Draft Review";
  } else if (docStatus === "approved") {
    badgeClass = "bg-green-100 text-green-800";
    displayText = "Approved";
  } else if (docStatus === "in review") {
    badgeClass = "bg-blue-100 text-blue-800";
    displayText = "In Review";
  } else if (docStatus === "submitted" || docStatus === "final") {
    badgeClass = "bg-green-100 text-green-800";
    displayText = docStatus === "final" ? "Final" : "Submitted";
  } else if (docStatus === "review" || docStatus === "working") {
    badgeClass = "bg-gray-100 text-gray-800";
    displayText = docStatus === "working" ? "Working" : "Ready for Review";
  } else if (docStatus === "disapproved") {
    badgeClass = "bg-red-100 text-red-800";
    displayText = "Disapproved";
  } else {
    badgeClass = "bg-gray-100 text-gray-800";
    displayText = docStatus.charAt(0).toUpperCase() + docStatus.slice(1);
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${badgeClass}`}
    >
      {displayText}
    </span>
  );
};

// Helper function to check if document is in review
export const isDocumentInReview = (document) => {
  const status = document.status || document.reviewStatus || "";
  return status === "in review" || status === "review";
};

// Helper function to check if document is a reference document
export const isReferenceDocument = (document) => {
  return (
    document.isReference ||
    document.status === "reference" ||
    document.status === "refdoc" ||
    document.reviewStatus === "reference"
  );
};

// Function to determine if actions column should be shown
export const shouldShowActionsColumn = (doc, selectedTab, isSubmitted) => {
  const inReview = isDocumentInReview(doc);
  const isReference = isReferenceDocument(doc);
  const isFinalVersion =
    doc.status === "approved" ||
    doc.status === "final" ||
    doc.status === "submitted";

  // Don't show actions column for reference documents
  if (isReference) return false;

  // Don't show actions column in final tab
  if (selectedTab === "final") return false;

  // Don't show actions column for final version documents in all tab
  if (selectedTab === "all" && isFinalVersion) return false;

  // Show actions column if document is in review and submitted
  return inReview && isSubmitted;
};

// Function to determine if review panel should be shown
export const shouldShowReviewPanel = (doc, selectedTab, hasDocumentsInReview) => {
  const inReview = isDocumentInReview(doc);
  const isReference = isReferenceDocument(doc);
  const isFinalVersion =
    doc.status === "approved" ||
    doc.status === "final" ||
    doc.status === "submitted";

  // Don't show review panel for reference documents
  if (isReference) return false;

  // Don't show review panel in final tab
  if (selectedTab === "final") return false;

  // Don't show review panel for final version documents in all tab
  if (selectedTab === "all" && isFinalVersion) return false;

  // Show review panel if document is in review
  return inReview && hasDocumentsInReview;
};

// Function to filter documents based on status and selected tab
export const filterDocuments = (allDocs, status, selectedTab) => {
  let docs = [...allDocs];

  if (status !== "reference") {
    docs = docs.filter(
      (doc) =>
        !(
          doc.isReference ||
          doc.status === "reference" ||
          doc.status === "refdoc" ||
          doc.reviewStatus === "reference"
        )
    );
  } else if (status === "reference") {
    docs = docs.filter(
      (doc) =>
        doc.isReference ||
        doc.status === "reference" ||
        doc.status === "refdoc" ||
        doc.reviewStatus === "reference"
    );
    return docs;
  }

  if (status) {
    if (status === "final") {
      docs = docs.filter(
        (doc) =>
          doc.fileType === "pdf" ||
          doc.status === "final" ||
          doc.status === "submitted"
      );
    } else if (status === "working") {
      docs = docs.filter(
        (doc) =>
          doc.fileType === "docx" ||
          doc.fileType === "doc" ||
          doc.status === "working" ||
          doc.status === "in review" ||
          doc.status === "draft review"
      );
    }
  }

  if (selectedTab === "working") {
    docs = docs.filter(
      (doc) =>
        doc.fileType === "docx" ||
        doc.fileType === "doc" ||
        doc.status === "working" ||
        doc.status === "in review" ||
        doc.status === "draft review" ||
        doc.status === "pending"
    );
  } else if (selectedTab === "final") {
    docs = docs.filter(
      (doc) =>
        doc.fileType === "pdf" ||
        doc.status === "final" ||
        doc.status === "submitted" ||
        doc.status === "approved"
    );
  }

  return docs;
};

// Function to check if documents have both versions
export const checkHasBothVersions = (allDocs) => {
  const titleMap = {};

  allDocs.forEach((doc) => {
    const title = doc.title || doc.name || `Document ${doc.id}`;
    if (!titleMap[title]) {
      titleMap[title] = new Set();
    }
    titleMap[title].add(doc.fileType || "unknown");
  });

  const result = {};
  Object.entries(titleMap).forEach(([title, fileTypes]) => {
    result[title] = fileTypes.size > 1;
  });

  return result;
};

// Function to check if there are documents in review
export const checkHasDocumentsInReview = (filteredDocs) => {
  return filteredDocs.some((doc) => {
    const status = doc.status || doc.reviewStatus || "";
    return status === "in review" || status === "review";
  });
};

// Function to get table header configuration
export const getTableHeaderConfig = (status) => {
  if (status === "reference") {
    return {
      title: "Reference Documents",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    };
  } else {
    return {
      title: "Current Document Details",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    };
  }
};
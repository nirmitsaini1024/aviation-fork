// /utils/review-tasks-utils.js
import { Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";
import React from "react"

// Filter documents based on search query, status, reviewer type and column filters
export function filterDocuments(documents, searchQuery, filterStatus, reviewerTypeFilter, columnFilters) {
  return documents.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.referenceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.commentDetails.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    const matchesOwner = 
      reviewerTypeFilter === 'all' || 
      doc.reviewerType === reviewerTypeFilter;

    // Apply column filters
    const matchesColumnFilters = Object.entries(columnFilters).every(([key, value]) => {
      if (!value) return true;
      return String(doc[key]).toLowerCase().includes(value.toLowerCase());
    });

    return matchesSearch && matchesStatus && matchesOwner && matchesColumnFilters;
  });
}

// Sort documents based on column and direction
export function sortDocuments(documents, sortColumn, sortDirection) {
  if (!sortColumn || !sortDirection) return documents;

  return [...documents].sort((a, b) => {
    const aValue = String(a[sortColumn]);
    const bValue = String(b[sortColumn]);

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
}

// Get status badge color based on status
export function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "rejected":
      return "bg-gray-200 text-gray-800 hover:bg-gray-100";
    case "expired":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

// Get status icon based on status
export function getStatusIcon(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return React.createElement(Clock, { className: "h-4 w-4 mr-1" });
    case "approved":
      return React.createElement(CheckCircle, { className: "h-4 w-4 mr-1" });
    case "rejected":
      return React.createElement(XCircle, { className: "h-4 w-4 mr-1" });
    case "expired":
      return React.createElement(AlertCircle, { className: "h-4 w-4 mr-1" });
    default:
      return React.createElement(FileText, { className: "h-4 w-4 mr-1" });
  }
}

// Generate AI summary for a document
export function getAiSummary(docId, documents, flightManualSections) {
  const doc = documents.find((d) => d.id === docId);
  if (!doc) {
    // Check if it's a section
    const section = flightManualSections.find((s) => s.id === docId);
    if (section && section.aiAnalysis && section.aiAnalysis.summary) {
      return section.aiAnalysis.summary;
    }
    return "No summary available";
  }

  // Check if we have predefined AI analysis in the mock data
  if (doc.aiAnalysis && doc.aiAnalysis.summary) {
    return doc.aiAnalysis.summary;
  }

  // Generate mock AI summary based on document content as fallback
  return `AI Analysis: This document contains ${
    doc.name.includes("Security")
      ? "security protocols"
      : doc.name.includes("Emergency")
      ? "emergency procedures"
      : doc.name.includes("Maintenance")
      ? "maintenance schedules"
      : doc.name.includes("Training")
      ? "training modules"
      : "aviation procedures"
  }. The content appears to be ${
    doc.status === "approved"
      ? "compliant with current regulations"
      : doc.status === "rejected"
      ? "requiring significant revisions"
      : "pending further review"
  }. Key focus areas include ${doc.referenceText.substring(0, 30)}...`;
}

// Generate AI sentiment for a document
export function getAiSentiment(docId, documents, flightManualSections) {
  const doc = documents.find((d) => d.id === docId);
  if (!doc) {
    // Check if it's a section
    const section = flightManualSections.find((s) => s.id === docId);
    if (section && section.aiAnalysis && section.aiAnalysis.sentiment) {
      return section.aiAnalysis.sentiment;
    }
    return "neutral";
  }

  // Check if we have predefined AI analysis in the mock data
  if (doc.aiAnalysis && doc.aiAnalysis.sentiment) {
    return doc.aiAnalysis.sentiment;
  }

  // Mock sentiment based on document status as fallback
  switch (doc.status) {
    case "approved":
      return "positive";
    case "rejected":
      return "negative";
    default:
      return "neutral";
  }
}
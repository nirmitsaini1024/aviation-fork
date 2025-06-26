// Add flight manual sections data - modified to match document structure
export const flightManualSections = [
  {
    id: "section-001",
    title: "Pre-Flight Checklist",
    description: "Complete set of required checks before aircraft departure",
    referenceText:
      "Section 1.2: Pre-departure safety checks including equipment verification, system tests, and external aircraft inspection procedures.",
    commentDetails:
      "Please review updated checklist items based on new regulations (FAA-2025-04)",
    status: "pending",
    lastUpdated: "05 Apr 2025",
    aiAnalysis: {
      summary:
        "AI Analysis: This document outlines critical pre-flight procedures. The content contains comprehensive checklists aligned with industry standards. Several sections have been updated to reflect recent FAA regulatory changes.",
      sentiment: "neutral",
    },
  },
  {
    id: "section-002",
    title: "Emergency Landing Procedures",
    description:
      "Protocol for safely executing emergency landings in various conditions",
    referenceText:
      "Section 2.3: Step-by-step procedures for emergency landings in various terrain and weather conditions with decision trees for pilots.",
    commentDetails:
      "Updated with findings from recent simulator training sessions",
    status: "pending",
    lastUpdated: "01 Apr 2025",
    aiAnalysis: {
      summary:
        "AI Analysis: Emergency landing protocols have been significantly updated based on simulation data. Terrain-specific guidance has been enhanced with clearer instructions. Recommend priority review of water landing scenarios.",
      sentiment: "negative",
    },
  },
  {
    id: "section-003",
    title: "Weather Diversion Protocols",
    description:
      "Guidelines for handling severe weather encounters during flight",
    referenceText:
      "Section 3.1: Decision matrix for weather-related diversions including visibility thresholds, wind limitations, and icing condition responses.",
    commentDetails: "Incorporated recent meteorological data from Q1 2025",
    status: "pending",
    lastUpdated: "04 Apr 2025",
    aiAnalysis: {
      summary:
        "AI Analysis: This document incorporates the latest meteorological data and updated decision matrices. All procedures align with current regulations and best practices for severe weather operations.",
      sentiment: "positive",
    },
  },
];
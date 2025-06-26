export const domains = ["Airport", "Airline"];

export const departmentOptions = {
  Airport: [
    "TSA",
    "FAA",
    "Airport Security",
    "Airport Operations",
    "Public Safety",
  ],
  Airline: ["Airline Security", "Airline Operations"],
};

export const categoryOptions = {
  Airport: ["ASP", "AEP", "ACM", "SMS", "ADFAP (Airport)"],
  Airline: ["ASP", "ADFP"],
};

// Mock data for reference documents
export const mockReferenceDocuments = [
  { id: "ref1", name: "Airport Security Manual", type: "PDF" },
  { id: "ref2", name: "TSA Compliance Guidelines", type: "PDF" },
  { id: "ref3", name: "Aviation Safety Protocol", type: "DOCX" },
  { id: "ref4", name: "Emergency Response Procedures", type: "PDF" },
  { id: "ref5", name: "Aircraft Maintenance Standards", type: "PDF" },
  { id: "ref6", name: "Security Personnel Training Guide", type: "DOCX" },
  { id: "ref7", name: "Baggage Screening Protocol", type: "PDF" },
  { id: "ref8", name: "Access Control Procedures", type: "PDF" },
  { id: "ref9", name: "Incident Reporting Guidelines", type: "DOCX" },
  { id: "ref10", name: "Security Audit Checklist", type: "PDF" },
  { id: "ref11", name: "Perimeter Security Standards", type: "PDF" },
  { id: "ref12", name: "Cyber Security Framework", type: "DOCX" },
  { id: "ref13", name: "International Aviation Standards", type: "PDF" },
  { id: "ref14", name: "Risk Assessment Template", type: "PDF" },
  { id: "ref15", name: "Security Training Schedule", type: "PDF" },
];

// CCT categories with richer metadata
export const cctCategories = [
  "Airline Defense Maintenance",
  "Airport Safety and Compliance",
  "Aviation Regulatory Affairs",
  "Hazardous Materials Management",
  "Emergency Response Planning",
];

// SubCategories for each CCT category
export const cctSubCategories = {
  "Airline Defense Maintenance": [
    "Aircraft Security Protocols - Regulations for monitoring and securing aircraft during maintenance operations and between flights to prevent unauthorized access and potential security threats.",
    "Passenger Screening - Mickey Mouse Airport (KMMW), also known as Mickey Mouse Club House, is a public use airport located east of the central business district of Disney Corner, Florida. The airport is owned by Disney Corner. Currently it operates two commercial airlines flights daily and serves general aviation activities as well.",
    "Cargo Inspection - Standardized procedures for examining cargo loads, detecting prohibited items, and ensuring compliance with international air cargo security regulations.",
    "Security Personnel Training - Requirements for security staff certification, ongoing education, and performance assessment to maintain high security standards.",
  ],
  "Airport Safety and Compliance": [
    "Terminal Safety - Guidelines for passenger flow management, emergency evacuation protocols, and infrastructure security measures within terminal buildings.",
    "Runway Management - Procedures for runway inspection, maintenance scheduling, and wildlife management to prevent incidents during takeoff and landing operations.",
    "Security Zones - Designation criteria for restricted areas, access control systems, and perimeter security measures to prevent unauthorized entry.",
    "Compliance Reporting - Documentation requirements, reporting timelines, and verification procedures for regulatory compliance with national and international aviation standards.",
  ],
};

// Mock CCT data for documents
export const documentCctData = [
  {
    id: "doc1",
    cctCategory: "Airline Defense Maintenance",
    cctSubCategory: "Aircraft Security Protocols",
    cctOwner: "Sarah Chen",
    cctReviewers: ["John Adams", "Maria Garcia"],
    cctNextReview: "30 June 2025",
    cctVersion: "2.3",
  },
  {
    id: "doc2",
    cctCategory: "Airport Safety and Compliance",
    cctSubCategory: "Terminal Safety",
    cctOwner: "Robert Johnson",
    cctReviewers: ["Emily Wilson", "David Lee"],
    cctNextReview: "15 July 2025",
    cctVersion: "1.7",
  },
];

// Approval nodes data
export const approvalNodes = [
  {
    id: "1",
    label: "Application Security Group",
    type: "group",
    status: "Initiated",
    attributes: [
      { name: "Role", value: "ASC" },
      { name: "Department", value: "ASC" },
      { name: "Location", value: "JFK" },
      { name: "Members", value: "2" },
    ],
  },
  {
    id: "2",
    label: "Non-Application Security Group",
    type: "group",
    status: "Assigned",
    attributes: [
      { name: "Role", value: "Non-ASC" },
      { name: "Department", value: "Non-ASC" },
      { name: "Location", value: "JFK" },
      { name: "Members", value: "5" },
    ],
  },
  {
    id: "3",
    label: "TSA",
    type: "group",
    status: "Not Assigned",
    attributes: [
      { name: "Role", value: "TSA" },
      { name: "Department", value: "TSA" },
      { name: "Location", value: "JFK" },
      { name: "Members", value: "5" },
    ],
  },
  {
    id: "4",
    label: "Application Security Group",
    type: "group",
    status: "Not Assigned",
    attributes: [
      { name: "Role", value: "ASC" },
      { name: "Department", value: "ASC" },
      { name: "Location", value: "JFK" },
      { name: "Members", value: "2" },
    ],
  },
];

export const linkedWithDocs = [
  {
    id: "ref1",
    name: "Airport Security Manual",
    type: "PDF",
    addedBy: "John doe",
    addedat: "15-04-2025",
  },
  {
    id: "ref2",
    name: "Mickey Mouse Asp",
    type: "PDF",
    addedBy: "John doe",
    addedat: "25-04-2025",
  },
];



export const departmentToDomain = {
    TSA: "Airport",
    FAA: "Airport",
    "Airport Security": "Airport",
    "Airport Operations": "Airport",
    "Public Safety": "Airport",
    "Aviation Security": "Airport",
    "Airline Security": "Airline",
    "Airline Operations": "Airline",
  };

  // Map document types to categories
export const typeToCategory = {
    "Airport Security": "ASP",
    Security: "ASP",
    Policy: "AEP",
    Strategy: "ACM",
    Manual: "SMS",
    Reference: "ADFAP (Airport)",
    Report: "ADFP",
    Log: "ADFP",
  };
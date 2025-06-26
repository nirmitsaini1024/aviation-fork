//sample data for deactivated table

export const sampleDocDeactived = [
    {
      id: "1",
      title: "Draft Policy v1.2",
      uploadedAt: "2023-05-15T10:30:00Z",
      deactivatedAt: "2023-05-18T14:15:00Z",
      fileType: "docx",
      type: "Policy",
      domain: "Airport",
      category: "AEP",
      status: "deactivated",
      deactivatedBy: "admin@example.com",
      deactivationReason: "Superseded by new version",
      owner: {
        officer: "Officer 1",
        department: "TSA",
        title: "Security Manager",
      },
    },
    {
      id: "2",
      title: "Old Employee Contract",
      uploadedAt: "2023-01-10T09:15:00Z",
      deactivatedAt: "2023-03-12T16:45:00Z",
      fileType: "docx",
      type: "Contract",
      domain: "Airport",
      category: "SMS",
      status: "deactivated",
      deactivatedBy: "hr@example.com",
      deactivationReason: "New contract template implemented",
      owner: {
        officer: "Officer 1",
        department: "FAA",
        title: "Security Manager",
      },
    },
    {
      id: "3",
      title: "Project Scope - Initial",
      uploadedAt: "2023-04-01T11:20:00Z",
      deactivatedAt: "2023-04-10T10:00:00Z",
      fileType: "docx",
      type: "Project",
      domain: "Airport",
      category: "ACM",
      status: "deactivated",
      deactivatedBy: "pm@example.com",
      deactivationReason: "Project requirements changed",
      owner: {
        officer: "Officer 2",
        department: "Airport Security",
        title: "Finance Manager",
      },
    },
    {
      id: "4",
      title: "Marketing Plan Draft",
      uploadedAt: "2023-02-15T08:45:00Z",
      deactivatedAt: "2023-02-28T13:30:00Z",
      fileType: "docx",
      type: "Marketing",
      domain: "Airline",
      category: "ADFP",
      status: "deactivated",
      deactivatedBy: "marketing@example.com",
      deactivationReason: "Final version approved",
      owner: {
        officer: "Officer 3",
        department: "Airport Security",
        title: "Finance Manager",
      },
    },
    {
      id: "5",
      title: "Financial Forecast Q1",
      uploadedAt: "2023-03-22T14:10:00Z",
      deactivatedAt: "2023-04-15T11:15:00Z",
      fileType: "docx",
      type: "Financial",
      domain: "Airport",
      category: "AEP",
      status: "deactivated",
      deactivatedBy: "finance@example.com",
      deactivationReason: "Updated with actual numbers",
      owner: {
        officer: "Officer 5",
        department: "Airport Security",
        title: "Finance Manager",
      },
    },
]


// Approval nodes data (extracted from DocumentTable)
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


// Domain badge configuration
export const domainBadgeConfig = {
  Airport: "bg-blue-100 text-blue-800 border-blue-200",
  Airline: "bg-green-100 text-green-800 border-green-200",
};

// Category badge configuration
export const categoryBadgeConfig = {
  ASP: "bg-purple-100 text-purple-800 border-purple-200",
  AEP: "bg-amber-100 text-amber-800 border-amber-200",
  ACM: "bg-sky-100 text-sky-800 border-sky-200",
  SMS: "bg-rose-100 text-rose-800 border-rose-200",
  "ADFAP (Airport)": "bg-indigo-100 text-indigo-800 border-indigo-200",
  ADFP: "bg-emerald-100 text-emerald-800 border-emerald-200",
};
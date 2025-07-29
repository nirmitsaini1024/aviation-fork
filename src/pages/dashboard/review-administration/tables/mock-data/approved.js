

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

export const cctData = [
  {
    category: "Airline Defense Maintenance",
    references: ["ABC 1", "ABC 11"],
  },
  {
    category: "Airport Safety and Compliance",
    references: ["ABC 2"],
  },
  {
    category: "Airline Defense Maintenance",
    references: ["XYZ 1"],
  },
  {
    category: "Airport Safety and Compliance",
    references: ["ABC 11", "ABC 22"],
  },
];

export const mockDocumentReferences = {
  1: ["ref1", "ref2"], // First document has 2 reference docs
  2: ["ref3", "ref4", "ref5"], // Second document has 3 reference docs
  3: ["ref1", "ref3"], // Third document has 2 reference docs
  4: ["ref2", "ref5", "ref6"], // Fourth document has 3 reference docs
  // Add more as needed based on your documentData IDs
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

// Reference texts matching the image
export const referenceTexts = {
  "ABC 1": {
    text: "Monitor: To observe the delivery of merchandise and consumables, in person or via closed-circuit television (CCTV), to ensure there is no unauthorized access to the merchandise or consumables. Monitoring may be performed by multiple personnel who have been trained to carry out this responsibility.  Monitoring personnel must be capable of immediately initiating a response to any unauthorized access or activity near the merchandise or consumables, including immediately contacting laws enforcement or other local authority as appropriate.",
    author: "John Smith",
    authorTitle: "Security Specialist",
    authorGroup: "Airport Security",
    timestamp: "2023-05-15T09:30:00Z",
  },
  "ABC 2": {
    text: "Identification (ID) Media ID: Media is any credential, card, badge, or other media issued for ID purposes and used at an airport. This includes, bus is not limited to, media signifying unescorted access to an Air Operations Area (AOA), Secured Area/SIDA, or Sterile Area.",
    author: "Sarah Johnson",
    authorTitle: "Compliance Officer",
    authorGroup: "TSA",
    timestamp: "2023-05-16T11:15:00Z",
  },
  "XYZ 1": {
    text: "Secured Area: Means a portion of an airport, specified in the airport security program, in which certain security measures specified in Part 1542 of this chapter are carried out.  This area is where aircraft operators and foreign air carriers that have a security program under Part 1544 or 1546 of this chapter enplane and deplane passengers and sort and load baggage and any adjacent areas that are not separated by adequate security measures ",
    author: "Michael Brown",
    authorTitle: "Security Manager",
    authorGroup: "Airline Defense",
    timestamp: "2023-05-14T14:45:00Z",
  },
  "ABC 11": {
    text: "The ASC serves as the Airport operator's 24-hour primary and immediate contact for security-related activities and communications with the TSA, FAA, and Airport tenants. The ASC also is charged with general oversight of Airport security functions, including managerial elements, as required to maintain Airport security under 49 CFR Part 1542. Additional responsibilities include, but are not limited to: ",
    author: "Emily Davis",
    authorTitle: "Operations Lead",
    authorGroup: "Airport Safety",
    timestamp: "2023-05-17T10:20:00Z",
  },
  "ABC 22": {
    text: "KMMW uses the Physical Access Control System (ACS). It is a comprehensive security solution designed to manage and control access to physical spaces within the Airport. All individuals requiring access to the Secured Area must possess, use, and visibly display an appropriate identification badge as described in Section X of this ASP. Individuals without Airport identification badges, who require access to the Secured Area, must be kept under escort.",
    author: "Robert Wilson",
    authorTitle: "Security Director",
    authorGroup: "TSA",
    timestamp: "2023-05-18T13:10:00Z",
  },
};

// Approver data for each reference
export const approverData = {
  "ABC 1": {
    name: "Jane Anderson",
    title: "Senior Security Analyst",
    group: "TSA",
    timestamp: "2023-05-20T14:15:00Z",
    signature: "/signatures/jane-anderson.png",
  },
  "ABC 2": {
    name: "David Miller",
    title: "Compliance Manager",
    group: "FAA",
    timestamp: "2023-05-21T09:30:00Z",
    signature: "/signatures/david-miller.png",
  },
  "XYZ 1": {
    name: "Lisa Thompson",
    title: "Security Supervisor",
    group: "Airline Defense",
    timestamp: "2023-05-19T16:45:00Z",
    signature: "/signatures/lisa-thompson.png",
  },
  "ABC 11": {
    name: "Mark Johnson",
    title: "Operations Manager",
    group: "Airport Safety",
    timestamp: "2023-05-22T11:20:00Z",
    signature: "/signatures/mark-johnson.png",
  },
  "ABC 22": {
    name: "Karen White",
    title: "Chief Security Officer",
    group: "TSA",
    timestamp: "2023-05-23T10:15:00Z",
    signature: "/signatures/karen-white.png",
  },
};

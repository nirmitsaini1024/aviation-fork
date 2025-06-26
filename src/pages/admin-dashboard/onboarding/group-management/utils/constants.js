// Domain and department options
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

// Reminder options
export const reminderOptions = ["12hr", "1 day", "weekly", "monthly"];

// Mock users data for the user selection
export const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    domain: "Airport",
    department: "TSA",
    title: "Software Engineer",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    domain: "Airline",
    department: "Airline Security",
    title: "HR Manager",
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    domain: "Airport",
    department: "FAA",
    title: "Financial Analyst",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Williams",
    domain: "Airport",
    department: "Airport Security",
    title: "Marketing Specialist",
  },
  {
    id: "5",
    firstName: "Michael",
    lastName: "Brown",
    domain: "Airline",
    department: "Airline Operations",
    title: "System Administrator",
  },
];

// Mock initial groups data with domain and department
export const initialGroups = [
  {
    id: "1",
    name: "IT Department",
    description:
      "All IT staff including developers, system administrators, and support",
    domain: "Airport",
    department: "TSA",
    reminder: "weekly",
    specificTime: "09:00",
    members: [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        domain: "Airport",
        department: "TSA",
        title: "Software Engineer",
      },
      {
        id: "5",
        firstName: "Michael",
        lastName: "Brown",
        domain: "Airline",
        department: "Airline Operations",
        title: "System Administrator",
      },
    ],
  },
  {
    id: "2",
    name: "HR Team",
    description: "Human Resources team responsible for employee management",
    domain: "Airline",
    department: "Airline Security",
    reminder: "1 day",
    specificTime: "09:00",
    members: [
      {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        domain: "Airline",
        department: "Airline Security",
        title: "HR Manager",
      },
    ],
  },
  {
    id: "3",
    name: "Finance Department",
    description: "Financial analysts and accountants",
    domain: "Airport",
    department: "FAA",
    reminder: "monthly",
    specificTime: "09:00",
    members: [
      {
        id: "3",
        firstName: "Robert",
        lastName: "Johnson",
        domain: "Airport",
        department: "FAA",
        title: "Financial Analyst",
      },
    ],
  },
  {
    id: "4",
    name: "Marketing Team",
    description: "Marketing specialists and coordinators",
    domain: "Airport",
    department: "Airport Security",
    reminder: "12hr",
    specificTime: "09:00",
    members: [
      {
        id: "4",
        firstName: "Emily",
        lastName: "Williams",
        domain: "Airport",
        department: "Airport Security",
        title: "Marketing Specialist",
      },
    ],
  },
  {
    id: "5",
    name: "Website Redesign Project",
    description: "Cross-functional team working on the website redesign",
    domain: "Airport",
    department: "Public Safety",
    reminder: "weekly",
    specificTime: "09:00",
    members: [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        domain: "Airport",
        department: "TSA",
        title: "Software Engineer",
      },
      {
        id: "4",
        firstName: "Emily",
        lastName: "Williams",
        domain: "Airport",
        department: "Airport Security",
        title: "Marketing Specialist",
      },
    ],
  },
];
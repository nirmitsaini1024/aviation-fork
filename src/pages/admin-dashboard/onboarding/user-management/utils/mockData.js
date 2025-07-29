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
export const reminderTypes = ["Days", "Weeks"];
export const reminderValues = {
  "Days": Array.from({ length: 7 }, (_, i) => ({ value: i + 1, label: `${i + 1} Day${i === 0 ? '' : 's'}` })),
  "Weeks": Array.from({ length: 4 }, (_, i) => ({ value: i + 1, label: `${i + 1} Week${i === 0 ? '' : 's'}` }))
};

// Initial users data
export const initialUsers = [
  {
    id: "1",
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    employeeId: "EMP001",
    domain: "Airport",
    department: "TSA",
    reminder: "1 day",
    specificTime: "09:00",
    email: "john.doe@example.com",
    title: "Software Engineer",
  },
  {
    id: "2",
    firstName: "Jane",
    middleName: "Marie",
    lastName: "Smith",
    employeeId: "EMP002",
    domain: "Airline",
    department: "Airline Security",
    reminder: "3 days",
    specificTime: "09:00",
    email: "jane.smith@example.com",
    title: "HR Manager",
  },
  {
    id: "3",
    firstName: "Robert",
    middleName: "",
    lastName: "Johnson",
    employeeId: "EMP003",
    domain: "Airport",
    department: "FAA",
    reminder: "Weekly",
    specificTime: "09:00",
    email: "robert.johnson@example.com",
    title: "Financial Analyst",
  },
  {
    id: "4",
    firstName: "Emily",
    middleName: "Rose",
    lastName: "Williams",
    employeeId: "EMP004",
    domain: "Airport",
    department: "Airport Security",
    reminder: "12 hours",
    specificTime: "09:00",
    email: "emily.williams@example.com",
    title: "Marketing Specialist",
  },
  {
    id: "5",
    firstName: "Michael",
    middleName: "",
    lastName: "Brown",
    employeeId: "EMP005",
    domain: "Airline",
    department: "Airline Operations",
    reminder: "1 day",
    specificTime: "09:00",
    email: "michael.brown@example.com",
    title: "System Administrator",
  },
];

// Table column configurations
export const columns = [
  {
    key: "name",
    label: "Name",
    sortValue: (user) => `${user.firstName} ${user.lastName}`.toLowerCase(),
  },
  {
    key: "email",
    label: "Email",
    sortValue: (user) => user.email.toLowerCase(),
  },
  {
    key: "title",
    label: "Title",
    sortValue: (user) => user.title.toLowerCase(),
  },
  {
    key: "reminder",
    label: "Reminder",
    sortValue: (user) => user.reminder.toLowerCase(),
  },
];
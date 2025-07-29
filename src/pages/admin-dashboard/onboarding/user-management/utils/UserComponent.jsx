import { useState, useRef, useEffect } from "react";
import {
  Edit,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  Plus,
  Loader2,
  ArrowUpDown,
  X,
  Calendar,
  Menu,
  LayoutGrid,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Import mock data
import { domains, departmentOptions } from "./mockData";

// Table components (inline definitions) - Updated with borders (no column borders)
export const Table = ({ children, className = "" }) => (
  <table className={`w-full caption-bottom text-sm border border-gray-400 ${className}`}>
    {children}
  </table>
);

export const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b [&_tr]:border-gray-400">{children}</thead>
);

export const TableBody = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0 [&_tr]:border-b [&_tr]:border-gray-400">{children}</tbody>
);

export const TableRow = ({ children, className = "" }) => (
  <tr
    className={`border-b border-gray-400 transition-colors data-[state=selected]:bg-muted ${className}`}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className = "", onClick }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    onClick={onClick}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = "", colSpan }) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    colSpan={colSpan}
  >
    {children}
  </td>
);

// Badge Component
export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    domain: "bg-blue-100 text-blue-800",
    department: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

// Custom Tree Dropdown Component
export function TreeDropdown({ value, onValueChange, placeholder, className, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState('root');
  const [selectedPath, setSelectedPath] = useState([]);
  
  const dropdownRef = useRef(null);

  const menuStructure = {
    root: [
      { id: 'days', label: 'Days', type: 'parent' },
      { id: 'weeks', label: 'Weeks', type: 'parent' }
    ],
    days: [
      { id: 'back', label: '← Back', type: 'back' },
      { id: '1-day', label: '1 Day', type: 'item', value: '1 Day' },
      { id: '2-days', label: '2 Days', type: 'item', value: '2 Days' },
      { id: '3-days', label: '3 Days', type: 'item', value: '3 Days' },
      { id: '4-days', label: '4 Days', type: 'item', value: '4 Days' },
      { id: '5-days', label: '5 Days', type: 'item', value: '5 Days' },
      { id: '6-days', label: '6 Days', type: 'item', value: '6 Days' },
      { id: '7-days', label: '7 Days', type: 'item', value: '7 Days' }
    ],
    weeks: [
      { id: 'back', label: '← Back', type: 'back' },
      { id: '1-week', label: '1 Week', type: 'item', value: '1 Week' },
      { id: '2-weeks', label: '2 Weeks', type: 'item', value: '2 Weeks' },
      { id: '3-weeks', label: '3 Weeks', type: 'item', value: '3 Weeks' },
      { id: '4-weeks', label: '4 Weeks', type: 'item', value: '4 Weeks' }
    ]
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setCurrentLevel('root');
        setSelectedPath([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    if (item.type === 'parent') {
      setCurrentLevel(item.id);
      setSelectedPath([...selectedPath, item.label]);
    } else if (item.type === 'back') {
      setCurrentLevel('root');
      setSelectedPath([]);
    } else if (item.type === 'item') {
      onValueChange(item.value);
      setIsOpen(false);
      setCurrentLevel('root');
      setSelectedPath([]);
    }
  };

  const getCurrentItems = () => {
    return menuStructure[currentLevel] || [];
  };

  return (
    <div className="text-sm relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-10 px-3 py-2 text-left border rounded-md flex items-center justify-between transition-all ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {/* Breadcrumb for current navigation */}
          {selectedPath.length > 0 && (
            <div className="px-3 py-2 bg-gray-50 border-b text-sm text-gray-600">
              Root {selectedPath.map(path => ` > ${path}`).join('')}
            </div>
          )}
          
          {/* Menu items */}
          <div className="py-1 max-h-60 overflow-y-auto">
            {getCurrentItems().map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                  item.type === 'parent' 
                    ? 'flex items-center justify-between font-medium' 
                    : item.type === 'back'
                    ? 'text-blue-600 hover:bg-blue-50'
                    : 'pl-6'
                }`}
              >
                <span>{item.label}</span>
                {item.type === 'parent' && (
                  <ChevronDown className="h-4 w-4 text-gray-400 -rotate-90" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// UserForm Component
export function UserForm({ user, onSave, onCancel }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: user?.id || "",
    firstName: user?.firstName || "",
    middleName: user?.middleName || "",
    lastName: user?.lastName || "",
    employeeId: user?.employeeId || "",
    domain: user?.domain || "",
    department: user?.department || "",
    reminder: user?.reminder || "",
    specificTime: user?.specificTime || "09:00",
    email: user?.email || "",
    title: user?.title || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Reset dependent fields when domain changes
      if (name === "domain") {
        newData.department = "";
      }

      // Reset reminder value when reminder type changes
      if (name === "reminderType") {
        newData.reminderValue = "";
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    const newErrors = {};
    
    // Validate required fields
    if (!formData.firstName || formData.firstName.trim() === '') {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName || formData.lastName.trim() === '') {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required';
    }
    if (!formData.domain || formData.domain.trim() === '') {
      newErrors.domain = 'Domain is required';
    }
    if (!formData.department || formData.department.trim() === '') {
      newErrors.department = 'Department is required';
    }
    if (!formData.reminder || formData.reminder.trim() === '') {
      newErrors.reminder = 'Reminder is required';
    }
    
    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        // If creating a new user, generate a new ID
        const userToSave = {
          ...formData,
          id: formData.id || Date.now().toString(),
        };
        onSave(userToSave);
      }

      // Reset form only if it's a new user creation (not editing)
      if (!user) {
        setFormData({
          id: "",
          firstName: "",
          middleName: "",
          lastName: "",
          employeeId: "",
          domain: "",
          department: "",
          reminder: "",
          specificTime: "09:00",
          email: "",
          title: "",
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold">
          {user ? "Edit User" : "Create New User"}
        </CardTitle>
      </CardHeader>
      <div onSubmit={handleSubmit}>
        <CardContent className="space-y-6 p-6">
          {/* Domain and Department Row - Now positioned above name fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Domain - takes first name column width */}
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-sm font-medium text-gray-700">
                Domain <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.domain}
                onValueChange={(value) => handleSelectChange("domain", value)}
              >
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                  <div className="flex items-center gap-2">
                    <Menu className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Select domain" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
                {errors.domain && (
                  <p className="text-red-500 text-sm mt-1">{errors.domain}</p>
                )}
              </Select>
            </div>

            {/* Department - takes middle name column width */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleSelectChange("department", value)
                }
                disabled={!formData.domain}
              >
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Select department" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {formData.domain &&
                    departmentOptions[formData.domain]?.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                </SelectContent>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                )}
              </Select>
            </div>

            {/* Empty third column to maintain grid layout */}
            <div></div>
          </div>

          {/* Name Fields Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                required
                value={formData.firstName}
                onChange={handleChange}
                className={`border transition-all ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">
                Middle Name
              </Label>
              <Input
                id="middleName"
                name="middleName"
                placeholder="Enter middle name (optional)"
                value={formData.middleName}
                onChange={handleChange}
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                required
                value={formData.lastName}
                onChange={handleChange}
                className={`border transition-all ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email, Title Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
                value={formData.email}
                onChange={handleChange}
                className={`border transition-all ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter job title"
                required
                value={formData.title}
                onChange={handleChange}
                className={`border transition-all ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            {/* Empty third column to maintain grid layout */}
            <div></div>
          </div>

        {/* Reminder and Specific Time Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Reminder frequency<span className="text-red-500">*</span>
            </Label>
            <TreeDropdown
              value={formData.reminder}
              onValueChange={(value) => handleSelectChange("reminder", value)}
              placeholder="Select reminder frequency"
              error={errors.reminder}
            />
            {errors.reminder && (
              <p className="text-red-500 text-sm mt-1">{errors.reminder}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specificTime" className="text-sm font-medium text-gray-700">
              Select Time
            </Label>
            <Input
              id="specificTime"
              name="specificTime"
              type="time"
              value={formData.specificTime}
              onChange={handleChange}
              onKeyDown={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer"
            />
          </div>
          
          {/* Empty third column to maintain grid layout */}
          <div></div>
        </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-lg">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="bg-[#335aff] hover:bg-[#335aff]/90 px-8 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !formData.firstName || !formData.lastName || !formData.email || !formData.title || !formData.domain || !formData.department || !formData.reminder}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {user ? "Updating..." : "Creating..."}
              </>
            ) : user ? (
              "Update User"
            ) : (
              "Create User"
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
import { useState, useRef, useEffect } from "react";
import { Edit, Trash2, Search, ChevronUp, ChevronDown, ArrowUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DepartmentForm } from "@/components/department-form";

// Mock initial departments data with domains
const initialDepartments = [
  {
    id: "1",
    domain: "Technology",
    name: "Information Technology",
    description: "Manages all IT infrastructure and software development",
  },
  {
    id: "2",
    domain: "Operations",
    name: "Human Resources",
    description: "Manages recruitment, employee relations, and benefits",
  },
  {
    id: "3",
    domain: "Finance",
    name: "Finance",
    description: "Manages company finances, accounting, and budgeting",
  },
  {
    id: "4",
    domain: "Marketing",
    name: "Marketing",
    description: "Manages brand, marketing campaigns, and communications",
  },
  {
    id: "5",
    domain: "Sales",
    name: "Sales",
    description: "Manages client relationships and sales processes",
  },
  {
    id: "6",
    domain: "Technology",
    name: "Research & Development",
    description: "Manages product innovation and development",
  },
  {
    id: "7",
    domain: "Operations",
    name: "Customer Support",
    description: "Manages customer inquiries and technical support",
  },
];

export function DepartmentTable() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  
  // Additional state for column-specific search
  const [domainSearchTerm, setDomainSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [descriptionSearchTerm, setDescriptionSearchTerm] = useState("");
  const [showDomainSearch, setShowDomainSearch] = useState(false);
  const [showNameSearch, setShowNameSearch] = useState(false);
  const [showDescriptionSearch, setShowDescriptionSearch] = useState(false);

  // Refs for search popups
  const domainPopupRef = useRef(null);
  const namePopupRef = useRef(null);
  const descriptionPopupRef = useRef(null);

  // Effect to handle clicks outside search popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (domainPopupRef.current && !domainPopupRef.current.contains(event.target)) {
        setShowDomainSearch(false);
        setDomainSearchTerm("");
      }
      if (namePopupRef.current && !namePopupRef.current.contains(event.target)) {
        setShowNameSearch(false);
        setNameSearchTerm("");
      }
      if (descriptionPopupRef.current && !descriptionPopupRef.current.contains(event.target)) {
        setShowDescriptionSearch(false);
        setDescriptionSearchTerm("");
      }
    };

    if (showDomainSearch || showNameSearch || showDescriptionSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDomainSearch, showNameSearch, showDescriptionSearch]);

  const columns = [
    {
      key: "domain",
      label: "Domain Name",
      sortValue: (dept) => dept.domain.toLowerCase(),
    },
    {
      key: "name",
      label: "Department Name",
      sortValue: (dept) => dept.name.toLowerCase(),
    },
    {
      key: "description",
      label: "Description",
      sortValue: (dept) => dept.description.toLowerCase(),
    },
  ];

  const sortedAndFilteredDepartments = () => {
    const filtered = departments.filter((dept) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Apply global search filter
      const globalMatch = (
        dept.domain.toLowerCase().includes(searchLower) ||
        dept.name.toLowerCase().includes(searchLower) ||
        dept.description.toLowerCase().includes(searchLower)
      );

      // Apply specific column search filters
      const domainMatch = domainSearchTerm ? 
        dept.domain.toLowerCase().includes(domainSearchTerm.toLowerCase()) : true;
      const nameMatch = nameSearchTerm ?
        dept.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) : true;
      const descriptionMatch = descriptionSearchTerm ?
        dept.description.toLowerCase().includes(descriptionSearchTerm.toLowerCase()) : true;

      return globalMatch && domainMatch && nameMatch && descriptionMatch;
    });

    if (sortConfig !== null) {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (column) {
        return [...filtered].sort((a, b) => {
          const aValue = column.sortValue(a);
          const bValue = column.sortValue(b);
          if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        });
      }
    }

    return filtered;
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const handleDeleteDepartment = (deptId) => {
    setDepartments(departments.filter((dept) => dept.id !== deptId));
    setOpenPopover(null);
  };

  const handleEditDepartment = (deptId) => {
    setEditingDepartment(deptId);
  };

  const handleSaveDepartment = (updatedDept) => {
    if (updatedDept.id) {
      // Editing existing department
      setDepartments(departments.map((dept) => (dept.id === updatedDept.id ? updatedDept : dept)));
    } else {
      // Creating new department
      const newDept = {
        ...updatedDept,
        id: Date.now().toString() // Simple ID generation
      };
      setDepartments([...departments, newDept]);
    }
    setEditingDepartment(null);
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
  };

  // Search toggle handlers
  const handleDomainSearchToggle = () => {
    setShowDomainSearch(!showDomainSearch);
    if (showDomainSearch) {
      setDomainSearchTerm("");
    }
  };

  const handleNameSearchToggle = () => {
    setShowNameSearch(!showNameSearch);
    if (showNameSearch) {
      setNameSearchTerm("");
    }
  };

  const handleDescriptionSearchToggle = () => {
    setShowDescriptionSearch(!showDescriptionSearch);
    if (showDescriptionSearch) {
      setDescriptionSearchTerm("");
    }
  };

  // Clear search handlers  
  const clearDomainSearch = () => {
    setDomainSearchTerm("");
    setShowDomainSearch(false);
  };

  const clearNameSearch = () => {
    setNameSearchTerm("");
    setShowNameSearch(false);
  };

  const clearDescriptionSearch = () => {
    setDescriptionSearchTerm("");
    setShowDescriptionSearch(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search departments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-blue-600">
              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Domain Name</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={() => requestSort("domain")}
                      title="Sort by domain"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showDomainSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleDomainSearchToggle}
                        title="Search by domain"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Domain search popup */}
                      {showDomainSearch && (
                        <div
                          ref={domainPopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by domain..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={domainSearchTerm}
                                onChange={(e) => setDomainSearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                onClick={clearDomainSearch}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {getSortIcon("domain")}
                </div>
              </TableHead>

              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Department Name</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={() => requestSort("name")}
                      title="Sort by name"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showNameSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleNameSearchToggle}
                        title="Search by name"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Name search popup */}
                      {showNameSearch && (
                        <div
                          ref={namePopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by name..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={nameSearchTerm}
                                onChange={(e) => setNameSearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                onClick={clearNameSearch}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {getSortIcon("name")}
                </div>
              </TableHead>

              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Description</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={() => requestSort("description")}
                      title="Sort by description"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showDescriptionSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleDescriptionSearchToggle}
                        title="Search by description"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Description search popup */}
                      {showDescriptionSearch && (
                        <div
                          ref={descriptionPopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by description..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={descriptionSearchTerm}
                                onChange={(e) => setDescriptionSearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                onClick={clearDescriptionSearch}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {getSortIcon("description")}
                </div>
              </TableHead>

              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredDepartments().length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  No departments found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredDepartments().map((dept) =>
                editingDepartment === dept.id ? (
                  <TableRow key={dept.id}>
                    <TableCell colSpan={columns.length + 1}>
                      <DepartmentForm
                        department={dept}
                        onSave={handleSaveDepartment}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.domain}</TableCell>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {dept.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditDepartment(dept.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        
                        <Popover 
                          open={openPopover === dept.id} 
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(dept.id);
                            } else {
                              setOpenPopover(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 p-4 mr-4" side="bottom">
                            <div className="space-y-4">
                              <div className="">
                                <h4 className="font-medium">Are you sure?</h4>
                                <p className="text-sm text-muted-foreground">
                                  This will permanently delete this department.
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setOpenPopover(null)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteDepartment(dept.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
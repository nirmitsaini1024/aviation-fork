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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
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
  const [domainSearchOpen, setDomainSearchOpen] = useState(false);
  const [nameSearchOpen, setNameSearchOpen] = useState(false);
  const [descriptionSearchOpen, setDescriptionSearchOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);


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

  // Get paginated data
  const allFilteredData = sortedAndFilteredDepartments();
  const totalPages = Math.ceil(allFilteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = allFilteredData.slice(startIndex, endIndex);

  // Page change handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset page when search changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
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


  // Clear search handlers  
  const clearDomainSearch = () => {
    setDomainSearchTerm("");
    setDomainSearchOpen(false);
    setCurrentPage(1);
  };

  const clearNameSearch = () => {
    setNameSearchTerm("");
    setNameSearchOpen(false);
    setCurrentPage(1);
  };

  const clearDescriptionSearch = () => {
    setDescriptionSearchTerm("");
    setDescriptionSearchOpen(false);
    setCurrentPage(1);
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
            onChange={(e) => handleSearchChange(e.target.value)}
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
                    <Popover open={domainSearchOpen} onOpenChange={setDomainSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${domainSearchOpen ? 'bg-blue-700' : ''}`}
                          title="Search by domain"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" side="top" align="center">
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              type="search"
                              placeholder="Search by domain..."
                              className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                              value={domainSearchTerm}
                              onChange={(e) => { setDomainSearchTerm(e.target.value); setCurrentPage(1); }}
                              autoFocus
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
                        </div>
                      </PopoverContent>
                    </Popover>
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
                    <Popover open={nameSearchOpen} onOpenChange={setNameSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${nameSearchOpen ? 'bg-blue-700' : ''}`}
                          title="Search by name"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" side="top" align="center">
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              type="search"
                              placeholder="Search by name..."
                              className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                              value={nameSearchTerm}
                              onChange={(e) => { setNameSearchTerm(e.target.value); setCurrentPage(1); }}
                              autoFocus
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
                        </div>
                      </PopoverContent>
                    </Popover>
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
                    <Popover open={descriptionSearchOpen} onOpenChange={setDescriptionSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${descriptionSearchOpen ? 'bg-blue-700' : ''}`}
                          title="Search by description"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" side="top" align="center">
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              type="search"
                              placeholder="Search by description..."
                              className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                              value={descriptionSearchTerm}
                              onChange={(e) => { setDescriptionSearchTerm(e.target.value); setCurrentPage(1); }}
                              autoFocus
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
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {getSortIcon("description")}
                </div>
              </TableHead>

              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  No departments found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((dept) =>
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
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, allFilteredData.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, allFilteredData.length)} of {allFilteredData.length} entries
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"} transition-colors
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer transition-colors ${currentPage === page ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-blue-50"}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"} transition-colors
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
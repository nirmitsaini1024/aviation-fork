import { Edit, Trash2, Search, Eye, ChevronUp, ChevronDown, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";

import { useRoleContext } from "../../context/RoleContext";
import { useState, useRef, useEffect } from "react";
import {Badge} from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import RoleForm from "./RoleForm";
import AccessControlViewer from "./AccessControlViewer";

// Columns configuration for role data
const columns = [
  {
    key: "name",
    label: "Role Name",
    sortValue: (role) => role.name.toLowerCase(),
  },
  {
    key: "description",
    label: "Description", 
    sortValue: (role) => role.description.toLowerCase(),
  },
  {
    key: "domain",
    label: "Domain",
    sortValue: (role) => role.domain?.toLowerCase() || "",
  },
  {
    key: "department", 
    label: "Department",
    sortValue: (role) => role.department?.toLowerCase() || "",
  }
];

// Main Role Management App Component
function RoleManagementApp({ showAddForm, onToggleForm }) {
  const {
    filteredRoles,
    searchTerm,
    setSearchTerm,
    editingRole,
    setEditingRole,
    openPopover,
    setOpenPopover,
    viewPermissionsRole,
    setViewPermissionsRole,
    deleteRole,
    saveRole,
    roles,
  } = useRoleContext();

  // Additional state for sorting and column-specific search
  const [sortConfig, setSortConfig] = useState(null);
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [descriptionSearchTerm, setDescriptionSearchTerm] = useState("");
  const [domainSearchTerm, setDomainSearchTerm] = useState("");
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");
  const [nameSearchOpen, setNameSearchOpen] = useState(false);
  const [descriptionSearchOpen, setDescriptionSearchOpen] = useState(false);
  const [domainSearchOpen, setDomainSearchOpen] = useState(false);
  const [departmentSearchOpen, setDepartmentSearchOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);


  // Sort and filter logic
  const sortedAndFilteredRoles = () => {
    let filtered = roles.filter((role) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Apply global search filter
      const globalMatch = (
        role.name.toLowerCase().includes(searchLower) ||
        role.description.toLowerCase().includes(searchLower) ||
        (role.domain && role.domain.toLowerCase().includes(searchLower)) ||
        (role.department && role.department.toLowerCase().includes(searchLower))
      );

      // Apply specific column search filters
      const nameMatch = nameSearchTerm ? 
        role.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) ||
        (role.domain && role.domain.toLowerCase().includes(nameSearchTerm.toLowerCase())) ||
        (role.department && role.department.toLowerCase().includes(nameSearchTerm.toLowerCase()))
        : true;
      const descriptionMatch = descriptionSearchTerm ?
        role.description.toLowerCase().includes(descriptionSearchTerm.toLowerCase()) : true;
      const domainMatch = domainSearchTerm ?
        (role.domain && role.domain.toLowerCase().includes(domainSearchTerm.toLowerCase())) : true;
      const departmentMatch = departmentSearchTerm ?
        (role.department && role.department.toLowerCase().includes(departmentSearchTerm.toLowerCase())) : true;

      return globalMatch && nameMatch && descriptionMatch && domainMatch && departmentMatch;
    });

    if (sortConfig !== null) {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (column) {
        return [...filtered].sort((a, b) => {
          const aValue = column.sortValue(a);
          const bValue = column.sortValue(b);
          if (aValue < bValue)
            return sortConfig.direction === "ascending" ? -1 : 1;
          if (aValue > bValue)
            return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        });
      }
    }

    return filtered;
  };

  // Get paginated data
  const allFilteredData = sortedAndFilteredRoles();
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
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
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


  // Clear search handlers  
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

  const clearDomainSearch = () => {
    setDomainSearchTerm("");
    setDomainSearchOpen(false);
    setCurrentPage(1);
  };

  const clearDepartmentSearch = () => {
    setDepartmentSearchTerm("");
    setDepartmentSearchOpen(false);
    setCurrentPage(1);
  };

  const handleDeleteRole = (roleId) => {
    deleteRole(roleId);
  };

  const handleEditRole = (roleId) => {
    setEditingRole(roleId);
    if (onToggleForm) onToggleForm();
  };

  const handleSaveRole = (roleData) => {
    saveRole(roleData);
    if (onToggleForm) onToggleForm(); // Close the form after saving
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    if (onToggleForm) onToggleForm(); // Close the form when canceling
  };

  // Get the role being edited
  const editingRoleData = editingRole ? roles.find(role => role.id === editingRole) : null;

  return (
    <div className="space-y-4 border">
      {showAddForm && (
        <RoleForm 
          role={editingRoleData} 
          onSave={handleSaveRole} 
          onCancel={handleCancelEdit} 
        />
      )}

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
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
              <TableHead className="text-white">
                <div className="flex items-center gap-2">
                  <span>Role Name</span>
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
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {getSortIcon("name")}
                </div>
              </TableHead>

              <TableHead className="text-white">
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

              <TableHead className="text-white">Access Controls</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((role) =>
                editingRole === role.id ? (
                  <TableRow key={role.id}>
                    <TableCell colSpan={4}>
                      <RoleForm
                        role={role}
                        onSave={handleSaveRole}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium">{role.name}</div>
                        <div className="flex flex-wrap gap-1">
                          {
                            role.domain && (
                              <Badge className="bg-blue-100 text-blue-700">{role.domain}</Badge>
                            )
                          }
                          {
                            role.department && (
                              <Badge className="bg-green-100 text-green-700">{role.department}</Badge>
                            )
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {role.description}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={viewPermissionsRole === role.id}
                        onOpenChange={(open) =>
                          setViewPermissionsRole(open ? role.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="sr-only">View Permissions</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="max-h-[80vh] overflow-y-auto"
                          style={{
                            width: "80vw",
                            height: "75vh",
                            maxWidth: "none",
                          }}
                        >
                          <DialogHeader>
                            <DialogTitle>
                              Access Controls - {role.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {role.permissions &&
                              Object.keys(role.permissions).length > 0 ? (
                              <AccessControlViewer
                                permissions={role.permissions}
                                isEditMode={true}
                              />
                            ) : (
                              <p className="text-gray-500 text-center py-8">
                                No permissions assigned to this role.
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditRole(role.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        {/* <Popover
                          open={openPopover === role.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(role.id);
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
                          <PopoverContent
                            className="w-60 p-4 mr-4"
                            side="bottom"
                          >
                            <div className="space-y-4">
                              <div className="">
                                <h4 className="font-medium">Are you sure?</h4>
                                <p className="text-sm text-muted-foreground">
                                  This will permanently delete this role.
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
                                  onClick={() => handleDeleteRole(role.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover> */}
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
                  className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"} transition-colors`}
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
                        className={`cursor-pointer transition-colors ${
                          currentPage === page 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "hover:bg-blue-50"
                        }`}
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
                  className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"} transition-colors`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default RoleManagementApp;
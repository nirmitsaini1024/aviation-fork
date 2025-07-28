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
import { DomainForm } from "@/components/domain-form";

// Mock initial domains data
const initialDomains = [
  {
    id: "1",
    name: "Airport Operations",
    description: "Manages all airport-related operations, security, and logistics",
  },
  {
    id: "2",
    name: "Airline Services",
    description: "Manages airline operations, passenger services, and flight coordination",
  },
  {
    id: "3",
    name: "Ground Handling",
    description: "Manages aircraft ground support, baggage handling, and cargo operations",
  },
  {
    id: "4",
    name: "Air Traffic Control",
    description: "Manages flight traffic coordination and airspace management",
  },
  {
    id: "5",
    name: "Security & Safety",
    description: "Manages aviation security protocols and safety compliance",
  },
  {
    id: "6",
    name: "Maintenance & Engineering",
    description: "Manages aircraft maintenance, technical support, and engineering services",
  },
  {
    id: "7",
    name: "Passenger Services",
    description: "Manages passenger check-in, boarding, and customer service operations",
  },
  {
    id: "8",
    name: "Cargo & Logistics",
    description: "Manages freight operations, cargo handling, and logistics coordination",
  },
];

export function DomainTable() {
  const [domains, setDomains] = useState(initialDomains);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDomain, setEditingDomain] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  
  // Additional state for column-specific search
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [descriptionSearchTerm, setDescriptionSearchTerm] = useState("");
  const [nameSearchOpen, setNameSearchOpen] = useState(false);
  const [descriptionSearchOpen, setDescriptionSearchOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);


  const columns = [
    {
      key: "name",
      label: "Domain Name",
      sortValue: (domain) => domain.name.toLowerCase(),
    },
    {
      key: "description",
      label: "Description",
      sortValue: (domain) => domain.description.toLowerCase(),
    },
  ];

  const sortedAndFilteredDomains = () => {
    const filtered = domains.filter((domain) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Apply global search filter
      const globalMatch = (
        domain.name.toLowerCase().includes(searchLower) ||
        domain.description.toLowerCase().includes(searchLower)
      );

      // Apply specific column search filters
      const nameMatch = nameSearchTerm ? 
        domain.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) : true;
      const descriptionMatch = descriptionSearchTerm ?
        domain.description.toLowerCase().includes(descriptionSearchTerm.toLowerCase()) : true;

      return globalMatch && nameMatch && descriptionMatch;
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
  const allFilteredData = sortedAndFilteredDomains();
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

  const handleDeleteDomain = (domainId) => {
    setDomains(domains.filter((domain) => domain.id !== domainId));
    setOpenPopover(null);
  };

  const handleEditDomain = (domainId) => {
    setEditingDomain(domainId);
  };

  const handleSaveDomain = (updatedDomain) => {
    setDomains(domains.map((domain) => (domain.id === updatedDomain.id ? updatedDomain : domain)));
    setEditingDomain(null);
  };

  const handleCancelEdit = () => {
    setEditingDomain(null);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search domains..."
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
                  No domains found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((domain) =>
                editingDomain === domain.id ? (
                  <TableRow key={domain.id}>
                    <TableCell colSpan={columns.length + 1}>
                      <DomainForm
                        domain={domain}
                        onSave={handleSaveDomain}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {domain.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditDomain(domain.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        
                        {/* <Popover 
                          open={openPopover === domain.id} 
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(domain.id);
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
                                  This will permanently delete this domain.
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
                                  onClick={() => handleDeleteDomain(domain.id)}
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
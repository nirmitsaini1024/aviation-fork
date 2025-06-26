import { useState } from "react";
import { Edit, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";

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
      
      return (
        domain.name.toLowerCase().includes(searchLower) ||
        domain.description.toLowerCase().includes(searchLower)
      );
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#335aff]">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredDomains().length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  No domains found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredDomains().map((domain) =>
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
                        
                        <Popover 
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
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";

import { Table, TableBody, TableHeader, TableCell, TableRow } from "./Table";
import { GroupForm } from "./GroupForm";
import { GroupTableHeader } from "./GroupTableHeader";
import { GroupTableRow } from "./GroupTableRow";
import { initialGroups } from "../utils/constants";

// Main Group Management App Component (for integration into existing pages)
export function GroupManagementApp({ showAddForm, onToggleForm }) {
  const [groups, setGroups] = useState(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [membersSearchTerm, setMembersSearchTerm] = useState("");
  const [descriptionSearchTerm, setDescriptionSearchTerm] = useState("");
  const [reminderSearchTerm, setReminderSearchTerm] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [showNameSearch, setShowNameSearch] = useState(false);
  const [showMembersSearch, setShowMembersSearch] = useState(false);
  const [showDescriptionSearch, setShowDescriptionSearch] = useState(false);
  const [showReminderSearch, setShowReminderSearch] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const columns = [
    {
      key: "name",
      label: "Group Name",
      sortValue: (group) => group.name.toLowerCase(),
    },
    {
      key: "members",
      label: "Members",
      sortValue: (group) => group.members.length,
    },
    {
      key: "description",
      label: "Description",
      sortValue: (group) => group.description.toLowerCase(),
    },
    {
      key: "reminder",
      label: "Reminder",
      sortValue: (group) => group.reminder.toLowerCase(),
    },
  ];

  const sortedAndFilteredGroups = () => {
    let filtered = groups.filter((group) => {
      const searchLower = searchTerm.toLowerCase();

      // Check if any member's name contains the search term
      const memberMatch = group.members.some(
        (member) =>
          `${member.firstName} ${member.lastName}`
            .toLowerCase()
            .includes(searchLower) ||
          member.domain.toLowerCase().includes(searchLower) ||
          member.department.toLowerCase().includes(searchLower)
      );

      // Apply global search filter
      const globalMatch = (
        group.name.toLowerCase().includes(searchLower) ||
        group.description.toLowerCase().includes(searchLower) ||
        group.domain.toLowerCase().includes(searchLower) ||
        group.department.toLowerCase().includes(searchLower) ||
        memberMatch
      );

      // Apply specific search filters if active
      const nameMatch = nameSearchTerm ?
        group.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) ||
        group.domain.toLowerCase().includes(nameSearchTerm.toLowerCase()) ||
        group.department.toLowerCase().includes(nameSearchTerm.toLowerCase())
        : true;

      const membersMatch = membersSearchTerm ?
        group.members.some((member) =>
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(membersSearchTerm.toLowerCase()) ||
          member.domain.toLowerCase().includes(membersSearchTerm.toLowerCase()) ||
          member.department.toLowerCase().includes(membersSearchTerm.toLowerCase()) ||
          member.title.toLowerCase().includes(membersSearchTerm.toLowerCase())
        ) : true;

      const descriptionMatch = descriptionSearchTerm ?
        group.description.toLowerCase().includes(descriptionSearchTerm.toLowerCase()) : true;

      const reminderMatch = reminderSearchTerm ?
        group.reminder.toLowerCase().includes(reminderSearchTerm.toLowerCase()) : true;

      return globalMatch && nameMatch && membersMatch && descriptionMatch && reminderMatch;
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
  const allFilteredData = sortedAndFilteredGroups();
  const totalPages = Math.ceil(allFilteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = allFilteredData.slice(startIndex, endIndex);

  // Page change handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset page when search changes
  // const handleSearchChange = (value) => {
  //   setSearchTerm(value);
  //   setCurrentPage(1);
  // };

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

  const handleSearchToggle = (type, forceValue = null) => {
    const setters = {
      name: setShowNameSearch,
      members: setShowMembersSearch,
      description: setShowDescriptionSearch,
      reminder: setShowReminderSearch,
    };

    const getters = {
      name: showNameSearch,
      members: showMembersSearch,
      description: showDescriptionSearch,
      reminder: showReminderSearch,
    };

    const searchTermSetters = {
      name: setNameSearchTerm,
      members: setMembersSearchTerm,
      description: setDescriptionSearchTerm,
      reminder: setReminderSearchTerm,
    };

    const currentValue = getters[type];
    const newValue = forceValue !== null ? forceValue : !currentValue;
    
    setters[type](newValue);
    
    if (!newValue) {
      searchTermSetters[type]("");
    }
  };

  const handleSearchChange = (type, value) => {
    const setters = {
      name: setNameSearchTerm,
      members: setMembersSearchTerm,
      description: setDescriptionSearchTerm,
      reminder: setReminderSearchTerm,
    };

    setters[type](value);
    setCurrentPage(1);
  };

  const handleSearchClear = (type) => {
    handleSearchChange(type, "");
    handleSearchToggle(type, false);
    setCurrentPage(1);
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(groups.filter((group) => group.id !== groupId));
  };

  const handleEditGroup = (groupId) => {
    setEditingGroup(groupId);
    if (onToggleForm) onToggleForm();
  };

  const handleSaveGroup = (groupData) => {
    if (groupData.id && groups.find((group) => group.id === groupData.id)) {
      // Editing existing group
      setGroups(
        groups.map((group) => (group.id === groupData.id ? groupData : group))
      );
    } else {
      // Adding new group
      setGroups([...groups, groupData]);
    }
    setEditingGroup(null);
    if (onToggleForm) onToggleForm(); // Close the form after saving
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    if (onToggleForm) onToggleForm(); // Close the form when canceling
  };

  const searchStates = {
    showNameSearch,
    showMembersSearch,
    showDescriptionSearch,
    showReminderSearch,
    nameSearchTerm,
    membersSearchTerm,
    descriptionSearchTerm,
    reminderSearchTerm,
  };

  return (
    <div className="space-y-4">
      {showAddForm && (
        <GroupForm onSave={handleSaveGroup} onCancel={handleCancelEdit} />
      )}

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-400">
        <Table className="border-collapse">
          <TableHeader>
            <GroupTableHeader
              sortConfig={sortConfig}
              onSort={requestSort}
              searchStates={searchStates}
              onSearchToggle={handleSearchToggle}
              onSearchChange={handleSearchChange}
              onSearchClear={handleSearchClear}
            />
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No groups found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((group) => (
                <GroupTableRow
                  key={group.id}
                  group={group}
                  isEditing={editingGroup === group.id}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                  onSave={handleSaveGroup}
                  onCancelEdit={handleCancelEdit}
                />
              ))
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
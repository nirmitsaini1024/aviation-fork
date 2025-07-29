import { useRef, useEffect } from "react";
import { ArrowUpDown, Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableHead, TableRow } from "./Table";

export function GroupTableHeader({
  sortConfig,
  onSort,
  searchStates,
  onSearchToggle,
  onSearchChange,
  onSearchClear,
}) {
  const {
    showNameSearch,
    showMembersSearch,
    showDescriptionSearch,
    showReminderSearch,
    nameSearchTerm,
    membersSearchTerm,
    descriptionSearchTerm,
    reminderSearchTerm,
  } = searchStates;

  // Refs for the search popups to detect clicks outside
  const namePopupRef = useRef(null);
  const membersPopupRef = useRef(null);
  const descriptionPopupRef = useRef(null);
  const reminderPopupRef = useRef(null);

  // Effect to handle clicks outside the search popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check name search popup
      if (namePopupRef.current && !namePopupRef.current.contains(event.target)) {
        onSearchToggle('name', false);
      }
      // Check members search popup
      if (membersPopupRef.current && !membersPopupRef.current.contains(event.target)) {
        onSearchToggle('members', false);
      }
      // Check description search popup
      if (descriptionPopupRef.current && !descriptionPopupRef.current.contains(event.target)) {
        onSearchToggle('description', false);
      }
      // Check reminder search popup
      if (reminderPopupRef.current && !reminderPopupRef.current.contains(event.target)) {
        onSearchToggle('reminder', false);
      }
    };

    // Add event listener when any popup is open
    if (showNameSearch || showMembersSearch || showDescriptionSearch || showReminderSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNameSearch, showMembersSearch, showDescriptionSearch, showReminderSearch, onSearchToggle]);

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const SearchPopup = ({ isOpen, searchTerm, onSearchChange, onClear, placeholder, popupRef }) => {
    if (!isOpen) return null;

    return (
      <div
        ref={popupRef}
        className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={placeholder}
              className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
              onClick={onClear}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      </div>
    );
  };

  return (
    <TableRow className="bg-blue-600">
      {/* Group Name Column */}
      <TableHead className="text-white relative">
        <div className="flex items-center gap-2">
          <span>Group Name</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
              onClick={() => onSort("name")}
              title="Sort by group name"
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showNameSearch ? 'bg-blue-700' : ''}`}
                onClick={() => onSearchToggle('name')}
                title="Search by group name and tags"
              >
                <Search className="h-3 w-3" />
              </Button>

              <SearchPopup
                isOpen={showNameSearch}
                searchTerm={nameSearchTerm}
                onSearchChange={(value) => onSearchChange('name', value)}
                onClear={() => onSearchClear('name')}
                placeholder="Search by name or tags..."
                popupRef={namePopupRef}
              />
            </div>
          </div>
          {getSortIcon("name")}
        </div>
      </TableHead>

      {/* Members Column */}
      <TableHead className="text-white relative">
        <div className="flex items-center gap-2">
          <span>Members</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
              onClick={() => onSort("members")}
              title="Sort by member count"
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showMembersSearch ? 'bg-blue-700' : ''}`}
                onClick={() => onSearchToggle('members')}
                title="Search by members"
              >
                <Search className="h-3 w-3" />
              </Button>

              <SearchPopup
                isOpen={showMembersSearch}
                searchTerm={membersSearchTerm}
                onSearchChange={(value) => onSearchChange('members', value)}
                onClear={() => onSearchClear('members')}
                placeholder="Search by member names..."
                popupRef={membersPopupRef}
              />
            </div>
          </div>
          {getSortIcon("members")}
        </div>
      </TableHead>

      {/* Description Column */}
      <TableHead className="text-white relative">
        <div className="flex items-center gap-2">
          <span>Description</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
              onClick={() => onSort("description")}
              title="Sort by description"
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showDescriptionSearch ? 'bg-blue-700' : ''}`}
                onClick={() => onSearchToggle('description')}
                title="Search by description"
              >
                <Search className="h-3 w-3" />
              </Button>

              <SearchPopup
                isOpen={showDescriptionSearch}
                searchTerm={descriptionSearchTerm}
                onSearchChange={(value) => onSearchChange('description', value)}
                onClear={() => onSearchClear('description')}
                placeholder="Search by description..."
                popupRef={descriptionPopupRef}
              />
            </div>
          </div>
          {getSortIcon("description")}
        </div>
      </TableHead>

      {/* Reminder Column */}
      <TableHead className="text-white relative">
        <div className="flex items-center gap-2">
          <span>Reminder</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
              onClick={() => onSort("reminder")}
              title="Sort by reminder"
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showReminderSearch ? 'bg-blue-700' : ''}`}
                onClick={() => onSearchToggle('reminder')}
                title="Search by reminder"
              >
                <Search className="h-3 w-3" />
              </Button>

              <SearchPopup
                isOpen={showReminderSearch}
                searchTerm={reminderSearchTerm}
                onSearchChange={(value) => onSearchChange('reminder', value)}
                onClear={() => onSearchClear('reminder')}
                placeholder="Search by reminder..."
                popupRef={reminderPopupRef}
              />
            </div>
          </div>
          {getSortIcon("reminder")}
        </div>
      </TableHead>

      <TableHead className="text-right text-white">Actions</TableHead>
    </TableRow>
  );
}
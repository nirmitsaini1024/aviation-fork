// /components/review-tasks/ReviewTasksTableHeader.jsx
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableColumnHeader } from "./searchable-column-header";

export function ReviewTasksTableHeader({
  selectedDocuments,
  filteredDocuments,
  toggleSelectAll,
  sortColumn,
  sortDirection,
  columnFilters,
  handleSort,
  handleFilterChange,
  filterStatus
}) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-blue-600">
        <TableHead className="w-[50px]">
          <Checkbox
            checked={
              selectedDocuments.length === filteredDocuments.length &&
              filteredDocuments.length > 0
            }
            onCheckedChange={toggleSelectAll}
            aria-label="Select all"
          />
        </TableHead>
        
        <SearchableColumnHeader
          title="Review Details"
          column="name"
          width="w-[320px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        
        <SearchableColumnHeader
          title="Reviewer"
          column="reviewerName"
          width="w-[140px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        
        <SearchableColumnHeader
          title="Assigned TS"
          column="createdAt"
          width="w-[150px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        
        <SearchableColumnHeader
          title="Last Updated"
          column="lastUpdated"
          width="w-[150px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        
        <SearchableColumnHeader
          title="Status"
          column="status"
          width="w-[110px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        
        <TableHead className="w-[120px] whitespace-nowrap">AI Analysis</TableHead>
        
        <TableHead className="w-[100px] text-center whitespace-nowrap">
          {filterStatus === "pending" || filterStatus === "all" || filterStatus === "expired"
            ? "Approval"
            : "Signed Off"}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
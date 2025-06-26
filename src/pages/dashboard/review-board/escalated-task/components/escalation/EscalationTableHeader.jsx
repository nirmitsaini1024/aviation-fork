// /components/escalation/EscalationTableHeader.jsx
import { TableHeader, TableRow } from "@/components/ui/table";
import { ColumnHeader } from "@/components/column-header";

export function EscalationTableHeader({
  sortColumn,
  sortDirection,
  columnFilters,
  handleSort,
  handleFilterChange,
}) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-[#335aff]">
        <ColumnHeader
          title="Document Category"
          column="category"
          width="w-[150px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        <ColumnHeader
          title="Document Name"
          column="documentName"
          width="w-[180px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        <ColumnHeader
          title="Role"
          column="role"
          width="w-[150px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        <ColumnHeader
          title="Assigned To"
          column="assignedTo"
          width="w-[150px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        <ColumnHeader
          title="Assigned TS"
          column="assignedAt"
          width="w-[160px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        <ColumnHeader
          title="Expired TS"
          column="expiredAt"
          width="w-[160px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        <ColumnHeader
          title="Actions"
          column="actions"
          width="w-[100px]"
          sortable={false}
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
      </TableRow>
    </TableHeader>
  );
}
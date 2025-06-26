// /components/escalation/EscalationTable.jsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { EscalationTableHeader } from "./EscalationTableHeader";
import { EscalationTableRow } from "./EscalationTableRow";
import { filterEscalations, sortEscalations } from "../../utils/escalation-filters";
import { escalations } from "../../mock-data/escalations";

export function EscalationTable({ globalFilter }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle column filter change
  const handleFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  // Filter and sort data
  const filteredData = filterEscalations(escalations, globalFilter, columnFilters);
  const sortedData = sortEscalations(filteredData, sortColumn, sortDirection);

  return (
    <div className="rounded-md border-1 border-gray-400 shadow-sm bg-white overflow-x-auto">
      <Table>
        <EscalationTableHeader
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleSort={handleSort}
          handleFilterChange={handleFilterChange}
        />
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No escalations found
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((escalation, index) => (
              <EscalationTableRow
                key={escalation.id}
                escalation={escalation}
                index={index}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
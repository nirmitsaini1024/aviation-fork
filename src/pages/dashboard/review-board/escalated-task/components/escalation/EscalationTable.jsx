// /components/escalation/EscalationTable.jsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { EscalationTableHeader } from "./EscalationTableHeader";
import { EscalationTableRow } from "./EscalationTableRow";
import { filterEscalations, sortEscalations } from "../../utils/escalation-filters";
import { escalations } from "../../mock-data/escalations";

export function EscalationTable({ globalFilter }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

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
    setCurrentPage(1);
  };

  // Filter and sort data
  const filteredData = filterEscalations(escalations, globalFilter, columnFilters);
  const sortedData = sortEscalations(filteredData, sortColumn, sortDirection);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Page change handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No escalations found
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((escalation, index) => (
              <EscalationTableRow
                key={escalation.id}
                escalation={escalation}
                index={startIndex + index}
              />
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
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
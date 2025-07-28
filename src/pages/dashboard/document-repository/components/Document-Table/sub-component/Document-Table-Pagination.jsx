import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { useDocumentTable } from "../../../context/DocumentTableContext";

export const DocumentTablePagination = () => {
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    allSortedData,
    handlePageChange,
  } = useDocumentTable();

  // Don't show pagination if there's only one page or no data
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, allSortedData.length)} to{' '}
        {Math.min(currentPage * itemsPerPage, allSortedData.length)} of {allSortedData.length} entries
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
  );
};
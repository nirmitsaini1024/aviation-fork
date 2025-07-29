import React from "react";
import { TableHeader, TableRow } from "@/components/ui/table";
import { ColumnHeader } from "@/components/column-header";
import { useSearchParams } from "react-router-dom";
import { useDocumentTable } from "../../../context/DocumentTableContext";

export const DocumentTableHeader = () => {
  const {
    handleSort,
    sortColumn,
    sortDirection,
    columnFilters,
    handleFilterChange,
  } = useDocumentTable();

  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <TableHeader>
      <TableRow className=" hover:bg-[#335aff] whitespace-nowrap">
        <ColumnHeader
          title="Document Name"
          column="name"
          width="w-[170px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        {tab !== "refdoc" && (
          <ColumnHeader
            title="Revision"
            column="revision"
            width="w-[20px]"
            sortable={false}
            handleSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            columnFilters={columnFilters}
            handleFilterChange={handleFilterChange}
          />
        )}
        <ColumnHeader
          title="Description"
          column="description"
          width="w-[20px]"
          sortable={false}
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        <ColumnHeader
          title="Owner"
          column="owner"
          width="w-[200px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        <ColumnHeader
          title={
            tab !== "refdoc" &&
            tab !== "approved" &&
            tab !== "disapproved"
              ? "Created TS"
              : "Uploaded TS"
          }
          column="createdAt"
          width="w-[230px]"
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          columnFilters={columnFilters}
          handleFilterChange={handleFilterChange}
        />
        {tab == "refdoc" && (
          <ColumnHeader
            title="Linked with"
            column="linkedwith"
            width="w-[20px]"
            sortable={false}
            filterable={false}
            handleSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            columnFilters={columnFilters}
            handleFilterChange={handleFilterChange}
          />
        )}
        {(tab === "approved" || tab === "disapproved") && (
          <ColumnHeader
            title={tab === "approved" ? "Approved TS" : "Deactivated TS"}
            column={tab === "approved" ? "approvedAt" : "deactivatedAt"}
            width="w-[250px]"
            handleSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            columnFilters={columnFilters}
            handleFilterChange={handleFilterChange}
          />
        )}
        {/* Compare Column Header - only show for approved tab */}
        {tab === "approved" && (
          <ColumnHeader
            title="Current Vs Last Final"
            column="compare"
            width="w-[400px]"
            sortable={false}
            filterable={false}
            handleSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            columnFilters={columnFilters}
            handleFilterChange={handleFilterChange}
          />
        )}
        {tab !== "refdoc" &&
          tab !== "approved" &&
          tab !== "disapproved" && (
            <ColumnHeader
              title="Final Vs Working Copy"
              column="details"
              width="w-[100px]"
              sortable={false}
              filterable={false}
              handleSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              columnFilters={columnFilters}
              handleFilterChange={handleFilterChange}
            />
          )}
        {tab !== "disapproved" && (
          <ColumnHeader
            title="Action"
            column="action"
            width="w-[20px]"
            sortable={false}
            filterable={false}
            handleSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            columnFilters={columnFilters}
            handleFilterChange={handleFilterChange}
          />
        )}
        {tab !== "refdoc" && (
          <ColumnHeader
            title="Review Panel"
            column="reviewCycle"
            width="w-[200px]"
            sortable={false}
            filterable={false}
            handleSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            columnFilters={columnFilters}
            handleFilterChange={handleFilterChange}
          />
        )}
      </TableRow>
    </TableHeader>
  );
};
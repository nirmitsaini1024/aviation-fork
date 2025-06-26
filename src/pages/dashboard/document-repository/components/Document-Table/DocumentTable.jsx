import { Table } from "@/components/ui/table";
import { DocumentTableProvider } from "../../context/DocumentTableContext";
import { DocumentTableHeader } from "./sub-component/Document-Table-Header";
import { DocumentTableBody } from "./sub-component/Document-Table-Body";

export function DocumentTable(props) {
  return (
    <DocumentTableProvider {...props}>
      <div className="space-y-4">
        <div className="rounded-md border-1 border-gray-400 shadow-sm bg-white overflow-x-auto">
          <Table>
            <DocumentTableHeader />
            <DocumentTableBody />
          </Table>
        </div>
      </div>
    </DocumentTableProvider>
  );
}
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentTable } from "../components/Document-Table/DocumentTable";
import { useDocCenter } from "../context/DocCenterContext";

export const DocumentTabs = ({ setIsBotOpen }) => {
  const {
    activeTab,
    handleTabChange,
    appliedFilters,
    IsresetFilters,
    setIsResetFilters,
  } = useDocCenter();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Tabs
        defaultValue="active"
        className="w-full duration-300 transition-all ease-in-out"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-4 bg-blue-50 w-full">
          <TabsTrigger
            value="active"
            className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            In Review
          </TabsTrigger>
          <TabsTrigger
            value="refdoc"
            className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            Reference Documents
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="disapproved"
            className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
          >
            Deactivated
          </TabsTrigger>
        </TabsList>

        {/* In Review Tab */}
        <TabsContent value="active">
          <DocumentTable
            documentTypeFilter={appliedFilters.documentType}
            documentNameFilter={appliedFilters.documentName}
            cctFilter={appliedFilters.cct}
            domainFilter={appliedFilters.domain}
            departmentFilter={appliedFilters.department}
            categoryFilter={appliedFilters.category}
            dateFrom={appliedFilters.dateFrom}
            dateTo={appliedFilters.dateTo}
            status="active"
            IsresetFilters={IsresetFilters}
            setIsResetFilters={setIsResetFilters}
            setIsBotOpen={setIsBotOpen}
            ownerNameFilter={appliedFilters.ownerName}
            refDocsFilter={appliedFilters.refDocs}
          />
        </TabsContent>

        {/* Reference Documents Tab */}
        <TabsContent value="refdoc">
          <DocumentTable
            documentTypeFilter={appliedFilters.documentType}
            documentNameFilter={appliedFilters.documentName}
            cctFilter={appliedFilters.cct}
            domainFilter={appliedFilters.domain}
            departmentFilter={appliedFilters.department}
            categoryFilter={appliedFilters.category}
            dateFrom={appliedFilters.dateFrom}
            dateTo={appliedFilters.dateTo}
            status="refdoc"
            IsresetFilters={true}
            setIsResetFilters={setIsResetFilters}
            setIsBotOpen={setIsBotOpen}
            ownerNameFilter={appliedFilters.ownerName}
            refDocsFilter={appliedFilters.refDocs}
          />
        </TabsContent>

        {/* Approved Tab */}
        <TabsContent value="approved">
          <DocumentTable
            documentTypeFilter={appliedFilters.documentType}
            documentNameFilter={appliedFilters.documentName}
            cctFilter={appliedFilters.cct}
            domainFilter={appliedFilters.domain}
            departmentFilter={appliedFilters.department}
            categoryFilter={appliedFilters.category}
            dateFrom={appliedFilters.dateFrom}
            dateTo={appliedFilters.dateTo}
            status="approved"
            IsresetFilters={IsresetFilters}
            setIsResetFilters={setIsResetFilters}
            setIsBotOpen={setIsBotOpen}
            ownerNameFilter={appliedFilters.ownerName}
            refDocsFilter={appliedFilters.refDocs}
          />
        </TabsContent>

        {/* Deactivated Tab */}
        <TabsContent value="disapproved">
          <DocumentTable
            documentTypeFilter={appliedFilters.documentType}
            documentNameFilter={appliedFilters.documentName}
            cctFilter={appliedFilters.cct}
            domainFilter={appliedFilters.domain}
            departmentFilter={appliedFilters.department}
            categoryFilter={appliedFilters.category}
            dateFrom={appliedFilters.dateFrom}
            dateTo={appliedFilters.dateTo}
            status="disapproved"
            IsresetFilters={IsresetFilters}
            setIsResetFilters={setIsResetFilters}
            ownerNameFilter={appliedFilters.ownerName}
            refDocsFilter={appliedFilters.refDocs}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
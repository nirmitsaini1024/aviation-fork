// /components/review-tasks/ReviewTasksStatusTabs.jsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ReviewTasksStatusTabs({ 
  tabParam, 
  setFilterStatus,
  filterStatus,
  setReviewerTypeFilter,
  reviewerTypeFilter 
}) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks to Review</h2>
      </div>

      <Tabs defaultValue={tabParam === "all" ? "expired" : "pending"} className="w-full">
        <TabsList className="bg-blue-50 w-full">
          <TabsTrigger
            value="all"
            className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            onClick={() => setFilterStatus("all")}
          >
            All Tasks
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
            onClick={() => setFilterStatus("expired")}
          >
            Expired
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            onClick={() => setFilterStatus("approved")}
          >
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="flex-1 data-[state=active]:bg-gray-400 data-[state=active]:text-white"
            onClick={() => setFilterStatus("rejected")}
          >
            Rejected
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
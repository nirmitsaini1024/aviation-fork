import { Badge } from "@/components/ui/badge";
import { useContext, useEffect, useState, useMemo } from "react";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";
import { RequestInfoContext } from "../../context/RequestInfoContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailSender from "../../component/SendEmail";
import RFITable from "./RFITable";

export default function TableDetails() {
  const { isBotOpen, setIsBotOpen, tableData, setTableData } =
    useContext(GlobalContext);
  const { setSearchRFIDetails, searchRFIDetails } =
    useContext(RequestInfoContext);
  const [showEmailSender, setShowEmailSender] = useState(false);
  const [selectedRIF, setSelectedRIF] = useState({});
  const [openRIFPopOver, setOpenRIFPopOver] = useState({});
  const [currentTab, setCurrentTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchProject, setSearchProject] = useState("");
  const [openProjectSearchPopOver, setProjectSearchPopOver] = useState(false);
  const [sortOrder, setSortOrder] = useState("none");
  const location = useLocation();
  const navigate = useNavigate();

  const redirectUserToCreateRFI = (data, rfiName, rfiProject) => {
    console.log("In function: ", data);
    navigate("/create-rfi", {
      state: { searchResults: data, rfiName, rfiProject },
    });
  };

  useEffect(() => {
    setSearchRFIDetails(tableData);
  }, [tableData]);

  const handlePopoverOpen = (index, isOpen) => {
    setOpenRIFPopOver((prev) => ({ ...prev, [index]: isOpen }));
  };

  const handleRIFSelection = (index, selectedValue, option) => {
    setSelectedRIF((prev) => ({
      ...prev,
      [index]: selectedValue === prev[index] ? "" : option.fullName,
    }));
    setOpenRIFPopOver((prev) => ({ ...prev, [index]: false }));
  };

  const clearRIFSelection = (index) => {
    setSelectedRIF((prev) => ({ ...prev, [index]: "" }));
    setOpenRIFPopOver((prev) => ({ ...prev, [index]: false }));
  };

  const handleSort = () => {
    if (sortOrder === "none") {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("none");
    }
  };

  const filteredData = useMemo(() => {
    if (!searchRFIDetails) return [];

    let filtered = [...searchRFIDetails];

    if (searchValue.trim()) {
      filtered = filtered.filter(
        (rfi) =>
          rfi.rfiName &&
          rfi.rfiName.toLowerCase().includes(searchValue.toLowerCase().trim())
      );
    }

    if (searchProject.trim()) {
      filtered = filtered.filter(
        (rfi) =>
          rfi.project &&
          rfi.project.toLowerCase().includes(searchProject.toLowerCase().trim())
      );
    }

    if (sortOrder !== "none") {
      filtered.sort((a, b) => {
        const nameA = a.rfiName || "";
        const nameB = b.rfiName || "";
        const firstCharA = nameA.charAt(0).toLowerCase();
        const firstCharB = nameB.charAt(0).toLowerCase();

        if (sortOrder === "asc") {
          return firstCharA.localeCompare(firstCharB);
        } else {
          return firstCharB.localeCompare(firstCharA);
        }
      });
    }

    // Then apply tab filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (currentTab) {
      case "inprogress":
        return filtered.filter((rfi) => {
          return rfi.data.some((dataItem) => {
            if (!dataItem.completionDate) return false;
            const completionDate = new Date(dataItem.completionDate);
            return completionDate > today;
          });
        });

      case "completed":
        return filtered.filter((rfi) => {
          return rfi.data.every((dataItem) => {
            if (!dataItem.completionDate) return false;
            const completionDate = new Date(dataItem.completionDate);
            return completionDate <= today;
          });
        });

      case "all":
      default:
        return filtered;
    }
  }, [searchRFIDetails, currentTab, searchValue, searchProject, sortOrder]);

  // Calculate counts for tab labels
  const tabCounts = useMemo(() => {
    if (!searchRFIDetails) return { all: 0, inprogress: 0, completed: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inProgressCount = searchRFIDetails.filter((rfi) => {
      return rfi.data.some((dataItem) => {
        if (!dataItem.completionDate) return false;
        const completionDate = new Date(dataItem.completionDate);
        return completionDate > today;
      });
    }).length;

    const completedCount = searchRFIDetails.filter((rfi) => {
      return rfi.data.every((dataItem) => {
        if (!dataItem.completionDate) return false;
        const completionDate = new Date(dataItem.completionDate);
        return completionDate <= today;
      });
    }).length;

    return {
      all: searchRFIDetails.length,
      inprogress: inProgressCount,
      completed: completedCount,
    };
  }, [searchRFIDetails]);

  const commonProps = {
    filteredData,
    redirectUserToCreateRFI,
    isBotOpen,
    setIsBotOpen,
    setShowEmailSender,
    selectedRIF,
    openRIFPopOver,
    handlePopoverOpen,
    handleRIFSelection,
    clearRIFSelection,
    searchValue,
    setSearchValue,
    isOpen,
    setIsOpen,
    searchProject,
    setSearchProject,
    openProjectSearchPopOver,
    setProjectSearchPopOver,
    sortOrder,
    handleSort,
  };

  return (
    <div className="pt-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList className={`grid w-full grid-cols-3 bg-blue-50`}>
          <TabsTrigger
            value="all"
            className="flex items-center data-[state=active]:text-white data-[state=active]:bg-blue-500 gap-2"
          >
            All RFI
            <Badge
              variant="secondary"
              className={`ml-1  text-gray-800 bg-gray-100`}
            >
              {tabCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="inprogress"
            className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            In Progress
            <Badge
              variant="secondary"
              className="ml-1 bg-blue-100 text-blue-800"
            >
              {tabCounts.inprogress}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Completed RFI
            <Badge
              variant="secondary"
              className="ml-1 bg-green-100 text-green-800"
            >
              {tabCounts.completed}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <RFITable {...commonProps} tabType="all" />
        </TabsContent>

        <TabsContent value="inprogress" className="mt-6">
          <RFITable {...commonProps} tabType="inprogress" />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <RFITable {...commonProps} tabType="completed" />
        </TabsContent>
      </Tabs>

      <div className="absolute">
        {showEmailSender && (
          <EmailSender open={showEmailSender} setOpen={setShowEmailSender} />
        )}
      </div>
    </div>
  );
}
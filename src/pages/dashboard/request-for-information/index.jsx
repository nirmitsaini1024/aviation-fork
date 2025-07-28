import Filter from "./component/Filter";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";
import AviationSearchResults from "./component/AviationPanel/AviationPanelMain";

const RequestForInfoContent = () => {
  const { setIsReviewManagementOpen } = useContext(GlobalContext);

  useEffect(() => {
    setIsReviewManagementOpen(true);
  }, []);
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
          AI Authoring <span className="text-blue-600">— Request For Information</span>
        </h3>

        <Filter />
      </div>
      <AviationSearchResults />
    </div>
  );
};


export default RequestForInfoContent;

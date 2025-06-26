import Filter from "./component/Filter";
import RequestInfoProvider from "./context/RequestInfoContext";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";
import AviationSearchInterface from "./component/AviationPanels";
import AviationSearchResults from "./component/AviationPanels";

const RequestForInfoContent = () => {
  const { setIsReviewManagementOpen } = useContext(GlobalContext);

  useEffect(() => {
    setIsReviewManagementOpen(true);
    console.log("ran");
  }, []);
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
          AI Authoring <span className="text-blue-600">— R.F.I</span>
        </h3>

        <Filter />
      </div>
      <AviationSearchResults />
    </div>
  );
};

const RequestForInfo = () => {
  return (
    <RequestInfoProvider>
      <RequestForInfoContent />
    </RequestInfoProvider>
  );
};

export default RequestForInfo;

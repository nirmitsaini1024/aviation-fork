import React, { useContext } from "react";
import { RequestInfoContext } from "../context/RequestInfoContext";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";

const useSaveRfi = () => {
  const {
    searchResults,
    setSearchResults,
    setSelectedResult,
    rfiName,
    project,
  } = useContext(RequestInfoContext);
  const { setTableData } = useContext(GlobalContext)
  const { setAllRfiNames, setAllProjectNames } = useContext(RequestInfoContext)
  const saveRfi = () => {
    console.log("In save Rfi", searchResults);
    if (rfiName.length === 0 || project.length === 0) return;
    setSelectedResult((prev) => ({
      ...prev,
      rfiName,
      project,
    }));

    setAllRfiNames((prev)=>[...prev, rfiName]);
    setAllProjectNames((prev)=>[...prev, project])

    setSearchResults((item) =>
      item.map((doc) => {
        return {
          ...doc,
          rfiName,
          project,
        };
      })
    );

    setTableData((prev) => [
      ...prev,
      {
          id: prev.length + 1,
          rfiName,
          project,
          data: searchResults,
      },
    ]);
  };

  return {
    saveRfi,
  };
};

export default useSaveRfi;

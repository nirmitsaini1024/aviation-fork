import React, { createContext, useCallback, useEffect, useState } from "react";
import { useAviationSearch } from "../hooks/useSearch";
import { docGenTemplateData, docGenUploadFileData, projectNameList, rfiNamesList, tableAllData } from "../mock-data/constant";

export const RequestInfoContext = createContext();

const RequestInfoProvider = ({ children }) => {
  const [domain, setDomain] = useState("Airport");
  const [category, setCategory] = useState("ASP");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [templates, setTemplates] = useState("ASP (Airport Safety Program)");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [externalInformationForTipTap, setExternalInformationForTipTap] =
    useState({ markdown: "", html: "", plainText: "" });
  const [editExternalResurce, setEditExternalResource] = useState(false);
  const [
    showInternalResourceAnswerInTipTap,
    setShowInternalResourceAnswerInTipTap,
  ] = useState({ originalAnswer: "", markdownAnswer: "" });
  const { searchFunction } = useAviationSearch();
  const [isEditInternalANswer, setIsEditInternalAnswer] = useState(false);
  const [isEditInternalAnswerId, setIsEditInternalAnswerId] = useState(null);
  const [selectedAgents, onSelectionChange] = useState([]);
  const [customAnswerFormat, setCustomAnswerFormat] = useState("");
  const [ContentLibrary, setContentLibrary] = useState("");
  const [docGenTemplate, setDocGenTemplate] = useState([]);
  const [selectedDocGenTypes, setSelectedDocGenTypes] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [completionDate, setCompletionDate] = useState(null);
  const [allRfiNames, setAllRfiNames] = useState(rfiNamesList);
  const [allProjectNames, setAllProjectNames] = useState(projectNameList);
  const [searchRFIDetails, setSearchRFIDetails] = useState(tableAllData);
  const [rfiDetailsForUploadTemplate, setRfiDetailsForUploadTemplate] = useState(tableAllData);
  const [editTemplateData, setEditTemplateData] = useState(null);
  const [docGenForUploadTemplate, setDocGenForUploadTemplate] = useState(docGenUploadFileData);
  const [editDocGenData, setEditDocGenData] = useState(null);
  const [docGenTemplateDataList, setDocGenTemplateDataList] = useState(docGenTemplateData);
  const [scheduleDate, setScheduleDate] = useState({
    date: null,
    time: null,
    repeat: "Once",
  });
  const [rfiName, setRfiName] = useState("");
  const [project, setProject] = useState("");
  const performSearch = useCallback(() => {
    const filters = {
      domain,
      category,
      templates,
      selectedAgents,
      selectedDocGenTypes,
      startDate,
      ContentLibrary,
      completionDate,
      selectedDepartment,
      scheduleDate,
    };
    const results = searchFunction(searchQuery, filters);
    setSearchResults(results);
    console.log(results);
  }, [
    searchQuery,
    domain,
    category,
    templates,
    searchFunction,
    selectedAgents,
    docGenTemplate,
    selectedDocGenTypes,
    startDate,
    ContentLibrary,
    completionDate,
    scheduleDate,
    selectedDepartment,
  ]);


  useEffect(()=>{
    console.log(docGenTemplateDataList, docGenForUploadTemplate);
  }, [docGenTemplateDataList, docGenForUploadTemplate])





  const value = {
    domain,
    setDomain,
    category,
    setCategory,
    templates,
    setTemplates,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    performSearch,
    selectedResult,
    setSelectedResult,
    externalInformationForTipTap,
    setExternalInformationForTipTap,
    editExternalResurce,
    setEditExternalResource,
    showInternalResourceAnswerInTipTap,
    setShowInternalResourceAnswerInTipTap,
    isEditInternalANswer,
    setIsEditInternalAnswer,
    isEditInternalAnswerId,
    setIsEditInternalAnswerId,
    selectedAgents,
    onSelectionChange,
    ContentLibrary,
    setContentLibrary,
    customAnswerFormat,
    setCustomAnswerFormat,
    docGenTemplate,
    setDocGenTemplate,
    selectedDocGenTypes,
    setSelectedDocGenTypes,
    startDate,
    setStartDate,
    completionDate,
    setCompletionDate,
    scheduleDate,
    setScheduleDate,
    rfiName,
    setRfiName,
    project,
    setProject,
    allRfiNames, setAllRfiNames,
    allProjectNames, setAllProjectNames,
    searchRFIDetails, setSearchRFIDetails,
    selectedDepartment, setSelectedDepartment,
    rfiDetailsForUploadTemplate, setRfiDetailsForUploadTemplate,
    editTemplateData, setEditTemplateData,
    docGenTemplateDataList, setDocGenTemplateDataList,
    docGenForUploadTemplate, setDocGenForUploadTemplate,
    editDocGenData, setEditDocGenData
  };

  return (
    <RequestInfoContext.Provider value={value}>
      {children}
    </RequestInfoContext.Provider>
  );
};

export default RequestInfoProvider;

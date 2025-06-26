import React, { createContext, useCallback, useEffect, useState } from "react";
import { useAviationSearch } from "../hooks/useSearch";

export const RequestInfoContext = createContext();

const RequestInfoProvider = ({ children }) => {
  const [domain, setDomain] = useState("Airport");
  const [category, setCategory] = useState("ASP");
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
  const performSearch = useCallback(() => {
    const filters = { domain, category, templates, selectedAgents };
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
  ]);

  useEffect(() => {
    console.log(isEditInternalAnswerId);
  }, [isEditInternalAnswerId]);

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
    docGenTemplate, setDocGenTemplate
  };

  return (
    <RequestInfoContext.Provider value={value}>
      {children}
    </RequestInfoContext.Provider>
  );
};

export default RequestInfoProvider;

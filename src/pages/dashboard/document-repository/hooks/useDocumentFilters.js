import { useCallback } from "react";
import { useDocCenter } from "../context/DocCenterContext";

export const useDocumentFilters = () => {
  const {
    appliedFilters,
    applyFilters,
    resetFilters,
    documentType,
    documentName,
    cct,
    dateFrom,
    dateTo,
    domain,
    department,
    category,
    ownerName,
    refDocs,
  } = useDocCenter();

  const hasActiveFilters = useCallback(() => {
    return Object.values(appliedFilters).some(filter => filter !== null && filter !== undefined);
  }, [appliedFilters]);

  const getFilterCount = useCallback(() => {
    return Object.values(appliedFilters).filter(filter => filter !== null && filter !== undefined).length;
  }, [appliedFilters]);

  const clearSpecificFilter = useCallback((filterKey) => {
    // This would need to be implemented to clear individual filters
    console.log(`Clearing filter: ${filterKey}`);
  }, []);

  return {
    appliedFilters,
    applyFilters,
    resetFilters,
    hasActiveFilters,
    getFilterCount,
    clearSpecificFilter,
    currentFilters: {
      documentType,
      documentName,
      cct,
      dateFrom,
      dateTo,
      domain,
      department,
      category,
      ownerName,
      refDocs,
    }
  };
};



export const useTabManagement = () => {
  const { activeTab, handleTabChange } = useDocCenter();

  const getTabStatus = (tab) => {
    return activeTab === tab ? 'active' : 'inactive';
  };

  const isTabActive = (tab) => {
    return activeTab === tab;
  };

  return {
    activeTab,
    handleTabChange,
    getTabStatus,
    isTabActive,
  };
};

// doc-center/hooks/useUrlParams.js
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setActiveTab } = useDocCenter();

  const updateUrlParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const getUrlParam = (key) => {
    return searchParams.get(key);
  };

  const clearUrlParams = () => {
    setSearchParams({});
  };

  // Sync tab with URL on mount and URL changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["active", "refdoc", "approved", "disapproved"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  return {
    updateUrlParam,
    getUrlParam,
    clearUrlParams,
    searchParams,
  };
};
import { useState, useMemo, useCallback } from "react";

const useRFISearch = (tableAllData) => {
  const [searchFilters, setSearchFilters] = useState({
    rfiName: "",
    domain: "",
    searchedCategory: "all_categories", // Using searchedCategory as you requested
    project: "",
    contentLibrary: [],
    agents: [],
    startDate: null,
    completionDate: null,
    searchText: "", // For general text search across questions and answers
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const rfiNames = [...new Set(tableAllData.map((item) => item.rfiName))];
    const projects = [...new Set(tableAllData.map((item) => item.project))];
    const domains = [
      ...new Set(
        tableAllData.flatMap((item) =>
          item.data.map((dataItem) => dataItem.domain)
        )
      ),
    ];
    const categories = [
      ...new Set(
        tableAllData.flatMap((item) =>
          item.data.map((dataItem) => dataItem.searchedCategory)
        )
      ),
    ];
    const contentLibraries = [
      ...new Set(
        tableAllData.flatMap((item) =>
          item.data.map((dataItem) => dataItem.contentLibrary)
        )
      ),
    ];
    const allAgents = [
      ...new Set(
        tableAllData.flatMap((item) =>
          item.data.flatMap((dataItem) => dataItem.agents || [])
        )
      ),
    ];

    return {
      rfiNames,
      projects,
      domains,
      categories,
      contentLibraries,
      allAgents,
    };
  }, [tableAllData]);

  // Update individual filter - force searchedCategory to always be 'all_categories'
  const updateFilter = useCallback((filterKey, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  }, []);

  // Reset all filters - keep searchedCategory as 'all_categories'
  const resetFilters = useCallback(() => {
    setSearchFilters({
      rfiName: "",
      domain: "",
      searchedCategory: "all_categories", // Always reset to all_categories
      project: "",
      contentLibrary: [],
      agents: [],
      startDate: null,
      completionDate: null,
      searchText: "",
    });
    setSearchResults([]);
    setIsSearchPerformed(false);
  }, []);

  // Check if date is within range
  const isDateInRange = useCallback((itemDate, startDate, completionDate) => {
    if (!itemDate) return true;

    const date = new Date(itemDate);
    const start = startDate ? new Date(startDate) : null;
    const end = completionDate ? new Date(completionDate) : null;

    if (start && date < start) return false;
    if (end && date > end) return false;

    return true;
  }, []);

  // Check if text matches search criteria
  const textMatches = useCallback((text, searchText) => {
    if (!searchText) return true;
    return text.toLowerCase().includes(searchText.toLowerCase());
  }, []);

  // Main search function
  const performSearch = useCallback(() => {
    const {
      rfiName,
      domain,
      searchedCategory,
      project,
      contentLibrary,
      agents,
      startDate,
      completionDate,
      searchText,
    } = searchFilters;

    const results = tableAllData.reduce((acc, rfiItem) => {
      // Filter by RFI Name
      if (rfiName && rfiName !== "All_RFI" && rfiItem.rfiName !== rfiName) {
        return acc;
      }

      // Filter by Project
      if (
        project &&
        project !== "All_Projects" &&
        rfiItem.project !== project
      ) {
        return acc;
      }

      // Filter data items within each RFI
      const filteredDataItems = rfiItem.data.filter((dataItem) => {
        // Domain filter
        if (domain && domain !== "all_domains" && dataItem.domain !== domain) {
          return false;
        }

        // SearchedCategory filter - always allow all_categories
        if (
          searchedCategory &&
          searchedCategory !== "all_categories" &&
          dataItem.searchedCategory !== searchedCategory
        ) {
          return false;
        }

        // Content Library filter
        if (contentLibrary.length > 0) {
          const hasMatchingLibrary = contentLibrary.includes(
            dataItem.contentLibrary
          );
          if (!hasMatchingLibrary) {
            return false;
          }
        }

        // Agents filter (check if any selected agent is in the item's agents)
        if (agents.length > 0) {
          const hasMatchingAgent = agents.some(
            (selectedAgent) =>
              dataItem.agents && dataItem.agents.includes(selectedAgent)
          );
          if (!hasMatchingAgent) {
            return false;
          }
        }

        // Date range filters - fixed logic for proper date filtering
        if (startDate) {
          const itemStartDate = new Date(dataItem.startDate);
          const filterStartDate = new Date(startDate);
          // Item start date should be on or after the filter start date
          if (itemStartDate < filterStartDate) {
            return false;
          }
        }

        if (completionDate) {
          const itemCompletionDate = new Date(dataItem.completionDate);
          const filterCompletionDate = new Date(completionDate);
          // Item completion date should be on or before the filter completion date
          if (itemCompletionDate > filterCompletionDate) {
            return false;
          }
        }

        // Text search (search in question and answers)
        if (searchText) {
          const questionMatches = textMatches(
            dataItem.question || "",
            searchText
          );
          const answerMatches = dataItem.answers?.some(
            (answer) =>
              textMatches(answer.answer || "", searchText) ||
              textMatches(answer.documentName || "", searchText)
          );
          const templateMatches = textMatches(
            dataItem.template || "",
            searchText
          );

          if (!questionMatches && !answerMatches && !templateMatches) {
            return false;
          }
        }

        return true;
      });

      // Only include RFI items that have matching data items
      if (filteredDataItems.length > 0) {
        acc.push({
          ...rfiItem,
          data: filteredDataItems,
          matchCount: filteredDataItems.length,
        });
      }

      return acc;
    }, []);

    setSearchResults(results);
    setIsSearchPerformed(true);

    return results;
  }, [searchFilters, tableAllData, isDateInRange, textMatches]);

  // Get search summary
  const searchSummary = useMemo(() => {
    if (!isSearchPerformed) {
      return {
        totalRFIs: 0,
        totalQuestions: 0,
        appliedFilters: [],
      };
    }

    const totalRFIs = searchResults.length;
    const totalQuestions = searchResults.reduce(
      (sum, rfi) => sum + rfi.data.length,
      0
    );

    const appliedFilters = Object.entries(searchFilters)
      .filter(([key, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (key === "searchedCategory" && value === "all_categories")
          return false;
        if (key === "domain" && value === "all_domains") return false;
        if (key === "rfiName" && value === "All_RFI") return false;
        if (key === "project" && value === "All_Projects") return false;
        return value !== "" && value !== null;
      })
      .map(([key, value]) => ({
        key,
        value: Array.isArray(value) ? value.join(", ") : value,
      }));

    return {
      totalRFIs,
      totalQuestions,
      appliedFilters,
    };
  }, [searchResults, searchFilters, isSearchPerformed]);

  // Advanced search helper - checks if any advanced filters are applied
  const hasAdvancedFilters = useMemo(() => {
    return !!(
      searchFilters.contentLibrary.length > 0 ||
      searchFilters.agents.length > 0 ||
      searchFilters.startDate ||
      searchFilters.completionDate ||
      searchFilters.searchText
    );
  }, [searchFilters]);

  // Check if search button should be disabled - Updated logic
  const isSearchDisabled = useMemo(() => {
    return (
      !searchFilters.domain ||
      searchFilters.domain === "" ||
      !searchFilters.searchedCategory ||
      searchFilters.searchedCategory === ""
    );
  }, [searchFilters.domain, searchFilters.searchedCategory]);

  return {
    // State
    searchFilters,
    searchResults,
    isSearchPerformed,

    // Actions
    updateFilter,
    resetFilters,
    performSearch,

    // Computed values
    filterOptions,
    searchSummary,
    hasAdvancedFilters,
    isSearchDisabled,

    // Utility functions for external use
    setSearchFilters,
    setSearchResults,
  };
};

export default useRFISearch;

import { useContext } from "react";
import { RequestInfoContext } from "../context/RequestInfoContext";

export const useAgentAndDocGenRemoverFromQuestion = () => {
  const {
    searchResults,
    setSearchResults,
    selectedResult,
    setSelectedResult,
  } = useContext(RequestInfoContext);

  const removeAgents = (item) => {
    console.log("The selectedResult is: ", selectedResult);
    console.log("All search Result is: ", searchResults);
    console.log("Remove the agent: ", item);

    const updatedSelectedResult = {
      ...selectedResult,
      agents: selectedResult.agents.filter((agent) => agent !== item),
      answers: selectedResult.answers.filter(
        (document) => document.documentName !== item
      ),
    };

    setSelectedResult(updatedSelectedResult);

    setSearchResults((prev) => {
      return prev.map((searchItem) => {
        if (searchItem.id === selectedResult.id) {
          return {
            ...searchItem,
            agents: searchItem.agents.filter((agent) => agent !== item),
            answers: searchItem.answers.filter(
              (document) => document.documentName !== item
            ),
          };
        }
        return searchItem;
      });
    });
  };

  const handleRemoveType = (templateName, typeToRemove) => {
  // Update selectedResult
  setSelectedResult((prev) => ({
    ...prev,
    docGen: prev.docGen.map(template => {
      if (template.name === templateName) {
        const updatedTypes = template.type.filter(type => type !== typeToRemove);
        return updatedTypes.length > 0 
          ? { ...template, type: updatedTypes }
          : null;
      }
      return template;
    }).filter(Boolean)
  }));

  // Update searchResults
  setSearchResults((prev) => {
    return prev.map((item) => {
      if (item.id === selectedResult.id) {
        return {
          ...item,
          docGen: item.docGen.map(template => {
            if (template.name === templateName) {
              const updatedTypes = template.type.filter(type => type !== typeToRemove);
              return updatedTypes.length > 0 
                ? { ...template, type: updatedTypes }
                : null;
            }
            return template;
          }).filter(Boolean)
        };
      }
      return item;
    });
  });
};

const handleRemoveTemplate = (templateName) => {
  // Update selectedResult
  setSelectedResult((prev) => ({
    ...prev,
    docGen: prev.docGen.filter(template => template.name !== templateName)
  }));

  // Update searchResults
  setSearchResults((prev) => {
    return prev.map((item) => {
      if (item.id === selectedResult.id) {
        return {
          ...item,
          docGen: item.docGen.filter(template => template.name !== templateName)
        };
      }
      return item;
    });
  });
};

const handleClearAll = () => {
  console.log("Clear all: ", selectedResult, searchResults);
  
  setSelectedResult((prev) => ({
    ...prev, 
    docGen: []
  }));
    
  setSearchResults((prev) => {
    return prev.map((item) => {
      if (item.id === selectedResult.id) {
        return { ...item, docGen: [] };
      }
      return item;
    });
  });
};

  return {
    removeAgents,
    handleRemoveType,
    handleRemoveTemplate,
    handleClearAll,
  };
};

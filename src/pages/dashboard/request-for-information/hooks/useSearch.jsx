import { useState, useCallback, useContext } from "react";
import {
  agentsMockData,
  customAnswers,
  mockCategories,
  mockExternalAnswers,
} from "../mock-data/constant";
import { RequestInfoContext } from "../context/RequestInfoContext";

export const useAviationSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchFunction = useCallback((query, filters = {}) => {
    setIsLoading(true);

    const {
      domain,
      category,
      templates,
      selectedAgents,
      selectedDocGenTypes,
      startDate = null,
      ContentLibrary = "",
      completionDate = null,
      scheduleDate = null,
      selectedDepartment = ""
    } = filters;
    let results = [];

    // Search in mockCategories
    mockCategories.forEach((categoryData) => {
      // Apply domain filter
      if (domain && domain !== "all_domains" && categoryData.name !== domain) {
        return;
      }

      categoryData.templates.forEach((template) => {
        // Apply category filter
        if (
          category &&
          category !== "all_categories" &&
          !template.name.toLowerCase().includes(category.toLowerCase())
        ) {
          return;
        }

        // Apply template filter
        if (
          templates &&
          templates !== "all_templates" &&
          template.name !== templates
        ) {
          return;
        }

        template.questions.forEach((question) => {
          // Search in question text
          if (
            query &&
            !question.text.toLowerCase().includes(query.toLowerCase())
          ) {
            // Search in answers
            const hasMatchingAnswer = question.answer.some(
              (ans) =>
                ans.answer.toLowerCase().includes(query.toLowerCase()) ||
                ans.documentName.toLowerCase().includes(query.toLowerCase())
            );

            if (!hasMatchingAnswer) return;
          }

          let allAnswers = [...question.answer];

          console.log(selectedAgents);

          // Add matching agents from agentsMockData if selectedAgents exist
          if (selectedAgents && selectedAgents.length > 0) {
            const matchingAgents = agentsMockData.filter((agent) =>
              selectedAgents.includes(agent.documentName)
            );

            // Add matching agents to answers array
            matchingAgents.forEach((agent) => {
              allAnswers.push({
                answer: agent.answer,
                documentName: agent.documentName,
                page: agent.page, // optional: include page if needed
              });
            });
          }

          console.log(question.text);
          results.push({
            id: `${categoryData.id}-${template.id}-${question.id}`,
            domain: categoryData.name,
            template: template.name,
            department: selectedDepartment,
            customAnswers: false,
            question: question.text,
            searchedCategory: category,
            docGen: selectedDocGenTypes,
            category: question.category,
            startDate: startDate,
            completionDate: completionDate,
            contentLibrary: ContentLibrary,
            scheduleDateTime: scheduleDate,
            answers: allAnswers,
            agents: selectedAgents,
            answerFormat:
              question.text ===
              "How are safety incidents investigated and reported?"
                ? "Table"
                : question.text ===
                  "What is the probability that a pilot chosen at random has completed safety training?"
                ? "Chart"
                : "Text",
            type: "internal",
          });
        });
      });
    });

    // Search in external answers if query exists
    if (query) {
      mockExternalAnswers.forEach((extAnswer) => {
        if (
          extAnswer.title.toLowerCase().includes(query.toLowerCase()) ||
          extAnswer.content.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({
            id: extAnswer.id,
            title: extAnswer.title,
            content: extAnswer.content,
            customAnswers: false,
            searchedCategory: category,
            source: extAnswer.source,
            answerFormat: "Text",
            type: "external",
          });
        }
      });
    }

    setSearchResults(results);
    setIsLoading(false);

    return results;
  }, []);

  return {
    searchResults,
    isLoading,
    searchQuery,
    setSearchQuery,
    searchFunction,
  };
};

export const useSearchForCustomQuestion = () => {
  const {
    searchResults,
    setSearchResults,
    domain,
    category,
    templates,
    selectedAgents,
    customAnswerFormat,
    selectedDocGenTypes,
    startDate = null,
    ContentLibrary = "",
    completionDate = null,
    scheduleDate = null,
    selectedDepartment = ""
  } = useContext(RequestInfoContext);
  const searchCustomQuestion = useCallback(
    (question, customCategory) => {
      console.log(searchResults);

      // const isMatchForCustomAnswers = searchResults.some((item) =>  (item.category === customCategory && item.customAnswers === true));

      let randomCustomAnswers = [];
      let endLoop = Math.floor(Math.random() * 3);
      for (let i = 0; i <= endLoop; i++) {
        const randomIndex = Math.floor(Math.random() * customAnswers.length);
        randomCustomAnswers.push(customAnswers[randomIndex]);
      }

      if (selectedAgents.length > 0) {
        agentsMockData.forEach((data) => {
          if (selectedAgents.includes(data.documentName)) {
            randomCustomAnswers.push(data);
          }
        });
      }

      const customDoc = {
        category: customCategory,
        customAnswers: true,
        domain: domain === "all_domains" ? "All Domains" : domain,
        department: selectedDepartment,
        id: Date.now(),
        question: question,
        agents: selectedAgents,
        docGen: selectedDocGenTypes,
        startDate: startDate,
        completionDate: completionDate,
        contentLibrary: ContentLibrary,
        scheduleDateTime: scheduleDate,
        searchedCategory: category,
        template: templates == "all_templates" ? "All Templates" : templates,
        type: "internal",
        answerFormat:
          customAnswerFormat.length > 0 ? customAnswerFormat : "Text",
        answers: randomCustomAnswers,
      };

      // console.log("custom Doc is: ", customDoc);

      setSearchResults((prev) => [...prev, customDoc]);
    },
    [customAnswerFormat]
  );

  return {
    searchCustomQuestion,
  };
};

export const useSearchAgainInternalQuestion = () => {
  const { setSelectedResult, setSearchResults, selectedAgents } =
    useContext(RequestInfoContext);
  const searchAgainInternalQues = () => {
    let randomInternalAnswers = [];
    let endLoop = Math.floor(Math.random() * 3);
    for (let i = 0; i <= endLoop; i++) {
      const randomIndex = Math.floor(Math.random() * customAnswers.length);
      randomInternalAnswers.push(customAnswers[randomIndex]);
    }

    if (selectedAgents.length > 0) {
      agentsMockData.forEach((data) => {
        if (selectedAgents.includes(data.documentName)) {
          randomInternalAnswers.push(data);
        }
      });
    }

    console.log(randomInternalAnswers);
    setSelectedResult((prev) => ({
      ...prev,
      answers: randomInternalAnswers,
    }));

    setSearchResults((prev) =>
      prev.map((item) => {
        if (item.id == prev.id) {
          return { ...item, answers: randomInternalAnswers };
        }
        return item;
      })
    );
  };
  return {
    searchAgainInternalQues,
  };
};

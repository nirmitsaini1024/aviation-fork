import { useContext, useState, useRef, useEffect } from "react";
import {
  assignUser,
  existingProjects,
  mockExternalAnswers,
  tabelContentFirst,
  tabelContentSecond,
} from "../../mock-data/constant";
import { RequestInfoContext } from "../../context/RequestInfoContext";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronLeft,
  UserRoundPen,
  Save,
  Mail,
  UserPlus,
  ChevronsUpDown,
  Check,
  ChevronDown,
  Plus,
  FolderOpen,
  MoreHorizontal,
  FileText,
  FileBarChart,
  ChartBarStacked,
  ChartPie,
  Globe,
  LineChart,
  BarChart,
  AlarmCheck,
  Shield,
  FileCheck,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import DownloadMessageAsHtml from "../../utils/DownloadTextAsPdf";
import {
  formatExternalAnswers,
  formatExternalAnswersAsPlainText,
  formatExternalAnswersInHTML,
} from "../../hooks/useFormatExternalAnswers";
import { useSearchAgainInternalQuestion } from "../../hooks/useSearch";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import EmailSender from "../SendEmail";
import { useAgentAndDocGenRemoverFromQuestion } from "../../hooks/usehandleDocAgent";
import useSaveRfi from "../../hooks/useSaveRfi";
import { useLocation } from "react-router-dom";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";

// Import the new components
import SearchResultsPanel from "./SearchResultsLeftPanel";
import ResultDetailsPanel from "./ResultDetailsRightPanel";

const AviationSearchResults = () => {
  const {
    searchResults,
    isLoading,
    selectedResult,
    setSelectedResult,
    setExternalInformationForTipTap,
    externalInformationForTipTap,
    editExternalResurce,
    setEditExternalResource,
    showInternalResourceAnswerInTipTap,
    setShowInternalResourceAnswerInTipTap,
    isEditInternalANswer,
    setIsEditInternalAnswer,
    setSearchResults,
    rfiName,
    setRfiName,
    project,
    setProject,
  } = useContext(RequestInfoContext);
  
  const location = useLocation();
  const { isBotOpen, setIsBotOpen } = useContext(GlobalContext);
  const {
    removeAgents,
    handleClearAll,
    handleRemoveType,
    handleRemoveTemplate,
  } = useAgentAndDocGenRemoverFromQuestion();
  const { searchAgainInternalQues } = useSearchAgainInternalQuestion();
  const { saveRfi } = useSaveRfi();

  // State variables
  const [filteredResults, setFilteredResults] = useState([]);
  const [randomMockExternalAnswers, setRandomExternalAnswer] = useState([]);
  const [searchQuestions, setSearchQuestions] = useState("");
  const [searchAgainLoading, setSearchAgainLoading] = useState(false);
  const [savedDoc, setSavedDoc] = useState([]);
  const [copiedFileContent, setCopiedFileContent] = useState(null);
  const timeOutRef = useRef(null);
  const [saveExternalInformation, setSaveExternalInformation] = useState(false);
  const copiedFileContentRef = useRef(null);
  const [onlyIncludeCustomQuestion, setOnlyIncludeCustomQUestion] = useState(false);
  const [excludeCustomQuestion, setExcludeCustomQuestion] = useState(false);
  const [changeExternalSourceData, setChangeExternalSourceData] = useState(null);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showLeftPanel, setSHowLeftPanel] = useState(true);
  const [showAIHintTextArea, setShowAIHintTextArea] = useState(false);
  const [aiHintText, setAIHintText] = useState("");
  const [showLoadingAFterAddHints, setShowLoadingAfterAddHints] = useState(false);
  const [selectedRIF, setSelectedRIF] = useState("");
  const [openRIFPopOver, setOpenRIFPopOver] = useState(false);
  const [showEmailPopOver, setShowEmailPopOver] = useState(false);
  const [isCopiedExternalInformation, setIsCopiedExternalInformation] = useState(false);
  const [showAIHintTextAreaForExternal, setSHowAIHintTextAreaForExternal] = useState(false);
  const [aiHintTextExternal, setAIHintTextExternal] = useState("");
  const [saveChartInternal, setSaveChartInternal] = useState(false);
  const [showLoadingAFterAddHintsExternal, setShowLoadingAfterAddHintsExternal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("Select a project");
  const [newProjectName, setNewProjectName] = useState("");
  const [projects, setProjects] = useState(existingProjects);
  const [openDeletePopOver, setOpenDeletePopOver] = useState(null);
  const [IscomeFromRFIDetails, setIsComeFromRFIDetails] = useState(false);
  const [showRiskANalysis, setShowRiskAnalysis] = useState(null);
  const [showButtonsPopOver, setSHowButtonPopOver] = useState(false);
  const [loaderForRiskCalCulate, setLoaderForRiskCalculate] = useState(true);

  // Effects
  useEffect(() => {
    if (location.state?.searchResults) {
      setSearchResults(location.state.searchResults);
      setRfiName(location.state.rfiName);
      setNewProjectName(location.state.rfiProject);
      setSelectedProject(location.state.rfiProject);
      setIsComeFromRFIDetails(true);
    }
  }, [location.state, setSearchResults]);

  useEffect(() => {
    setFilteredResults(searchResults);
  }, [searchResults, selectedResult]);

  useEffect(() => {
    if (copiedFileContentRef.current) {
      clearTimeout(copiedFileContentRef.current);
    }
    copiedFileContentRef.current = setTimeout(() => {
      setCopiedFileContent(null);
    }, 5000);

    return () => {
      clearTimeout(copiedFileContentRef.current);
    };
  }, [copiedFileContent]);

  useEffect(() => {
    if (searchResults.length === 0) return;
    let results = searchResults;

    if (searchQuestions.length > 0) {
      results = searchResults.filter((data) =>
        [data.template, data.domain, data.question, data.title, data.category].some(
          (field) => field?.toLowerCase().includes(searchQuestions.toLowerCase())
        )
      );
    }

    if (onlyIncludeCustomQuestion) {
      results = results.filter((item) => item.customAnswers === true);
    } else if (excludeCustomQuestion) {
      results = results.filter((item) => item.customAnswers !== true);
    }

    setFilteredResults(results);
  }, [searchResults, searchQuestions, onlyIncludeCustomQuestion, excludeCustomQuestion]);

  // Handler functions
  const handleResultSelect = (result) => {
    setSelectedResult(result);
  };

  const handleExternalAnswer = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
    setSearchAgainLoading(true);
    timeOutRef.current = setTimeout(() => {
      let randomAnswers = [];
      for (let i = 0; i < 3; i++) {
        let randIndex = Math.floor(Math.random() * mockExternalAnswers.length);
        randomAnswers.push(mockExternalAnswers[randIndex]);
      }
      const getExternalAnswersInMarkdown = formatExternalAnswers(randomAnswers);
      const getExternalAnswersInHTML = formatExternalAnswersInHTML(randomAnswers);
      const getExternalAnswerAsPlainText = formatExternalAnswersAsPlainText(randomAnswers);
      setExternalInformationForTipTap((prev) => ({
        ...prev,
        markdown: getExternalAnswersInMarkdown,
        html: getExternalAnswersInHTML,
        plainText: getExternalAnswerAsPlainText,
      }));
      setRandomExternalAnswer(randomAnswers);
      setSearchAgainLoading(false);
      timeOutRef.current = null;
      setSaveExternalInformation(false);
    }, 300);
  };

  const handleCreateProject = () => {
    if (newProjectName.trim() && !projects.includes(newProjectName.trim())) {
      const newProject = newProjectName.trim();
      setProjects([newProject, ...projects]);
      setSelectedProject(newProject);
      setNewProjectName("");
      setIsOpen(false);
      setProject(newProject);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setIsOpen(false);
    setProject(project);
  };

  const handleDownloadFile = (fileName) => {
    try {
      let a = document.createElement("a");
      a.href = "/sample.docx";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.log(error);
      toast.error("Failed, Try again!");
    }
  };

  const handleSavedDoc = (fileName) => {
    const isDocAvailable = savedDoc.findIndex((item) => item.documentName === fileName);
    if (isDocAvailable === -1) {
      setSavedDoc((prev) => [...prev, { documentName: fileName }]);
    } else {
      setSavedDoc((prev) => prev.filter((item) => item.documentName !== fileName));
    }
  };

  const handleDownloadExternalText = async () => {
    const questionSection = `
      <div style="margin-bottom: 40px; padding: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; border-radius: 8px; page-break-inside: avoid;">
        <p style="color: #1e40af; font-size: 19px; line-height: 1.5; margin: 0; font-family: system-ui, -apple-system, sans-serif;">
          ${selectedResult.question}
        </p>
      </div>
    `;
    const formattedContent = questionSection + externalInformationForTipTap.html;
    await DownloadMessageAsHtml(formattedContent, "External_Information");
  };

  const handleCopyExternalSources = () => {
    setIsCopiedExternalInformation(true);
    const randomAnswerStr = randomMockExternalAnswers
      .map((item) => `${item.title}\n${item.content}\n\n\n`)
      .join(" ");

    navigator.clipboard
      .writeText(randomAnswerStr)
      .then(() => {
        setTimeout(() => {
          setIsCopiedExternalInformation(false);
        }, 5000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      Safety: <Shield className="w-5 h-5" />,
      "Emergency Preparation": <AlarmCheck className="w-5 h-5" />,
      "Capacity Management": <BarChart className="w-5 h-5" />,
      "Data Analytics": <LineChart className="w-5 h-5" />,
      Data: <Database className="w-5 h-5" />,
      "External Sources": <Globe className="w-5 h-5" />,
    };
    return iconMap[category] || <FileCheck className="w-5 h-5 text-blue-600" />;
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      Safety: "bg-white border-gray-400",
      "Emergency Preparation": "bg-white border-gray-400",
      "Capacity Management": "bg-white border-gray-400",
      "Data Analytics": "bg-white border-gray-400",
      Data: "bg-white border-gray-400",
      "External Sources": "bg-white border-gray-400",
    };
    return colorMap[category] || "bg-white border-gray-400";
  };

  const handlePanels = (panel) => {
    if (panel === "left") {
      if (showLeftPanel && showRightPanel) {
        setShowRightPanel(false);
      } else {
        setSHowLeftPanel(true);
        setShowRightPanel(true);
      }
    } else if (panel === "right") {
      if (showLeftPanel && showRightPanel) {
        setSHowLeftPanel(false);
      } else {
        setSHowLeftPanel(true);
        setShowRightPanel(true);
      }
    }
  };

  const handleDeleteAnswer = (answer, documentName) => {
    setSelectedResult((prev) => ({
      ...prev,
      answers: prev.answers.filter((ans) => ans.answer !== answer),
    }));

    setSearchResults((prev) =>
      prev.map((item) => {
        if (item.id === selectedResult.id) {
          return {
            ...item,
            answers: item.answers.filter((ans) => ans.answer !== answer),
          };
        }
        return item;
      })
    );

    setOpenDeletePopOver(null);
  };

  const handleChangeAnswerFormat = async (id, type) => {
    await setSearchResults((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, answerFormat: type };
        }
        return item;
      })
    );

    setFilteredResults((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, answerFormat: type };
        }
        return item;
      })
    );

    setSelectedResult((prev) => ({
      ...prev,
      answerFormat: type,
    }));
  };

  // Initialize external answers
  useEffect(() => {
    handleExternalAnswer();
    return () => {
      clearTimeout(timeOutRef.current);
    };
  }, []);

  // Group filtered results by category
  const groupedResults =
    filteredResults.length > 0 &&
    filteredResults.reduce((acc, result) => {
      if (result.type === "internal") {
        const category = result.category || "Uncategorized";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(result);
      } else {
        if (!acc["External Sources"]) {
          acc["External Sources"] = [];
        }
        acc["External Sources"].push(result);
      }
      return acc;
    }, {});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <UserRoundPen className="mx-auto h-16 w-16 mb-4 opacity-50" />
        <p className="text-xl font-medium">Start authoring</p>
        <p className="text-sm">
          Choose your keywords and filters to find relevant information.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Email Popover */}
      <div className="absolute">
        {showEmailPopOver && (
          <EmailSender open={showEmailPopOver} setOpen={setShowEmailPopOver} />
        )}
      </div>

      {/* Split Panel Layout */}
      <div className="flex-1 flex gap-6 mb-10 px-6 pb-6 min-h-0">
        {/* Left Panel */}
        {showLeftPanel && (
          <div
            className={`${
              showRightPanel ? "w-[40%]" : "w-full"
            } duration-300 ease-in-out transition-all`}
          >
            <SearchResultsPanel
              searchResults={searchResults}
              filteredResults={filteredResults}
              groupedResults={groupedResults}
              selectedResult={selectedResult}
              handleResultSelect={handleResultSelect}
              searchQuestions={searchQuestions}
              setSearchQuestions={setSearchQuestions}
              onlyIncludeCustomQuestion={onlyIncludeCustomQuestion}
              setOnlyIncludeCustomQUestion={setOnlyIncludeCustomQUestion}
              excludeCustomQuestion={excludeCustomQuestion}
              setExcludeCustomQuestion={setExcludeCustomQuestion}
              handleExternalAnswer={handleExternalAnswer}
              setChangeExternalSourceData={setChangeExternalSourceData}
              changeExternalSourceData={changeExternalSourceData}
              setShowInternalResourceAnswerInTipTap={setShowInternalResourceAnswerInTipTap}
              handleChangeAnswerFormat={handleChangeAnswerFormat}
              removeAgents={removeAgents}
              handleRemoveType={handleRemoveType}
              handleRemoveTemplate={handleRemoveTemplate}
              handleClearAll={handleClearAll}
              getCategoryIcon={getCategoryIcon}
              getCategoryColor={getCategoryColor}
            />
          </div>
        )}

        {/* Panel Toggle Controls */}
        <div className="relative flex items-center justify-center gap-y-5 flex-col">
          <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px border-l-2 border-dotted border-gray-300" />
          <div className="absolute top-1/2 space-y-5">
            <button
              onClick={() => handlePanels("left")}
              className={`hover:cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 p-1.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-20 ${
                showLeftPanel && !showRightPanel && "opacity-0"
              }`}
              title="Toggle panels"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={() => handlePanels("right")}
              className={`hover:cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 p-1.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-20 ${
                !showLeftPanel && showRightPanel && "opacity-0"
              }`}
              title="Toggle panels"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        {showRightPanel && (
          <div
            className={`${
              showLeftPanel ? "w-[60%]" : "w-full"
            } duration-100 transition-all ease-in-out`}
          >
            <ResultDetailsPanel
              selectedResult={selectedResult}
              showInternalResourceAnswerInTipTap={showInternalResourceAnswerInTipTap}
              setShowInternalResourceAnswerInTipTap={setShowInternalResourceAnswerInTipTap}
              isEditInternalANswer={isEditInternalANswer}
              setIsEditInternalAnswer={setIsEditInternalAnswer}
              externalInformationForTipTap={externalInformationForTipTap}
              editExternalResurce={editExternalResurce}
              setEditExternalResource={setEditExternalResource}
              saveExternalInformation={saveExternalInformation}
              setSaveExternalInformation={setSaveExternalInformation}
              copiedFileContent={copiedFileContent}
              setCopiedFileContent={setCopiedFileContent}
              savedDoc={savedDoc}
              setSavedDoc={setSavedDoc}
              handleDownloadFile={handleDownloadFile}
              handleSavedDoc={handleSavedDoc}
              randomMockExternalAnswers={randomMockExternalAnswers}
              handleDownloadExternalText={handleDownloadExternalText}
              handleCopyExternalSources={handleCopyExternalSources}
              isCopiedExternalInformation={isCopiedExternalInformation}
              setIsCopiedExternalInformation={setIsCopiedExternalInformation}
              showLoadingAFterAddHints={showLoadingAFterAddHints}
              setShowLoadingAfterAddHints={setShowLoadingAfterAddHints}
              searchAgainInternalQues={searchAgainInternalQues}
              showAIHintTextArea={showAIHintTextArea}
              setShowAIHintTextArea={setShowAIHintTextArea}
              aiHintText={aiHintText}
              setAIHintText={setAIHintText}
              showAIHintTextAreaForExternal={showAIHintTextAreaForExternal}
              setSHowAIHintTextAreaForExternal={setSHowAIHintTextAreaForExternal}
              aiHintTextExternal={aiHintTextExternal}
              setAIHintTextExternal={setAIHintTextExternal}
              showLoadingAFterAddHintsExternal={showLoadingAFterAddHintsExternal}
              setShowLoadingAfterAddHintsExternal={setShowLoadingAfterAddHintsExternal}
              handleExternalAnswer={handleExternalAnswer}
              saveChartInternal={saveChartInternal}
              setSaveChartInternal={setSaveChartInternal}
              openDeletePopOver={openDeletePopOver}
              setOpenDeletePopOver={setOpenDeletePopOver}
              handleDeleteAnswer={handleDeleteAnswer}
              showRiskANalysis={showRiskANalysis}
              setShowRiskAnalysis={setShowRiskAnalysis}
              loaderForRiskCalCulate={loaderForRiskCalCulate}
              setLoaderForRiskCalculate={setLoaderForRiskCalculate}
              tabelContentFirst={tabelContentFirst}
              tabelContentSecond={tabelContentSecond}
              setSelectedResult={setSelectedResult}
              setSearchResults={setSearchResults}
              searchAgainLoading={searchAgainLoading}
            />
          </div>
        )}

        {/* Bottom Toolbar */}
        <div className="fixed bottom-0 w-[90%] bg-white border-t border-slate-200 py-4">
          <div className="w-full flex gap-x-14 items-center">
            <div className="w-[40%]">
              {(Object.keys(groupedResults).length > 0 || searchResults.length > 0) && (
                <div className="flex items-center gap-x-4">
                  <div className="relative w-full border border-gray-400 rounded-md">
                    <Input
                      value={rfiName}
                      onChange={(e) => setRfiName(e.target.value)}
                      placeholder="Enter RFI name..."
                      className="pr-20"
                    />
                    <Button
                      variant="outline"
                      disabled={rfiName.length === 0}
                      onClick={() => {
                        if (project.length === 0) {
                          toast.warning("Please select a project first.", {
                            duration: 800,
                          });
                        } else {
                          saveRfi();
                          toast.success("R.F.I Saved", {
                            duration: 8000,
                          });
                          setRfiName("");
                        }
                      }}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 bg-blue-500 hover:bg-blue-600 ease-in-out transition-all duration-300 text-white shadow-lg text-xs px-3 hover:text-white"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isOpen}
                          className="h-10 min-w-[200px] max-w-[200px] justify-between"
                        >
                          <span className="truncate">{selectedProject}</span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <div className="p-3 border-b">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Create new project..."
                              value={newProjectName}
                              onChange={(e) => setNewProjectName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleCreateProject();
                                }
                              }}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-700"
                              onClick={handleCreateProject}
                              disabled={
                                !newProjectName.trim() ||
                                projects.includes(newProjectName.trim())
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="max-h-[200px] scroll-container overflow-y-auto">
                          {projects.length > 0 ? (
                            projects.map((project, index) => (
                              <button
                                key={index}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                                onClick={() => handleSelectProject(project)}
                              >
                                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{project}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              No projects found
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-x-5">
              {/* Send via Email Button */}
              <Button
                onClick={() => setShowEmailPopOver(true)}
                className="h-10 shadow hover:opacity-90 active:scale-95 focus-visible:ring-[#405cf5] bg-[#405cf5] hover:bg-[#405cf5] text-white ease-in-out transition-all duration-300 text-sm"
              >
                <Mail className="h-4 w-4" />
                Send via Email
              </Button>

              {/* Assign RIF Popover */}
              <Popover open={openRIFPopOver} onOpenChange={setOpenRIFPopOver}>
                <PopoverTrigger asChild>
                  <Button className="h-10 shadow hover:opacity-90 active:scale-95 focus-visible:ring-[#405cf5] bg-[#405cf5] hover:bg-[#405cf5] text-white ease-in-out transition-all duration-300 text-sm">
                    {selectedRIF.length === 0 && <UserPlus className="h-4 w-4 mr-2" />}
                    {selectedRIF.length > 0 ? `Assigned: ${selectedRIF}` : "Assign RIF"}
                    {selectedRIF.length === 0 && (
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search employees..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No employee found.</CommandEmpty>
                      <CommandGroup heading="Available Employees">
                        {assignUser.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={option.fullName}
                            onSelect={(currentValue) => {
                              setSelectedRIF(
                                currentValue.fullName === selectedRIF ? "" : option.fullName
                              );
                              setOpenRIFPopOver(false);
                            }}
                            className="flex items-center justify-between p-3 cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{option.fullName}</span>
                            </div>
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedRIF === option.fullName ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    {selectedRIF && (
                      <div className="border-t p-3 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Currently assigned to:{" "}
                            <span className="font-medium">{selectedRIF}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRIF("");
                              setOpenRIFPopOver(false);
                            }}
                            className="text-xs h-6 px-2"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>

              {/* More Options Popover */}
              <div>
                <Popover open={showButtonsPopOver} onOpenChange={setSHowButtonPopOver}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-auto px-3 border-gray-400 border-1 hover:bg-gray-100 bg-transparent"
                    >
                      Generate Report...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2 mb-2 ml-40" align="right">
                    <div className="grid gap-1">
                      <Button
                        variant="ghost"
                        onClick={() => handleDownloadFile("Request_for_Information")}
                        className="justify-start gap-y-2 gap-x-3 h-auto p-3"
                      >
                        <FileText className="h-4 text-blue-700 w-4" />
                        Full Report
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDownloadFile("RFI_Summary")}
                        className="justify-start gap-y-2 gap-x-3 h-auto p-3"
                      >
                        <FileBarChart className="h-4 text-blue-700 w-4" />
                        Summary Report
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDownloadFile("Category_Report")}
                        className="justify-start gap-y-2 gap-x-3 h-auto p-3"
                      >
                        <ChartBarStacked className="h-4 text-blue-700 w-4" />
                        Category Report
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDownloadFile("Risk_Report")}
                        className="justify-start gap-y-2 gap-x-3 h-auto p-3"
                      >
                        <ChartPie className="h-4 text-blue-700 w-4" />
                        Risk Report
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AviationSearchResults;
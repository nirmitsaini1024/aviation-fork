import { useContext, useState, useRef, useEffect } from "react";
import {
  assignUser,
  chartImage,
  chartImageSecond,
  existingProjects,
  mockExternalAnswers,
  selectedAnswerOption,
  tabelContentFirst,
  tabelContentSecond,
} from "../mock-data/constant";
import { RequestInfoContext } from "../context/RequestInfoContext";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  CircleCheckBig,
  Copy,
  Database,
  Download,
  Edit3,
  File,
  Loader2,
  Mail,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Sparkles,
  UserRoundPen,
  ChevronRight,
  Globe,
  LineChart,
  BarChart,
  AlarmCheck,
  Shield,
  FileCheck,
  ChevronLeft,
  Brain,
  X,
  UserPlus,
  ChevronsUpDown,
  Check,
  CircleX,
  ChartBarStacked,
  ChevronDown,
  Menu,
  FolderOpen,
  EllipsisVertical,
  Award,
  SquareDashedBottomCode,
  FileText,
  Trash,
  Trash2,
  EllipsisVerticalIcon,
  Bot,
  ChartPie,
  AlertTriangle,
  ChevronUp,
  MoreHorizontal,
  FileBarChart,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import DownloadMessageAsHtml from "../utils/DownloadTextAsPdf";
import ReadOnlyEditor from "./ReadOnlyTipTap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TipTap from "./TipTapEditor";
import CustomQuestion from "./CustomQuestion";
import {
  formatExternalAnswers,
  formatExternalAnswersAsPlainText,
  formatExternalAnswersInHTML,
} from "../hooks/useFormatExternalAnswers";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSearchAgainInternalQuestion } from "../hooks/useSearch";
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
import EmailSender from "./SendEmail";
import AIHints from "./AIHints";

import CustomTable from "./CustomTable";
import BadgePopover from "./BadgePopover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgentAndDocGenRemoverFromQuestion } from "../hooks/usehandleDocAgent";
import BadgePopoverDocGen from "./BadgePopOverDocGen";
import useSaveRfi from "../hooks/useSaveRfi";
import { useLocation } from "react-router-dom";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";

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
  const [filteredResults, setFilteredResults] = useState([]);
  const [randomMockExternalAnswers, setRandomExternalAnswer] = useState([]);
  const [searchQuestions, setSearchQuestions] = useState("");
  const [searchAgainLoading, setSearchAgainLoading] = useState(false);
  const [savedDoc, setSavedDoc] = useState([]);
  const leftPanelScrollRef = useRef(null);
  const [copiedFileContent, setCopiedFileContent] = useState(null);
  const timeOutRef = useRef(null);
  const [saveExternalInformation, setSaveExternalInformation] = useState(false);
  const copiedFileContentRef = useRef(null);
  const [showCustomQuestionDialog, setCustomQuestionDialog] = useState(false);
  const [onlyIncludeCustomQuestion, setOnlyIncludeCustomQUestion] =
    useState(false);
  const [excludeCustomQuestion, setExcludeCustomQuestion] = useState(false);
  const [changeExternalSourceData, setChangeExternalSourceData] =
    useState(null);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showLeftPanel, setSHowLeftPanel] = useState(true);
  const [showAIHintTextArea, setShowAIHintTextArea] = useState(false);
  const [aiHintText, setAIHintText] = useState("");
  const [showLoadingAFterAddHints, setShowLoadingAfterAddHints] =
    useState(false);
  const [selectedRIF, setSelectedRIF] = useState("");
  const [openRIFPopOver, setOpenRIFPopOver] = useState(false);
  const [showEmailPopOver, setShowEmailPopOver] = useState(false);
  const [isCopiedExternalInformation, setIsCopiedExternalInformation] =
    useState(false);
  const [showAIHintTextAreaForExternal, setSHowAIHintTextAreaForExternal] =
    useState(false);
  const [aiHintTextExternal, setAIHintTextExternal] = useState("");
  const [saveChartInternal, setSaveChartInternal] = useState(false);
  const [
    showLoadingAFterAddHintsExternal,
    setShowLoadingAfterAddHintsExternal,
  ] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("Select a project");
  const [newProjectName, setNewProjectName] = useState("");
  const [projects, setProjects] = useState(existingProjects);
  const [openDeletePopOver, setOpenDeletePopOver] = useState(null);
  const [IscomeFromRFIDetails, setIsComeFromRFIDetails] = useState(false);
  const [showRiskANalysis, setShowRiskAnalysis] = useState(null);
  const [showButtonsPopOver, setSHowButtonPopOver] = useState(false);
  const [loaderForRiskCalCulate, setLoaderForRiskCalculate] = useState(true);

  useEffect(() => {
    if (location.state?.searchResults) {
      setSearchResults(location.state.searchResults);
      setRfiName(location.state.rfiName);
      setNewProjectName(location.state.rfiProject);
      setSelectedProject(location.state.rfiProject);
      setIsComeFromRFIDetails(true);
    }
  }, [location.state, setSearchResults]);

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

  useEffect(() => {}, [selectedRIF]);

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
      const getExternalAnswersInHTML =
        formatExternalAnswersInHTML(randomAnswers);
      const getExternalAnswerAsPlainText =
        formatExternalAnswersAsPlainText(randomAnswers);
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

  useEffect(() => {
    handleExternalAnswer();

    return () => {
      clearTimeout(timeOutRef.current);
    };
  }, []);

  useEffect(() => {
    if (searchResults.length === 0) return;
    let results = searchResults;

    // Apply search filter first if there's a search query
    if (searchQuestions.length > 0) {
      results = searchResults.filter((data) =>
        [
          data.template,
          data.domain,
          data.question,
          data.title,
          data.category,
        ].some((field) =>
          field?.toLowerCase().includes(searchQuestions.toLowerCase())
        )
      );
    }

    // Then apply checkbox filters
    if (onlyIncludeCustomQuestion) {
      results = results.filter((item) => item.customAnswers === true);
    } else if (excludeCustomQuestion) {
      results = results.filter((item) => item.customAnswers !== true);
    }

    setFilteredResults(results);
  }, [
    searchResults,
    searchQuestions,
    onlyIncludeCustomQuestion,
    excludeCustomQuestion,
  ]);

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
        // Group external results separately
        if (!acc["External Sources"]) {
          acc["External Sources"] = [];
        }
        acc["External Sources"].push(result);
      }
      return acc;
    }, {});

  const handleViewDocument = () => {
    window.open("/refdoc", "_blank");
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
    const isDocAvailable = savedDoc.findIndex(
      (item) => item.documentName === fileName
    );
    if (isDocAvailable === -1) {
      setSavedDoc((prev) => [...prev, { documentName: fileName }]);
    } else {
      setSavedDoc((prev) =>
        prev.filter((item) => item.documentName !== fileName)
      );
    }
  };

  const handleDownloadExternalText = async () => {
    console.log(randomMockExternalAnswers);
    const questionSection = `
    <div style="
      margin-bottom: 40px;
      padding: 16px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
      page-break-inside: avoid;
    ">
     
      <p style="
        color: #1e40af;
        font-size: 19px;
        line-height: 1.5;
        margin: 0;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        ${selectedResult.question}
      </p>
    </div>
  `;

    const formattedContent =
      questionSection + externalInformationForTipTap.html;

    console.log(formattedContent);

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
    console.log("The answer is: ", answer);
    console.log("The doucment name is: ", documentName);
    console.log("The selected question is: ", selectedResult);

    setSelectedResult((prev) => {
      return {
        ...prev,
        answers: prev.answers.filter((ans) => ans.answer !== answer),
      };
    });

    setSearchResults((prev) => {
      return prev.map((item) => {
        if (item.id === selectedResult.id) {
          return {
            ...item,
            answers: item.answers.filter((ans) => ans.answer !== answer),
          };
        }
        return item;
      });
    });

    setOpenDeletePopOver(null);
  };

  const handleChangeAnswerFormat = async (id, type) => {
    await setSearchResults((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, answerFormat: type };
          return updatedItem;
        }
        return item;
      });
    });

    setFilteredResults((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, answerFormat: type };
          return updatedItem;
        }
        return item;
      });
    });

    setSelectedResult((prev) => ({
      ...prev,
      answerFormat: type,
    }));
  };

  const renderLeftPanel = () => (
    <div className={`w-full  flex flex-col gap-y-9 h-full`}>
      <div className="h-20 mb-2">
        <div className="flex  items-center mb-4">
          <h3 className="text-lg flex-1 h-full relative font-semibold pr-4 text-slate-900   flex items-center gap-2">
            <UserRoundPen className="h-5 w-5 absolute text-blue-600 ml-2" />
            <Input
              value={searchQuestions}
              placeholder="Search Questions..."
              className="pl-10 h-12 border-slate-400 rounded-lg border"
              onChange={(e) => setSearchQuestions(e.target.value)}
            />
          </h3>
          <div>
            {(Object.keys(groupedResults).length > 0 ||
              searchResults.length > 0) && (
              <Button
                variant="outline"
                onClick={() =>
                  setCustomQuestionDialog(!showCustomQuestionDialog)
                }
                className="h-12 bg-blue-500  hover:bg-blue-600 ease-in-out transition-all duration-300 text-white shadow-lg text-sm  hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add Custom Question
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-x-5">
          <div className="flex items-center gap-2">
            <Checkbox
              id="excludeCustomQuestions"
              checked={excludeCustomQuestion}
              onCheckedChange={() => {
                setExcludeCustomQuestion(!excludeCustomQuestion);
                // If turning on exclude, turn off include
                if (!excludeCustomQuestion && onlyIncludeCustomQuestion) {
                  setOnlyIncludeCustomQUestion(false);
                }
              }}
              className="border-black"
            />
            <Label htmlFor="excludeCustomQuestions" className="font-medium">
              Exclude Custom Questions
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="includeCustomQuestions"
              checked={onlyIncludeCustomQuestion}
              onCheckedChange={() => {
                setOnlyIncludeCustomQUestion(!onlyIncludeCustomQuestion);
                // If turning on include, turn off exclude
                if (!onlyIncludeCustomQuestion && excludeCustomQuestion) {
                  setExcludeCustomQuestion(false);
                }
              }}
              className="border-black"
            />
            <Label htmlFor="includeCustomQuestions" className="font-medium">
              Only Include Custom Questions
            </Label>
          </div>
        </div>
      </div>

      <div
        ref={leftPanelScrollRef}
        className="flex-1 scroll-container overflow-y-auto pr-2 space-y-4 min-h-0"
      >
        {Object.keys(groupedResults).length === 0 ||
        (searchQuestions.length > 0 && filteredResults.length === 0) ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center flex flex-col justify-center items-center py-8 text-slate-500">
              <UserRoundPen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">No questions found</p>
              <p className="text-sm">
                Try adjusting your keywords or clear the search to see all
                results
              </p>
            </div>
          </div>
        ) : (
          <Accordion
            type="multiple"
            className="w-full  space-y-7"
            style={{ minHeight: `calc(100% + 150px)` }}
          >
            {Object.entries(groupedResults).map(([category, results]) => (
              <AccordionItem
                key={category}
                value={category}
                className={`border rounded-lg border-b-[1px] border-gray-400 ${getCategoryColor(
                  category
                )}`}
              >
                <AccordionTrigger className="px-4 border-b-[1px] border-gray-400 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-x-3">
                        <h4 className="font-semibold text-slate-900">
                          {category}
                        </h4>
                        {results.some(
                          (item) => item.customAnswers === true
                        ) && (
                          <Badge className="bg-blue-600">
                            Includes Custom Questions
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        {results.length} question
                        {results.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 mt-5 ">
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <Card
                        key={result.id}
                        data-question-card
                        className={`p-4 cursor-pointer transition-all duration-300 border-slate-200/60 ${
                          selectedResult?.id === result.id
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md"
                            : "bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-lg"
                        }`}
                        onClick={() => {
                          handleResultSelect(result);
                          setShowInternalResourceAnswerInTipTap({
                            originalAnswer: "",
                            markdownAnswer: "",
                          });
                          if (changeExternalSourceData !== result.id) {
                            handleExternalAnswer();
                            setChangeExternalSourceData(result.id);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3 relative">
                          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {result.type === "internal"
                                  ? result.domain
                                  : "External"}
                              </Badge>
                              {result.type === "internal" && (
                                <Badge variant="secondary" className="text-xs">
                                  {result.template}
                                </Badge>
                              )}

                              {result.customAnswers && (
                                <Badge className="bg-blue-600">
                                  Custom Added Question
                                </Badge>
                              )}
                            </div>

                            <h4 className="text-md font-semibold text-slate-900 mb-1">
                              {result.type === "internal"
                                ? result.question
                                : result.title}
                            </h4>

                            <div className="flex items-center gap-x-4 mt-2">
                              <Badge
                                variant="secondary"
                                className="text-xs border border-blue-500 bg-blue-200 px-3"
                              >
                                {result.answerFormat}
                              </Badge>
                              {result.agents.length > 0 && (
                                <BadgePopover
                                  notifications={result.agents}
                                  name={"Agents"}
                                  icon={
                                    <SquareDashedBottomCode className="w-3 h-3 font-semibold text-blue-500" />
                                  }
                                  onRemove={removeAgents}
                                />
                              )}
                              {/* docGenTemplate */}
                              {result.docGen.length > 0 && (
                                <BadgePopoverDocGen
                                  selectedTemplates={result.docGen}
                                  onRemoveType={handleRemoveType}
                                  onRemoveTemplate={handleRemoveTemplate}
                                  onClearAll={handleClearAll}
                                />
                              )}
                              <p className="text-xs text-slate-600">
                                {result.type === "internal"
                                  ? `${result.answers.length} answer${
                                      result.answers.length !== 1 ? "s" : ""
                                    } available`
                                  : `From: ${result.source}`}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <EllipsisVerticalIcon className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                              {selectedAnswerOption.map((option, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onClick={() => {
                                    handleChangeAnswerFormat(
                                      result.id,
                                      option.text
                                    );
                                    groupedResults();
                                  }}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <option.icon className="h-4 w-4" />
                                  {option.text}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {selectedResult?.id === result.id && (
                            <div className="w-2 h-2 absolute -right-2 -top-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );

  const renderRightPanel = () => {
    const riskScore = Math.floor(Math.random() * 100);
    const getRiskLevel = (score) => {
      if (score < 30)
        return {
          level: "Low",
          color: "bg-green-100 text-green-800 border-green-200",
        };
      if (score < 70)
        return {
          level: "Medium",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      return { level: "High", color: "bg-red-100 text-red-800 border-red-200" };
    };

    const risk = getRiskLevel(riskScore);
    if (!selectedResult) {
      return (
        <div className={`w-full flex h-full items-center justify-center`}>
          <div className="text-center text-slate-500">
            <Search className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-medium">Choose an authored result</p>
            <p className="text-sm">
              Choose a result from the left panel to view details
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            {selectedResult.type === "internal"
              ? "Information About"
              : "External Source"}
          </h3>
          <div className="flex justify-between">
            <p className="text-slate-700 font-medium">
              {selectedResult.type === "internal"
                ? selectedResult.question
                : selectedResult.title}
            </p>
            {showAIHintTextArea === true && (
              <Badge
                variant="secondary"
                onClick={searchAgainInternalQues}
                className="bg-blue-300 select-none mr-[3%] transition-all hover:cursor-pointer  duration-300 ease-in-out hover:bg-blue-400 "
              >
                <RefreshCcw
                  className={`transition-all duration-300 ease-in-out`}
                />
                <span>Search Again</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scroll-container pr-2 space-y-6 min-h-0">
          {selectedResult.type === "internal" ? (
            <>
              <div className="ml-3">
                <AIHints
                  showAIHintTextArea={showAIHintTextArea}
                  setAIHintText={setAIHintText}
                  aiHintText={aiHintText}
                  setShowAIHintTextArea={setShowAIHintTextArea}
                  setShowLoadingAfterAddHints={setShowLoadingAfterAddHints}
                  searchAgainInternalQues={searchAgainInternalQues}
                  type="internal"
                />
              </div>
              {/* Primary Answers */}
              <div>
                {isEditInternalANswer === false && (
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="text-md flex gap-x-2 items-center font-semibold text-slate-900">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Internal Source Response
                    </h4>
                    {(selectedResult.answerFormat === "Chart" ||
                      selectedResult.answerFormat === "Table") && (
                      <div className="text-gray-600 flex gap-x-4 items-center">
                        <Badge
                          variant="secondary"
                          onClick={() => handleDownloadFile("Chart")}
                          className=" text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 rounded-lg group scale-105"
                        >
                          <Download className="h-4 w-4 group-hover:animate-bounce" />
                        </Badge>

                        {saveChartInternal ? (
                          <Badge
                            onClick={() =>
                              setSaveChartInternal(!saveChartInternal)
                            }
                            className="bg-green-500/20 backdrop-blur-md border border-white/20 text-green-900 hover:bg-green-500/30 px-3 py-1.5 transition-all duration-300 cursor-pointer"
                          >
                            <Database className="h-4 w-4 mr-1" />
                            <span>Saved</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            onClick={() =>
                              setSaveChartInternal(!saveChartInternal)
                            }
                            className="bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200 cursor-pointer gap-2 px-3 py-1.5 font-medium"
                          >
                            {" "}
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {showLoadingAFterAddHints === false ? (
                  <div
                    className={`${
                      isEditInternalANswer === false && "space-y-4"
                    }`}
                  >
                    {isEditInternalANswer === true && (
                      <div className="w-full flex mr-10 justify-end">
                        <CircleX
                          className="text-red-500 w-5 h-5 text-end"
                          onClick={() => {
                            setIsEditInternalAnswer(false);
                          }}
                        />
                      </div>
                    )}
                    {selectedResult.answerFormat === "Text" ? (
                      <>
                        {selectedResult.answers.map((answerItem, index) => (
                          <>
                            <Card
                              key={index}
                              className={`p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-400 shadow-sm ${
                                isEditInternalANswer === true &&
                                showInternalResourceAnswerInTipTap.originalAnswer !==
                                  answerItem.answer &&
                                "opacity-0"
                              }`}
                            >
                              {isEditInternalANswer === false && (
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm flex items-center gap-x-2 font-semibold text-blue-600">
                                    {answerItem.documentName === "API Agent" ||
                                    answerItem.documentName === "Web Agent" ||
                                    answerItem.documentName === "SQL Agent" ? (
                                      <Badge className="bg-blue-600 px-2 py-1">
                                        {answerItem.documentName}
                                      </Badge>
                                    ) : (
                                      <>
                                        <File className="h-5 w-5" />{" "}
                                        <span
                                          onClick={handleViewDocument}
                                          className="hover:underline hover:cursor-pointer"
                                        >
                                          {answerItem.documentName}
                                        </span>
                                      </>
                                    )}
                                    <div className="text-gray-600 flex gap-x-0.5 items-center">
                                      <Badge
                                        variant="secondary"
                                        className=" text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 rounded-lg group scale-105"
                                        onClick={() => setIsBotOpen(!isBotOpen)}
                                      >
                                        <Bot className="h-4 w-4 group-hover:animate-bounce" />
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        onClick={() =>
                                          handleDownloadFile(
                                            answerItem.documentName
                                          )
                                        }
                                        className=" text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 rounded-lg group scale-105"
                                        title={`Download ${answerItem.documentName}`}
                                      >
                                        <Download className="h-4 w-4 group-hover:animate-bounce" />
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            answerItem.answer
                                          );
                                          setCopiedFileContent(
                                            answerItem.documentName
                                          );
                                        }}
                                        className=" text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 rounded-lg group scale-105"
                                        title={`Copy ${answerItem.documentName}`}
                                      >
                                        {copiedFileContent ===
                                        answerItem.documentName ? (
                                          <CircleCheckBig className="h-4 w-4" />
                                        ) : (
                                          <Copy className="h-4 w-4 group-hover:animate-bounce" />
                                        )}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-50 mr-1 hover:bg-blue-100 border-blue-200 hover:border-blue-300 select-none text-blue-700 hover:text-blue-800 transition-all duration-200 cursor-pointer gap-2 px-3 py-1.5 font-medium"
                                        onClick={() => {
                                          if (
                                            showInternalResourceAnswerInTipTap.originalAnswer !=
                                            answerItem.answer
                                          ) {
                                            setShowInternalResourceAnswerInTipTap(
                                              {
                                                originalAnswer:
                                                  answerItem.answer,
                                                markdownAnswer:
                                                  answerItem.answer,
                                              }
                                            );
                                          }
                                          setIsEditInternalAnswer(true);
                                        }}
                                      >
                                        <Edit3 className="h-4 w-4" />
                                        <span>Edit</span>
                                      </Badge>
                                      {savedDoc.some(
                                        (item) =>
                                          item.documentName ===
                                          answerItem.documentName
                                      ) ? (
                                        <Badge
                                          onClick={() =>
                                            handleSavedDoc(
                                              answerItem.documentName
                                            )
                                          }
                                          className="bg-green-500/20 backdrop-blur-md border border-white/20 text-green-900 hover:bg-green-500/30 px-3 py-1.5 transition-all duration-300 cursor-pointer"
                                        >
                                          <Database className="h-4 w-4 mr-1" />
                                          <span>Saved</span>
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          onClick={() =>
                                            handleSavedDoc(
                                              answerItem.documentName
                                            )
                                          }
                                          className="bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200 cursor-pointer gap-2 px-3 py-1.5 font-medium"
                                        >
                                          {" "}
                                          <Save className="h-4 w-4" />
                                          <span>Save</span>
                                        </Badge>
                                      )}
                                      <div className="">
                                        <CircleX
                                          className="h-4 w-4 ml-3 text-red-600"
                                          onClick={() =>
                                            setOpenDeletePopOver(
                                              answerItem.answer
                                            )
                                          }
                                        />

                                        {/* Full Screen Modal */}
                                        {openDeletePopOver ===
                                          answerItem.answer && (
                                          <div className="fixed inset-0 z-50 flex items-center justify-center">
                                            {/* Blurred Background Overlay */}
                                            <div
                                              className="absolute inset-0 bg-black/30"
                                              onClick={() =>
                                                setOpenDeletePopOver(
                                                  answerItem.answer
                                                )
                                              }
                                            />

                                            {/* Confirmation Card */}
                                            <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl">
                                              <CardHeader className="text-center">
                                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                                  <CircleX className="h-6 w-6 text-red-600" />
                                                </div>
                                                <CardTitle className="text-xl">
                                                  Confirm Delete
                                                </CardTitle>
                                                <CardDescription>
                                                  Are you sure you want to
                                                  delete this answer? This
                                                  action cannot be undone.
                                                </CardDescription>
                                              </CardHeader>
                                              <CardFooter className="flex gap-3 justify-end">
                                                <Button
                                                  variant="outline"
                                                  onClick={() =>
                                                    setOpenDeletePopOver(null)
                                                  }
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  variant="destructive"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAnswer(
                                                      answerItem.answer,
                                                      answerItem.documentName
                                                    );
                                                  }}
                                                >
                                                  Delete
                                                </Button>
                                              </CardFooter>
                                            </Card>
                                          </div>
                                        )}
                                      </div>
                                      <div className="ml-3">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setShowRiskAnalysis(
                                              showRiskANalysis ===
                                                answerItem.answer
                                                ? null
                                                : answerItem.answer
                                            );
                                            loaderForRiskCalCulate === false
                                              ? setLoaderForRiskCalculate(true)
                                              : setTimeout(() => {
                                                  setLoaderForRiskCalculate(
                                                    false
                                                  );
                                                }, 1000);
                                          }}
                                          className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
                                        >
                                          <ChartPie className="w-3 h-3" />
                                          Calculate Risk
                                          {showRiskANalysis ===
                                          answerItem.answer ? (
                                            <ChevronUp className="w-4 h-4 ml-2" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 ml-2" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </span>
                                </div>
                              )}

                              <div className="ml-9">
                                {isEditInternalANswer ? (
                                  // In edit mode: show TipTap only if answer matches
                                  showInternalResourceAnswerInTipTap.originalAnswer ===
                                  answerItem.answer ? (
                                    <TipTap
                                      answers={
                                        showInternalResourceAnswerInTipTap.markdownAnswer
                                      }
                                      type="internal"
                                    />
                                  ) : null
                                ) : // Not in edit mode: show ReadOnlyEditor or plain text
                                showInternalResourceAnswerInTipTap.originalAnswer ===
                                  answerItem.answer ? (
                                  <ReadOnlyEditor
                                    externalAnswers={
                                      showInternalResourceAnswerInTipTap.markdownAnswer
                                    }
                                    type="internal"
                                  />
                                ) : (
                                  <p className="text-slate-700 leading-relaxed text-sm">
                                    {answerItem.answer}
                                  </p>
                                )}
                              </div>
                            </Card>
                            {showRiskANalysis === answerItem.answer && (
                              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                                {loaderForRiskCalCulate ? (
                                  <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                    <span className="ml-2 text-sm text-slate-500">
                                      Please wait, Calculating Risk...
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                                        <ChartPie className="w-4 h-4 mr-2 text-amber-600" />
                                        Risk Summary
                                      </h4>
                                      <p className="text-slate-600 text-sm leading-relaxed mb-3">
                                        This recommendation carries a{" "}
                                        {risk.level.toLowerCase()} risk profile
                                        based on market volatility, asset
                                        correlation, and historical performance
                                        data.
                                      </p>
                                    </div>
                                    <div className="flex justify-end items-center gap-2">
                                      <span className="text-xs flex gap-x-2">
                                        <RefreshCcw onClick={() => {
                                            setLoaderForRiskCalculate(true);
                                            setTimeout(() => {
                                                  setLoaderForRiskCalculate(
                                                    false
                                                  );
                                                }, 1000); 
                                          }} className="w-4 h-4 text-blue-600" />Risk Score
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className={`rounded-full font-semibold ${risk.color}`}
                                      >
                                        {riskScore}
                                        <span className="text-xs text-slate-500 font-medium">
                                          {risk.level} Risk
                                        </span>
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        ))}
                      </>
                    ) : (
                      <Card className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-400 shadow-sm">
                        {selectedResult.answerFormat === "Chart" ? (
                          <img
                            src={chartImage}
                            alt="chart"
                            className="w-full h-full"
                          />
                        ) : (
                          <CustomTable tabelDataFirst={tabelContentFirst} />
                        )}
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-[400px] flex items-center justify-center bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 border-2 rounded-lg shadow-md transition-all duration-300">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                )}
              </div>

              {/* External Sources */}
              <div>
                <div className="flex items-center justify-between gap-y-2 gap-x-4 mb-4">
                  <div className="flex items-center gap-x-3">
                    <h4 className="text-md flex gap-x-2 items-center font-semibold text-slate-900">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      External Source Response
                    </h4>
                    <div className="text-gray-600 flex gap-x-0.5 items-center">
                      <Badge
                        variant="secondary"
                        className=" text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 mr-2 rounded-lg group scale-105"
                        onClick={() => setIsBotOpen(!isBotOpen)}
                      >
                        <Bot className="h-4 w-4 group-hover:animate-bounce" />
                      </Badge>
                      <Badge
                        variant="secondary"
                        className=" text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 mr-2 rounded-lg group scale-105"
                        onClick={handleDownloadExternalText}
                      >
                        <Download className="h-4 w-4 group-hover:animate-bounce" />
                      </Badge>
                      {selectedResult.answerFormat === "Text" && (
                        <Badge
                          variant="secondary"
                          className=" text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 mr-2 rounded-lg group scale-105"
                          title={`Copy`}
                          onClick={handleCopyExternalSources}
                        >
                          {isCopiedExternalInformation === true ? (
                            <CircleCheckBig className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4 group-hover:animate-bounce" />
                          )}
                        </Badge>
                      )}
                      {selectedResult.answerFormat === "Text" && (
                        <Badge
                          onClick={() =>
                            setEditExternalResource(!editExternalResurce)
                          }
                          variant="outline"
                          className="bg-blue-50 mr-1 hover:bg-blue-100 border-blue-200 hover:border-blue-300 select-none text-blue-700 hover:text-blue-800 transition-all duration-200 cursor-pointer gap-2 px-3 py-1.5 font-medium"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Edit</span>
                        </Badge>
                      )}
                      <Badge
                        onClick={() =>
                          setSaveExternalInformation(!saveExternalInformation)
                        }
                        className={`transition-all duration-200 cursor-pointer gap-2 px-3 py-1.5 font-medium ${
                          saveExternalInformation
                            ? "bg-green-500/20 backdrop-blur-md border border-white/20 text-green-900 hover:bg-green-500/30 px-3 py-1.5"
                            : "bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
                        }`}
                      >
                        {saveExternalInformation ? (
                          <Database className="h-4 w-4 mr-1" />
                        ) : (
                          <Save className="w-4 h-4 mr-1" />
                        )}
                        <span>
                          {saveExternalInformation ? "Saved" : "Save"}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  {showAIHintTextAreaForExternal && (
                    <Badge
                      variant="secondary"
                      onClick={handleExternalAnswer}
                      className="bg-blue-300 select-none mr-[3%] transition-all hover:cursor-pointer  duration-300 ease-in-out hover:bg-blue-400 "
                    >
                      <RefreshCcw
                        className={`transition-all duration-300 ease-in-out ${
                          searchAgainLoading ? "animate-spin" : ""
                        }`}
                      />
                      <span>Search Again</span>
                    </Badge>
                  )}
                </div>

                <div className="ml-3">
                  <AIHints
                    showAIHintTextArea={showAIHintTextAreaForExternal}
                    setAIHintText={setAIHintTextExternal}
                    aiHintText={aiHintTextExternal}
                    setShowAIHintTextArea={setSHowAIHintTextAreaForExternal}
                    setShowLoadingAfterAddHints={
                      setShowLoadingAfterAddHintsExternal
                    }
                    searchAgainInternalQues={handleExternalAnswer}
                    type="external"
                  />
                </div>
                {selectedResult.answerFormat === "Text" && (
                  <div className="space-y-3 bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 border-2 rounded-lg shadow-md transition-all duration-300">
                    {showLoadingAFterAddHintsExternal === false ? (
                      <>
                        {randomMockExternalAnswers.length > 0 && (
                          <div>
                            {editExternalResurce ? (
                              <TipTap
                                answers={externalInformationForTipTap.markdown}
                                type="external"
                              />
                            ) : (
                              <ReadOnlyEditor
                                externalAnswers={
                                  externalInformationForTipTap.markdown
                                }
                              />
                            )}
                          </div>
                        )}
                        {randomMockExternalAnswers.length > 0 &&
                          randomMockExternalAnswers.map((answer, index) => (
                            <Card
                              key={index}
                              className="p-4 hidden border-none shadow-none bg-gradient-to-br from-slate-50 to-slate-100"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-slate-900 text-sm">
                                  {answer.title}
                                </h5>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {answer.content}
                              </p>
                            </Card>
                          ))}
                      </>
                    ) : (
                      <div className="w-full h-[400px] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>
                )}

                {selectedResult.answerFormat === "Chart" && (
                  <div>
                    <img
                      src={chartImageSecond}
                      alt="chart"
                      className="w-full h-full"
                    />
                  </div>
                )}

                {selectedResult.answerFormat === "Table" && (
                  <CustomTable tabelDataFirst={tabelContentSecond} />
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  };

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
      {/* Split Panel Layout */}

      <div className="absolute">
        {showEmailPopOver && (
          <EmailSender open={showEmailPopOver} setOpen={setShowEmailPopOver} />
        )}
      </div>
      <div className="flex-1 flex gap-6 mb-10 px-6 pb-6 min-h-0">
        {showLeftPanel && (
          <div
            className={`${
              showRightPanel ? "w-[40%]" : "w-full"
            } duration-300 ease-in-out transition-all`}
          >
            {renderLeftPanel()}
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
              title="Expand right panel"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>

            <button
              onClick={() => handlePanels("right")}
              className={`hover:cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 p-1.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-20 ${
                !showLeftPanel && showRightPanel && "opacity-0"
              }`}
              title="Expand right panel"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        {showRightPanel && (
          <div
            className={`${
              showLeftPanel ? "w-[60%]" : "w-full"
            } duration-100 transition-all ease-in-out`}
          >
            {renderRightPanel()}
          </div>
        )}
        <div>
          {showCustomQuestionDialog && (
            <CustomQuestion
              open={showCustomQuestionDialog}
              setOpen={setCustomQuestionDialog}
            />
          )}
        </div>

        <div className="fixed bottom-0 w-[90%] bg-white border-t border-slate-200 py-4">
          <div className="w-full flex gap-x-14 items-center">
            <div className="w-[40%]">
              {(Object.keys(groupedResults).length > 0 ||
                searchResults.length > 0) && (
                <div className="flex items-center gap-x-4">
                  <div className="relative w-full border border-gray-400 rounded-md">
                    <Input
                      value={rfiName}
                      onChange={(e) => setRfiName(e.target.value)}
                      placeholder="Enter RFI name..."
                      className="pr-20" // Add padding to prevent text overlap with button
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
                              onChange={(e) =>
                                setNewProjectName(e.target.value)
                              }
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
                className="h-10  shadow hover:opacity-90 active:scale-95 focus-visible:ring-[#405cf5] bg-[#405cf5] hover:bg-[#405cf5] text-white ease-in-out transition-all duration-300  text-sm"
              >
                <Mail className="h-4 w-4 " />
                Send via Email
              </Button>

              {/* Assign RIF Popover */}
              <Popover open={openRIFPopOver} onOpenChange={setOpenRIFPopOver}>
                <PopoverTrigger asChild>
                  <Button className="h-10  shadow hover:opacity-90 active:scale-95 focus-visible:ring-[#405cf5] bg-[#405cf5] hover:bg-[#405cf5] text-white ease-in-out transition-all duration-300  text-sm">
                    {selectedRIF.length === 0 && (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    {selectedRIF.length > 0
                      ? `Assigned: ${selectedRIF}`
                      : "Assign RIF"}
                    {selectedRIF.length === 0 && (
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search employees..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No employee found.</CommandEmpty>
                      <CommandGroup heading="Available Employees">
                        {assignUser.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={option.fullName}
                            onSelect={(currentValue) => {
                              setSelectedRIF(
                                currentValue.fullName === selectedRIF
                                  ? ""
                                  : option.fullName
                              );
                              setOpenRIFPopOver(false);
                            }}
                            className="flex items-center justify-between p-3 cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {option.fullName}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedRIF === option.fullName
                                  ? "opacity-100"
                                  : "opacity-0"
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
              <div>
                <Popover
                  open={showButtonsPopOver}
                  onOpenChange={setSHowButtonPopOver}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0 hover:bg-gray-100 bg-transparent"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2 mb-2 ml-40" align="right">
                    <div className="grid gap-1">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleDownloadFile("Request_for_Information")
                        }
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

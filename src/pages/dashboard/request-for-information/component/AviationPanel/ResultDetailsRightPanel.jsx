import { useContext } from "react";
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
  RefreshCcw,
  Save,
  Search,
  Sparkles,
  CircleX,
  Bot,
  ChartPie,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";
import DownloadMessageAsHtml from "../../utils/DownloadTextAsPdf";
import ReadOnlyEditor from "../ReadOnlyTipTap";
import TipTap from "../TipTapEditor";
import AIHints from "../AIHints";
import CustomTable from "../CustomTable";
import { chartImage, chartImageSecond } from "../../mock-data/constant";

const ResultDetailsPanel = ({
  selectedResult,
  showInternalResourceAnswerInTipTap,
  setShowInternalResourceAnswerInTipTap,
  isEditInternalANswer,
  setIsEditInternalAnswer,
  externalInformationForTipTap,
  editExternalResurce,
  setEditExternalResource,
  saveExternalInformation,
  setSaveExternalInformation,
  copiedFileContent,
  setCopiedFileContent,
  savedDoc,
  handleDownloadFile,
  handleSavedDoc,
  randomMockExternalAnswers,
  handleDownloadExternalText,
  handleCopyExternalSources,
  isCopiedExternalInformation,
  showLoadingAFterAddHints,
  setShowLoadingAfterAddHints,
  searchAgainInternalQues,
  showAIHintTextArea,
  setShowAIHintTextArea,
  aiHintText,
  setAIHintText,
  showAIHintTextAreaForExternal,
  setSHowAIHintTextAreaForExternal,
  aiHintTextExternal,
  setAIHintTextExternal,
  showLoadingAFterAddHintsExternal,
  setShowLoadingAfterAddHintsExternal,
  handleExternalAnswer,
  saveChartInternal,
  setSaveChartInternal,
  openDeletePopOver,
  setOpenDeletePopOver,
  handleDeleteAnswer,
  showRiskANalysis,
  setShowRiskAnalysis,
  loaderForRiskCalCulate,
  setLoaderForRiskCalculate,
  tabelContentFirst,
  tabelContentSecond,
  searchAgainLoading,
}) => {
  const { isBotOpen, setIsBotOpen } = useContext(GlobalContext);

  const handleViewDocument = () => {
    window.open("/refdoc", "_blank");
  };

  if (!selectedResult) {
    return (
      <div className="w-full flex h-full items-center justify-center">
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
          {showAIHintTextArea && (
            <Badge
              variant="secondary"
              onClick={searchAgainInternalQues}
              className="bg-blue-300 select-none mr-[3%] transition-all hover:cursor-pointer duration-300 ease-in-out hover:bg-blue-400"
            >
              <RefreshCcw className="transition-all duration-300 ease-in-out" />
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
              {!isEditInternalANswer && (
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
                        className="text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 rounded-lg group scale-105"
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
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!showLoadingAFterAddHints ? (
                <div className={`${!isEditInternalANswer && "space-y-4"}`}>
                  {isEditInternalANswer && (
                    <div className="w-full flex mr-10 justify-end">
                      <CircleX
                        className="text-red-500 w-5 h-5 text-end cursor-pointer"
                        onClick={() => setIsEditInternalAnswer(false)}
                      />
                    </div>
                  )}
                  {selectedResult.answerFormat === "Text" ? (
                    <>
                      {selectedResult.answers?.map((answerItem, index) => (
                        <div key={index}>
                          <Card
                            className={`p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-400 shadow-sm ${
                              isEditInternalANswer &&
                              showInternalResourceAnswerInTipTap.originalAnswer !==
                                answerItem.answer &&
                              "opacity-0"
                            }`}
                          >
                            {!isEditInternalANswer && (
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
                                      <File className="h-5 w-5" />
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
                                      className="text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 rounded-lg group scale-105"
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
                                      className="text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 rounded-lg group scale-105"
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
                                      className="text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 rounded-lg group scale-105"
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
                                          showInternalResourceAnswerInTipTap.originalAnswer !==
                                          answerItem.answer
                                        ) {
                                          setShowInternalResourceAnswerInTipTap(
                                            {
                                              originalAnswer: answerItem.answer,
                                              markdownAnswer: answerItem.answer,
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
                                        <Save className="h-4 w-4" />
                                        <span>Save</span>
                                      </Badge>
                                    )}
                                    <div>
                                      <CircleX
                                        className="h-4 w-4 ml-3 text-red-600 cursor-pointer"
                                        onClick={() =>
                                          setOpenDeletePopOver(
                                            answerItem.answer
                                          )
                                        }
                                      />

                                      {openDeletePopOver ===
                                        answerItem.answer && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                                          <div
                                            className="absolute inset-0 bg-black/30"
                                            onClick={() =>
                                              setOpenDeletePopOver(null)
                                            }
                                          />
                                          <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl">
                                            <CardHeader className="text-center">
                                              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                                <CircleX className="h-6 w-6 text-red-600" />
                                              </div>
                                              <CardTitle className="text-xl">
                                                Confirm Delete
                                              </CardTitle>
                                              <CardDescription>
                                                Are you sure you want to delete
                                                this answer? This action cannot
                                                be undone.
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
                                    {selectedResult.agents.includes("Risk Agent") && (
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
                                            if (
                                              loaderForRiskCalCulate === false
                                            ) {
                                              setLoaderForRiskCalculate(true);
                                            } else {
                                              setTimeout(() => {
                                                setLoaderForRiskCalculate(
                                                  false
                                                );
                                              }, 1000);
                                            }
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
                                    )}
                                  </div>
                                </span>
                              </div>
                            )}

                            <div className="ml-9">
                              {isEditInternalANswer ? (
                                showInternalResourceAnswerInTipTap.originalAnswer ===
                                answerItem.answer ? (
                                  <TipTap
                                    answers={
                                      showInternalResourceAnswerInTipTap.markdownAnswer
                                    }
                                    type="internal"
                                  />
                                ) : null
                              ) : showInternalResourceAnswerInTipTap.originalAnswer ===
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
                                      <RefreshCcw
                                        onClick={() => {
                                          setLoaderForRiskCalculate(true);
                                          setTimeout(() => {
                                            setLoaderForRiskCalculate(false);
                                          }, 1000);
                                        }}
                                        className="w-4 h-4 text-blue-600 cursor-pointer"
                                      />
                                      Risk Score
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
                        </div>
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
                      className="text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 mr-2 rounded-lg group scale-105"
                      onClick={() => setIsBotOpen(!isBotOpen)}
                    >
                      <Bot className="h-4 w-4 group-hover:animate-bounce" />
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 mr-2 rounded-lg group scale-105"
                      onClick={handleDownloadExternalText}
                    >
                      <Download className="h-4 w-4 group-hover:animate-bounce" />
                    </Badge>
                    {selectedResult.answerFormat === "Text" && (
                      <Badge
                        variant="secondary"
                        className="text-gray-600 border-0 transition-all duration-200 cursor-pointer p-2 mr-2 rounded-lg group scale-105"
                        title="Copy"
                        onClick={handleCopyExternalSources}
                      >
                        {isCopiedExternalInformation ? (
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
                      <span>{saveExternalInformation ? "Saved" : "Save"}</span>
                    </Badge>
                  </div>
                </div>
                {showAIHintTextAreaForExternal && (
                  <Badge
                    variant="secondary"
                    onClick={handleExternalAnswer}
                    className="bg-blue-300 select-none mr-[3%] transition-all hover:cursor-pointer duration-300 ease-in-out hover:bg-blue-400"
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
                  {!showLoadingAFterAddHintsExternal ? (
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

export default ResultDetailsPanel;

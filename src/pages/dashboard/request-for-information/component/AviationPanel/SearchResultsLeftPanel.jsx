import { useContext, useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  UserRoundPen,
  SquareDashedBottomCode,
  EllipsisVerticalIcon,
} from "lucide-react";
import {
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomQuestion from "../CustomQuestion";
import BadgePopover from "../BadgePopover";
import BadgePopoverDocGen from "../BadgePopOverDocGen";
import { selectedAnswerOption } from "../../mock-data/constant";

const SearchResultsPanel = ({
  searchResults,
  filteredResults,
  groupedResults,
  selectedResult,
  handleResultSelect,
  searchQuestions,
  setSearchQuestions,
  onlyIncludeCustomQuestion,
  setOnlyIncludeCustomQUestion,
  excludeCustomQuestion,
  setExcludeCustomQuestion,
  handleExternalAnswer,
  setChangeExternalSourceData,
  changeExternalSourceData,
  setShowInternalResourceAnswerInTipTap,
  handleChangeAnswerFormat,
  removeAgents,
  handleRemoveType,
  handleRemoveTemplate,
  handleClearAll,
  getCategoryIcon,
  getCategoryColor,
}) => {
  const [showCustomQuestionDialog, setCustomQuestionDialog] = useState(false);

  return (
    <div className="w-full flex flex-col gap-y-9 h-full">
      <div className="h-20 mb-2">
        <div className="flex items-center mb-4">
          <h3 className="text-lg flex-1 h-full relative font-semibold pr-4 text-slate-900 flex items-center gap-2">
            <UserRoundPen className="h-5 w-5 absolute text-blue-600 ml-2" />
            <Input
              value={searchQuestions}
              placeholder="Search Questions..."
              className="pl-10 h-12 border-slate-400 rounded-lg border"
              onChange={(e) => setSearchQuestions(e.target.value)}
            />
          </h3>
          <div>
            {(Object.keys(groupedResults).length > 0 || searchResults.length > 0) && (
              <Button
                variant="outline"
                onClick={() => setCustomQuestionDialog(!showCustomQuestionDialog)}
                className="h-12 bg-blue-500 hover:bg-blue-600 ease-in-out transition-all duration-300 text-white shadow-lg text-sm hover:text-white"
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

      <div className="flex-1 scroll-container overflow-y-auto pr-2 space-y-4 min-h-0">
        {Object.keys(groupedResults).length === 0 ||
        (searchQuestions.length > 0 && filteredResults.length === 0) ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center flex flex-col justify-center items-center py-8 text-slate-500">
              <UserRoundPen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">No questions found</p>
              <p className="text-sm">
                Try adjusting your keywords or clear the search to see all results
              </p>
            </div>
          </div>
        ) : (
          <Accordion
            type="multiple"
            className="w-full space-y-7"
            style={{ minHeight: `calc(100% + 150px)` }}
          >
            {Object.entries(groupedResults).map(([category, results]) => (
              <AccordionItem
                key={category}
                value={category}
                className={`border rounded-lg border-b-[1px] border-gray-400 ${getCategoryColor(category)}`}
              >
                <AccordionTrigger className="px-4 border-b-[1px] border-gray-400 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-x-3">
                        <h4 className="font-semibold text-slate-900">{category}</h4>
                        {results.some((item) => item.customAnswers === true) && (
                          <Badge className="bg-blue-600">Includes Custom Questions</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        {results.length} question{results.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 mt-5">
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
                                {result.type === "internal" ? result.domain : "External"}
                              </Badge>
                              {result.type === "internal" && (
                                <Badge variant="secondary" className="text-xs">
                                  {result.template}
                                </Badge>
                              )}
                              {result.customAnswers && (
                                <Badge className="bg-blue-600">Custom Added Question</Badge>
                              )}
                            </div>

                            <h4 className="text-md font-semibold text-slate-900 mb-1">
                              {result.type === "internal" ? result.question : result.title}
                            </h4>

                            <div className="flex items-center gap-x-4 mt-2">
                              <Badge
                                variant="secondary"
                                className="text-xs border border-blue-500 bg-blue-200 px-3"
                              >
                                {result.answerFormat}
                              </Badge>
                              {result.agents?.length > 0 && (
                                <BadgePopover
                                  notifications={result.agents}
                                  name={"Agents"}
                                  icon={
                                    <SquareDashedBottomCode className="w-3 h-3 font-semibold text-blue-500" />
                                  }
                                  onRemove={removeAgents}
                                />
                              )}
                              {result.docGen?.length > 0 && (
                                <BadgePopoverDocGen
                                  selectedTemplates={result.docGen}
                                  onRemoveType={handleRemoveType}
                                  onRemoveTemplate={handleRemoveTemplate}
                                  onClearAll={handleClearAll}
                                />
                              )}
                              <p className="text-xs text-slate-600">
                                {result.type === "internal"
                                  ? `${result.answers?.length || 0} answer${
                                      result.answers?.length !== 1 ? "s" : ""
                                    } available`
                                  : `From: ${result.source}`}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <EllipsisVerticalIcon className="w-4 h-4 cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                              {selectedAnswerOption.map((option, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onClick={() => {
                                    handleChangeAnswerFormat(result.id, option.text);
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

      {showCustomQuestionDialog && (
        <CustomQuestion
          open={showCustomQuestionDialog}
          setOpen={setCustomQuestionDialog}
        />
      )}
    </div>
  );
};

export default SearchResultsPanel;
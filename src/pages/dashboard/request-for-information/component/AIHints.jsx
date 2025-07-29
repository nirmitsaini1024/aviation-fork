import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, RefreshCcw, X } from "lucide-react";

const AIHints = ({showAIHintTextArea, setAIHintText, aiHintText, setShowAIHintTextArea, setShowLoadingAfterAddHints, searchAgainInternalQues, type = "internal"}) => {
  return (
   <div className="my-2">
            {showAIHintTextArea ? (
              <div className="relative">
                <textarea
                  onChange={(e) => setAIHintText(e.target.value)}
                  value={aiHintText}
                  placeholder="Enter AI hints or context to enable precise authoring..."
                  className="w-full min-h-24 scroll-container p-4 pr-20 pb-16 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-y bg-white text-gray-700 placeholder-gray-400"
                  rows={2}
                />
                <div className="absolute bottom-3 right-3 flex gap-x-2">
                  {/* Close Button */}
                  <div
                    onClick={() => setShowAIHintTextArea(false)}
                    className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                  >
                    <X className="w-4 h-4 text-gray-600 group-hover:text-gray-700 transition-colors" />
                  </div>
                  <Button
                    disabled={aiHintText.length === 0}
                    className="flex gap-x-2 items-center px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all disabled:border-none disabled:shadow-none disabled:bg-blue-50 duration-200 cursor-pointer group hover:shadow-sm"
                    onClick={() => {
                      setShowAIHintTextArea(false);
                      setShowLoadingAfterAddHints(true);
                      setTimeout(() => {
                        searchAgainInternalQues();
                        setShowLoadingAfterAddHints(false);
                      }, 2000);
                    }}
                  >
                    <Brain className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    <span className="text-blue-700 font-semibold text-xs group-hover:text-blue-800 transition-colors">
                      Add AI Hints
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div
                  onClick={() => setShowAIHintTextArea(true)}
                  className="flex gap-x-3 items-center max-w-fit px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all  duration-200 cursor-pointer group hover:shadow-sm"
                >
                  <Brain className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  <span className="text-blue-700 font-semibold text-sm group-hover:text-blue-800 transition-colors">
                    <span>{aiHintText.length > 0 ? "Modify" : "Add"}</span> AI
                    Hints
                  </span>
                </div>
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
              </div>
            )}
          </div>
  )
}

export default AIHints

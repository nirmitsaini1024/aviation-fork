import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Minus, FileText, X } from "lucide-react";

function BadgePopoverDocGen({
  selectedTemplates,
  onRemoveType = () => {},
  onRemoveTemplate = () => {},
  onClearAll = () => {},
}) {
  //   const totalTypes = selectedTemplates.reduce((sum, template) => sum + template.types.length, 0);

  return (
    <div className="flex items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Badge
            variant="secondary"
            className="text-xs border border-blue-500 bg-blue-200 px-3 hover:bg-blue-300 cursor-pointer"
          >
            DocGen
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-3">
            {/* Header with Clear All */}
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <h4 className="font-semibold text-sm text-gray-800">
                Selected Templates
              </h4>
              {selectedTemplates.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onClearAll) {
                      onClearAll();
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-800 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Accordions for each template */}
            {selectedTemplates.length > 0 ? (
              <Accordion type="multiple" className="w-full">
                {selectedTemplates.map((template, index) => (
                  <AccordionItem
                    key={`${template.name}-${index}`}
                    value={`template-${index}`}
                    className="border-none"
                  >
                    <AccordionTrigger className="px-2 py-2 hover:no-underline text-left hover:bg-gray-50 rounded">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-gray-800 text-sm">
                          {template.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {template.type.length}
                          </span>
                          {/* <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onRemoveTemplate) {
                                onRemoveTemplate(template.name);
                              }
                            }}
                            className="p-1 hover:bg-red-100 rounded-full"
                          >
                            {template.type.length > 1 && (
                                <X className="w-3 h-3 text-red-600" />
                            )}
                          </button> */}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 pb-2">
                      <div className="space-y-1">
                        {template.type.map((type, typeIndex) => (
                          <div
                            key={`${template.name}-${type}-${typeIndex}`}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 text-blue-600" />
                              <span className="text-sm text-gray-700">
                                {type}
                              </span>
                            </div>
                            {(
                              template.type.length > 1) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onRemoveType) {
                                    onRemoveType(template.name, type);
                                  }
                                }}
                                className="p-1 hover:bg-red-100 rounded-full"
                              >
                                <Minus className="w-3 h-3 text-red-600" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center text-gray-500 text-sm py-4">
                No templates selected
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default BadgePopoverDocGen;

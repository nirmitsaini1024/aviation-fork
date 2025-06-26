import { ExpandedCommentsContent } from "@/components/navigate-document/comment-expandible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye, FileText, X } from "lucide-react";
import React, { useState } from "react";

const CategoryView = React.memo(({ category, documents, onViewDocument }) => {
  const [loading, setLoading] = useState(false);
  const [isSubCategoryPopoverOpen, setIsSubCategoryPopoverOpen] = useState(false); // Add this line

  const parts = category ? category.split("/") : [];
  const mainCategory = parts[0];
  const subCategory = parts[1];

  // Mock data for linked documents
  const linkedDocuments = [
    {
      id: "ld1",
      name: "Mickey-mouse.docx",
      type: "DOCX",
      category: "Aircraft Security Protocols",
    },
    {
      id: "ld2",
      name: "aviation.pdf",
      type: "PDF",
      category: "Airline Defense Maintenance",
    },
  ];
  const mockDocuments = [
    {
      id: "doc3",
      name: "Aviation Safety Protocol",
      type: "DOCX",
      category: "Airport Safety and Compliance",
    },
    {
      id: "doc4",
      name: "Emergency Response Procedures",
      type: "PDF",
      category: "Airport Safety and Compliance",
    },
  ];

  // Filter documents relevant to this category
  const relevantDocuments = linkedDocuments.filter(
    (doc) =>
      doc.category === mainCategory ||
      (subCategory && doc.category === subCategory.split(" - ")[0])
  );

  const relevantMockDocuments = mockDocuments.filter(
    (doc) =>
      doc.category === mainCategory ||
      (subCategory && doc.category === subCategory.split(" - ")[0])
  );

  const renderDocumentBadge = (doc) => {
    const handleEyeClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.open("/refdoc", "_blank");
    };

    const handleBadgeClick = () => {
      console.log("View document:", doc.name);
    };

    return (
      <Badge
        key={doc.id}
        variant="outline"
        className="px-3 py-1 text-sm flex items-center gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 cursor-pointer"
        onClick={handleBadgeClick}
      >
        {doc.type === "PDF" ? (
          <FileText className="h-4 w-4 text-red-500" />
        ) : (
          <FileText className="h-4 w-4 text-blue-500" />
        )}
        <span>{doc.name}</span>
        <button
          onClick={handleEyeClick}
          className="flex items-center justify-center"
        >
          <Eye className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
        </button>
      </Badge>
    );
  };

  const getCategoryMetadata = () => {
    let docsCount = documents.length;
    let pendingReviews = documents.filter(
      (doc) => doc.status === "In Review" || doc.status === "Review"
    ).length;
    let approvedDocs = documents.filter(
      (doc) => doc.status === "Approved"
    ).length;

    return {
      docsCount,
      pendingReviews,
      approvedDocs,
      owners: [
        ...new Set(documents.map((doc) => doc.cct?.owner).filter(Boolean)),
      ],
      reviewers: [
        ...new Set(documents.flatMap((doc) => doc.cct?.reviewers || [])),
      ],
      nextReview:
        documents.length > 0
          ? documents.sort((a, b) => {
              if (!a.cct?.nextReview) return 1;
              if (!b.cct?.nextReview) return -1;
              return new Date(a.cct.nextReview) - new Date(b.cct.nextReview);
            })[0]?.cct?.nextReview || "N/A"
          : "N/A",
    };
  };

  const metadata = getCategoryMetadata();

  return (
    <div className="p-4 space-y-6">
      <div className="mb-2">
        <div className="flex items-start gap-4">
          <h3 className="text-lg font-medium text-gray-900">{mainCategory}</h3>
          {relevantMockDocuments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {relevantMockDocuments.map(renderDocumentBadge)}
            </div>
          )}
        </div>

        {subCategory && (
          <div className="text-blue-500 mt-4 mb-3 font-medium bg-blue-50 border-1 border-blue-200 p-4 rounded-md text-[16px]">
            <div className="flex items-start gap-2">
              <p className="line-clamp-3 flex-1 leading-relaxed">
                {subCategory}
              </p>
              <Popover open={isSubCategoryPopoverOpen} onOpenChange={setIsSubCategoryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0 hover:bg-blue-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSubCategoryPopoverOpen(!isSubCategoryPopoverOpen);
                    }}
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[500px] max-h-[300px] overflow-y-auto"
                  side="right"
                  align="start"
                  sideOffset={10}
                >
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm border-b pb-2 flex justify-between items-center">
                      <span className="text-blue-700">Full Description</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-gray-100"
                        onClick={() => setIsSubCategoryPopoverOpen(false)}
                      >
                        <X className="h-3 w-3 text-red-700" />
                      </Button>
                    </h4>
                    <div className="text-sm leading-relaxed">
                      {subCategory}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {relevantDocuments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {relevantDocuments.map(renderDocumentBadge)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Summary Section */}
      <div className="pt-4">
        <ExpandedCommentsContent
          allowRating={true}
          title={""}
          maxHeight="300px"
          documentId={`category-${category?.replace("/", "-")}`}
          user="current_user"
          getSummary={() =>
            `This ${subCategory ? "subcategory" : "category"} "${mainCategory}${
              subCategory ? ` - ${subCategory}` : ""
            }" has ${metadata.docsCount} documents with ${
              metadata.approvedDocs
            } approved and ${
              metadata.pendingReviews
            } pending review. The overall feedback from reviewers has been ${
              metadata.approvedDocs > metadata.pendingReviews
                ? "positive"
                : "mixed"
            }.`
          }
          getSentiment={() =>
            metadata.approvedDocs > metadata.pendingReviews
              ? "positive"
              : "neutral"
          }
          readOnly={true}
          publicOnly={true}
        />
      </div>
    </div>
  );
});


export default CategoryView
// /components/review-tasks/SectionRows.jsx (Fixed)
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TimestampDisplay } from "./time-stamp-display";
import AiSummary from "./ai-summary";
import AiSentiment from "./ai-sentiment";
import {
  ExpandableComments,
  ExpandedCommentsContent,
} from "../comment-section";

export function SectionRows({ 
  doc, 
  expandedDocumentSections,
  expandedCommentRows,
  setExpandedCommentRows,
  getStatusColor,
  getStatusIcon,
  getAiSummary,
  getAiSentiment,
  user
}) {
  if (expandedDocumentSections !== doc.id || !doc.sections) {
    return null;
  }

  return (
    <>
      {doc.sections.map((section, index) => (
        <>
          <TableRow key={section.id} className="bg-blue-50/30 hover:bg-blue-50/50 border-l-4 border-l-blue-400">
            {/* Checkbox with indentation */}
            <TableCell className="w-[50px] pl-8"></TableCell>
            
            {/* Section Details - First Column Only */}
            <TableCell className="pl-6">
              <div className="flex flex-col">
                {/* Section indicator */}
                <div className="text-xs text-blue-600 font-medium mb-1 flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">Review Details</Badge>
                </div>
                {/* Section title - Full display */}
                <div className="text-sm font-medium text-gray-800 mb-1">
                  {section.title}
                </div>
                
                {/* Section reference text */}
                <div className="text-xs text-gray-500 leading-tight">
                  {section.referenceText}
                </div>
              </div>
            </TableCell>

            {/* Section Comments - Second Column (Reviewer Column) */}
            <TableCell className="w-[140px]">
              <div className="flex items-center justify-center">
                <ExpandableComments
                  title={`Comments for ${section.title}`}
                  expanded={expandedCommentRows.includes(section.id)}
                  setExpanded={(expanded) => {
                    if (expanded) {
                      setExpandedCommentRows((prev) =>
                        prev.includes(section.id) ? prev : [...prev, section.id]
                      );
                    } else {
                      setExpandedCommentRows((prev) =>
                        prev.filter((id) => id !== section.id)
                      );
                    }
                  }}
                  onExpand={() => {}}
                  onCollapse={() => {}}
                  size="sm"
                />
              </div>
            </TableCell>

            {/* Section dates */}
            <TableCell className="w-[180px]">
              <TimestampDisplay timestamp={section.createdAt || doc.createdAt} size="sm" />
            </TableCell>

            <TableCell className="w-[180px]">
              <TimestampDisplay timestamp={section.lastUpdated} size="sm" />
            </TableCell>
            
            {/* Section status */}
            <TableCell className="w-[110px]">
              <Badge className={`${getStatusColor(section.status)} text-xs scale-90`}>
                {getStatusIcon(section.status)}
                <span className="truncate">
                  {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
                </span>
              </Badge>
            </TableCell>
            
            {/* Section AI Analysis */}
            <TableCell className="w-[80px]">
              <div className="flex items-center space-x-1">
                <AiSummary
                  documentId={section.id}
                  getSummary={getAiSummary}
                  title="Section AI Summary"
                  size="sm"
                />
                <AiSentiment
                  documentId={section.id}
                  getSentiment={getAiSentiment}
                  title="Section Sentiment"
                  size="sm"
                />
              </div>
            </TableCell>
            
            {/* Section Actions - Empty for sections */}
            <TableCell className="w-[100px]">
              {/* Empty - sections don't have approval actions */}
            </TableCell>
          </TableRow>
            
          {/* Section expanded comments row */}
          {expandedCommentRows.includes(section.id) && (
            <TableRow>
              <TableCell colSpan={8} className="p-0 bg-blue-25">
                <div className="ml-12 pl-4">
                  <ExpandedCommentsContent
                    documentId={doc.id}
                    user={user}
                    getSummary={() => getAiSummary(doc.id)}
                    getSentiment={() => getAiSentiment(doc.id)}
                    allowRating={true}
                    readOnly={doc.status !== 'pending' && doc.status !== 'expired'}
                    isUserLevelTask={doc.reviewerType === 'user'}
                  />
                </div>
              </TableCell>
            </TableRow>
          )}
        </>
      ))}
    </>
  );
}
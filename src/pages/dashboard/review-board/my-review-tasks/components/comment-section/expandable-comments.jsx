// /components/comment-section/ExpandableComments.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronUp, ChevronDown } from "lucide-react";
import { enhancedSampleCommentsData } from "../../mock-data/comments-data";

export function ExpandableComments({
  onExpand = () => {},
  onCollapse = () => {},
  expanded = false,
  setExpanded = () => {},
}) {
  const [comments] = useState(enhancedSampleCommentsData);
  
  const toggleExpanded = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    newExpandedState ? onExpand() : onCollapse();
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleExpanded}
        className="ml-1 whitespace-nowrap"
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        {comments.length}
        {expanded ? (
          <ChevronUp className="h-4 w-4 ml-1" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-1" />
        )}
      </Button>
    </div>
  );
}
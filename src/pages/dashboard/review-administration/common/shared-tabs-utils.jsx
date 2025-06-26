import { Badge } from "@/components/ui/badge";
import { categoryBadgeConfig, domainBadgeConfig } from "../tables/mock-data/deactivated";
import { Building, Tag } from "lucide-react";

// Function to get domain badge
export const getDomainBadge = (doc) => {
  if (!doc.domain) return null;

  const colorClass =
    domainBadgeConfig[doc.domain] ||
    "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <Badge
      variant="outline"
      className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ${colorClass}`}
    >
      <Building className="h-3.5 w-3.5" />
      <span>{doc.domain}</span>
    </Badge>
  );
};

// Function to get category badge
export const getCategoryBadge = (doc) => {
  if (!doc.category) return null;

  const colorClass =
    categoryBadgeConfig[doc.category] ||
    "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <Badge
      variant="outline"
      className={`px-2 py-0.5 text-xs font-medium flex items-center gap-1.5 ${colorClass}`}
    >
      <Tag className="h-3.5 w-3.5" />
      <span>{doc.category}</span>
    </Badge>
  );
};

// Function to get document type badge
export const getDocumentTypeBadge = (doc) => {
  if (!doc.type) return null;

  return (
    <Badge
      variant="secondary"
      className="px-2 py-0.5 bg-gray-100 text-gray-600 flex items-center gap-1.5"
    >
      <Tag className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">{doc.type}</span>
    </Badge>
  );
};

// Main reusable component for document badges section
export const DocumentBadgesSection = ({
  doc,
  showType = true,
  showDomain = true,
  showCategory = true,
  className = "mt-1 inline-flex items-center gap-1.5",
  onClick,
}) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      e.stopPropagation();
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {/* Domain Badge */}
      {showDomain && getDomainBadge(doc)}

      {/* Document Type Badge */}
      {showType && getDocumentTypeBadge(doc)}

      {/* Category Badge */}
      {showCategory && getCategoryBadge(doc)}
    </div>
  );
};

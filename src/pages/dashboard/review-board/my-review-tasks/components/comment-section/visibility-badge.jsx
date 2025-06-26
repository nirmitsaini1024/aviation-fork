// /components/comment-section/VisibilityBadge.jsx
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Users, Globe, User } from "lucide-react";

export function VisibilityBadge({ 
  visibility, 
  commentId, 
  isOwner = false, 
  onEdit = null, 
  readOnly = false, 
  isUserLevelTask = false,
  visibilityConfirmOpen,
  setVisibilityConfirmOpen,
  pendingVisibilityChange,
  confirmVisibilityChange
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const badgeRef = useRef(null);
  const confirmationTimeoutRef = useRef(null);
  
  const getBadgeContent = (vis) => {
    switch (vis) {
      case "private":
        return {
          icon: <Users className="h-3 w-3 mr-1" />,
          text: "Group Only",
          className: "bg-slate-100 text-slate-700 border-slate-200"
        };
      case "public":
        return {
          icon: <Globe className="h-3 w-3 mr-1" />,
          text: "Public",
          className: "bg-green-100 text-green-700 border-green-200"
        };
      case "individual":
        return {
          icon: <User className="h-3 w-3 mr-1" />,
          text: "For Me",
          className: "bg-blue-100 text-blue-700 border-blue-200"
        };
      default:
        return {
          icon: <Globe className="h-3 w-3 mr-1" />,
          text: "Public",
          className: "bg-green-100 text-green-700 border-green-200"
        };
    }
  };

  const currentBadge = getBadgeContent(visibility);

  const getAvailableOptions = () => {
    const options = [];
    
    if (visibility === "individual") {
      if (!isUserLevelTask) {
        options.push({ value: "private", label: "Group Only", icon: <Users className="h-3.5 w-3.5" /> });
      }
      options.push({ value: "public", label: "Public", icon: <Globe className="h-3.5 w-3.5 text-green-600" /> });
    } else if (visibility === "private" && !isUserLevelTask) {
      options.push({ value: "public", label: "Public", icon: <Globe className="h-3.5 w-3.5 text-green-600" /> });
    }
    
    return options;
  };

  const availableOptions = getAvailableOptions();
  const canEdit = isOwner && !readOnly && availableOptions.length > 0;

  // Chrome-specific fix: Use RAF and separate state management
  const handleVisibilityChange = (newVisibility) => {
    // Immediately close dropdown
    setIsEditing(false);
    
    // Clear any existing timeout
    if (confirmationTimeoutRef.current) {
      clearTimeout(confirmationTimeoutRef.current);
    }
    
    // Store the pending change locally
    setPendingChange(newVisibility);
    
    // Use RAF to ensure dropdown is completely closed before showing confirmation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Double RAF for Chrome compatibility
        setShowConfirmation(true);
        
        // Also update the parent state for compatibility
        setVisibilityConfirmOpen(prev => ({...prev, [commentId]: true}));
        onEdit && onEdit(commentId, newVisibility);
      });
    });
  };

  const handleConfirmation = (confirmed) => {
    setShowConfirmation(false);
    setVisibilityConfirmOpen(prev => ({...prev, [commentId]: false}));
    
    if (confirmed && confirmVisibilityChange) {
      // Small delay to ensure popover closes before executing change
      confirmationTimeoutRef.current = setTimeout(() => {
        confirmVisibilityChange();
        setPendingChange(null);
      }, 100);
    } else {
      setPendingChange(null);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (confirmationTimeoutRef.current) {
        clearTimeout(confirmationTimeoutRef.current);
      }
    };
  }, []);

  // Force close confirmation if dropdown opens (prevent conflicts)
  useEffect(() => {
    if (isEditing && showConfirmation) {
      setShowConfirmation(false);
      setPendingChange(null);
    }
  }, [isEditing]);

  if (!canEdit) {
    return (
      <Badge variant="outline" className={`ml-2 text-xs ${currentBadge.className}`}>
        {currentBadge.icon}
        {currentBadge.text}
      </Badge>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      {/* Dropdown Menu */}
      <DropdownMenu 
        open={isEditing} 
        onOpenChange={(open) => {
          setIsEditing(open);
          // Ensure confirmation is closed when dropdown opens
          if (open && showConfirmation) {
            setShowConfirmation(false);
            setPendingChange(null);
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Badge 
            ref={badgeRef}
            variant="outline" 
            className={`ml-2 text-xs cursor-pointer hover:opacity-80 ${currentBadge.className}`}
          >
            {currentBadge.icon}
            {currentBadge.text}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-32">
          {availableOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="flex items-center gap-2 text-xs cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleVisibilityChange(option.value);
              }}
            >
              {option.icon}
              <span className={option.value === "public" ? "text-green-600" : ""}>
                {option.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Chrome-compatible Confirmation Popover */}
      {(showConfirmation || visibilityConfirmOpen[commentId]) && (
        <div 
          className="fixed inset-0 z-50 bg-black/20"
          onClick={() => handleConfirmation(false)}
        >
          <div 
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-72"
            style={{
              top: badgeRef.current ? badgeRef.current.getBoundingClientRect().bottom + 8 : '50%',
              left: badgeRef.current ? badgeRef.current.getBoundingClientRect().left : '50%',
              transform: !badgeRef.current ? 'translate(-50%, -50%)' : 'none',
              zIndex: 9999
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <p className="text-sm font-medium">Change Comment Visibility</p>
              <p className="text-xs text-gray-600">
                {(pendingChange || pendingVisibilityChange?.newVisibility) === "public" && 
                  "This will make your comment visible to everyone. Are you sure?"
                }
                {(pendingChange || pendingVisibilityChange?.newVisibility) === "private" && 
                  "This will make your comment visible to your group only. Are you sure?"
                }
                {(pendingChange || pendingVisibilityChange?.newVisibility) === "individual" && 
                  "This will make your comment visible to you only. Are you sure?"
                }
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleConfirmation(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleConfirmation(true);
                  }}
                >
                  Change Visibility
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
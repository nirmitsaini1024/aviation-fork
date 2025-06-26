// /components/comment-section/CommentItem.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThumbsUp, ThumbsDown, MessageSquare, Reply, File, Eye, Trash2, Lock, Image, FileText, FileIcon, X } from "lucide-react";
import { VisibilityBadge } from "./visibility-badge";
import { CommentReplies } from "./comment-replies";
import { StarRating } from "./star-rating";

export function CommentItem({
  comment,
  currentUser,
  userInteractions,
  handleLike,
  handleDislike,
  expandedComments,
  toggleCommentReplies,
  toggleReplyInput,
  openDocumentViewer,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  handleDeleteComment,
  visibilityConfirmOpen,
  setVisibilityConfirmOpen,
  pendingVisibilityChange,
  handleVisibilityChange,
  confirmVisibilityChange,
  readOnly,
  isUserLevelTask,
  // Reply related props
  showReplyInput,
  replyInputs,
  replyingTo,
  setReplyingTo,
  setReplyInputs,
  handleReplyChange,
  submitReply,
  cancelReply,
  handleReplyLike,
  handleReplyDislike,
  getReplyInteraction,
  toggleReplyToReply,
  handleReplyRating,
  formatReplyText,
  allowRating,
  // NEW: Attachment deletion props
  handleDeleteAttachment,
  attachmentDeleteConfirmOpen,
  setAttachmentDeleteConfirmOpen,
  // NEW: Rating props
  handleCommentRating
}) {
  // Helper function to get appropriate icon for file type
  const getFileIcon = (fileType) => {
    if (fileType === 'image') return <Image className="h-4 w-4 text-blue-500" />;
    if (fileType === 'pdf') return <FileText className="h-4 w-4 text-red-500" />;
    if (fileType === 'docx' || fileType === 'doc') return <FileText className="h-4 w-4 text-blue-600" />;
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };

  // Check if comment has attachments (new structure) or single file (old structure for backward compatibility)
  const hasAttachments = comment.attachments && comment.attachments.length > 0;
  const hasSingleFile = comment.fileType && comment.fileName; // For backward compatibility

  // Check if user can delete attachments (only for own comments with "for me" or "group only" visibility)
  const canDeleteAttachments = !readOnly && 
    comment.user.name === currentUser.name && 
    (comment.visibility === "individual" || comment.visibility === "private");

  // Rating value - simple integer from 0-5
  const userRating = comment.rating || 0;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Comment header and content */}
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
          <AvatarFallback>{comment.user.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <p className="font-medium">{comment.user.name}</p>
                {comment.visibility && (
                  <VisibilityBadge 
                    visibility={comment.visibility}
                    commentId={comment.id}
                    isOwner={comment.user.name === currentUser.name}
                    onEdit={handleVisibilityChange}
                    readOnly={readOnly}
                    isUserLevelTask={isUserLevelTask}
                    visibilityConfirmOpen={visibilityConfirmOpen}
                    setVisibilityConfirmOpen={setVisibilityConfirmOpen}
                    pendingVisibilityChange={pendingVisibilityChange}
                    confirmVisibilityChange={confirmVisibilityChange}
                  />
                )}
                {comment.restrictedTo && !comment.visibility && (
                  <Badge variant="outline" className="ml-2 text-xs bg-slate-100 text-slate-700 border-slate-200">
                    <Lock className="h-3 w-3 mr-1" />
                    Group Only
                  </Badge>
                )}
                
                {/* Delete button for own comments */}
                {!readOnly && 
                comment.user.name === currentUser.name && 
                (comment.visibility === "individual" || comment.visibility === "private") && (
                  <Popover 
                    open={deleteConfirmOpen[comment.id]} 
                    onOpenChange={(open) => setDeleteConfirmOpen(prev => ({...prev, [comment.id]: open}))}
                  >
                    <PopoverTrigger asChild>
                      <button
                        className={`ml-2 flex items-center text-xs hover:cursor-pointer text-red-600 hover:text-red-800`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3">
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Delete Comment</p>
                        <p className="text-xs text-gray-600">
                          Are you sure you want to delete this comment? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setDeleteConfirmOpen(prev => ({...prev, [comment.id]: false}))}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white text-xs"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {comment.timestamp}
              </p>
            </div>
          </div>

          <div className="mt-2">
            {comment.text && <p>{comment.text}</p>}
            
            {/* NEW: Multiple attachments support with individual deletion */}
            {hasAttachments && (
              <div className="mt-3 space-y-2">
                {comment.attachments.length === 1 ? (
                  // Single attachment - same layout as before but with delete option
                  <div className="border rounded-md p-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getFileIcon(comment.attachments[0].fileType)}
                        <span className="text-sm ml-2">{comment.attachments[0].fileName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDocumentViewer(comment.attachments[0])}
                          className="h-6 px-2"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {canDeleteAttachments && (
                          <Popover 
                            open={attachmentDeleteConfirmOpen[`${comment.id}-0`]} 
                            onOpenChange={(open) => setAttachmentDeleteConfirmOpen(prev => ({
                              ...prev, 
                              [`${comment.id}-0`]: open
                            }))}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-3">
                              <div className="space-y-3">
                                <p className="text-sm font-medium">Delete Attachment</p>
                                <p className="text-xs text-gray-600">
                                  Are you sure you want to delete "{comment.attachments[0].fileName}"? This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => setAttachmentDeleteConfirmOpen(prev => ({
                                      ...prev, 
                                      [`${comment.id}-0`]: false
                                    }))}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                                    onClick={() => handleDeleteAttachment(comment.id, 0)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Multiple attachments - grid layout with individual delete options
                  <div className="border rounded-md p-3 bg-gray-50">
                    <div className="flex items-center mb-3">
                      <File className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm font-medium">
                        {comment.attachments.length} attachments
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {comment.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded p-2 border">
                          <div className="flex items-center flex-1 min-w-0">
                            {getFileIcon(attachment.fileType)}
                            <span className="text-xs ml-2 truncate" title={attachment.fileName}>
                              {attachment.fileName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDocumentViewer(attachment)}
                              className="h-6 px-2"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            {canDeleteAttachments && (
                              <Popover 
                                open={attachmentDeleteConfirmOpen[`${comment.id}-${index}`]} 
                                onOpenChange={(open) => setAttachmentDeleteConfirmOpen(prev => ({
                                  ...prev, 
                                  [`${comment.id}-${index}`]: open
                                }))}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3">
                                  <div className="space-y-3">
                                    <p className="text-sm font-medium">Delete Attachment</p>
                                    <p className="text-xs text-gray-600">
                                      Are you sure you want to delete "{attachment.fileName}"? This action cannot be undone.
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setAttachmentDeleteConfirmOpen(prev => ({
                                          ...prev, 
                                          [`${comment.id}-${index}`]: false
                                        }))}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700 text-white text-xs"
                                        onClick={() => handleDeleteAttachment(comment.id, index)}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* OLD: Backward compatibility for single file structure with delete option */}
            {!hasAttachments && hasSingleFile && (
              <div className="mt-2 border rounded-md p-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">{comment.fileName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDocumentViewer(comment)}
                      className="h-6 px-2"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    {canDeleteAttachments && (
                      <Popover 
                        open={attachmentDeleteConfirmOpen[`${comment.id}-single`]} 
                        onOpenChange={(open) => setAttachmentDeleteConfirmOpen(prev => ({
                          ...prev, 
                          [`${comment.id}-single`]: open
                        }))}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3">
                          <div className="space-y-3">
                            <p className="text-sm font-medium">Delete Attachment</p>
                            <p className="text-xs text-gray-600">
                              Are you sure you want to delete "{comment.fileName}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => setAttachmentDeleteConfirmOpen(prev => ({
                                  ...prev, 
                                  [`${comment.id}-single`]: false
                                }))}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white text-xs"
                                onClick={() => handleDeleteAttachment(comment.id, 'single')}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interaction buttons */}
          <div className="flex items-center mt-3 gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={userInteractions[comment.id]?.liked ? "default" : "ghost"}
                size="sm"
                onClick={() => !readOnly && handleLike(comment.id)}
                disabled={readOnly}
                className={`h-8 px-2 ${
                  userInteractions[comment.id]?.liked
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "hover:bg-green-100 hover:text-green-700"
                } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <ThumbsUp className="h-4 w-4 mr-1 text-green-700" />
                {comment.likes}
              </Button>
              <Button
                variant={userInteractions[comment.id]?.disliked ? "default" : "ghost"}
                size="sm"
                onClick={() => !readOnly && handleDislike(comment.id)}
                disabled={readOnly}
                className={`h-8 px-2 ${
                  userInteractions[comment.id]?.disliked
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "hover:bg-red-100 hover:text-red-700"
                } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <ThumbsDown className="h-4 w-4 mr-1 text-red-600" />
                {comment.dislikes}
              </Button>
              
              {/* Rating stars positioned right after like/dislike */}
              {allowRating && (
                <div className="ml-2">
                  <StarRating
                    value={userRating}
                    onChange={(value) => !readOnly && handleCommentRating && handleCommentRating(comment.id, value)}
                    readOnly={readOnly}
                  />
                </div>
              )}
            </div>

            {comment.replies.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleCommentReplies(comment.id)}
                className={"opacity-70 cursor-pointer"}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                {expandedComments.includes(comment.id) ? "Hide" : "Show"} Replies ({comment.replies.length})
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => !readOnly && toggleReplyInput(comment.id)}
              disabled={readOnly}
              className={`ml-auto ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <Reply className="h-3.5 w-3.5 mr-1.5" />
              Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Replies section */}
      <CommentReplies
        comment={comment}
        expandedComments={expandedComments}
        showReplyInput={showReplyInput}
        replyInputs={replyInputs}
        replyingTo={replyingTo}
        currentUser={currentUser}
        setReplyingTo={setReplyingTo}
        setReplyInputs={setReplyInputs}
        handleReplyChange={handleReplyChange}
        submitReply={submitReply}
        cancelReply={cancelReply}
        handleReplyLike={handleReplyLike}
        handleReplyDislike={handleReplyDislike}
        getReplyInteraction={getReplyInteraction}
        toggleReplyToReply={toggleReplyToReply}
        handleReplyRating={handleReplyRating}
        formatReplyText={formatReplyText}
        allowRating={allowRating}
        readOnly={readOnly}
      />
    </div>
  );
}
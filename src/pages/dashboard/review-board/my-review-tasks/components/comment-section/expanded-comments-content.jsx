// /components/comment-section/ExpandedCommentsContent.jsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Smile, Meh, Frown, Plus, RotateCcw, AlertTriangle } from "lucide-react";
import { enhancedSampleCommentsData, currentUser } from "../../mock-data/comments-data";
import { CommentInputSection } from "./comment-input-section";
import { CommentItem } from "./comment-item";
import { FullPagePopup } from "./full-page-popup";
import { 
  useCommentInteractions,
  useCommentFilters,
  useCommentHandlers,
  useFileHandlers,
  useVisibilityHandlers,
  useAttachmentHandlers // NEW: Import the new hook
} from "../../utils/comment-utils";
import UniversalDocumentViewer from "@/components/universal-document-viewer";

export function ExpandedCommentsContent({
  allowRating = true,
  title = "Comments",
  maxHeight = "370px",
  documentId,
  user,
  getSummary = () => "No summary available for this document.",
  getSentiment = () => "neutral",
  getRiskScore = () => 55,
  getRiskLevel = () => "Medium Risk",
  getRiskDescription = () => "This recommendation carries a medium risk profile based on market volatility, asset correlation, and historical performance data.",
  readOnly = false,
  publicOnly = false,
  isUserLevelTask = false,
}) {
  const [expandedComments, setExpandedComments] = useState([]);
  const [comments, setComments] = useState(enhancedSampleCommentsData);
  const [newComment, setNewComment] = useState("");
  const [visibility, setVisibility] = useState("individual");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isViewerPopupOpen, setIsViewerPopupOpen] = useState(false);
  const [viewerFileType, setViewerFileType] = useState(null);
  const [viewerFilePath, setViewerFilePath] = useState(null);
  const fileInputRef = useRef(null);
  
  // Custom hooks for managing complex state
  const { userInteractions, replyInteractions, getReplyInteraction, handleLike, handleDislike, handleReplyLike, handleReplyDislike } = useCommentInteractions(setComments);
  const { visibleCommentsCount, setVisibleCommentsCount, getVisibleComments, loadMoreComments, showLessComments } = useCommentFilters(comments, publicOnly, user);
  const { replyInputs, showReplyInput, replyingTo, handleReplyChange, toggleReplyInput, toggleReplyToReply, submitReply, cancelReply, setReplyInputs, setShowReplyInput, setReplyingTo } = useCommentHandlers(setComments, currentUser);
  const { handleFileUpload, openDocumentViewer, getFileTypeFromFileName } = useFileHandlers(setSelectedFiles, setViewerFileType, setViewerFilePath, setIsViewerPopupOpen);
  const { deleteConfirmOpen, setDeleteConfirmOpen, visibilityConfirmOpen, setVisibilityConfirmOpen, pendingVisibilityChange, setPendingVisibilityChange, handleDeleteComment, handleVisibilityChange, confirmVisibilityChange } = useVisibilityHandlers(setComments);
  
  // NEW: Add attachment deletion hook
  const { attachmentDeleteConfirmOpen, setAttachmentDeleteConfirmOpen, handleDeleteAttachment } = useAttachmentHandlers(setComments);

  const [ratingsHistory, setRatingsHistory] = useState([]);

  const toggleCommentReplies = (commentId) => {
    setExpandedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const logRating = (itemType, itemId, userId, oldRating, newRating) => {
    const ratingEvent = {
      timestamp: new Date().toISOString(),
      itemType,
      itemId,
      userId,
      oldRating,
      newRating,
    };
    setRatingsHistory(prev => [...prev, ratingEvent]);
  };

  const handleCommentRating = (commentId, newRating) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            rating: newRating,
          };
        }
        return comment;
      })
    );

    logRating("comment", commentId, currentUser.id, 0, newRating);
  };

  const handleReplyRating = (commentId, replyId, newRating) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  rating: newRating,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );

    logRating("reply", replyId, currentUser.id, 0, newRating);
  };

  const formatReplyText = (text, taggedUser) => {
    if (!taggedUser) return text;

    const tagPattern = new RegExp(`^@${taggedUser.name}\\s`);
    if (tagPattern.test(text)) {
      const tagLength = `@${taggedUser.name} `.length;
      return (
        <div className="flex gap-2">
          <span className="text-blue-600 font-medium">@{taggedUser.name}</span>
          <span>{text.substring(tagLength)}</span>
        </div>
      );
    }

    return text;
  };

  const submitComment = () => {
    if (!newComment.trim() && (!selectedFiles || selectedFiles.length === 0)) return;

    const comment = {
      id: Date.now(),
      user: currentUser,
      text: newComment,
      likes: 0,
      dislikes: 0,
      timestamp: "Just now",
      rating: 0,
      replies: [],
      visibility: visibility,
      // Handle multiple files
      ...(selectedFiles && selectedFiles.length > 0 && {
        attachments: selectedFiles.map(selectedFile => ({
          hasImage: selectedFile.fileType === 'image',
          fileType: selectedFile.fileType,
          fileName: selectedFile.file.name,
          filePath: selectedFile.filePath
        }))
      })
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
    setSelectedFiles([]); // Clear all files
  };

  const getRiskColor = (score) => {
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-orange-600";
    return "text-green-600";
  };

  const getRiskBorderColor = (score) => {
    if (score >= 70) return "border-red-200";
    if (score >= 40) return "border-orange-200";
    return "border-green-200";
  };

  const getRiskBgColor = (score) => {
    if (score >= 70) return "bg-red-50";
    if (score >= 40) return "bg-orange-50";
    return "bg-green-50";
  };

  const visibleComments = getVisibleComments();
  const displayedComments = visibleComments.slice(0, visibleCommentsCount);
  const hasMoreComments = visibleCommentsCount < visibleComments.length;
  const showingAllComments = visibleCommentsCount >= visibleComments.length && visibleComments.length > 3;

  const currentRiskScore = getRiskScore(documentId);

  return (
    <div className="pl-20 p-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <span className="text-sm text-gray-500">
              Showing {displayedComments.length} of {visibleComments.length} comments
            </span>
          </div>
        </div>
        
        {/* AI Summary Section */}
        <div className="mb-6 p-4 pt-2 border-2 rounded-md border-purple-200">
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center">
              <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
              Review AI Summary
              <div className="flex justify-center space-x-4 py-2 ml-2">
                <div className={`flex gap-1 items-center text-green-500 ${getSentiment(documentId) === "positive" ? "opacity-100" : "hidden"}`}>
                  <Smile className="h-4 w-4 mt-1" />
                  <span className="text-xs mt-1">Positive</span>
                </div>
                <div className={`flex gap-1 items-center text-yellow-500 ${getSentiment(documentId) === "neutral" ? "opacity-100" : "hidden"}`}>
                  <Meh className="h-4 w-4 mt-1" />
                  <span className="text-xs mt-1">Neutral</span>
                </div>
                <div className={`flex gap-1 items-center text-red-500 ${getSentiment(documentId) === "negative" ? "opacity-100" : "hidden"}`}>
                  <Frown className="h-4 w-4 mt-1" />
                  <span className="text-xs mt-1">Negative</span>
                </div>
              </div>
            </h4>
            <div className="text-sm text-gray-700 border-l-2 border-purple-200 pl-3">
              {getSummary(documentId)}
            </div>
          </div>
        </div>

        {/* Risk Summary Section */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Risk Summary</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Risk Score</span>
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-yellow-100 text-yellow-800">
                <span className="text-brown font-semibold mr-1">{currentRiskScore}</span>
                <span className="text-blue-900">{getRiskLevel(documentId)}</span>
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {getRiskDescription(documentId)}
          </div>
        </div>

        {/* Comment Input Section */}
        <CommentInputSection
          currentUser={currentUser}
          newComment={newComment}
          setNewComment={setNewComment}
          visibility={visibility}
          setVisibility={setVisibility}
          isUserLevelTask={isUserLevelTask}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
          submitComment={submitComment}
          readOnly={readOnly}
        />

        {/* Comments List */}
        <div className="rounded-md border bg-white">
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {displayedComments.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                No comments yet. Be the first to add a comment!
              </div>
            ) : (
              displayedComments.map((comment) => (
                <CommentItem
                  key={`comment-${comment.id}`}
                  comment={comment}
                  currentUser={currentUser}
                  userInteractions={userInteractions}
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                  expandedComments={expandedComments}
                  toggleCommentReplies={toggleCommentReplies}
                  toggleReplyInput={toggleReplyInput}
                  openDocumentViewer={openDocumentViewer}
                  deleteConfirmOpen={deleteConfirmOpen}
                  setDeleteConfirmOpen={setDeleteConfirmOpen}
                  handleDeleteComment={handleDeleteComment}
                  visibilityConfirmOpen={visibilityConfirmOpen}
                  setVisibilityConfirmOpen={setVisibilityConfirmOpen}
                  pendingVisibilityChange={pendingVisibilityChange}
                  handleVisibilityChange={handleVisibilityChange}
                  confirmVisibilityChange={confirmVisibilityChange}
                  readOnly={readOnly}
                  isUserLevelTask={isUserLevelTask}
                  showReplyInput={showReplyInput}
                  replyInputs={replyInputs}
                  replyingTo={replyingTo}
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
                  // NEW: Pass attachment deletion props
                  handleDeleteAttachment={handleDeleteAttachment}
                  attachmentDeleteConfirmOpen={attachmentDeleteConfirmOpen}
                  setAttachmentDeleteConfirmOpen={setAttachmentDeleteConfirmOpen}
                  // NEW: Pass rating props
                  handleCommentRating={handleCommentRating}
                />
              ))
            )}
          </div>
          
          {/* Load More / Show Less Section */}
          {visibleComments.length > 0 && (
            <div className="border-t bg-gray-50 p-4 flex justify-center">
              {hasMoreComments ? (
                <Button
                  variant="outline"
                  onClick={loadMoreComments}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <Plus className="h-4 w-4" />
                  Load {Math.min(3, visibleComments.length - visibleCommentsCount)} More Comments
                </Button>
              ) : showingAllComments ? (
                <Button
                  variant="outline"
                  onClick={showLessComments}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <RotateCcw className="h-4 w-4" />
                  Show Less Comments
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* File Viewer Popup */}
      <FullPagePopup
        isOpen={isViewerPopupOpen}
        onClose={() => setIsViewerPopupOpen(false)}
      >
        {viewerFileType === 'pdf' ? (
          <div className="h-full">
            <h2 className="text-xl font-bold mb-4">PDF Viewer</h2>
            <UniversalDocumentViewer 
              documentUrl={viewerFilePath}
              documentType="pdf"
              height="calc(100% - 60px)"
              width="100%"
            />
          </div>
        ) : viewerFileType === 'docx' || viewerFileType === 'doc' ? (
          <div className="h-full">
            <h2 className="text-xl font-bold mb-4">Document Viewer</h2>
            <UniversalDocumentViewer 
              documentUrl={viewerFilePath}
              documentType={viewerFileType}
              height="calc(100% - 60px)"
              width="100%"
              enableEditing={false}
            />
          </div>
        ) : viewerFileType === 'image' ? (
          <div className="flex justify-center items-center h-full">
            <img
              src={viewerFilePath}
              alt="Preview"
              className="max-w-full max-h-full"
            />
          </div>
        ) : (
          <div className="text-center p-8">
            <p>Cannot preview this file type.</p>
          </div>
        )}
      </FullPagePopup>
    </div>
  );
}
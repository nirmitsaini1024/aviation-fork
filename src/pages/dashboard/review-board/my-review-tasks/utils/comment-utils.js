// /utils/comment-utils.js
import { useState } from "react";
import { currentUser } from "../mock-data/comments-data";

// Custom hook for managing comment interactions (likes, dislikes)
export function useCommentInteractions(setComments) {
  const [userInteractions, setUserInteractions] = useState({});
  const [replyInteractions, setReplyInteractions] = useState({});

  const handleLike = (commentId) => {
    const interaction = userInteractions[commentId] || {
      liked: false,
      disliked: false,
    };

    if (interaction.liked) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: Math.max(0, comment.likes - 1) }
            : comment
        )
      );
      setUserInteractions(prev => ({
        ...prev,
        [commentId]: { ...interaction, liked: false },
      }));
    } else {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              likes: comment.likes + 1,
              dislikes: interaction.disliked
                ? Math.max(0, comment.dislikes - 1)
                : comment.dislikes,
            }
            : comment
        )
      );
      setUserInteractions(prev => ({
        ...prev,
        [commentId]: { liked: true, disliked: false },
      }));
    }
  };

  const handleDislike = (commentId) => {
    const interaction = userInteractions[commentId] || {
      liked: false,
      disliked: false,
    };

    if (interaction.disliked) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, dislikes: Math.max(0, comment.dislikes - 1) }
            : comment
        )
      );
      setUserInteractions(prev => ({
        ...prev,
        [commentId]: { ...interaction, disliked: false },
      }));
    } else {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              dislikes: comment.dislikes + 1,
              likes: interaction.liked
                ? Math.max(0, comment.likes - 1)
                : comment.likes,
            }
            : comment
        )
      );
      setUserInteractions(prev => ({
        ...prev,
        [commentId]: { liked: false, disliked: true },
      }));
    }
  };

  const handleReplyLike = (commentId, replyId) => {
    const interactionKey = `${commentId}-${replyId}`;
    const interaction = replyInteractions[interactionKey] || {
      liked: false,
      disliked: false,
    };

    if (interaction.liked) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, likes: Math.max(0, reply.likes - 1) }
                  : reply
              ),
            }
            : comment
        )
      );
      setReplyInteractions(prev => ({
        ...prev,
        [interactionKey]: { ...interaction, liked: false },
      }));
    } else {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? {
                    ...reply,
                    likes: reply.likes + 1,
                    dislikes: interaction.disliked
                      ? Math.max(0, reply.dislikes - 1)
                      : reply.dislikes,
                  }
                  : reply
              ),
            }
            : comment
        )
      );
      setReplyInteractions(prev => ({
        ...prev,
        [interactionKey]: { liked: true, disliked: false },
      }));
    }
  };

  const handleReplyDislike = (commentId, replyId) => {
    const interactionKey = `${commentId}-${replyId}`;
    const interaction = replyInteractions[interactionKey] || {
      liked: false,
      disliked: false,
    };

    if (interaction.disliked) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, dislikes: Math.max(0, reply.dislikes - 1) }
                  : reply
              ),
            }
            : comment
        )
      );
      setReplyInteractions(prev => ({
        ...prev,
        [interactionKey]: { ...interaction, disliked: false },
      }));
    } else {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? {
                    ...reply,
                    dislikes: reply.dislikes + 1,
                    likes: interaction.liked
                      ? Math.max(0, reply.likes - 1)
                      : reply.likes,
                  }
                  : reply
              ),
            }
            : comment
        )
      );
      setReplyInteractions(prev => ({
        ...prev,
        [interactionKey]: { liked: false, disliked: true },
      }));
    }
  };

  const getReplyInteraction = (commentId, replyId) => {
    const interactionKey = `${commentId}-${replyId}`;
    return replyInteractions[interactionKey] || { liked: false, disliked: false };
  };

  return {
    userInteractions,
    replyInteractions,
    getReplyInteraction,
    handleLike,
    handleDislike,
    handleReplyLike,
    handleReplyDislike
  };
}

// Custom hook for managing comment filters and pagination
export function useCommentFilters(comments, publicOnly, user) {
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
  const COMMENTS_PER_LOAD = 3;

  const filterCommentsByPermission = (commentsData) => {
    return commentsData.filter(comment => {
      if (publicOnly) {
        return comment.visibility === "public";
      }
      
      if (comment.restrictedTo && Array.isArray(comment.restrictedTo)) {
        return comment.restrictedTo.includes(user);
      }
      return true;
    });
  };

  const getVisibleComments = () => filterCommentsByPermission(comments);

  const loadMoreComments = () => {
    setVisibleCommentsCount(prev => Math.min(prev + COMMENTS_PER_LOAD, getVisibleComments().length));
  };

  const showLessComments = () => {
    setVisibleCommentsCount(3);
  };

  return {
    visibleCommentsCount,
    setVisibleCommentsCount,
    getVisibleComments,
    loadMoreComments,
    showLessComments
  };
}

// Custom hook for managing comment replies
export function useCommentHandlers(setComments, currentUser) {
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [replyingTo, setReplyingTo] = useState({});

  const handleReplyChange = (commentId, value) => {
    setReplyInputs(prev => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const toggleReplyInput = (commentId) => {
    setReplyingTo(prev => ({
      ...prev,
      [commentId]: null,
    }));
    setShowReplyInput(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    if (showReplyInput[commentId]) {
      setReplyInputs(prev => ({
        ...prev,
        [commentId]: "",
      }));
    }
  };

  const toggleReplyToReply = (commentId, replyId, replyUser) => {
    setReplyingTo(prev => ({
      ...prev,
      [commentId]: {
        replyId,
        user: replyUser,
      },
    }));
    setShowReplyInput(prev => ({
      ...prev,
      [commentId]: true,
    }));
    if (replyUser) {
      setReplyInputs(prev => ({
        ...prev,
        [commentId]: `@${replyUser.name} `,
      }));
    }
  };

  const submitReply = (commentId) => {
    const replyText = replyInputs[commentId];
    if (!replyText || replyText.trim() === "") return;

    const newReply = {
      id: Date.now(),
      user: currentUser,
      text: replyText,
      timestamp: "Just now",
      taggedUser: replyingTo[commentId]?.user || null,
      likes: 0,
      dislikes: 0,
      rating: 0,
    };

    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );

    setReplyInputs(prev => ({
      ...prev,
      [commentId]: "",
    }));
    setReplyingTo(prev => ({
      ...prev,
      [commentId]: null,
    }));
    setShowReplyInput(prev => ({
      ...prev,
      [commentId]: false,
    }));
  };

  const cancelReply = (commentId) => {
    setShowReplyInput(prev => ({
      ...prev,
      [commentId]: false,
    }));
    setReplyInputs(prev => ({
      ...prev,
      [commentId]: "",
    }));
    setReplyingTo(prev => ({
      ...prev,
      [commentId]: null,
    }));
  };

  return {
    replyInputs,
    showReplyInput,
    replyingTo,
    setReplyInputs,
    setShowReplyInput,
    setReplyingTo,
    handleReplyChange,
    toggleReplyInput,
    toggleReplyToReply,
    submitReply,
    cancelReply
  };
}

// UPDATED: Custom hook for file handling - Now supports multiple files
export function useFileHandlers(setSelectedFiles, setViewerFileType, setViewerFilePath, setIsViewerPopupOpen) {
  const getFileTypeFromFileName = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'docx';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    return 'other';
  };

  // UPDATED: Now handles multiple files
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newFiles = files.map(file => ({
      file,
      fileType: getFileTypeFromFileName(file.name),
      filePath: URL.createObjectURL(file)
    }));

    // Add to existing files instead of replacing
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Clear the input so the same files can be selected again if needed
    e.target.value = '';
  };

  const openDocumentViewer = (file) => {
    setViewerFileType(file.fileType);
    setViewerFilePath(file.filePath || file.imageSrc);
    setIsViewerPopupOpen(true);
  };

  return {
    getFileTypeFromFileName,
    handleFileUpload,
    openDocumentViewer
  };
}

// NEW: Custom hook for attachment deletion
export function useAttachmentHandlers(setComments) {
  const [attachmentDeleteConfirmOpen, setAttachmentDeleteConfirmOpen] = useState({});

  const handleDeleteAttachment = (commentId, attachmentIndex) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id !== commentId) return comment;

        if (attachmentIndex === 'single') {
          // Handle backward compatibility - remove single file properties
          const { fileType, fileName, filePath, imageSrc, ...commentWithoutFile } = comment;
          return commentWithoutFile;
        } else {
          // Handle multiple attachments - remove specific attachment by index
          if (comment.attachments && comment.attachments.length > 0) {
            const updatedAttachments = comment.attachments.filter((_, index) => index !== attachmentIndex);
            return {
              ...comment,
              attachments: updatedAttachments
            };
          }
        }

        return comment;
      })
    );

    // Close the confirmation dialog
    setAttachmentDeleteConfirmOpen(prev => ({
      ...prev,
      [`${commentId}-${attachmentIndex}`]: false
    }));
  };

  return {
    attachmentDeleteConfirmOpen,
    setAttachmentDeleteConfirmOpen,
    handleDeleteAttachment
  };
}

// Custom hook for visibility and delete handlers
export function useVisibilityHandlers(setComments) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState({});
  const [visibilityConfirmOpen, setVisibilityConfirmOpen] = useState({});
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState({});

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    setDeleteConfirmOpen(prev => ({
      ...prev,
      [commentId]: false
    }));
  };

  const handleVisibilityChange = (commentId, newVisibility) => {
    setPendingVisibilityChange({ commentId, newVisibility });
    setVisibilityConfirmOpen(prev => ({
      ...prev,
      [commentId]: true
    }));
  };

  const confirmVisibilityChange = () => {
    if (pendingVisibilityChange.commentId && pendingVisibilityChange.newVisibility) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === pendingVisibilityChange.commentId
            ? { ...comment, visibility: pendingVisibilityChange.newVisibility }
            : comment
        )
      );
      
      setVisibilityConfirmOpen(prev => ({
        ...prev,
        [pendingVisibilityChange.commentId]: false
      }));
      setPendingVisibilityChange({});
    }
  };

  return {
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    visibilityConfirmOpen,
    setVisibilityConfirmOpen,
    pendingVisibilityChange,
    setPendingVisibilityChange,
    handleDeleteComment,
    handleVisibilityChange,
    confirmVisibilityChange
  };
}
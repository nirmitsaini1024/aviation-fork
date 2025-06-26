// /components/comment-section/CommentReplies.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Reply, Send } from "lucide-react";
import { StarRating } from "./star-rating";

export function CommentReplies({
  comment,
  expandedComments,
  showReplyInput,
  replyInputs,
  replyingTo,
  currentUser,
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
  readOnly
}) {
  return (
    <>
      {/* Replies section - Show replies but disable interactions when readOnly */}
      {expandedComments.includes(comment.id) && comment.replies.length > 0 && (
        <div className="mt-4 ml-8 pl-4 space-y-4 border-l-2">
          {comment.replies.map((reply, replyIndex) => (
            <React.Fragment key={`reply-${reply.id}`}>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={reply.user.avatar || "/placeholder.svg"} alt={reply.user.name} />
                    <AvatarFallback>{reply.user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{reply.user.name}</p>
                        <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                      </div>
                      {allowRating && (
                        <div className="flex items-center scale-75 origin-right">
                          <StarRating
                            value={reply.rating || 0}
                            onChange={(newRating) =>
                              !readOnly && handleReplyRating(comment.id, reply.id, newRating)
                            }
                            readOnly={readOnly}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-1 text-sm">
                      {formatReplyText(reply.text, reply.taggedUser)}
                    </div>

                    {/* Reply interaction buttons */}
                    <div className="flex items-center mt-2 mb-1">
                      <div className="flex items-center gap-1">
                        <Button
                          variant={getReplyInteraction(comment.id, reply.id).liked ? "default" : "ghost"}
                          size="sm"
                          onClick={() => !readOnly && handleReplyLike(comment.id, reply.id)}
                          disabled={readOnly}
                          className={`h-6 px-1.5 text-xs ${
                            getReplyInteraction(comment.id, reply.id).liked
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "hover:bg-green-100 hover:text-green-700"
                          } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1 text-green-700" />
                          {reply.likes}
                        </Button>
                        <Button
                          variant={getReplyInteraction(comment.id, reply.id).disliked ? "default" : "ghost"}
                          size="sm"
                          onClick={() => !readOnly && handleReplyDislike(comment.id, reply.id)}
                          disabled={readOnly}
                          className={`h-6 px-1.5 text-xs ${
                            getReplyInteraction(comment.id, reply.id).disliked
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "hover:bg-red-100 hover:text-red-700"
                          } ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          <ThumbsDown className="h-3 w-3 mr-1 text-red-600" />
                          {reply.dislikes}
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs h-6 px-2 ml-auto ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
                        onClick={() => !readOnly && toggleReplyToReply(comment.id, reply.id, reply.user)}
                        disabled={readOnly}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show reply input right after the specific reply being replied to */}
              {showReplyInput[comment.id] && 
              replyingTo[comment.id]?.replyId === reply.id && (
                <div className={`ml-4 pl-4 ${readOnly ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {replyingTo[comment.id]?.user && !readOnly && (
                        <div className="mb-1 text-xs text-blue-600">
                          Replying to {replyingTo[comment.id].user.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1 ml-1 text-xs"
                            onClick={() => {
                              setReplyingTo((prev) => ({
                                ...prev,
                                [comment.id]: null,
                              }));
                              setReplyInputs((prev) => ({
                                ...prev,
                                [comment.id]: prev[comment.id].replace(
                                  new RegExp(`^@${replyingTo[comment.id].user.name}\\s`),
                                  ""
                                ),
                              }));
                            }}
                            disabled={readOnly}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                      <Textarea
                        placeholder={
                          readOnly 
                            ? "Replying is disabled for this document"
                            : replyingTo[comment.id]?.user
                            ? `Reply to ${replyingTo[comment.id].user.name}...`
                            : "Write a reply..."
                        }
                        className="min-h-[60px] resize-none"
                        value={readOnly ? "" : (replyInputs[comment.id] || "")}
                        onChange={(e) => !readOnly && handleReplyChange(comment.id, e.target.value)}
                        disabled={readOnly}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="mr-2"
                          onClick={() => cancelReply(comment.id)}
                          disabled={readOnly}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => submitReply(comment.id)}
                          disabled={readOnly || !replyInputs[comment.id]?.trim()}
                        >
                          <Send className="h-3 w-3 mr-1.5" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Show reply input at the end only when replying to the main comment */}
          {showReplyInput[comment.id] && 
          (!replyingTo[comment.id]?.replyId) && (
            <div className={`pl-4 ${readOnly ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {replyingTo[comment.id]?.user && !readOnly && (
                    <div className="mb-1 text-xs text-blue-600">
                      Replying to {replyingTo[comment.id].user.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1 ml-1 text-xs"
                        onClick={() => {
                          setReplyingTo((prev) => ({
                            ...prev,
                            [comment.id]: null,
                          }));
                          setReplyInputs((prev) => ({
                            ...prev,
                            [comment.id]: prev[comment.id].replace(
                              new RegExp(`^@${replyingTo[comment.id].user.name}\\s`),
                              ""
                            ),
                          }));
                        }}
                        disabled={readOnly}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  <Textarea
                    placeholder={
                      readOnly 
                        ? "Replying is disabled for this document"
                        : replyingTo[comment.id]?.user
                        ? `Reply to ${replyingTo[comment.id].user.name}...`
                        : "Write a reply..."
                    }
                    className="min-h-[60px] resize-none"
                    value={readOnly ? "" : (replyInputs[comment.id] || "")}
                    onChange={(e) => !readOnly && handleReplyChange(comment.id, e.target.value)}
                    disabled={readOnly}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mr-2"
                      onClick={() => cancelReply(comment.id)}
                      disabled={readOnly}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => submitReply(comment.id)}
                      disabled={readOnly || !replyInputs[comment.id]?.trim()}
                    >
                      <Send className="h-3 w-3 mr-1.5" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reply input - Show but disable when readOnly */}
      {showReplyInput[comment.id] && (
        <div className={`mt-4 ml-8 pl-4 ${readOnly ? 'opacity-60' : ''}`}>
          <div className="flex items-start gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {replyingTo[comment.id]?.user && !readOnly && (
                <div className="mb-1 text-xs text-blue-600">
                  Replying to {replyingTo[comment.id].user.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-1 ml-1 text-xs"
                    onClick={() => {
                      setReplyingTo((prev) => ({
                        ...prev,
                        [comment.id]: null,
                      }));
                      setReplyInputs((prev) => ({
                        ...prev,
                        [comment.id]: prev[comment.id].replace(
                          new RegExp(`^@${replyingTo[comment.id].user.name}\\s`),
                          ""
                        ),
                      }));
                    }}
                    disabled={readOnly}
                  >
                    ×
                  </Button>
                </div>
              )}
              <Textarea
                placeholder={
                  readOnly 
                    ? "Replying is disabled for this document"
                    : replyingTo[comment.id]?.user
                    ? `Reply to ${replyingTo[comment.id].user.name}...`
                    : "Write a reply..."
                }
                className="min-h-[60px] resize-none"
                value={readOnly ? "" : (replyInputs[comment.id] || "")}
                onChange={(e) => !readOnly && handleReplyChange(comment.id, e.target.value)}
                disabled={readOnly}
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="mr-2"
                  onClick={() => cancelReply(comment.id)}
                  disabled={readOnly}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => submitReply(comment.id)}
                  disabled={readOnly || !replyInputs[comment.id]?.trim()}
                >
                  <Send className="h-3 w-3 mr-1.5" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
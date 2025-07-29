// /components/comment-section/CommentInputSection.jsx
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Users, Globe, Upload, X, Send, FileText, Image, FileIcon } from "lucide-react";

export function CommentInputSection({
  currentUser,
  newComment,
  setNewComment,
  visibility,
  setVisibility,
  isUserLevelTask,
  selectedFiles, // Changed from selectedFile to selectedFiles
  setSelectedFiles, // Changed from setSelectedFile to setSelectedFiles
  fileInputRef,
  handleFileUpload,
  submitComment,
  readOnly
}) {
  if (readOnly) return null;

  // Helper function to get appropriate icon for file type
  const getFileIcon = (fileType) => {
    if (fileType === 'image') return <Image className="h-3 w-3 text-blue-500" />;
    if (fileType === 'pdf') return <FileText className="h-3 w-3 text-red-500" />;
    if (fileType === 'docx' || fileType === 'doc') return <FileText className="h-3 w-3 text-blue-600" />;
    return <FileIcon className="h-3 w-3 text-gray-500" />;
  };

  // Helper function to remove a specific file
  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Helper function to clear all files
  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4 sticky top-0 z-10">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="mb-2">
            <Textarea
              placeholder="Write a comment..."
              className="min-h-[80px] resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>

          {/* Selected Files Display */}
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                </span>
                <button 
                  onClick={clearAllFiles}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedFiles.map((selectedFile, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded px-3 py-2 border">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getFileIcon(selectedFile.fileType)}
                      <span className="text-xs truncate flex-1" title={selectedFile.file.name}>
                        {selectedFile.file.name}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {(selectedFile.file.size / 1024).toFixed(1)}KB
                      </span>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="ml-2 p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Visibility Dropdown */}
              {isUserLevelTask ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 h-8 px-3"
                    >
                      {visibility === "individual" && (
                        <>
                          <User className="h-3.5 w-3.5 text-blue-600" />
                          <span className="text-xs text-blue-600">For Me</span>
                        </>
                      )}
                      {visibility === "public" && (
                        <>
                          <Globe className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-xs text-green-600">Public</span>
                        </>
                      )}
                      <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-32">
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-xs cursor-pointer"
                      onClick={() => setVisibility("individual")}
                    >
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-blue-600">For Me</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-xs cursor-pointer"
                      onClick={() => setVisibility("public")}
                    >
                      <Globe className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-green-600">Public</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 h-8 px-3"
                    >
                      {visibility === "private" && (
                        <>
                          <Users className="h-3.5 w-3.5 text-slate-600" />
                          <span className="text-xs">Group Only</span>
                        </>
                      )}
                      {visibility === "public" && (
                        <>
                          <Globe className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-xs text-green-600">Public</span>
                        </>
                      )}
                      {visibility === "individual" && (
                        <>
                          <User className="h-3.5 w-3.5 text-blue-600" />
                          <span className="text-xs text-blue-600">For Me</span>
                        </>
                      )}
                      <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-32">
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-xs cursor-pointer"
                      onClick={() => setVisibility("individual")}
                    >
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-blue-600">For Me</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-xs cursor-pointer"
                      onClick={() => setVisibility("private")}
                    >
                      <Users className="h-3.5 w-3.5" />
                      Group Only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-xs cursor-pointer"
                      onClick={() => setVisibility("public")}
                    >
                      <Globe className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-green-600">Public</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
                multiple // Added multiple attribute
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current.click()}
                className="h-8"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Attachment
              </Button>
            </div>

            <Button
              size="sm"
              onClick={submitComment}
              disabled={!newComment.trim() && (!selectedFiles || selectedFiles.length === 0)}
              className="bg-blue-600"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Post Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
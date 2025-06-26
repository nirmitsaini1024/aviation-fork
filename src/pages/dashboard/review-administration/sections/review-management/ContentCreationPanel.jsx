import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  X,
  FileText,
  Link,
  MousePointer2,
  Type,
  Upload,
  Eye,
  FilePen,
  FileTextIcon,
  Search,
  Check,
  Link2,
} from "lucide-react";
import { useContext, useState } from "react";
import TipTap from "./sub-component/TextEditor";
import { ReviewManagementContext } from "./Context/ReviewManagementProvider";

export default function ContentCreationPanel({
  entireDocumentSelected,
  setEntireDocumentSelected,
  entireDocumentGroupName,
  setEntireDocumentGroupName,
  entireDocumentNote,
  setEntireDocumentNote,
  groupName,
  setGroupName,
  isGroupNameEmpty,
  setIsGroupNameEmpty,
  reviewContent,
  setReviewContent,
  showFooterContentInReview,
  setShowFooterContentInReview,
  openFooterTextArea,
  setOpenFooterTextArea,
  footerContent,
  setFooterContent,
  isWritingContent,
  setIsWritingContent,
  manualContent,
  setManualContent,
  addingTo,
  setAddingTo,
  addingToGroupId,
  setAddingToGroupId,
  editingContent,
  setEditingContent,
  referReviewDocuments,
  setReferReviewDocuments,
  showDocSelector,
  setShowDocSelector,
  activeContentItem,
  setActiveContentItem,
  contentReferenceDocs,
  setContentReferenceDocs,
  searchTextindocx,
  setSearchTextindocx,
  availableDocuments,
  savedGroups,
  setSavedGroups,
  expandedGroups,
  setExpandedGroups,
  currentPage,
  setSelectedPage,
  setSelectedText,
  setSearchText,
  setActiveSearchItem,
  documentName,
  openFileDialog,
  openDocumentViewer,
}) {
  const [IsaddChapter, setIsAddChapter] = useState(false);
  const { chapterDescription, setChapterDescription } = useContext(ReviewManagementContext)
  // Handle entire document selection
  const handleEntireDocumentChange = (checked) => {
    setEntireDocumentSelected(checked);
    if (checked) {
      setAddingTo(null);
      setAddingToGroupId(null);
      setIsWritingContent(null);
      setManualContent("");
      setEditingContent(null);
    }

    if (IsaddChapter) {
      setIsAddChapter(false);
    }
  };

  const handleAddChapters = (checked) => {
    setIsAddChapter(!IsaddChapter);
    if (checked === true) {
      setEntireDocumentSelected(false);
    }
  };

  // Handle entire document inputs
  const handleEntireDocumentNoteChange = (e) => {
    setEntireDocumentNote(e.target.value);
  };

  const handleEntireDocumentGroupNameChange = (e) => {
    setEntireDocumentGroupName(e.target.value);
  };

  // Save entire document group
  const saveEntireDocumentGroup = () => {
    if (!entireDocumentSelected || !entireDocumentNote.trim()) return;

    const newGroup = {
      id: `group-entire-${Date.now()}`,
      name: entireDocumentGroupName,
      documentName: documentName,
      reviewContent: [
        {
          id: `review-entire-${Date.now()}`,
          content: entireDocumentNote,
          fileName: "",
          hasImage: false,
          fileType: null,
          isEntireDocument: true,
        },
      ],
      relatedContent: [],
      isEntireDocument: true,
    };

    setSavedGroups([...savedGroups, newGroup]);
    setEntireDocumentNote("");
    setEntireDocumentGroupName("Entire Document Reference");
    setEntireDocumentSelected(false);
    setExpandedGroups({
      ...expandedGroups,
      [newGroup.id]: true,
    });
  };

  // Handle group name changes
  const handleNameChange = (e) => {
    setGroupName(e.target.value);
    if (isGroupNameEmpty) {
      setIsGroupNameEmpty(false);
    }
  };

  // Content creation handlers
  const addReviewContentBySelection = () => {
    setSelectedPage(currentPage);
    if (entireDocumentSelected) return;
    setAddingTo("review");
    setAddingToGroupId(null);
    setIsWritingContent(null);
    setEditingContent(null);

    // Reset search states
    setSearchText("");
    setActiveSearchItem(null);
  };

  const writeReviewContent = () => {
    setIsWritingContent("review");
    setAddingToGroupId(null);
    setAddingTo(null);
    setEditingContent(null);

    // Reset search states
    setSearchText("");
    setActiveSearchItem(null);
  };

  const handleManualContentChange = (e) => {
    setManualContent(e.target.value);
  };

  const saveManualContent = () => {
    if (!manualContent.trim()) return;

    if (isWritingContent === "review" && !addingToGroupId) {
      const newId = `review-${Date.now()}`;
      setReviewContent([
        ...reviewContent,
        {
          id: newId,
          content: manualContent,
          page: "(Manually added)",
          fileName: "",
          hasImage: false,
          fileType: null,
        },
      ]);
    }

    setIsWritingContent(null);
    setAddingToGroupId(null);
    setManualContent("");
  };

  const cancelWritingContent = () => {
    setIsWritingContent(null);
    setAddingToGroupId(null);
    setManualContent("");
  };

  const removeReviewItem = (id) => {
    if (entireDocumentSelected) return;
    setReviewContent(reviewContent.filter((item) => item.id !== id));
  };

  // File upload handler
  const getFileTypeFromFileName = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") return "pdf";
    if (["doc", "docx"].includes(extension)) return "docx";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
      return "image";
    return "other";
  };

  const handleFileUpload = (e) => {
    if (entireDocumentSelected) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      const newItems = Array.from(files).map((file) => {
        const newId = `review-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        const fileType = getFileTypeFromFileName(file.name);
        return {
          id: newId,
          content: "",
          fileName: file.name,
          hasImage: fileType === "image",
          fileType: fileType,
          filePath: URL.createObjectURL(file),
        };
      });

      setReviewContent([...reviewContent, ...newItems]);
    }
  };

  // Document selection handlers
  const toggleDocumentSelection = (docId, contentId = null) => {
    if (contentId) {
      setContentReferenceDocs((prev) => ({
        ...prev,
        [contentId]: prev[contentId]?.includes(docId)
          ? prev[contentId].filter((id) => id !== docId)
          : [...(prev[contentId] || []), docId],
      }));
    } else {
      setReferReviewDocuments((prev) =>
        prev.includes(docId)
          ? prev.filter((id) => id !== docId)
          : [...prev, docId]
      );
    }
  };

  const removeContentReference = (contentId, docId) => {
    setContentReferenceDocs((prev) => ({
      ...prev,
      [contentId]: prev[contentId]?.filter((id) => id !== docId) || [],
    }));
  };

  const openInNewTab = () => {
    window.open("/refdoc", "_blank");
  };

  // Save group
  const saveGroup = () => {
    if (entireDocumentSelected || reviewContent.length === 0) return;

    if (groupName.length === 0) {
      setIsGroupNameEmpty(true);
      return;
    }

    const contentWithReferences = reviewContent.map((item) => ({
      ...item,
      referencedDocuments: contentReferenceDocs[item.id] || [],
    }));

    const newGroup = {
      id: `group-${Date.now()}`,
      name: groupName,
      documentName: documentName,
      reviewContent: contentWithReferences,
      relatedContent: [],
      footerContent: footerContent,
      referencedDocuments: [...referReviewDocuments],
    };

    setSavedGroups([...savedGroups, newGroup]);
    setReviewContent([]);
    setGroupName("");
    setReferReviewDocuments([]);
    setSelectedText("");
    setContentReferenceDocs({});
    setFooterContent("");
    setShowFooterContentInReview("");
    setOpenFooterTextArea(false);
    setExpandedGroups({
      ...expandedGroups,
      [newGroup.id]: true,
    });
  };

  // Content Card Component
  const ContentCard = ({ id, item, onRemove }) => (
    <div className="bg-white border my-3 border-gray-100 rounded-lg p-4 relative shadow-sm hover:shadow-md transition-all duration-200">
      <button
        onClick={() => onRemove(id)}
        className={`absolute top-3 right-3 ${
          entireDocumentSelected
            ? "text-gray-200 cursor-not-allowed"
            : "text-gray-300 hover:text-red-400 transition-colors duration-200"
        }`}
        disabled={entireDocumentSelected}
      >
        <X size={16} />
      </button>

      {!item.hasImage && !item.fileType && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDocSelector(true);
            setActiveContentItem(id);
          }}
          className={`absolute top-3 right-10 ${
            entireDocumentSelected
              ? "text-gray-200 cursor-not-allowed"
              : "text-blue-300 hover:text-blue-500 transition-colors duration-200"
          }`}
          disabled={entireDocumentSelected}
        >
          <Link2 size={16} />
        </button>
      )}

      {item.fileType && item.fileType !== "image" ? (
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <FileText
              className={`h-4 w-4 mr-2 ${
                item.fileType === "pdf" ? "text-red-500" : "text-blue-500"
              }`}
            />
            <span className="text-sm text-gray-600 flex-1">
              {item.fileName}
            </span>
            <button
              onClick={() => openDocumentViewer(item)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Eye className="h-4 w-4 text-blue-500" />
            </button>
          </div>
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText
                className={`w-12 h-12 mx-auto mb-2 ${
                  item.fileType === "pdf" ? "text-red-500" : "text-blue-500"
                }`}
              />
              <p className="text-sm text-gray-600">
                {item.fileType === "pdf" ? "PDF Document" : "Word Document"}
              </p>
            </div>
          </div>
        </div>
      ) : item.hasImage ? (
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm text-gray-600 flex-1">
              {item.fileName}
            </span>
            <button
              onClick={() => openFileDialog(item)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Eye className="h-4 w-4 text-blue-500" />
            </button>
          </div>
          <img
            src={item.filePath || item.imageSrc}
            alt={item.fileName}
            className="w-full h-32 object-cover rounded cursor-pointer"
            onClick={() => openFileDialog(item)}
          />
        </div>
      ) : (
        <div className="pr-6 text-gray-700">
          <div>
            {item.content}
            {item.page && typeof item.page === "string" ? (
              <span className="text-gray-500 inline-flex text-sm ml-2 italic">
                {item.page}
              </span>
            ) : (
              item.page?.length > 0 && (
                <span className="text-gray-500 inline-flex text-sm ml-2 italic">
                  (Page {item.page.join(", ")})
                </span>
              )
            )}
          </div>
          {contentReferenceDocs[id] && contentReferenceDocs[id].length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {contentReferenceDocs[id].map((docId) => {
                const doc = availableDocuments.find((d) => d.id === docId);
                return doc ? (
                  <Badge
                    key={docId}
                    variant="outline"
                    className="text-xs px-2 py-0.5 flex items-center border-blue-200 bg-blue-50"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInNewTab();
                      }}
                      className="p-0.5 rounded hover:bg-blue-300 transition-colors mr-1"
                    >
                      <Eye className="h-3 w-3 text-blue-600" />
                    </button>
                    <span className="text-blue-700">{doc.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeContentReference(id, docId);
                      }}
                      className="ml-1 rounded-full p-0.5 hover:bg-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Entire Document Selection */}
      <div className="mb-4 p-2 sm:p-4 bg-blue-50 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-x-7">
          <div className="flex gap-x-3 items-center">
            <Checkbox
              id="entire-document"
              checked={entireDocumentSelected}
              onCheckedChange={handleEntireDocumentChange}
              className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-blue-400"
            />
            <label
              htmlFor="entire-document"
              className="text-xs sm:text-sm font-medium leading-none text-blue-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <span className="flex items-center font-semibold">
                Select entire document
              </span>
            </label>
          </div>

          <div className="flex gap-x-3 items-center">
            <Checkbox
              id="add-chapters"
              checked={IsaddChapter}
              onCheckedChange={handleAddChapters}
              className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-blue-400"
            />
            <label
              htmlFor="entire-document"
              className="text-xs sm:text-sm font-medium leading-none text-blue-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <span className="flex items-center font-semibold">
                Add Chapters
              </span>
            </label>
          </div>
        </div>

        {entireDocumentSelected && (
          <div className="mt-4 p-2 sm:p-4 z-40 bg-white rounded-lg border border-blue-200">
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Document Description
              </label>
              <Input
                value={entireDocumentGroupName}
                onChange={handleEntireDocumentGroupNameChange}
                className="w-full border border-gray-300 text-sm"
                placeholder="Enter a name for this reference group"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Write a Note
              </label>
              <textarea
                value={entireDocumentNote}
                onChange={handleEntireDocumentNoteChange}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 min-h-20 sm:min-h-24 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 focus:outline-none text-sm"
                placeholder="Write your note about the entire document here..."
              />
            </div>

            <Button
              onClick={saveEntireDocumentGroup}
              className="w-full py-3 sm:py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
              disabled={!entireDocumentNote.trim()}
            >
              <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Save
            </Button>
          </div>
        )}

        {IsaddChapter && (
          <div className="mt-4 bg-white w-full rounded-lg border border-blue-200">
            <div className="flex my-2 sm:my-4 items-center flex-1 px-2 relative">
              <span className="bg-blue-500 w-1 h-6 sm:h-8 rounded mr-3 absolute left-1 top-[50%]"></span>
              <div className="flex flex-col w-full gap-y-2 ml-2">
                <label
                  htmlFor="chapterdescription"
                  className="text-gray-700 font-medium text-sm sm:text-base"
                >
                  Chapter Title
                </label>
                <Input
                  className="font-medium text-xl sm:text-3xl text-gray-800 focus:border-none focus:outline-none focus-visible:ring-blue-200 border border-gray-300"
                  placeholder="Write chapter title here..."
                  onChange={(e) => setChapterDescription(e.target.value)}
                  value={chapterDescription}
                  autoFocus
                />
              </div>
            </div>
            <TipTap />
          </div>
        )}
      </div>

      {/* Regular Content Section */}
      <div
        className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-6 ${
          entireDocumentSelected || IsaddChapter
            ? "opacity-50 pointer-events-none"
            : ""
        }`}
      >
        <div className="flex items-center justify-between border-b pb-2 sm:pb-4 mb-3 sm:mb-6">
          <div className="flex items-center flex-1">
            <span className="bg-blue-500 w-1 h-6 sm:h-8 rounded mr-2 sm:mr-3"></span>
            <Input
              value={groupName}
              onChange={handleNameChange}
              className="font-medium text-lg  text-gray-800 focus:border-none focus:outline-none focus-visible:ring-blue-200 border border-gray-300"
              placeholder="Write Change Control Title/Modification here..."
              autoFocus
            />
          </div>
        </div>

        {showDocSelector ? (
          <div className="space-y-2 border border-gray-300 rounded-lg p-2 sm:p-3 bg-muted/50">
            {activeContentItem && (
              <div className="text-xs sm:text-sm text-blue-600 font-medium mb-2 flex items-center">
                <Link2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Selecting reference documents
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-7 sm:pl-9 mb-2 border border-gray-200 text-sm"
                onChange={(e) => setSearchTextindocx(e.target.value)}
              />
            </div>

            <div className="max-h-40 sm:max-h-52 overflow-y-auto">
              {availableDocuments
                .filter((doc) =>
                  doc.name
                    .toLowerCase()
                    .includes(searchTextindocx.toLowerCase())
                )
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 p-1.5 sm:p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() =>
                      toggleDocumentSelection(doc.id, activeContentItem)
                    }
                  >
                    <div
                      className={`w-3 h-3 sm:w-4 sm:h-4 border rounded-sm flex items-center justify-center ${
                        (
                          activeContentItem
                            ? contentReferenceDocs[activeContentItem]?.includes(
                                doc.id
                              )
                            : referReviewDocuments.includes(doc.id)
                        )
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {(activeContentItem
                        ? contentReferenceDocs[activeContentItem]?.includes(
                            doc.id
                          )
                        : referReviewDocuments.includes(doc.id)) && (
                        <Check className="h-2 w-2 sm:h-3 sm:w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm">{doc.name}</span>
                  </div>
                ))}
            </div>

            <Button
              onClick={() => {
                setShowDocSelector(false);
                setActiveContentItem(null);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 mt-2 text-xs sm:text-sm"
              size="sm"
            >
              Select
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
            <div className="flex-1 flex flex-col min-h-0">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-700 flex items-center">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-blue-500" />
                Change Control Title / Modification Conditions
              </h3>

              <div
                className="space-y-3 flex-1 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 24rem)" }}
              >
                {reviewContent.length > 0 ? (
                  <div>
                    {reviewContent.map((item) => (
                      <ContentCard
                        key={item.id}
                        id={item.id}
                        item={item}
                        onRemove={removeReviewItem}
                      />
                    ))}
                    {showFooterContentInReview.length > 0 && (
                      <div className="bg-white relative my-3 border border-gray-100 rounded-lg p-2 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
                        <div className="flex gap-x-1 items-center pr-2">
                          <span className="text-sm">
                            {showFooterContentInReview}
                            <span className="text-gray-500 text-xs sm:text-sm ml-1 italic">
                              (Manually added footer details)
                            </span>
                          </span>
                        </div>
                        <div className="flex absolute right-2 sm:right-3 top-2 items-center gap-x-2 sm:gap-x-3">
                          <button onClick={() => setOpenFooterTextArea(true)}>
                            <FilePen className="w-3 h-3 text-blue-300 hover:text-blue-500" />
                          </button>
                          <button
                            onClick={() => {
                              setShowFooterContentInReview("");
                              setFooterContent("");
                            }}
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {showFooterContentInReview.length > 0 ? (
                      <div className="bg-white my-3 border border-gray-100 rounded-lg p-2 sm:p-4 relative shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
                        <div className="flex gap-x-1 items-center">
                          <span className="text-sm">
                            {showFooterContentInReview}
                            <span className="text-gray-500 text-xs sm:text-sm ml-1 italic">
                              (Manually added footer details)
                            </span>
                          </span>
                        </div>
                        <div className="flex absolute top-2 right-2 sm:right-3 items-center gap-x-2 sm:gap-x-3">
                          <button onClick={() => setOpenFooterTextArea(true)}>
                            <FilePen className="w-3 h-3 text-blue-300 hover:text-blue-500" />
                          </button>
                          <button
                            onClick={() => setShowFooterContentInReview("")}
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[12rem] sm:min-h-[14rem] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                        <FileTextIcon className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-50" />
                        <span className="text-sm sm:text-base">
                          Please select your content here
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Manual content writing */}
              {isWritingContent === "review" && !addingToGroupId && (
                <div className="mt-4 border border-blue-200 rounded-lg p-2 sm:p-3 bg-blue-50">
                  <textarea
                    value={manualContent}
                    onChange={handleManualContentChange}
                    className="w-full p-2 border border-blue-100 rounded bg-white text-gray-700 min-h-20 sm:min-h-24 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 focus:outline-none text-sm"
                    placeholder="Write your content here..."
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={saveManualContent}
                      variant="default"
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm"
                      disabled={!manualContent.trim()}
                    >
                      <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={cancelWritingContent}
                      variant="outline"
                      className="hover:bg-red-50 border-red-100 text-red-500 hover:text-red-600 text-xs sm:text-sm"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Content Area */}
        {openFooterTextArea ? (
          <div className="mb-4 mt-4 border border-blue-200 rounded-lg p-2 sm:p-3 bg-blue-50">
            <textarea
              value={footerContent}
              onChange={(e) => setFooterContent(e.target.value)}
              className="w-full p-2 resize-y border border-blue-100 rounded bg-white text-gray-700 min-h-20 sm:min-h-24 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 focus:outline-none text-sm"
              placeholder="Write your footer content here..."
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => {
                  setOpenFooterTextArea(false);
                  setShowFooterContentInReview(footerContent);
                }}
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm"
                disabled={!footerContent.trim()}
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Save
              </Button>
              <Button
                onClick={() => setOpenFooterTextArea(false)}
                variant="outline"
                className="hover:bg-red-50 border-red-100 text-red-500 hover:text-red-600 text-xs sm:text-sm"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!isWritingContent && !editingContent && !addingToGroupId && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  onClick={addReviewContentBySelection}
                  variant="outline"
                  className={`rounded-lg border text-xs sm:text-sm ${
                    addingTo === "review"
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  }`}
                  disabled={addingTo === "review" || entireDocumentSelected}
                >
                  {addingTo === "review" ? (
                    "Waiting..."
                  ) : (
                    <>
                      <MousePointer2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Select
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setOpenFooterTextArea(true)}
                  variant="outline"
                  className="rounded-lg border hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-xs sm:text-sm"
                >
                  <FilePen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Footer
                </Button>

                <Button
                  onClick={writeReviewContent}
                  variant="outline"
                  className="rounded-lg border hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-xs sm:text-sm"
                  disabled={addingTo === "review"}
                >
                  <Type className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Note
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    multiple
                    disabled={entireDocumentSelected}
                  />
                  <label
                    htmlFor="file-upload"
                    className="rounded-lg border font-medium w-full h-full flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-xs sm:text-sm py-2"
                  >
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Upload
                  </label>
                </div>
              </div>
            )}
          </>
        )}

        {/* Reference Documents Section */}
        <div className="mt-4 mb-3 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <Link size={14} className="text-blue-600 sm:w-4 sm:h-4" />
              <h3 className="text-xs sm:text-sm font-medium">
                Reference Documents
              </h3>
            </div>
            <Button
              variant="ghost"
              className="hover:bg-blue-500 hover:text-white text-xs sm:text-sm"
              size="sm"
              onClick={() => setShowDocSelector(!showDocSelector)}
            >
              {showDocSelector ? "Hide" : "Link Ref-Doc"}
            </Button>
          </div>

          {referReviewDocuments.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
              {referReviewDocuments.map((docId) => {
                const doc = availableDocuments.find((d) => d.id === docId);
                return (
                  <Badge
                    key={docId}
                    variant="secondary"
                    className="pl-1 sm:pl-2 pr-1 py-0.5 sm:py-1 text-xs"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInNewTab();
                      }}
                      className="p-0.5 rounded hover:bg-blue-300 transition-colors mr-1"
                    >
                      <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600" />
                    </button>
                    <span className="text-blue-800">{doc?.name}</span>
                    <button
                      onClick={() => toggleDocumentSelection(docId)}
                      className="ml-1 rounded-full p-0.5 hover:bg-accent"
                    >
                      <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        {/* Save Group Button */}
        <div className="mt-4 sm:mt-8">
          <Button
            onClick={saveGroup}
            className="w-full py-4 sm:py-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
            disabled={
              entireDocumentSelected ||
              reviewContent.length === 0 ||
              groupName.length === 0
            }
          >
            <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </>
  );
}

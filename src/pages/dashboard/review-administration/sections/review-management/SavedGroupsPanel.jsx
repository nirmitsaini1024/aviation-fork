import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown, ChevronUp, Trash2, Pencil, Undo2,
  FileText, Link2, MousePointer2, Type, Upload,
  Eye, X, Save, FilePen, Search
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function SavedGroupsPanel({
  savedGroups,
  setSavedGroups,
  expandedGroups,
  setExpandedGroups,
  confirmDeleteDocument,
  setConfirmDeleteDocument,
  IseditGroupNameByUsingId,
  setIsEditGroupNameByUsingId,
  editedGroupName,
  setEditedGroupName,
  confirmDelete,
  setConfirmDelete,
  entireDocumentSelected,
  isWritingContent,
  setIsWritingContent,
  manualContent,
  setManualContent,
  addingToGroupId,
  setAddingToGroupId,
  addingTo,
  setAddingTo,
  editingContent,
  setEditingContent,
  activeSearchItem,
  setActiveSearchItem,
  searchText,
  setSearchText,
  footerContent,
  setFooterContent,
  isEditFooterContent,
  setIsEditFooterContent,
  deleteFooterContent,
  setDeleteFooterContent,
  availableDocuments,
  currentPage,
  setSelectedPage,
  openFileDialog,
  openDocumentViewer,
}) {
  const [showReviewModificationCard, setShowReviewModificationCard] = useState(false);

  const handleDeleteSavedGroupsData = (index, groupId) => {
    const updatedGroups = savedGroups.filter((group) => group.id !== groupId);
    setSavedGroups(updatedGroups);
    setConfirmDeleteDocument(null);
  };

  const handleEditedGroupName = (index) => {
    if (editedGroupName.length === 0) {
      toast.warning("Control title is required", {
        duration: 1000,
        position: "top-right",
      });
      return;
    }
    savedGroups[index].name = editedGroupName;
    setIsEditGroupNameByUsingId(null);
    setEditedGroupName("");
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups({
      ...expandedGroups,
      [groupId]: !expandedGroups[groupId],
    });
  };

  const addSavedGroupReviewContentBySelection = (groupId) => {
    if (entireDocumentSelected) return;
    setSelectedPage(currentPage);
    setAddingTo("review");
    setAddingToGroupId(groupId);
    setIsWritingContent(null);
    setEditingContent(null);
    
    // Reset search states
    setSearchText("");
    setActiveSearchItem(null);
  };

  const writeSavedGroupReviewContent = (groupId) => {
    setIsWritingContent("review");
    setAddingToGroupId(groupId);
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

    if (isWritingContent === "review" && addingToGroupId) {
      const newId = `review-${Date.now()}`;
      const newItem = {
        id: newId,
        content: manualContent,
        page: "(Manually added)",
        fileName: "",
        hasImage: false,
        fileType: null,
      };

      setSavedGroups(
        savedGroups.map((group) => {
          if (group.id === addingToGroupId) {
            return {
              ...group,
              reviewContent: [...group.reviewContent, newItem],
            };
          }
          return group;
        })
      );
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

  const removeSavedGroupReviewItem = (groupId, itemId) => {
    if (entireDocumentSelected) return;

    setSavedGroups(
      savedGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            reviewContent: group.reviewContent.filter(
              (item) => item.id !== itemId
            ),
          };
        }
        return group;
      })
    );
  };

  const startEditSavedContent = (groupId, contentId) => {
    if (entireDocumentSelected) return;
    setAddingTo(null);
    setAddingToGroupId(null);
    setIsWritingContent(null);
    setManualContent("");
    setSearchText("");
    setActiveSearchItem(null);
    setEditingContent({ groupId, contentId });
  };

  const handleSearchContent = (contentId, text) => {
    if (activeSearchItem === contentId) {
      setActiveSearchItem(null);
      setSearchText("");
    } else {
      setActiveSearchItem(null);
      setSearchText("");
      setTimeout(() => {
        setSearchText(text);
        setActiveSearchItem(contentId);
      }, 100);
    }
  };

  const getFileTypeFromFileName = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") return "pdf";
    if (["doc", "docx"].includes(extension)) return "docx";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "image";
    return "other";
  };

  const handleSavedGroupFileUpload = (e, groupId) => {
    if (entireDocumentSelected) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      const updatedGroups = [...savedGroups];
      const groupIndex = updatedGroups.findIndex((group) => group.id === groupId);

      if (groupIndex !== -1) {
        Array.from(files).forEach((file) => {
          const newId = `review-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          const fileType = getFileTypeFromFileName(file.name);

          const newItem = {
            id: newId,
            content: "",
            fileName: file.name,
            hasImage: fileType === "image",
            fileType: fileType,
            filePath: URL.createObjectURL(file),
          };

          updatedGroups[groupIndex].reviewContent.push(newItem);
        });

        setSavedGroups(updatedGroups);
      }
    }
  };

  const removeReferenceDocument = (index, docId, savedGroups) => {
    if (!docId) return;

    const updatedGroups = savedGroups.map((group, i) => {
      if (
        i === index &&
        group.referencedDocuments &&
        Array.isArray(group.referencedDocuments)
      ) {
        return {
          ...group,
          referencedDocuments: group.referencedDocuments.filter(
            (refDocId) => refDocId !== docId
          ),
        };
      }
      return group;
    });
    setSavedGroups(updatedGroups);
  };

  const handleEditFooter = () => {
    const updatedGroupdoc = savedGroups.map((obj) => {
      if (obj.id === isEditFooterContent) {
        return { ...obj, footerContent: footerContent };
      }
      return obj;
    });

    setSavedGroups(updatedGroupdoc);
    setIsEditFooterContent(null);
    setFooterContent("");
  };

  const handleDeleteFooterContent = () => {
    const updatedSavedDocs = savedGroups.map((obj) => {
      if (obj.id === deleteFooterContent) {
        return { ...obj, footerContent: null };
      }
      return obj;
    });

    setSavedGroups(updatedSavedDocs);
    setDeleteFooterContent(null);
    setFooterContent("");
  };

  const openInNewTab = () => {
    window.open("/refdoc", "_blank");
  };

  if (savedGroups.length === 0) return null;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${
      entireDocumentSelected ? "opacity-50 pointer-events-none" : ""
    }`}>
     <h2 onClick={()=>{
            setShowReviewModificationCard(!showReviewModificationCard);
            setExpandedGroups({})
          }} className={`text-xl hover:cursor-pointer  font-medium  text-gray-800 flex items-center justify-between  ${showReviewModificationCard ? "border-b pb-4 mb-6" : ""}`}>
          <div className="flex">
            <span className="bg-green-500 w-1 h-8 rounded mr-3"></span>
            Change Control Title / Modification for Review
          </div>
          <ChevronDown className={`hover:text-gray-800 text-gray-400 ease-in-out duration-500 transition-all hover:cursor-pointer ${showReviewModificationCard  ? "rotate-180" : "rotate-0"}`} />
        </h2>

      <div className={`space-y-4 ${showReviewModificationCard ? "block" : "hidden"}`}>
        {savedGroups.map((group, index) => (
          <div
            key={group.id}
            className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            {confirmDeleteDocument === group.id ? (
              <div className="bg-gradient-to-r from-gray-50 py-2 to-gray-100 px-4 flex justify-between items-center cursor-pointer">
                <div className="w-full space-y-3">
                  <p className="w-full font-semibold">
                    Are you sure you want to delete this?
                  </p>
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteDocument(null);
                      }}
                      className="bg-white rounded-md hover:bg-gray-100 ease-in-out transition-400 px-3 py-1 border-1 border-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSavedGroupsData(index, group.id);
                      }}
                      className="bg-red-300 rounded-md hover:bg-red-400 ease-in-out transition-400 px-3 py-1 border-1 border-gray-300"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleGroup(group.id)}
              >
                <div className="flex flex-1 items-center">
                  <h3 className="font-semibold text-gray-700 flex items-center flex-1">
                    <span className="bg-red-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                      {index + 1}
                    </span>
                    <div className="flex-1 mr-5">
                      {IseditGroupNameByUsingId === group.id ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={editedGroupName}
                            onChange={(e) => setEditedGroupName(e.target.value)}
                            placeholder="Change Control Title/Modification here..."
                            className="focus:outline-none focus:border-none focus:ring-gray-300 border-1 border-gray-300"
                          />
                        </div>
                      ) : (
                        <>{group.name}</>
                      )}
                    </div>
                    {group.isEntireDocument && (
                      <span className="mx-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Entire Document
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex gap-x-4 items-center">
                  <div>
                    {IseditGroupNameByUsingId === group.id ? (
                      <div className="flex items-center gap-x-4">
                        <Undo2
                          className="text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditGroupNameByUsingId(null);
                          }}
                        />
                        <button
                          className="w-full py-1 px-3 rounded-lg bg-blue-500 hover:bg-blue-700 ease-in-out text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditedGroupName(index);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-x-4 items-center">
                        <Trash2
                          size={16}
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteDocument(group.id);
                            setExpandedGroups({});
                          }}
                        />
                        <Pencil
                          size={16}
                          className="text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditGroupNameByUsingId(group.id);
                            setEditedGroupName(group.name);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {expandedGroups[group.id] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            )}

            {expandedGroups[group.id] && (
              <div className="p-4 bg-white">
                {/* Reference Documents Section */}
                {group.referencedDocuments && group.referencedDocuments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-500 flex items-center mb-2">
                      <Link2 className="h-4 w-4 mr-2 text-blue-500" />
                      Reference Documents
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.referencedDocuments.map((docId) => {
                        const doc = availableDocuments.find((d) => d.id === docId);
                        return doc ? (
                          <Badge
                            key={docId}
                            variant="secondary"
                            className="bg-gray-100 border-none px-2 py-1 flex items-center gap-1"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openInNewTab();
                              }}
                              className="p-1 rounded hover:bg-blue-200 transition-colors"
                            >
                              <Eye className="h-4 w-4 text-blue-500" />
                            </button>
                            <span className="text-sm text-gray-800">{doc.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeReferenceDocument(index, docId, savedGroups);
                              }}
                              className="ml-1 p-1 rounded hover:bg-red-200 transition-colors"
                            >
                              <X className="h-3 w-3 text-red-500" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-sm text-gray-500 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        Change Control Title / Modification Contents
                      </h4>
                      {!group.isEntireDocument && (
                        <div className="flex space-x-1">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              addSavedGroupReviewContentBySelection(group.id);
                            }}
                            variant="outline"
                            size="icon"
                            className={`h-7 w-7 p-1 rounded-full ${
                              addingTo === "review" && addingToGroupId === group.id
                                ? "bg-blue-100 text-blue-600"
                                : "hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                            }`}
                            disabled={
                              entireDocumentSelected ||
                              (addingTo === "review" && addingToGroupId === group.id) ||
                              editingContent !== null
                            }
                            title="Select text from document"
                          >
                            <MousePointer2 className="h-4 w-4" />
                          </Button>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              writeSavedGroupReviewContent(group.id);
                            }}
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 p-1 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                            disabled={
                              isWritingContent !== null ||
                              editingContent !== null
                            }
                            title="Write a note"
                          >
                            <Type className="h-4 w-4" />
                          </Button>

                          <div className="relative">
                            <input
                              type="file"
                              id={`file-upload-${group.id}`}
                              className="hidden"
                              accept="image/*,.pdf,.doc,.docx"
                              onChange={(e) => handleSavedGroupFileUpload(e, group.id)}
                              multiple
                              disabled={entireDocumentSelected}
                            />
                            <label
                              htmlFor={`file-upload-${group.id}`}
                              className="flex items-center justify-center h-7 w-7 p-1 rounded-full border cursor-pointer hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                              title="Upload files (images, PDF, DOCX)"
                            >
                              <Upload className="h-4 w-4" />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {isWritingContent === "review" && addingToGroupId === group.id && (
                      <div className="mb-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
                        <textarea
                          value={manualContent}
                          onChange={handleManualContentChange}
                          className="w-full p-2 border border-blue-100 rounded bg-white text-gray-700 min-h-24 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 focus:outline-none"
                          placeholder="Write your content here..."
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <Button
                            onClick={saveManualContent}
                            variant="default"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            disabled={!manualContent.trim()}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            onClick={cancelWritingContent}
                            variant="outline"
                            className="hover:bg-red-50 border-red-100 text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {group.reviewContent.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2 ${
                            activeSearchItem === item.id
                              ? "bg-green-100 border-green-200 shadow-sm"
                              : editingContent &&
                                editingContent.groupId === group.id &&
                                editingContent.contentId === item.id
                              ? "bg-blue-200 border-blue-300 shadow-sm"
                              : "bg-blue-50 border-blue-100 hover:bg-blue-100"
                          } rounded-lg border text-sm text-gray-700 relative group cursor-pointer`}
                          onClick={() =>
                            !item.hasImage &&
                            !item.fileType &&
                            !item.isEntireDocument
                              ? handleSearchContent(item.id, item.content)
                              : null
                          }
                        >
                          {!item.hasImage &&
                            !item.fileType &&
                            !item.isEntireDocument &&
                            !group.isEntireDocument && (
                              <div className="absolute top-2 right-2 flex flex-row space-x-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditSavedContent(group.id, item.id);
                                  }}
                                  className={`p-1 rounded ${
                                    editingContent &&
                                    editingContent.groupId === group.id &&
                                    editingContent.contentId === item.id
                                      ? "bg-blue-200 text-blue-600"
                                      : "group-hover:bg-blue-100 text-blue-500"
                                  }`}
                                  disabled={
                                    entireDocumentSelected ||
                                    editingContent !== null ||
                                    confirmDelete
                                  }
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDelete(item.id);
                                  }}
                                  className="p-1 rounded hover:bg-red-100 text-red-500"
                                  disabled={entireDocumentSelected || editingContent}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            )}

                          {item.isEntireDocument ? (
                            <div className="pr-6">
                              <div className="flex items-center mb-2">
                                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                <span className="text-blue-600 font-medium">
                                  Entire Document Note
                                </span>
                              </div>
                              {item.content}
                            </div>
                          ) : item.fileType === "pdf" ? (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-red-500" />
                                <span className="text-sm flex-1">{item.fileName}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDocumentViewer(item);
                                  }}
                                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                >
                                  <Eye className="h-4 w-4 text-red-500" />
                                </button>
                              </div>
                              <div className="mt-2 h-16 bg-red-50 rounded flex items-center justify-center">
                                <p className="text-red-600 text-xs">PDF Document</p>
                              </div>
                            </div>
                          ) : item.fileType === "docx" || item.fileType === "doc" ? (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm flex-1">{item.fileName}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDocumentViewer(item);
                                  }}
                                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                >
                                  <Eye className="h-4 w-4 text-blue-500" />
                                </button>
                              </div>
                              <div className="mt-2 h-16 bg-blue-50 rounded flex items-center justify-center">
                                <p className="text-blue-600 text-xs">Word Document</p>
                              </div>
                            </div>
                          ) : item.hasImage ? (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-green-500" />
                                <span className="text-sm flex-1">{item.fileName}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFileDialog(item);
                                  }}
                                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                >
                                  <Eye className="h-4 w-4 text-green-500" />
                                </button>
                              </div>
                              <img
                                src={item.filePath || item.imageSrc}
                                alt={item.fileName || "Image"}
                                className="mt-2 w-full h-16 object-cover rounded cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openFileDialog(item);
                                }}
                              />
                            </div>
                          ) : (
                            <div className="pr-6 max-h-[200px] overflow-y-scroll scroll-container">
                              <div className="flex items-center">
                                {activeSearchItem === item.id && (
                                  <Search className="h-3 w-3 text-green-600 mr-1 inline-block" />
                                )}
                                <span>
                                  {item.content}
                                  {item.page &&
                                  typeof item.page === "string" ? (
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
                                </span>
                              </div>
                              {item.referencedDocuments &&
                                item.referencedDocuments.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {item.referencedDocuments.map((docId) => {
                                      const doc = availableDocuments.find(
                                        (d) => d.id === docId
                                      );
                                      return doc ? (
                                        <Badge
                                          key={docId}
                                          variant="outline"
                                          className="text-xs px-2 py-0.5 flex items-center"
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
                                          <span className="text-blue-700">
                                            {doc.name}
                                          </span>
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                )}
                            </div>
                          )}

                          {confirmDelete === item.id && editingContent === null && (
                            <div className="flex justify-end items-center mr-2 mt-4 gap-x-3">
                              <button
                                className="bg-white rounded-md hover:bg-gray-100 ease-in-out transition-400 px-3 py-1 border-1 border-gray-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDelete(null);
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-red-300 rounded-md hover:bg-red-400 ease-in-out transition-400 px-3 py-1 border-1 border-gray-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSavedGroupReviewItem(group.id, item.id);
                                  setConfirmDelete(false);
                                }}
                              >
                                Confirm
                              </button>
                            </div>
                          )}
                          {editingContent &&
                            editingContent.groupId === group.id &&
                            editingContent.contentId === item.id && (
                              <div className="mt-2 text-blue-600 text-xs flex justify-end items-center">
                                <MousePointer2 className="h-3 w-3 mr-1 animate-pulse" />
                                Select new text to replace this content
                              </div>
                            )}
                        </div>
                      ))}

                      {group.reviewContent.length === 0 && (
                        <div className="text-gray-400 text-sm p-3 bg-gray-50 rounded-lg border border-gray-100 italic">
                          No review content
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Content Section */}
                <div>
                  {group.footerContent &&
                    (isEditFooterContent === group.id ? (
                      <div className="mt-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
                        <textarea
                          value={footerContent}
                          onChange={(e) => setFooterContent(e.target.value)}
                          className="w-full p-2 border border-blue-100 rounded bg-white text-gray-700 resize-none min-h-60 focus:ring-2 focus:ring-blue-200 focus:border-blue-300 focus:outline-none"
                          placeholder="Edit your footer here..."
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <Button
                            onClick={handleEditFooter}
                            variant="default"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            disabled={!footerContent.trim()}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditFooterContent(null);
                            }}
                            variant="outline"
                            className="hover:bg-red-50 border-red-100 text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 group hover:cursor-pointer hover:bg-blue-100 my-2 rounded-md p-2 relative">
                        <div className="max-h-[200px] overflow-y-auto flex w-full scroll-container">
                          <p className="text-sm text-gray-700">
                            {group.footerContent}
                            <span className="text-gray-500 text-sm ml-1 italic">
                              (Manually added footer details)
                            </span>
                          </p>
                        </div>

                        <div className="group-hover:flex hidden ease-in-out transition-all duration-150 items-center absolute top-2 right-3 gap-x-2">
                          <Pencil
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditFooterContent(group.id);
                              setFooterContent(group.footerContent);
                            }}
                            className="text-blue-500 hover:cursor-default w-4 h-4 hover:text-blue-700 group-hover:bg-blue-100"
                          />
                          <button
                            className="p-1 rounded hover:bg-red-100 text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteFooterContent(group.id);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {deleteFooterContent === group.id && (
                          <div className="flex justify-end items-center mr-2 mt-4 gap-x-3">
                            <button
                              className="bg-white rounded-md hover:bg-gray-100 ease-in-out transition-400 px-3 py-1 border-1 border-gray-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteFooterContent(null);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className="bg-red-300 rounded-md hover:bg-red-400 ease-in-out transition-400 px-3 py-1 border-1 border-gray-300"
                              onClick={handleDeleteFooterContent}
                            >
                              Confirm
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
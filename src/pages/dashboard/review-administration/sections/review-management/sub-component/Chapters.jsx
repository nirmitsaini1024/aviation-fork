import { useContext, useState } from "react";
import { ReviewManagementContext } from "../Context/ReviewManagementProvider";
import TipTap from "./TextEditor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  ChevronDown,
  Pencil,
  Save,
  Trash2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReadOnlyEditor from "./ReadOnlyTextEditor";

const Chapters = ({ entireDocumentSelected }) => {
  const { setShowAllChapters, showAllChapters, editChapter, setEditChapter } =
    useContext(ReviewManagementContext);

  const [openAccordion, setOpenAccordion] = useState(null);
  const [deleteChapter, setDeleteChapter] = useState(null);
  const [renameChapter, setRenameChapter] = useState("");
  const [renameChapterId, setRenameChapterId] = useState(null);
  const [editChapterId, setEditChapterId] = useState(null);
  const [showAddedChaptersCard, setShowAddedChapters] = useState(false);

  const handleAccordionChange = (id) => {
    if (renameChapterId === id) return;
    setOpenAccordion((openAccordion) => (openAccordion === id ? null : id));
    setEditChapter(false);
  };

  const handleDeleteChapter = () => {
    if (deleteChapter === null) return;

    setShowAllChapters(() => {
      return showAllChapters.filter((chapter) => {
        return chapter.id !== deleteChapter;
      });
    });

    setDeleteChapter(null);
  };

  const handleSaveRenameChapter = () => {
    if (renameChapterId === null || renameChapter.length === 0) return;

    setShowAllChapters(() => {
      return showAllChapters.map((chapter) => {
        if (chapter.id === renameChapterId) {
          chapter.title = renameChapter;
          chapter.titleWithHtmlTag = `<h1>${renameChapter}</h1>`;
          return chapter;
        }
        return chapter;
      });
    });

    setRenameChapter("");
    setRenameChapterId(null);
  };
  return (
    <>
      {showAllChapters.length > 0 && (
        <div
          className={`bg-white rounded-xl shadow-lg p-6 ${
            entireDocumentSelected ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <h2
            onClick={() => {
              setShowAddedChapters(!showAddedChaptersCard);
              setOpenAccordion(null);
            }}
            className={`text-xl hover:cursor-pointer  font-medium  text-gray-800 flex items-center justify-between  ${
              showAddedChaptersCard ? "border-b pb-4 mb-6" : ""
            }`}
          >
            <div className="flex">
              <span className="bg-green-500 w-1 h-8 rounded mr-3"></span>
              Added Chapters
            </div>
            <ChevronDown
              className={`hover:text-gray-800 text-gray-400 ease-in-out duration-500 transition-all hover:cursor-pointer ${
                showAddedChaptersCard ? "rotate-180" : "rotate-0"
              }`}
            />
          </h2>

          {
            showAddedChaptersCard && (
              <Accordion
            type="single"
            collapsible
            className="space-y-4"
            value={openAccordion}
            onValueChange={handleAccordionChange}
          >
            {showAllChapters.map((chapters, index) => (
              <div key={index}>
                {deleteChapter === chapters.id ? (
                  <div className="border border-red-200 rounded-lg overflow-hidden bg-red-50">
                    <div className="px-6 py-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-red-900 mb-2">
                            Delete Chapter
                          </h3>
                          <p className="text-red-700 mb-1">
                            Are you sure you want to delete "{chapters.title}"?
                          </p>
                          <p className="text-red-600 text-sm mb-6">
                            This action cannot be undone.
                          </p>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setDeleteChapter(null)}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteChapter}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete Chapter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AccordionItem
                    key={chapters.id}
                    value={chapters.id}
                    className="border border-gray-200  rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:cursor-pointer bg-gray-100 hover:no-underline flex justify-between items-center w-full [&>svg]:hidden">
                      <div className="flex items-center  w-full gap-x-4">
                        <span className="font-medium bg-red-200 px-2.5 py-0.5 rounded-full text-[13px] text-gray-700">
                          {index + 1}
                        </span>
                        {renameChapterId === chapters.id ? (
                          <div className="flex items-center w-full">
                            <Input
                              value={renameChapter}
                              onChange={(e) => setRenameChapter(e.target.value)}
                              placeholder="Rename your chapter..."
                              className="border-gray-300  border-1 w-full "
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-[15px] text-gray-700">
                            {chapters.title}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-x-4 items-center">
                        {renameChapterId === chapters.id ? (
                          <div className="flex items-center gap-x-4">
                            <Undo2
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenameChapter("");
                                setRenameChapterId(null);
                              }}
                              className="w-4 h-4 text-gray-600"
                            />
                            <button
                              disabled={renameChapter.length === 0}
                              className={`flex  gap-x-1  ease-in-out duration-300 transition-all px-3 max-h-fit py-2 items-center rounded-md  hover:cursor-pointer hover:shadow-xl text-white ${
                                renameChapter.length === 0
                                  ? "bg-blue-300"
                                  : "hover:bg-blue-600 bg-blue-500"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveRenameChapter();
                              }}
                            >
                              {" "}
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-x-4 items-center">
                            <Trash2
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteChapter(chapters.id);
                              }}
                              className="w-4 h-4 transition-all  ease-in-out duration-300 text-red-600"
                            />
                            <Pencil
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenameChapter(chapters.title);
                                setRenameChapterId(chapters.id);
                                setOpenAccordion(null);
                              }}
                              className="w-4 h-4 text-gray-600 hover:text-gray-700"
                            />
                          </div>
                        )}
                        <ChevronDown
                          className={`w-5 h-5  transition-all ease-in-out duration-300 text-gray-400 ${
                            openAccordion === chapters.id
                              ? "rotate-180"
                              : "rotate-none"
                          }`}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <div className="border-t border-gray-200">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-between items-center cursor-pointer">
                          {editChapter ? (
                            <TipTap
                              content={chapters.markdown}
                              openAccordion={openAccordion}
                              editAfterSave={true}
                              chapterId={chapters.id}
                              isEditModeOn={chapters.id}
                              editChapterId={editChapterId}
                              setEditChapterId={setEditChapterId}
                            />
                          ) : (
                            <ReadOnlyEditor content={chapters.markdown} />
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </div>
            ))}
          </Accordion>
            )
          }

          {/* <div>
        {
          showAllChapters.map((chapters, index)=>(
            <div key={index}>
               <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-between items-center cursor-pointer">
                <TipTap content={chapters.markdown}/>
               </div>
            </div>
          ))
        }
      </div> */}
        </div>
      )}
    </>
  );
};

export default Chapters;

import { createContext, useEffect, useState } from "react";

export const ReviewManagementContext = createContext();

const ReviewManagementProvider = ({ children }) => {
  const [chapterDescription, setChapterDescription] = useState("");
  const [showAllChapters, setShowAllChapters] = useState([]);
  const [editChapter, setEditChapter] = useState(false);


  useEffect(()=>{
    console.log(showAllChapters)
  }, [showAllChapters])
  return (
    <ReviewManagementContext.Provider
      value={{
        chapterDescription,
        setChapterDescription,
        setShowAllChapters,
        showAllChapters,
        editChapter, setEditChapter
      }}
    >
      {children}
    </ReviewManagementContext.Provider>
  );
};

export default ReviewManagementProvider;

import { useContext } from "react";
import { RequestInfoContext } from "../../context/RequestInfoContext";

const UseSaveDocGenTemplate = () => {
  const {
    docGenTemplateDataList,
    setDocGenTemplateDataList,
    docGenForUploadTemplate,
    setDocGenForUploadTemplate,
    setEditDocGenData,
    editDocGenData,
  } = useContext(RequestInfoContext);
  const saveDocGenTemplate = (filter) => {
    const {
      docGenName,
      type,
      domain,
      department,
      category,
      file,
      docGenTemplateDescription,
    } = filter;

    setDocGenTemplateDataList((prev) => [
      ...prev,
      {
        id: docGenTemplateDataList.length + 1,
        name: docGenName,
        type,
      },
    ]);

    setDocGenForUploadTemplate((prev) => [
      ...prev,
      {
        id: docGenForUploadTemplate.length + 1,
        name: docGenName,
        type,
        domain,
        department,
        searchedCategory: category,
        files: file,
        docGenTemplateDescription,
      },
    ]);
  };

  const saveEditedDocGenTemplate = (filter) => {
    const {
      docGenName,
      type,
      file,
      docGenTemplateDescription,
    } = filter;
    const newDocGen = {
      id: editDocGenData.id,
      domain: editDocGenData.domain,
      department: editDocGenData.department,
      searchedCategory: editDocGenData.searchedCategory,
      name: docGenName,
      type,
      files: file,
      docGenTemplateDescription,
    };

    setDocGenTemplateDataList((prev) => {
      return prev.map((item) => {
        if (item.id === editDocGenData.id) {
          return newDocGen;
        }
        return item;
      });
    });

    setDocGenForUploadTemplate((prev) => {
      return prev.map((item) => {
        if (item.id === editDocGenData.id) {
          return newDocGen;
        }

        return item;
      });
    });

    setEditDocGenData(null);
  };

  return { saveDocGenTemplate, saveEditedDocGenTemplate };
};

export default UseSaveDocGenTemplate;

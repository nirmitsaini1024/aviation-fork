import { useContext } from "react";
import { RequestInfoContext } from "../../context/RequestInfoContext";

const UseSaveRFITemplate = () => {
  const {
    rfiDetailsForUploadTemplate,
    setRfiDetailsForUploadTemplate,
    editTemplateData,
    setEditTemplateData,
  } = useContext(RequestInfoContext);
  const saveRFiTemplate = (filters) => {
    // console.log("In hook: ", rfiDetailsForUploadTemplate);
    // console.log("Function is executing...");
    // console.log("The filters are: ", filters);

    const newTemplateSave = {
      id: rfiDetailsForUploadTemplate.length + 1,
      rfiName: filters.questionWithTypes.rfiTemplateName,
      rfiTemplateDescription: filters.rfiTemplateDescription,
      data: filters.questionWithTypes.data.map((item) => ({
        id: item.id,
        domain: filters.domain,
        department: filters.department,
        searchedCategory: filters.category,
        question: item.question,
        answerFormat: item.type,
      })),
    };
    setRfiDetailsForUploadTemplate((prev) => [...prev, newTemplateSave]);
  };

  const saveEditedTemplate = (filters) => {
    const newEditedTemplateSave = {
      id: editTemplateData.id,
      rfiName: filters.rfiTemplateName,
      files: editTemplateData.files || null,
      rfiTemplateDescription: filters.rfiTemplateDescription,
      data: filters.questionWithTypes.data.map((item) => ({
        id: new Date(),
        domain: editTemplateData.data[0]?.domain,
        searchedCategory: editTemplateData.data[0]?.searchedCategory,
        department: editTemplateData.data[0]?.department,
        question: item.question,
        answerFormat: item.type,
      })),
    };

    setRfiDetailsForUploadTemplate((prev) => {
      return prev.map((item) => {
        if (item.id === editTemplateData.id) {
          return newEditedTemplateSave;
        }
        return item;
      });
    });

    setEditTemplateData(null);
  };

  const saveRFIForUploads = (filters) => {
    const newTemplateSave = {
      id: rfiDetailsForUploadTemplate.length + 1,
      rfiName: filters.rfiName,
      rfiTemplateDescription: filters.rfiTemplateDescription,
      files: filters.file,
      data: [
        {
          id: Date.now(),
          domain: filters.domain,
          department: filters.department,
          searchedCategory: filters.category,
        },
      ],
    };
    setRfiDetailsForUploadTemplate((prev) => [...prev, newTemplateSave]);
  };

  const saveEditedRFIForUploads = (filters) => {
    const newEditedTemplateSave = {
      id: editTemplateData.id,
      rfiName: filters.rfiName,
      rfiTemplateDescription: filters.rfiTemplateDescription,
      files: filters.file,
      data: [
        {
          id: Date.now(),
          domain: editTemplateData.data[0]?.domain,
          department: editTemplateData.data[0]?.department,
          searchedCategory: editTemplateData.data[0]?.searchedCategory,
        },
      ],
    };

    setRfiDetailsForUploadTemplate((prev) => {
      return prev.map((item) => {
        if (item.id === editTemplateData.id) {
          return newEditedTemplateSave;
        }
        return item;
      });
    });

    setEditTemplateData(null);
  };

  return {
    saveRFiTemplate,
    saveRFIForUploads,
    saveEditedTemplate,
    saveEditedRFIForUploads,
  };
};

export default UseSaveRFITemplate;

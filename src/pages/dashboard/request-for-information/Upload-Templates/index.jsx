import { useState } from "react";
import TableTemplates from "./components/TableTemplates";
import UploadTemplateFilter from "./components/UploadTemplateFilter";
import CustomQuestion from "./components/CustomQuestion";
import UploadTemplateForFile from "./components/UploadTemplateForFile";

export const UploadTemplatesMain = () => {
  const [showTemplates, setShowTemplate] = useState(true);
  const [domain, setDomain] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [ShowUploadFile, setShowUploadFile] = useState(false);
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
          Upload Questionnaire <span className="text-blue-600">— Templates</span>
        </h3>

        <UploadTemplateFilter
          showTemplates={showTemplates}
          setShowTemplate={setShowTemplate}
          domain={domain}
          department={department}
          category={category}
          setDomain={setDomain}
          setDepartment={setDepartment}
          setCategory={setCategory}
          setShowUploadFile={setShowUploadFile}
          ShowUploadFile={ShowUploadFile}
        />
      </div>
      {showTemplates ? (
        <TableTemplates
          setShowTemplate={setShowTemplate}
          setShowUploadFile={setShowUploadFile}
        />
      ) : (
        <>
          {ShowUploadFile ? (
            <UploadTemplateForFile
              setShowTemplate={setShowTemplate}
              setShowUploadFile={setShowUploadFile}
              domain={domain}
              department={department}
              category={category}
            />
          ) : (
            <CustomQuestion
              showTemplates={showTemplates}
              setShowTemplate={setShowTemplate}
              domain={domain}
              department={department}
              category={category}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UploadTemplatesMain;

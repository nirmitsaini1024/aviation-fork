import { useState } from "react";
import UploadDocTemplateFilter from "./components/DocGenFilter";
import UploadDocGenTemplateForFile from "./components/UploadDocGenFile";
import DocGenTableTemplates from "./components/DocGenTableTemplates";

export const ReportTemplate = () => {
  const [showTemplates, setShowTemplate] = useState(true);
  const [domain, setDomain] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [ShowUploadFile, setShowUploadFile] = useState(false);
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
         Upload Report <span className="text-blue-600">— Templates</span>
        </h3>

        <UploadDocTemplateFilter
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
        <DocGenTableTemplates
          setShowTemplate={setShowTemplate}
          setShowUploadFile={setShowUploadFile}
        />
      ) : (
        <UploadDocGenTemplateForFile
          setShowTemplate={setShowTemplate}
          setShowUploadFile={setShowUploadFile}
          domain={domain}
          department={department}
          category={category}
        />
      )}
    </div>
  );
};

export default ReportTemplate;

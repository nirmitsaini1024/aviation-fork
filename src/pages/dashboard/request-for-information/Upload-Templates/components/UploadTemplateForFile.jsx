import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, File, Upload, X } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import UseSaveRFITemplate from "../hooks/useSaveRfiTemplate";
import { Textarea } from "@/components/ui/textarea";
import { RequestInfoContext } from "../../context/RequestInfoContext";

const UploadTemplateForFile = ({
  setShowTemplate,
  setShowUploadFile,
  domain,
  department,
  category,
}) => {
  const [uploadFile, setUploadFile] = useState(null);
  const uploadFileRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [rfiName, setRfiName] = useState("");
  const { saveRFIForUploads, saveEditedRFIForUploads } = UseSaveRFITemplate();
  const [rfiDescription, setRfiDescription] = useState("");
  const { editTemplateData, setEditTemplateData } =
    useContext(RequestInfoContext);

  useEffect(() => {
    if (editTemplateData === null) return;

    setUploadFile(editTemplateData.files);
    setRfiName(editTemplateData.rfiName);
    setRfiDescription(editTemplateData.rfiTemplateDescription);
  }, []);
  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setUploadFile(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadFile(file.name);
    }
  };

  const handleBrowseClick = () => {
    uploadFileRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadFile(null);
    if (uploadFileRef.current) {
      uploadFileRef.current.value = "";
    }
  };

  const handleSaveFile = () => {
    const filter = {
      domain,
      department,
      category,
      file: uploadFile,
      rfiName,
      rfiTemplateDescription: rfiDescription,
    };
    if (editTemplateData === null) {
      saveRFIForUploads(filter);
    } else {
      saveEditedRFIForUploads(filter);
    }
    setShowTemplate(true);
    setShowUploadFile(false);
  };

  return (
    <div className="bg-blue-50 rounded-bl-lg rounded-br-lg shadow-lg border border-slate-200/50 py-8 px-6 min-h-[500px]">
      <div className="space-y-2">
        <div className="space-y-3">
          <div className="w-full flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-800">
                Upload File
              </h3>
              <p className="text-sm text-slate-600">
                Select or drag and drop your file to get started
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowUploadFile(false);
                setShowTemplate(true);
                setEditTemplateData(null);
              }}
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 bg-slate-50 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-10">
            <label
              htmlFor="rfi-name"
              className="block text-sm font-medium text-slate-700"
            >
              RFI Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="rfi-name"
              type="text"
              value={rfiName}
              onChange={(e) => setRfiName(e.target.value)}
              placeholder="Enter RFI name or description"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-0 focus:ring-blue-500 focus:border-0 transition-all duration-200 bg-white"
            />
            <p className="text-xs text-slate-500">
              Provide a clear, descriptive name for this RFI
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`relative min-h-[280px] border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : uploadFile
                ? "border-green-300 bg-green-50"
                : "border-blue-300 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <Input
              ref={uploadFileRef}
              type="file"
              onChange={handleUploadFile}
              id="upload-files"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx,.txt,.csv"
            />

            <div className="space-y-4">
              {uploadFile ? (
                <>
                  <div className="flex items-center mt-5 justify-center w-16 h-16 mx-auto bg-emerald-100 rounded-full shadow-sm">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-emerald-700">
                      File uploaded successfully!
                    </p>
                    <p className="text-sm text-slate-600 font-medium truncate max-w-full px-4">
                      {uploadFile}
                    </p>
                    {/* {fileSize && <p className="text-xs text-slate-500">{formatFileSize(fileSize)}</p>} */}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center mt-5 w-16 h-16 mx-auto bg-blue-100 rounded-full shadow-sm">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-medium text-slate-700 mb-1">
                        Drop your file here, or{" "}
                        <span className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                          browse
                        </span>
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                      <span className="text-xs font-medium text-slate-600">
                        Supported formats:
                      </span>
                      <span className="text-xs text-slate-500">
                        PDF, DOC, DOCX, TXT, CSV
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4  pt-5">
            <label
              htmlFor="template-description"
              className="text-sm font-medium text-slate-700"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="template-description"
              placeholder="R.F.I Template Description"
              value={rfiDescription}
              onChange={(e) => setRfiDescription(e.target.value)}
              className="h-10 border-slate-200 bg-white p-2 border min-h-[150px] focus:border-0 focus:ring-0"
            />
          </div>

          {/* File Preview */}
          {uploadFile && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded">
                  <File className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                    {uploadFile}
                  </p>
                  <p className="text-xs text-gray-500">Ready to upload</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSaveFile}
            disabled={
              !uploadFile ||
              !domain ||
              !department ||
              !category ||
              !rfiDescription ||
              !rfiName
            }
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploadFile ? "Continue" : "Select File"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadTemplateForFile;

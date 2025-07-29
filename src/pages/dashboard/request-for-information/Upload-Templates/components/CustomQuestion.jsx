import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Plus,
  FileText,
  Table,
  BarChart3,
  Edit3,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle,
  Building2,
  Users,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Copy,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import UseSaveRFITemplate from "../hooks/useSaveRfiTemplate";
import { Textarea } from "@/components/ui/textarea";
import { RequestInfoContext } from "../../context/RequestInfoContext";
import DeleteConfirmation from "./DeleteConfirmation";

const CustomQuestion = ({
  showTemplates,
  setShowTemplate,
  domain,
  department,
  category,
}) => {
  const { editTemplateData, setEditTemplateData } =
    useContext(RequestInfoContext);
  const { saveRFiTemplate, saveEditedTemplate } = UseSaveRFITemplate();
  const [questionWithTypes, setQuestionWithType] = useState({
    rfiTemplateName: "",
    rfiTemplateDescription: "",
    data: [],
  });
  const [rfiTemplateName, setRfiTemplateName] = useState("");
  const [rfiDescription, setRfiDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [isEdit, setIsEdit] = useState(null);
  const [type, setType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteQuestion, setDeleteQuestion] = useState(null);

  useEffect(() => {
    if (!editTemplateData || editTemplateData === null) return;
    setRfiDescription(editTemplateData.rfiTemplateDescription);
    setRfiTemplateName(editTemplateData.rfiName);
    setQuestionWithType({
      rfiTemplateName: editTemplateData.rfiName,
      rfiTemplateDescription: editTemplateData.rfiTemplateDescription,
      data: editTemplateData.data.map((item) => {
        return {
          id: item.id,
          question: item.question,
          type: item.answerFormat,
          domain: item.domain,
          searchedCategory: item.searchedCategory,
          department: item.department,
          updatedAt: item.startDate,
        };
      }),
    });
  }, []);

  const handleAddMore = () => {
    if (isEdit && question.trim().length > 0) {
      setQuestionWithType((prev) => ({
        ...prev,
        data: prev.data.map((item) => {
          if (item.id === isEdit) {
            return {
              ...item,
              question: question.trim(),
              type: type,
              updatedAt: new Date().toISOString(),
            };
          }
          return item;
        }),
      }));
      setQuestion("");
      setType("");
      setIsEdit(null);
      return;
    }

    if (question.trim() && type && rfiTemplateName.trim()) {
      const newQuestion = {
        id: Date.now(),
        question: question.trim(),
        type: type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setQuestionWithType((prev) => ({
        rfiTemplateName: rfiTemplateName,
        data: [...prev.data, newQuestion],
      }));

      setQuestion("");
      setType("");
    }
  };

  const saveTemplate = () => {
    setQuestionWithType((prev) => ({
      ...prev,
      rfiTemplateName: rfiTemplateName,
      rfiTemplateDescription: rfiDescription,
    }));

    console.log("Template saved:", {
      rfiTemplateName: rfiTemplateName,
      data: questionWithTypes.data,
    });
    const filters = {
      domain,
      department,
      category,
      questionWithTypes,
      rfiTemplateDescription: rfiDescription,
      rfiTemplateName,
    };

    if (editTemplateData) {
      console.log("Here in if block");
      saveEditedTemplate(filters);
    } else {
      saveRFiTemplate(filters);
    }
    setShowTemplate(true);
  };

  useEffect(() => {
    console.log(questionWithTypes);
  }, [questionWithTypes]);

  const removeQuestion = () => {
    setQuestionWithType((prev) => ({
      ...prev,
      data: prev.data.filter((q) => q.id !== deleteQuestion),
    }));
    setIsEdit(null);
    setDeleteQuestion(null);
  };

  const handleEditQuestion = (id) => {
    if (isEdit !== null && isEdit === id) {
      setQuestion("");
      setType("");
      setIsEdit(null);
    } else {
      setIsEdit(id);
      const foundQuestion = questionWithTypes.data.find(
        (item) => item.id === id
      );
      if (foundQuestion) {
        setQuestion(foundQuestion.question);
        setType(foundQuestion.type);
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Text":
        return <FileText className="w-4 h-4" />;
      case "Table":
        return <Table className="w-4 h-4" />;
      case "Chart":
        return <BarChart3 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "Text":
        return {
          color: "bg-emerald-500",
          lightColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          description: "Free-form text response",
        };
      case "Table":
        return {
          color: "bg-blue-500",
          lightColor: "bg-blue-50",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          description: "Structured tabular data",
        };
      case "Chart":
        return {
          color: "bg-purple-500",
          lightColor: "bg-purple-50",
          textColor: "text-purple-700",
          borderColor: "border-purple-200",
          description: "Visual data representation",
        };
      default:
        return {
          color: "bg-gray-500",
          lightColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          description: "Standard response",
        };
    }
  };

  const filteredQuestions = questionWithTypes.data.filter(
    (q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFormValid = question.trim() && type && rfiTemplateName.trim();
  const totalQuestions = questionWithTypes.data.length;
  const typeDistribution = questionWithTypes.data.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-blue-50 rounded-bl-lg rounded-br-lg shadow-md">
      {/* Top Navigation Bar */}
      <div className="bg-blue-50 rounded-tl-lg rounded-tr-lg border  border-slate-200 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    RFI Template Builder
                  </h1>
                  <p className="text-xs text-slate-500">
                    Enterprise Question Management
                  </p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Auto-save</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTemplate(!showTemplates);
                  setEditTemplateData(null);
                }}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Form */}
          <div className="col-span-12 lg:col-span-4">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-3">
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {totalQuestions}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                      Total Questions
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {typeDistribution.Text || 0}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                      Text
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {typeDistribution.Table || 0}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                      Tables
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {typeDistribution.Chart || 0}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                      Chart
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Form Card */}
              <Card className="border-0 shadow-lg bg-white">
                <div className="space-y-2 mx-4 pt-5">
                  <Label
                    htmlFor="template-name"
                    className="text-sm font-medium text-slate-700"
                  >
                    RFI Template Name
                  </Label>
                  <Input
                    id="template-name"
                    placeholder="R.F.I Template Name"
                    value={rfiTemplateName}
                    onChange={(e) => setRfiTemplateName(e.target.value)}
                    className="h-10 border-slate-200 border focus:border-0 focus:ring-0"
                  />
                </div>

                <div className="space-y-2 mx-4 pt-5">
                  <Label
                    htmlFor="template-description"
                    className="text-sm font-medium text-slate-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="template-description"
                    placeholder="R.F.I Template Description"
                    value={rfiDescription}
                    onChange={(e) => {
                      setRfiDescription(e.target.value);
                    }}
                    className="h-10 border-slate-200 border min-h-[150px] focus:border-0 focus:ring-0"
                  />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {isEdit ? "Edit Question" : "Add New Question"}
                  </CardTitle>
                  <p className="text-sm text-slate-500">
                    {isEdit
                      ? "Update the selected question"
                      : "Create a new question for your RFI template"}
                  </p>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="question"
                      className="text-sm font-medium text-slate-700"
                    >
                      Question
                    </Label>
                    <Input
                      id="question"
                      placeholder="Enter your question here..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="h-10 border-slate-200 border focus:border-0 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2 w-full">
                    <Label className="text-sm font-medium text-slate-700">
                      Type
                    </Label>
                    <Select
                      onValueChange={(value) => setType(value)}
                      value={type}
                    >
                      <SelectTrigger className="h-14 w-full border-slate-200 border-2 focus:border-1 focus:border-slate-200 focus:ring-0">
                        <SelectValue
                          className="py-2"
                          placeholder="Select type"
                        />
                      </SelectTrigger>
                      <SelectContent className="border-slate-200">
                        <SelectGroup>
                          <SelectLabel className="text-xs font-medium text-slate-500 uppercase tracking-wide px-2 py-1">
                            Available Formats
                          </SelectLabel>
                          {["Text", "Table", "Chart"].map(
                            (responseType, index) => {
                              const config = getTypeConfig(responseType);
                              return (
                                <SelectItem
                                  key={index}
                                  value={responseType}
                                  className="py-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-6 rounded-md flex items-center justify-center`}
                                    >
                                      {getTypeIcon(responseType)}
                                      {/* <span className="text-white text-xs">
                                        {responseType === "Text" && (
                                          <FileText className="w-3 h-3" />
                                        )}
                                        {responseType === "Table" && (
                                          <Table className="w-3 h-3" />
                                        )}
                                        {responseType === "Chart" && (
                                          <BarChart3 className="w-3 h-3" />
                                        )}
                                      </span> */}
                                    </div>
                                    <div>
                                      <div className="font-medium text-slate-900">
                                        {responseType} Response
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {config.description}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            }
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleAddMore}
                      disabled={!isFormValid}
                      className="w-full h-10 bg-blue-700 hover:bg-blue-800 text-white font-medium disabled:opacity-50"
                    >
                      {isEdit ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Update Question
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Question
                        </>
                      )}
                    </Button>
                  </div>

                  {!isFormValid && (question || type || rfiTemplateName) && (
                    <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium">Incomplete Form</div>
                        <div className="text-amber-600">
                          Please fill in all required fields to continue.
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Questions List */}
          <div className="col-span-12 lg:col-span-8 h-[850px]">
            <Card className="border-0 shadow-lg  bg-white h-full overflow-y-auto scroll-container">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-900">
                      Question Library
                      {questionWithTypes.rfiTemplateName && (
                        <span className="ml-2 text-sm font-normal text-slate-500">
                          - {questionWithTypes.rfiTemplateName}
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage and organize your RFI questions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-8 w-64 border border-slate-200 focus:border-slate-400 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {filteredQuestions.length > 0 ? (
                  <div className="space-y-3 relative">
                    {filteredQuestions.map((item, index) => {
                      const config = getTypeConfig(item.type);
                      const isEditing = isEdit === item.id;

                      return (
                        <Card
                          key={index}
                          className={`border transition-all duration-200 ${
                            isEditing
                              ? "border-slate-300 bg-slate-50 shadow-md"
                              : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="flex items-center justify-center w-7 h-7 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                                    {String(index + 1).padStart(2, "0")}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={`${config.lightColor} ${config.textColor} ${config.borderColor} font-medium`}
                                    >
                                      <div
                                        className={`w-2 h-2 ${config.color} rounded-full mr-1`}
                                      ></div>
                                      {item.type}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-slate-700 leading-relaxed pl-10 mb-2">
                                  {item.question}
                                </p>
                                <div className="flex items-center gap-4 pl-10 text-xs text-slate-500">
                                  {/* <span>
                                    Created{" "}
                                    {new Date(
                                      item.createdAt
                                    ).toLocaleDateString()}
                                  </span> */}
                                  {item.updatedAt !== item.createdAt && (
                                    <span>
                                      • Updated{" "}
                                      {new Date(
                                        item.updatedAt
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditQuestion(item.id)}
                                  className={`h-8 w-8 p-0 ${
                                    isEditing
                                      ? "bg-slate-200 text-slate-700"
                                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(
                                      item.question
                                    );
                                  }}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <p
                                  className="w-full"
                                  onClick={() => setDeleteQuestion(item.id)}
                                >
                                  <DeleteConfirmation
                                    onConfirm={removeQuestion}
                                  />
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 min-h-[450px]">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {searchTerm
                        ? "No matching questions"
                        : "No questions added yet"}
                    </h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6">
                      {searchTerm
                        ? "Try adjusting your search terms or clear the filter to see all questions."
                        : "Start building your RFI template by adding your first question using the form on the left."}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                        className="h-8 text-sm"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="px-6 py-4 mt-auto">
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              Showing {filteredQuestions.length} of {totalQuestions} questions
            </div>

            <div className="flex gap-x-4">
              <Button
                onClick={saveTemplate}
                disabled={
                  !rfiTemplateName.trim() ||
                  totalQuestions === 0 ||
                  rfiDescription.length === 0
                }
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 h-9 font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomQuestion;

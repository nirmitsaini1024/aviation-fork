import { categoryOptions } from "../../mock-data/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePlus, FileUp, Menu, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { departmentOptions, domains } from "@/mock-data/doc-center";

const UploadTemplateFilter = ({
  showTemplates,
  setShowTemplate,
  domain,
  department,
  category,
  setDomain,
  setDepartment,
  setCategory,
  ShowUploadFile,
  setShowUploadFile
}) => {

  const handleReset = () => {
    setDomain("");
    setCategory("");
    setDepartment("");
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200 shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-5 gap-x-6 w-full mb-4">
        {/* Domain Filter */}
        <div className="space-y-2">
          <label
            htmlFor="domain"
            className="block text-sm font-medium text-blue-700"
          >
            Domain
          </label>
          <div className="w-full">
            <Select value={domain} onValueChange={(value) => setDomain(value)}>
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Domain" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_domains">All Domains</SelectItem>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Department Filter */}
        <div className="space-y-2">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-blue-700"
          >
            Department
          </label>
          <div className="w-full">
            <Select
              value={department}
              onValueChange={(value) => setDepartment(value)}
              disabled={domain.length === 0}
            >
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Department" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_department">All Department</SelectItem>
                {departmentOptions[domain]?.map((department, index) => (
                  <SelectItem key={index} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Filter  */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-blue-700"
          >
            Category
          </label>
          <div className="w-full">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
              disabled={department.length === 0}
            >
              <SelectTrigger className="h-10 bg-white border-blue-200 shadow-sm w-full hover:border-blue-300 focus:ring-blue-300">
                <div className="flex items-center">
                  <Menu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All Categories</SelectItem>
                {categoryOptions[domain]?.map((cat, index) => (
                  <SelectItem key={`${cat}-${index}`} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        

        {/* Actions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-700">
            Actions
          </label>
          <div className="flex gap-y-1 gap-x-3">
            <Button
              disabled={
                domain.length === 0 ||
                department.length === 0 ||
                category.length === 0 ||
                (showTemplates === false && ShowUploadFile === false)
              }
              className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setShowTemplate(false);
                setShowUploadFile(true)
              }}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Upload Template
            </Button>
            <Button
              disabled={
                domain.length === 0 ||
                department.length === 0 ||
                category.length === 0 ||
                ShowUploadFile === true
              }
              className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setShowTemplate(false);
              }}
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
            <Button
              className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleReset}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTemplateFilter;

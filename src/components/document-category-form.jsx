import { useState } from "react"
import { Loader2, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock domains data
const domainOptions = [
  "Technology",
  "Operations", 
  "Finance",
  "Marketing",
  "Sales",
  "Legal",
  "Quality Assurance",
  "Research & Development"
];

// Mock departments data with domains - ensuring all domains have departments
const initialDepartments = [
  { id: "1", name: "Information Technology", domain: "Technology" },
  { id: "2", name: "Software Development", domain: "Technology" },
  { id: "3", name: "System Administration", domain: "Technology" },
  { id: "4", name: "Human Resources", domain: "Operations" },
  { id: "5", name: "Customer Support", domain: "Operations" },
  { id: "6", name: "Administration", domain: "Operations" },
  { id: "7", name: "Accounting", domain: "Finance" },
  { id: "8", name: "Financial Planning", domain: "Finance" },
  { id: "9", name: "Audit", domain: "Finance" },
  { id: "10", name: "Digital Marketing", domain: "Marketing" },
  { id: "11", name: "Brand Management", domain: "Marketing" },
  { id: "12", name: "Communications", domain: "Marketing" },
  { id: "13", name: "Inside Sales", domain: "Sales" },
  { id: "14", name: "Field Sales", domain: "Sales" },
  { id: "15", name: "Business Development", domain: "Sales" },
  { id: "16", name: "Legal Affairs", domain: "Legal" },
  { id: "17", name: "Compliance", domain: "Legal" },
  { id: "18", name: "Contracts", domain: "Legal" },
  { id: "19", name: "Testing", domain: "Quality Assurance" },
  { id: "20", name: "Quality Control", domain: "Quality Assurance" },
  { id: "21", name: "Process Improvement", domain: "Quality Assurance" },
  { id: "22", name: "Product Research", domain: "Research & Development" },
  { id: "23", name: "Innovation", domain: "Research & Development" },
  { id: "24", name: "Technical Research", domain: "Research & Development" },
]

export function DocumentCategoryForm({ category, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState(initialDepartments)
  const [newDepartment, setNewDepartment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    id: category?.id || "",
    domainName: category?.domainName || "",
    departmentName: category?.departmentName || "",
    categoryName: category?.categoryName || "",
    description: category?.description || "",
    receiveMode: category?.receiveMode || "upload",
  })

  // Filter departments based on selected domain
  const filteredDepartments = formData.domainName 
    ? departments.filter(dept => dept.domain === formData.domainName)
    : departments

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      
      // Reset department when domain changes
      if (name === "domainName" && value !== prev.domainName) {
        newData.departmentName = ""
      }
      
      return newData
    })
  }

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      const newId = (departments.length + 1).toString()
      setDepartments([...departments, { id: newId, name: newDepartment.trim(), domain: formData.domainName }])
      setFormData((prev) => ({ ...prev, departmentName: newDepartment.trim() }))
      setNewDepartment("")
      setIsDialogOpen(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onSave) {
        onSave(formData)
      } else {
        // Reset form after successful submission
        setFormData({
          id: "",
          domainName: "",
          departmentName: "",
          categoryName: "",
          description: "",
          receiveMode: "upload",
        })
      }
    } catch (error) {
      console.error("Form submission failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? "Edit Document Category" : "Create Document Category"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Domain and Department Name side by side with flex */}
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="space-y-2">
              <Label htmlFor="domainName" className="text-sm font-medium text-gray-700">
                Domain Name<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.domainName}
                onValueChange={(value) => handleSelectChange("domainName", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentName" className="text-sm font-medium text-gray-700">
                Department Name<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.departmentName}
                onValueChange={(value) => handleSelectChange("departmentName", value)}
                disabled={!formData.domainName}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.domainName ? "Select department" : "Select domain first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
              Category Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="categoryName"
              name="categoryName"
              placeholder="Enter category name"
              required
              value={formData.categoryName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter category description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Mode to Receive Documents</Label>
            <RadioGroup
              value={formData.receiveMode}
              onValueChange={(value) => handleSelectChange("receiveMode", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="font-normal">
                  Upload from User Computer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="folder" id="folder" />
                <Label htmlFor="folder" className="font-normal">
                  Folder Location
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="font-normal">
                  By Email
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-[#335aff] hover:bg-[#335aff]/80" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {category ? "Updating..." : "Creating..."}
              </>
            ) : category ? (
              "Update Category"
            ) : (
              "Create Category"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
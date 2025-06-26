import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

// Mock domain options
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

export function DepartmentForm({ department, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: department?.id || "",
    domain: department?.domain || "",
    name: department?.name || "",
    description: department?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDomainChange = (value) => {
    setFormData((prev) => ({ ...prev, domain: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        onSave(formData);
      } else {
        setFormData({
          id: "",
          domain: "",
          name: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{department ? "Edit Department" : "Create Department"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {/* Domain and Department Name in same row */}
          <div className="grid grid-cols-5">
            <div className="space-y-2 col-span-1">
              <Label htmlFor="domain" className="text-sm font-medium text-gray-700">
                Domain Name<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.domain}
                onValueChange={handleDomainChange}
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
            
            <div className="space-y-2 col-span-3">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Department Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter department name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter department description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
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
                {department ? "Updating..." : "Creating..."}
              </>
            ) : department ? (
              "Update Department"
            ) : (
              "Create Department"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
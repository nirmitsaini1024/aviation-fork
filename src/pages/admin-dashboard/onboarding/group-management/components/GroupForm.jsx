import { useState } from "react";
import {
  Loader2,
  UserPlus,
  X,
  Menu,
  LayoutGrid,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";
import { Badge } from "./Badge";
import { TreeDropdown } from "./TreeDropdown";
import { domains, departmentOptions, mockUsers } from "../utils/constants";

// GroupForm Component
export function GroupForm({ group, onSave, onCancel }) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: group?.id || "",
    name: group?.name || "",
    description: group?.description || "",
    domain: group?.domain || "",
    department: group?.department || "",
    reminder: group?.reminder || "",
    specificTime: group?.specificTime || "09:00",
    members: group?.members || [],
  });
  const [userSearch, setUserSearch] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Reset dependent fields when domain changes
      if (name === "domain") {
        newData.department = "";
      }

      return newData;
    });
  };

  const handleAddUser = (user) => {
    if (!formData.members.some((member) => member.id === user.id)) {
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, user],
      }));
    }
  };

  const handleRemoveUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member.id !== userId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    const newErrors = {};
    
    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Group name is required';
    }
    if (!formData.domain || formData.domain.trim() === '') {
      newErrors.domain = 'Domain is required';
    }
    if (!formData.department || formData.department.trim() === '') {
      newErrors.department = 'Department is required';
    }
    if (!formData.reminder || formData.reminder.trim() === '') {
      newErrors.reminder = 'Reminder is required';
    }
    
    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        // If creating a new group, generate a new ID
        const groupToSave = {
          ...formData,
          id: formData.id || Date.now().toString(),
        };
        onSave(groupToSave);
      }

      // Reset form only if it's a new group creation (not editing)
      if (!group) {
        setFormData({
          id: "",
          name: "",
          description: "",
          domain: "",
          department: "",
          reminder: "",
          specificTime: "09:00",
          members: [],
        });
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users for the search
  const filteredUsers = mockUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchLower = userSearch.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      user.domain.toLowerCase().includes(searchLower) ||
      user.department.toLowerCase().includes(searchLower) ||
      user.title.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group ? "Edit Group" : "Create Group"}</CardTitle>
      </CardHeader>
      <div onSubmit={handleSubmit}>
        <CardContent className="space-y-6 p-6">
          {/* Domain and Department Row - Now positioned above name fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Domain - takes first name column width */}
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-sm font-medium text-gray-700">
                Domain <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.domain}
                onValueChange={(value) => handleSelectChange("domain", value)}
              >
                <SelectTrigger className={`w-full h-10 border transition-all ${errors.domain ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}>
                  <div className="flex items-center gap-2">
                    <Menu className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Select domain" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.domain && (
                <p className="text-red-500 text-sm mt-1">{errors.domain}</p>
              )}
            </div>
            {/* Department - takes middle name column width */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange("department", value)}
                disabled={!formData.domain}
              >
                <SelectTrigger className={`w-full h-10 border transition-all disabled:bg-gray-100 ${errors.department ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Select department" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {formData.domain &&
                    departmentOptions[formData.domain]?.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                </SelectContent>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                )}
              </Select>
            </div>
            {/* Empty third column to maintain grid layout */}
            <div></div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter group name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`border transition-all ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter group description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Reminder and Specific Time Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reminder">Reminder frequency <span className="text-red-500">*</span></Label>
              <TreeDropdown
                value={formData.reminder}
                onValueChange={(value) => handleSelectChange("reminder", value)}
                placeholder="Select reminder frequency"
                error={errors.reminder}
              />
              {errors.reminder && (
                <p className="text-red-500 text-sm mt-1">{errors.reminder}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificTime">Select Time</Label>
              <Input
                id="specificTime"
                name="specificTime"
                type="time"
                value={formData.specificTime}
                onChange={handleChange}
                onKeyDown={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                className="border border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Group Members Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Group Members</h3>
              <p className="text-sm text-muted-foreground">
                Add users to this group
              </p>
            </div>

            {/* User Search */}
            <div className="relative border border-gray-400 rounded-md max-h-56 overflow-y-auto">
              <Input
                placeholder="Search users by name, domain, department, or title..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {/* User Selection List */}
            {userSearch && (
              <div className="border border-gray-400 rounded-md max-h-56 overflow-y-auto">
                <Table>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="cursor-pointer hover:bg-muted"
                        >
                          <TableCell onClick={() => handleAddUser(user)}>
                            <div className="space-y-2">
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="domain">{user.domain}</Badge>
                                <Badge variant="department">
                                  {user.department}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell onClick={() => handleAddUser(user)}>
                            {user.title}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddUser(user)}
                            >
                              <UserPlus className="h-4 w-4" />
                              <span className="sr-only">Add User</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Added Members */}
            {formData.members.length > 0 && (
              <div className="border border-gray-400 rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-600">
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Title</TableHead>
                      <TableHead className="w-16 text-white"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="domain">{member.domain}</Badge>
                              <Badge variant="department">
                                {member.department}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.title}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUser(member.id)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="bg-[#335aff] hover:bg-[#335aff]/80 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !formData.name || !formData.domain || !formData.department || !formData.reminder}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {group ? "Updating..." : "Creating..."}
              </>
            ) : group ? (
              "Update Group"
            ) : (
              "Create Group"
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
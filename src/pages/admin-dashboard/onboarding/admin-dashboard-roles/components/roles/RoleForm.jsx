import { useState } from "react";
import { Loader2 } from "lucide-react";
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

import { permissions, sections } from "../../mock-data/permissions";
import { domains, departmentOptions } from "../../mock-data/constant";

// RoleForm Component with Access Control
function RoleForm({ role, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: role?.id || "",
    name: role?.name || "",
    description: role?.description || "",
    domain: role?.domain || "",
    department: role?.department || "",
    roleName: role?.roleName || "",
    roleDescription: role?.roleDescription || "",
    effectiveDate:
      role?.effectiveDate || new Date().toISOString().split("T")[0],
    permissions: role?.permissions || {},
  });

  const [activeTab, setActiveTab] = useState("document-repository");
  const [expandedItems, setExpandedItems] = useState({
    "in-review": true,
    "approved-view": true,
    upload: true,
    group: true,
    "group-level": true,
    user: true,
    "user-level": true,
    "escalated-tasks-access": true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Reset department when domain changes
      if (name === "domain") {
        newData.department = "";
      }

      return newData;
    });
  };

  // Initialize default permission values if not already set
  const initializeDefaultPermissions = () => {
    const updatedPermissions = { ...formData.permissions };

    permissions.forEach((permission) => {
      if (permission.defaultLevel && !updatedPermissions[permission.id]) {
        updatedPermissions[permission.id] = permission.defaultLevel;
      }
    });

    if (!role) {
      setFormData((prev) => ({
        ...prev,
        permissions: updatedPermissions,
      }));
    }
  };

  // Handle permission level change
  const handlePermissionLevelChange = (permissionId, level) => {
    setFormData((prev) => {
      const updatedPermissions = {
        ...prev.permissions,
        [permissionId]: level,
      };

      // Update sub-items based on parent permission change
      permissions.forEach((permission) => {
        if (permission.subItemOf === permissionId) {
          if (level === "no_access") {
            // If parent is "no_access", set all sub-items to "no_access"
            updatedPermissions[permission.id] = "no_access";
          } else {
            // Otherwise, inherit appropriate permission based on parent level
            const inheritedPermission = getInheritedPermission(level, permission.allowedLevels);
            updatedPermissions[permission.id] = inheritedPermission;
          }
        }
      });

      return {
        ...prev,
        permissions: updatedPermissions,
      };
    });
  };

  // Toggle expanded state for an item
  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Get permission level color
  const getPermissionLevelColor = (level) => {
    switch (level) {
      case "admin_access":
        return "bg-green-100 text-green-800 border-green-200";
      case "write_access":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "read_access":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "view_access":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "edit_access":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "no_access":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get available permission levels for a permission
  const getAvailableLevels = (permission) => {
    if (permission.allowedLevels) {
      return permission.allowedLevels;
    }
    return ["admin_access", "write_access", "view_access", "no_access"];
  };

  // Get sub-items for a given item
  const getSubItems = (itemId, category, parent) => {
    return permissions.filter(
      (p) =>
        p.isSubItem &&
        p.subItemOf === itemId &&
        p.category === category &&
        (parent ? p.parent === parent : true)
    );
  };

  // Check if parent permission has no_access
  const isParentNoAccess = (parentId) => {
    const parentPermission = formData.permissions[parentId];
    return parentPermission === "no_access";
  };

  // Check if sub-item should be disabled based on parent permission
  const shouldDisableSubItem = (subItemOf) => {
    if (!subItemOf) return false;
    return isParentNoAccess(subItemOf);
  };

  // Get the appropriate permission level for a sub-item based on parent permission
  const getInheritedPermission = (parentPermission, subItemAllowedLevels) => {
    if (!subItemAllowedLevels || subItemAllowedLevels.length === 0) {
      return "no_access";
    }

    // Priority order for inheritance
    const priorityOrder = ["admin_access", "write_access", "view_access", "read_access"];
    
    switch (parentPermission) {
      case "admin_access":
        // Give the highest available permission to sub-items
        for (const level of priorityOrder) {
          if (subItemAllowedLevels.includes(level)) {
            return level;
          }
        }
        break;
      case "write_access":
        // Give write_access or the highest available permission below admin
        const writeOrder = ["write_access", "view_access", "read_access"];
        for (const level of writeOrder) {
          if (subItemAllowedLevels.includes(level)) {
            return level;
          }
        }
        break;
      case "view_access":
        // Give view_access or read_access if available
        const viewOrder = ["view_access", "read_access"];
        for (const level of viewOrder) {
          if (subItemAllowedLevels.includes(level)) {
            return level;
          }
        }
        break;
      case "read_access":
        // Give read_access if available
        if (subItemAllowedLevels.includes("read_access")) {
          return "read_access";
        }
        break;
    }
    
    return "no_access";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        // If creating a new role, generate a new ID
        const roleToSave = {
          ...formData,
          id: formData.id || Date.now().toString(),
        };
        onSave(roleToSave);
      }

      // Reset form only if it's a new role creation (not editing)
      if (!role) {
        setFormData({
          id: "",
          name: "",
          description: "",
          domain: "",
          department: "",
          roleName: "",
          roleDescription: "",
          effectiveDate: new Date().toISOString().split("T")[0],
          permissions: {},
        });
        initializeDefaultPermissions();
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPermissionSelect = (permission, permissionLevel, availableLevels, disabled = false) => (
    <Select
      value={permissionLevel}
      onValueChange={(value) =>
        handlePermissionLevelChange(permission.id, value)
      }
      disabled={disabled}
    >
      <SelectTrigger
        className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
          permissionLevel
        )} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableLevels.includes("admin_access") && (
          <SelectItem
            value="admin_access"
            className="font-medium text-green-600"
          >
            Admin Access
          </SelectItem>
        )}
        {availableLevels.includes("write_access") && (
          <SelectItem
            value="write_access"
            className="font-medium text-blue-600"
          >
            Write Access
          </SelectItem>
        )}
        {availableLevels.includes("view_access") && (
          <SelectItem
            value="view_access"
            className="font-medium text-purple-600"
          >
            View Access
          </SelectItem>
        )}
        {availableLevels.includes("read_access") && (
          <SelectItem
            value="read_access"
            className="font-medium text-amber-600"
          >
            Read Access
          </SelectItem>
        )}
        {availableLevels.includes("no_access") && (
          <SelectItem
            value="no_access"
            className="font-medium text-gray-600"
          >
            No Access
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );

  return (
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle>{role ? "Edit Role" : "Create Role"}</CardTitle>
      </CardHeader>
      <div onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Information Section */}
          <Card className="border-2 border-gray-200">
            <div className="bg-blue-50 p-4">
              <h2 className="text-xl font-bold text-blue-600">
                Basic Information
              </h2>
              <p className="text-sm text-blue-500">Define the role details</p>
            </div>
            <div className="p-6 space-y-2">
              {/* Domain and Department Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="domain" className="text-sm font-medium text-gray-700">
                    Domain <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => handleSelectChange("domain", value)}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleSelectChange("department", value)
                    }
                    disabled={!formData.domain}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.domain &&
                        departmentOptions[formData.domain]?.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter role name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Short Name*</Label>
                  <Input
                    id="roleName"
                    name="roleName"
                    placeholder="Enter role title"
                    required
                    value={formData.roleName}
                    onChange={handleChange}
                    className="border border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the purpose of this role"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="border border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* Access Control Section */}
          <div className="border-2 border-gray-200 rounded-lg">
            <div className="bg-blue-50 p-4">
              <h2 className="text-xl font-bold text-blue-600">
                Access Control
              </h2>
              <p className="text-sm text-blue-500">
                Define permissions for this role
              </p>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200">
              {Object.keys(sections).map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`min-w-[200px] px-6 py-4 text-center font-bold transition-colors border-r border-gray-200 last:border-r-0 ${
                    activeTab === category
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={() => setActiveTab(category)}
                >
                  {sections[category].title}
                </button>
              ))}
            </div>

            {/* Tab Content - Fixed height with internal scroll */}
            <div className="divide-y divide-blue-100 h-96 overflow-y-auto">
              {/* Regular permissions (no parent) */}
              {permissions
                .filter(
                  (p) =>
                    p.category === activeTab &&
                    !p.parent &&
                    !p.isSubItem &&
                    p.id !== "review-administration-access" &&
                    p.id !== "escalated-tasks-access" &&
                    p.id !== "review-management" &&
                    p.id !== "document-view"
                )
                .map((permission) => {
                  const permissionLevel =
                    formData.permissions[permission.id] ||
                    permission.defaultLevel ||
                    "no_access";
                  const availableLevels = getAvailableLevels(permission);
                  const subItems = getSubItems(permission.id, activeTab);
                  const hasSubItems = subItems.length > 0;
                  const isExpanded = expandedItems[permission.id] || false;

                  return (
                    <div key={permission.id}>
                      <div
                        className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
                          hasSubItems ? "cursor-pointer" : ""
                        }`}
                        onClick={hasSubItems ? () => toggleExpanded(permission.id) : undefined}
                      >
                        <div className="flex items-center">
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {permission.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          {renderPermissionSelect(permission, permissionLevel, availableLevels)}
                        </div>
                      </div>
                      
                      {/* Sub-items */}
                      {hasSubItems && isExpanded && (
                        <div className="border-t border-blue-50">
                          <div className="bg-gray-100 p-2 pl-12 text-black">
                            <h4 className="font-medium">Actions</h4>
                          </div>
                          {subItems.map((subItem) => {
                            const subItemPermissionLevel =
                              formData.permissions[subItem.id] ||
                              subItem.defaultLevel ||
                              "no_access";
                            const subItemAvailableLevels =
                              getAvailableLevels(subItem);

                            return (
                              <div
                                key={subItem.id}
                                className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                              >
                                <div className="flex items-center">
                                  <div className="ml-8 mr-2 text-gray-400">
                                    →
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-700">
                                      {subItem.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {subItem.description}
                                    </p>
                                  </div>
                                </div>
                                {renderPermissionSelect(subItem, subItemPermissionLevel, subItemAvailableLevels, shouldDisableSubItem(subItem.subItemOf))}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Special sections handling for review-administration and escalated-tasks */}
              {activeTab === "review-administration" && (
                <>
                  {/* Review Administration Access section */}
                  <div className="border-t-2 border-blue-100">
                    <div className="flex items-center justify-between bg-blue-50 p-4">
                      <div>
                        <h3 className="font-bold text-blue-600">Review Administration Access</h3>
                        <p className="text-sm text-blue-500">Top-level access control</p>
                      </div>
                      <Select
                        value={formData.permissions["review-administration-access"] || "no_access"}
                        onValueChange={(value) => handlePermissionLevelChange("review-administration-access", value)}
                      >
                        <SelectTrigger
                          className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                            formData.permissions["review-administration-access"] || "no_access"
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin_access" className="font-medium text-green-600">
                            Admin Access
                          </SelectItem>
                          <SelectItem value="no_access" className="font-medium text-gray-600">
                            No Access
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sub-items of Review Administration Access */}
                    <div className="divide-y divide-blue-100">
                      {permissions
                        .filter(
                          (p) =>
                            p.category === activeTab &&
                            p.isSubItem &&
                            p.subItemOf === "review-administration-access"
                        )
                        .map((permission) => {
                          const permissionLevel = formData.permissions[permission.id] || "no_access";
                          const availableLevels = getAvailableLevels(permission);
                          const subItems = getSubItems(permission.id, activeTab);
                          const hasSubItems = subItems.length > 0;
                          const isExpanded = expandedItems[permission.id] || false;

                          return (
                            <div key={permission.id}>
                              <div
                                className={`flex items-center justify-between p-4 pl-8 hover:bg-gray-50 ${
                                  hasSubItems ? "cursor-pointer" : ""
                                }`}
                                onClick={hasSubItems ? () => toggleExpanded(permission.id) : undefined}
                              >
                                <div className="flex items-center">
                                  <div>
                                    <h3 className="font-bold text-gray-800">{permission.title}</h3>
                                    <p className="text-sm text-gray-500">{permission.description}</p>
                                  </div>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  {renderPermissionSelect(permission, permissionLevel, availableLevels)}
                                </div>
                              </div>

                              {/* Sub-items (third level) */}
                              {hasSubItems && isExpanded && (
                                <div className="border-t border-blue-50">
                                  <div className="bg-gray-100 p-2 pl-12 text-black">
                                    <h4 className="font-medium">Actions</h4>
                                  </div>
                                  {subItems.map((subItem) => {
                                    const subItemPermissionLevel =
                                      formData.permissions[subItem.id] ||
                                      subItem.defaultLevel ||
                                      "no_access";
                                    const subItemAvailableLevels = getAvailableLevels(subItem);

                                    return (
                                      <div
                                        key={subItem.id}
                                        className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                                      >
                                        <div className="flex items-center">
                                          <div className="ml-8 mr-2 text-gray-400">→</div>
                                          <div>
                                            <h3 className="font-medium text-gray-700">{subItem.title}</h3>
                                            <p className="text-sm text-gray-500">{subItem.description}</p>
                                          </div>
                                        </div>
                                        {renderPermissionSelect(subItem, subItemPermissionLevel, subItemAvailableLevels, shouldDisableSubItem(subItem.subItemOf))}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Review Management section */}
                  <div className="border-t-2 border-blue-100">
                    <div className="flex items-center justify-between bg-blue-50 p-4">
                      <div>
                        <h3 className="font-bold text-blue-600">Review Management</h3>
                        <p className="text-sm text-blue-500">Document review management permissions</p>
                      </div>
                      <Select
                        value={formData.permissions["review-management"] || "no_access"}
                        onValueChange={(value) => handlePermissionLevelChange("review-management", value)}
                      >
                        <SelectTrigger
                          className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                            formData.permissions["review-management"] || "no_access"
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin_access" className="font-medium text-green-600">
                            Admin Access
                          </SelectItem>
                          <SelectItem value="no_access" className="font-medium text-gray-600">
                            No Access
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Document View section */}
                  <div className="border-t-2 border-blue-100">
                    <div className="flex items-center justify-between bg-blue-50 p-4">
                      <div>
                        <h3 className="font-bold text-blue-600">Admin Document Repository View</h3>
                        <p className="text-sm text-blue-500">Document viewing permissions</p>
                      </div>
                      <Select
                        value={formData.permissions["document-view"] || "no_access"}
                        onValueChange={(value) => handlePermissionLevelChange("document-view", value)}
                      >
                        <SelectTrigger
                          className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                            formData.permissions["document-view"] || "no_access"
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin_access" className="font-medium text-green-600">
                            Admin Access
                          </SelectItem>
                          <SelectItem value="no_access" className="font-medium text-gray-600">
                            No Access
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sub-items of document-view */}
                    <div className="divide-y divide-blue-100">
                      {permissions
                        .filter(
                          (p) =>
                            p.category === activeTab &&
                            p.isSubItem &&
                            p.subItemOf === "document-view"
                        )
                        .map((permission) => {
                          const permissionLevel = formData.permissions[permission.id] || "no_access";
                          const availableLevels = getAvailableLevels(permission);
                          const subItems = getSubItems(permission.id, activeTab);
                          const hasSubItems = subItems.length > 0;
                          const isExpanded = expandedItems[permission.id] || false;

                          return (
                            <div key={permission.id}>
                              <div
                                className={`flex items-center justify-between p-4 pl-8 hover:bg-gray-50 ${
                                  hasSubItems ? "cursor-pointer" : ""
                                }`}
                                onClick={hasSubItems ? () => toggleExpanded(permission.id) : undefined}
                              >
                                <div className="flex items-center">
                                  <div>
                                    <h3 className="font-bold text-gray-800">{permission.title}</h3>
                                    <p className="text-sm text-gray-500">{permission.description}</p>
                                  </div>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  {renderPermissionSelect(permission, permissionLevel, availableLevels)}
                                </div>
                              </div>

                              {/* Sub-items (third level) */}
                              {hasSubItems && isExpanded && (
                                <div className="border-t border-blue-50">
                                  <div className="bg-gray-100 p-2 pl-12 text-black">
                                    <h4 className="font-medium">Actions</h4>
                                  </div>
                                  {subItems.map((subItem) => {
                                    const subItemPermissionLevel =
                                      formData.permissions[subItem.id] ||
                                      subItem.defaultLevel ||
                                      "no_access";
                                    const subItemAvailableLevels = getAvailableLevels(subItem);

                                    return (
                                      <div
                                        key={subItem.id}
                                        className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                                      >
                                        <div className="flex items-center">
                                          <div className="ml-8 mr-2 text-gray-400">→</div>
                                          <div>
                                            <h3 className="font-medium text-gray-700">{subItem.title}</h3>
                                            <p className="text-sm text-gray-500">{subItem.description}</p>
                                          </div>
                                        </div>
                                        {renderPermissionSelect(subItem, subItemPermissionLevel, subItemAvailableLevels, shouldDisableSubItem(subItem.subItemOf))}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}

              {/* Escalated Tasks section */}
              {activeTab === "escalated-tasks" && (
                <div className="border-t-2 border-blue-100">
                  <div className="flex items-center justify-between bg-blue-50 p-4">
                    <div>
                      <h3 className="font-bold text-blue-600">Escalated Tasks Access</h3>
                      <p className="text-sm text-blue-500">Top-level access control</p>
                    </div>
                    <Select
                      value={formData.permissions["escalated-tasks-access"] || "no_access"}
                      onValueChange={(value) => handlePermissionLevelChange("escalated-tasks-access", value)}
                    >
                      <SelectTrigger
                        className={`w-[168px] border-2 font-medium ${getPermissionLevelColor(
                          formData.permissions["escalated-tasks-access"] || "no_access"
                        )}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin_access" className="font-medium text-green-600">
                          Admin Access
                        </SelectItem>
                        <SelectItem value="no_access" className="font-medium text-gray-600">
                          No Access
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sub-items of Escalated Tasks Access */}
                  {expandedItems["escalated-tasks-access"] && (
                    <div className="border-t border-blue-50">
                      <div className="bg-gray-100 p-2 pl-12 text-black">
                        <h4 className="font-medium">Actions</h4>
                      </div>
                      {permissions
                        .filter(
                          (p) =>
                            p.category === activeTab &&
                            p.isSubItem &&
                            p.subItemOf === "escalated-tasks-access"
                        )
                        .map((permission) => {
                          const permissionLevel = formData.permissions[permission.id] || "no_access";
                          const availableLevels = getAvailableLevels(permission);

                          return (
                            <div
                              key={permission.id}
                              className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                            >
                              <div className="flex items-center">
                                <div className="ml-8 mr-2 text-gray-400">→</div>
                                <div>
                                  <h3 className="font-medium text-gray-700">{permission.title}</h3>
                                  <p className="text-sm text-gray-500">{permission.description}</p>
                                </div>
                              </div>
                              {renderPermissionSelect(permission, permissionLevel, availableLevels, shouldDisableSubItem(permission.subItemOf))}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* Parent sections with child permissions (for Tasks tab) */}
              {sections[activeTab].parents &&
                Object.entries(sections[activeTab].parents || {}).map(
                  ([parentKey, parent]) => {
                    if (
                      activeTab === "review-administration" &&
                      (parentKey === "review-management" || parentKey === "document-view")
                    ) {
                      return null;
                    }

                    const childPermissions = permissions.filter(
                      (p) =>
                        p.category === activeTab &&
                        p.parent === parentKey &&
                        !p.isSubItem
                    );

                    if (childPermissions.length === 0) return null;

                    return (
                      <div key={parentKey} className="border-t-2 border-blue-100">
                        <div className="bg-blue-50 p-4">
                          <h3 className="font-bold text-blue-600">{parent.title}</h3>
                          <p className="text-sm text-blue-500">{parent.description}</p>
                        </div>
                        <div className="divide-y divide-blue-100">
                          {childPermissions.map((permission) => {
                            const permissionLevel =
                              formData.permissions[permission.id] ||
                              permission.defaultLevel ||
                              "no_access";
                            const availableLevels = getAvailableLevels(permission);
                            const subItems = getSubItems(permission.id, activeTab, parentKey);
                            const hasSubItems = subItems.length > 0;
                            const isExpanded = expandedItems[permission.id] || false;

                            return (
                              <div key={permission.id}>
                                <div
                                  className={`flex items-center justify-between p-4 pl-8 hover:bg-gray-50 ${
                                    hasSubItems ? "cursor-pointer" : ""
                                  }`}
                                  onClick={hasSubItems ? () => toggleExpanded(permission.id) : undefined}
                                >
                                  <div className="flex items-center">
                                    <div>
                                      <h3 className="font-bold text-gray-800">{permission.title}</h3>
                                      <p className="text-sm text-gray-500">{permission.description}</p>
                                    </div>
                                  </div>
                                  <div onClick={(e) => e.stopPropagation()}>
                                    {renderPermissionSelect(permission, permissionLevel, availableLevels)}
                                  </div>
                                </div>

                                {/* Sub-items for items in parent sections */}
                                {hasSubItems && isExpanded && (
                                  <div className="border-t border-blue-50">
                                    <div className="bg-gray-100 p-2 pl-12 text-black">
                                      <h4 className="font-medium">Actions</h4>
                                    </div>
                                    {subItems.map((subItem) => {
                                      const subItemPermissionLevel =
                                        formData.permissions[subItem.id] ||
                                        subItem.defaultLevel ||
                                        "no_access";
                                      const subItemAvailableLevels = getAvailableLevels(subItem);

                                      return (
                                        <div
                                          key={subItem.id}
                                          className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                                        >
                                          <div className="flex items-center">
                                            <div className="ml-8 mr-2 text-gray-400">→</div>
                                            <div>
                                              <h3 className="font-medium text-gray-700">{subItem.title}</h3>
                                              <p className="text-sm text-gray-500">{subItem.description}</p>
                                            </div>
                                          </div>
                                          {renderPermissionSelect(subItem, subItemPermissionLevel, subItemAvailableLevels, shouldDisableSubItem(subItem.subItemOf))}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
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
            className="bg-[#335aff] hover:bg-[#335aff]/80"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {role ? "Updating..." : "Creating..."}
              </>
            ) : role ? (
              "Update Role"
            ) : (
              "Create Role"
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default RoleForm;
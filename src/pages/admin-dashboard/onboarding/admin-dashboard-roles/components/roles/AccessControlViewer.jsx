import { useState } from "react";
import { permissions, sections } from "../../mock-data/permissions";

// Access Control Viewer Component - Fixed to work in both view and edit modes
function AccessControlViewer({ permissions: rolePermissions, isEditMode = false }) {
  const [activeTab, setActiveTab] = useState("document-repository");

  // Get permission level display info
  const getPermissionDisplayInfo = (level) => {
    switch (level) {
      case "admin_access":
        return {
          text: "Admin Access",
          color: "text-green-600",
          bg: "bg-green-100",
        };
      case "write_access":
        return {
          text: "Write Access",
          color: "text-blue-600",
          bg: "bg-blue-100",
        };
      case "read_access":
        return {
          text: "Read Access",
          color: "text-amber-600",
          bg: "bg-amber-100",
        };
      case "view_access":
        return {
          text: "View Access",
          color: "text-purple-600",
          bg: "bg-purple-100",
        };
      case "edit_access":
        return {
          text: "Edit Access",
          color: "text-indigo-600",
          bg: "bg-indigo-100",
        };
      case "no_access":
        return { text: "No Access", color: "text-gray-600", bg: "bg-gray-200" };
      default:
        return { text: "No Access", color: "text-gray-600", bg: "bg-gray-100" };
    }
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

  // Check if permission should be displayed
  const shouldShowPermission = (permission) => {
    if (isEditMode) {
      // In edit mode, show all permissions
      return true;
    } else {
      // In view mode, only show permissions that have been assigned
      return rolePermissions[permission.id];
    }
  };

  // Check if special section should be displayed
  const shouldShowSpecialSection = (sectionId) => {
    if (isEditMode) {
      return true; // Always show in edit mode
    } else {
      return rolePermissions[sectionId]; // Only show if assigned in view mode
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg">
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

      {/* Tab Content */}
      <div className="divide-y divide-blue-100 max-h-100 overflow-y-auto">
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
              p.id !== "document-view" &&
              shouldShowPermission(p) // Use the new function
          )
          .map((permission) => {
            const permissionLevel = rolePermissions[permission.id] || permission.defaultLevel || "no_access";
            const displayInfo = getPermissionDisplayInfo(permissionLevel);
            const subItems = getSubItems(permission.id, activeTab);
            const hasSubItems = subItems.length > 0;

            return (
              <div key={permission.id}>
                {/* Main permission item */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
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
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${displayInfo.bg} ${displayInfo.color}`}
                  >
                    {displayInfo.text}
                  </span>
                </div>

                {/* Sub-items */}
                {hasSubItems && (
                  <div className="border-t border-blue-50">
                    <div className="bg-gray-100 p-2 pl-12 text-black">
                      <h4 className="font-medium">Actions</h4>
                    </div>
                    {subItems
                      .filter(subItem => isEditMode || rolePermissions[subItem.id]) // Filter sub-items based on mode
                      .map((subItem) => {
                        const subItemLevel = rolePermissions[subItem.id] || subItem.defaultLevel || "no_access";
                        const subDisplayInfo = getPermissionDisplayInfo(subItemLevel);

                        return (
                          <div
                            key={subItem.id}
                            className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                          >
                            <div className="flex items-center">
                              <div className="ml-8 mr-2 text-gray-400">→</div>
                              <div>
                                <h3 className="font-medium text-gray-700">
                                  {subItem.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {subItem.description}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${subDisplayInfo.bg} ${subDisplayInfo.color}`}
                            >
                              {subDisplayInfo.text}
                            </span>
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
            {/* Review Administration Access section - show if should be displayed */}
            {shouldShowSpecialSection("review-administration-access") && (
              <div className="border-t-2 border-blue-100">
                <div className="flex items-center justify-between bg-blue-50 p-4">
                  <div>
                    <h3 className="font-bold text-blue-600">
                      Review Administration Access
                    </h3>
                    <p className="text-sm text-blue-500">
                      Top-level access control
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getPermissionDisplayInfo(
                        rolePermissions["review-administration-access"] ||
                          "no_access"
                      ).bg
                    } ${
                      getPermissionDisplayInfo(
                        rolePermissions["review-administration-access"] ||
                          "no_access"
                      ).color
                    }`}
                  >
                    {
                      getPermissionDisplayInfo(
                        rolePermissions["review-administration-access"] ||
                          "no_access"
                      ).text
                    }
                  </span>
                </div>

                {/* Sub-items of Review Administration Access */}
                <div className="divide-y divide-blue-100">
                  {permissions
                    .filter(
                      (p) =>
                        p.category === activeTab &&
                        p.isSubItem &&
                        p.subItemOf === "review-administration-access" &&
                        shouldShowPermission(p) // Use the new function
                    )
                    .map((permission) => {
                      const permissionLevel =
                        rolePermissions[permission.id] || permission.defaultLevel || "no_access";
                      const displayInfo =
                        getPermissionDisplayInfo(permissionLevel);
                      const subItems = getSubItems(permission.id, activeTab);
                      const hasSubItems = subItems.length > 0;

                      return (
                        <div key={permission.id}>
                          <div className="flex items-center justify-between p-4 pl-8 hover:bg-gray-50">
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
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${displayInfo.bg} ${displayInfo.color}`}
                            >
                              {displayInfo.text}
                            </span>
                          </div>

                          {/* Sub-items (third level) */}
                          {hasSubItems && (
                            <div className="border-t border-blue-50">
                              <div className="bg-gray-100 p-2 pl-12 text-black">
                                <h4 className="font-medium">Actions</h4>
                              </div>
                              {subItems
                                .filter(subItem => isEditMode || rolePermissions[subItem.id])
                                .map((subItem) => {
                                  const subItemLevel = rolePermissions[subItem.id] || subItem.defaultLevel || "no_access";
                                  const subDisplayInfo = getPermissionDisplayInfo(subItemLevel);

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
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${subDisplayInfo.bg} ${subDisplayInfo.color}`}
                                      >
                                        {subDisplayInfo.text}
                                      </span>
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
            )}

            {/* Review Management section */}
            {shouldShowSpecialSection("review-management") && (
              <div className="border-t-2 border-blue-100">
                <div className="flex items-center justify-between bg-blue-50 p-4">
                  <div>
                    <h3 className="font-bold text-blue-600">
                      Review Management
                    </h3>
                    <p className="text-sm text-blue-500">
                      Document review management permissions
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getPermissionDisplayInfo(
                        rolePermissions["review-management"] || "no_access"
                      ).bg
                    } ${
                      getPermissionDisplayInfo(
                        rolePermissions["review-management"] || "no_access"
                      ).color
                    }`}
                  >
                    {
                      getPermissionDisplayInfo(
                        rolePermissions["review-management"] || "no_access"
                      ).text
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Admin Document Repository View section */}
            {shouldShowSpecialSection("document-view") && (
              <div className="border-t-2 border-blue-100">
                <div className="flex items-center justify-between bg-blue-50 p-4">
                  <div>
                    <h3 className="font-bold text-blue-600">
                      Admin Document Repository View
                    </h3>
                    <p className="text-sm text-blue-500">
                      Document viewing permissions
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getPermissionDisplayInfo(
                        rolePermissions["document-view"] || "no_access"
                      ).bg
                    } ${
                      getPermissionDisplayInfo(
                        rolePermissions["document-view"] || "no_access"
                      ).color
                    }`}
                  >
                    {
                      getPermissionDisplayInfo(
                        rolePermissions["document-view"] || "no_access"
                      ).text
                    }
                  </span>
                </div>

                {/* Sub-items of Admin Document Repository View */}
                <div className="divide-y divide-blue-100">
                  {permissions
                    .filter(
                      (p) =>
                        p.category === activeTab &&
                        p.isSubItem &&
                        p.subItemOf === "document-view" &&
                        shouldShowPermission(p)
                    )
                    .map((permission) => {
                      const permissionLevel =
                        rolePermissions[permission.id] || permission.defaultLevel || "no_access";
                      const displayInfo =
                        getPermissionDisplayInfo(permissionLevel);
                      const subItems = getSubItems(permission.id, activeTab);
                      const hasSubItems = subItems.length > 0;

                      return (
                        <div key={permission.id}>
                          <div className="flex items-center justify-between p-4 pl-8 hover:bg-gray-50">
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
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${displayInfo.bg} ${displayInfo.color}`}
                            >
                              {displayInfo.text}
                            </span>
                          </div>

                          {/* Sub-items (third level) */}
                          {hasSubItems && (
                            <div className="border-t border-blue-50">
                              <div className="bg-gray-100 p-2 pl-12 text-black">
                                <h4 className="font-medium">Actions</h4>
                              </div>
                              {subItems
                                .filter(subItem => isEditMode || rolePermissions[subItem.id])
                                .map((subItem) => {
                                  const subItemLevel = rolePermissions[subItem.id] || subItem.defaultLevel || "no_access";
                                  const subDisplayInfo = getPermissionDisplayInfo(subItemLevel);

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
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${subDisplayInfo.bg} ${subDisplayInfo.color}`}
                                      >
                                        {subDisplayInfo.text}
                                      </span>
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
            )}
          </>
        )}

        {/* Header-level access control for Escalated Tasks */}
        {activeTab === "escalated-tasks" && shouldShowSpecialSection("escalated-tasks-access") && (
          <div className="border-t-2 border-blue-100">
            <div className="flex items-center justify-between bg-blue-50 p-4">
              <div>
                <h3 className="font-bold text-blue-600">
                  Escalated Tasks Access
                </h3>
                <p className="text-sm text-blue-500">
                  Top-level access control
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getPermissionDisplayInfo(
                    rolePermissions["escalated-tasks-access"] || "no_access"
                  ).bg
                } ${
                  getPermissionDisplayInfo(
                    rolePermissions["escalated-tasks-access"] || "no_access"
                  ).color
                }`}
              >
                {
                  getPermissionDisplayInfo(
                    rolePermissions["escalated-tasks-access"] || "no_access"
                  ).text
                }
              </span>
            </div>

            {/* Sub-items of Escalated Tasks Access */}
            <div className="divide-y divide-blue-100">
              {permissions
                .filter(
                  (p) =>
                    p.category === activeTab &&
                    p.isSubItem &&
                    p.subItemOf === "escalated-tasks-access" &&
                    shouldShowPermission(p)
                )
                .map((permission) => {
                  const permissionLevel = rolePermissions[permission.id] || permission.defaultLevel || "no_access";
                  const displayInfo = getPermissionDisplayInfo(permissionLevel);

                  return (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between border-t border-blue-50 bg-gray-100 p-4 hover:bg-gray-200"
                    >
                      <div className="flex items-center">
                        <div className="ml-8 mr-2 text-gray-400">→</div>
                        <div>
                          <h3 className="font-medium text-gray-700">
                            {permission.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${displayInfo.bg} ${displayInfo.color}`}
                      >
                        {displayInfo.text}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Parent sections with child permissions (for Tasks and other tabs) */}
        {sections[activeTab].parents &&
          Object.entries(sections[activeTab].parents || {}).map(
            ([parentKey, parent]) => {
              // Don't filter out document-view, only filter out review-management
              // which will be displayed separately
              if (
                activeTab === "review-administration" &&
                (parentKey === "review-management" ||
                  parentKey === "document-view")
              ) {
                return null;
              }

              // Check if we should display this parent section
              const parentPermission = permissions.find(
                (p) => p.id === parentKey
              );
              const parentPermissionLevel =
                parentPermission && rolePermissions[parentKey];

              // Display the parent header with its permission level if applicable
              const childPermissions = permissions.filter(
                (p) =>
                  p.category === activeTab &&
                  p.parent === parentKey &&
                  !p.isSubItem &&
                  shouldShowPermission(p) // Use the new function
              );

              // In edit mode, show parent sections even if no permissions are assigned yet
              if (childPermissions.length === 0 && !parentPermissionLevel && !isEditMode)
                return null;

              return (
                <div key={parentKey} className="border-t-2 border-blue-100">
                  <div className="bg-blue-50 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-blue-600">
                        {parent.title}
                      </h3>
                      <p className="text-sm text-blue-500">
                        {parent.description}
                      </p>
                    </div>
                    {(parentPermissionLevel || isEditMode) && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getPermissionDisplayInfo(parentPermissionLevel || "no_access").bg
                        } ${
                          getPermissionDisplayInfo(parentPermissionLevel || "no_access").color
                        }`}
                      >
                        {getPermissionDisplayInfo(parentPermissionLevel || "no_access").text}
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-blue-100">
                    {childPermissions.map((permission) => {
                      const permissionLevel = rolePermissions[permission.id] || permission.defaultLevel || "no_access";
                      const displayInfo = getPermissionDisplayInfo(permissionLevel);
                      const subItems = getSubItems(
                        permission.id,
                        activeTab,
                        parentKey
                      );
                      const hasSubItems = subItems.length > 0;

                      return (
                        <div key={permission.id}>
                          <div className="flex items-center justify-between p-4 pl-8 hover:bg-gray-50">
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
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${displayInfo.bg} ${displayInfo.color}`}
                            >
                              {displayInfo.text}
                            </span>
                          </div>

                          {/* Sub-items for items in parent sections */}
                          {hasSubItems && (
                            <div className="border-t border-blue-50">
                              <div className="bg-gray-100 p-2 pl-12 text-black">
                                <h4 className="font-medium">Actions</h4>
                              </div>
                              {subItems
                                .filter(subItem => isEditMode || rolePermissions[subItem.id])
                                .map((subItem) => {
                                  const subItemLevel = rolePermissions[subItem.id] || subItem.defaultLevel || "no_access";
                                  const subDisplayInfo = getPermissionDisplayInfo(subItemLevel);

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
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${subDisplayInfo.bg} ${subDisplayInfo.color}`}
                                      >
                                        {subDisplayInfo.text}
                                      </span>
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
  );
}

export default AccessControlViewer;
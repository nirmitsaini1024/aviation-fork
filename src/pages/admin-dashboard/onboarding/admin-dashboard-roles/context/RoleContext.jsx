import { createContext, useContext, useState } from "react";
import { initialRoles } from "../mock-data/constant";

const RoleContext = createContext();

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
};

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState(initialRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);
  const [viewPermissionsRole, setViewPermissionsRole] = useState(null);

  const filteredRoles = roles.filter((role) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      role.domain.toLowerCase().includes(searchLower) ||
      role.department.toLowerCase().includes(searchLower) ||
      role.name.toLowerCase().includes(searchLower) ||
      role.roleName.toLowerCase().includes(searchLower) ||
      role.description.toLowerCase().includes(searchLower)
    );
  });

  const addRole = (roleData) => {
    const newRole = {
      ...roleData,
      id: roleData.id || Date.now().toString(),
    };
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = (roleData) => {
    setRoles(prev => 
      prev.map(role => role.id === roleData.id ? roleData : role)
    );
  };

  const deleteRole = (roleId) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
    setOpenPopover(null);
  };

  const saveRole = (roleData) => {
    if (roleData.id && roles.find(role => role.id === roleData.id)) {
      updateRole(roleData);
    } else {
      addRole(roleData);
    }
    setEditingRole(null);
  };

  const value = {
    roles,
    filteredRoles,
    searchTerm,
    setSearchTerm,
    editingRole,
    setEditingRole,
    openPopover,
    setOpenPopover,
    viewPermissionsRole,
    setViewPermissionsRole,
    addRole,
    updateRole,
    deleteRole,
    saveRole,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
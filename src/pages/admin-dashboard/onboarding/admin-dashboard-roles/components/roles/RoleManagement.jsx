import { Edit, Trash2, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRoleContext } from "../../context/RoleContext";
import {Badge} from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import RoleForm from "./RoleForm";
import AccessControlViewer from "./AccessControlViewer";

// Main Role Management App Component
function RoleManagementApp({ showAddForm, onToggleForm }) {
  const {
    filteredRoles,
    searchTerm,
    setSearchTerm,
    editingRole,
    setEditingRole,
    openPopover,
    setOpenPopover,
    viewPermissionsRole,
    setViewPermissionsRole,
    deleteRole,
    saveRole,
    roles,
  } = useRoleContext();

  const handleDeleteRole = (roleId) => {
    deleteRole(roleId);
  };

  const handleEditRole = (roleId) => {
    setEditingRole(roleId);
    if (onToggleForm) onToggleForm();
  };

  const handleSaveRole = (roleData) => {
    saveRole(roleData);
    if (onToggleForm) onToggleForm(); // Close the form after saving
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    if (onToggleForm) onToggleForm(); // Close the form when canceling
  };

  // Get the role being edited
  const editingRoleData = editingRole ? roles.find(role => role.id === editingRole) : null;

  return (
    <div className="space-y-4 border">
      {showAddForm && (
        <RoleForm 
          role={editingRoleData} 
          onSave={handleSaveRole} 
          onCancel={handleCancelEdit} 
        />
      )}

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600">
              <TableHead className="text-white">Role Name</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Access Controls</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) =>
                editingRole === role.id ? (
                  <TableRow key={role.id}>
                    <TableCell colSpan={5}>
                      <RoleForm
                        role={role}
                        onSave={handleSaveRole}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium">{role.name}</div>
                        <div className="flex flex-wrap gap-1">
                          {
                            role.domain && (
                              <Badge className="bg-blue-100 text-blue-700">{role.domain}</Badge>
                            )
                          }
                          {
                            role.department && (
                              <Badge className="bg-green-100 text-green-700">{role.department}</Badge>
                            )
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {role.description}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={viewPermissionsRole === role.id}
                        onOpenChange={(open) =>
                          setViewPermissionsRole(open ? role.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="sr-only">View Permissions</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="max-h-[80vh] overflow-y-auto"
                          style={{
                            width: "80vw",
                            height: "75vh",
                            maxWidth: "none",
                          }}
                        >
                          <DialogHeader>
                            <DialogTitle>
                              Access Controls - {role.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {role.permissions &&
                              Object.keys(role.permissions).length > 0 ? (
                              <AccessControlViewer
                                permissions={role.permissions}
                                isEditMode={true}
                              />
                            ) : (
                              <p className="text-gray-500 text-center py-8">
                                No permissions assigned to this role.
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditRole(role.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <Popover
                          open={openPopover === role.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(role.id);
                            } else {
                              setOpenPopover(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-60 p-4 mr-4"
                            side="bottom"
                          >
                            <div className="space-y-4">
                              <div className="">
                                <h4 className="font-medium">Are you sure?</h4>
                                <p className="text-sm text-muted-foreground">
                                  This will permanently delete this role.
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setOpenPopover(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteRole(role.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default RoleManagementApp;
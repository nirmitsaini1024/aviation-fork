import { useState } from "react";
import { Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { TableCell, TableRow } from "./Table";
import { Badge } from "./Badge";
import { GroupForm } from "./GroupForm";

export function GroupTableRow({ 
  group, 
  isEditing, 
  onEdit, 
  onDelete, 
  onSave, 
  onCancelEdit 
}) {
  const [openPopover, setOpenPopover] = useState(false);

  const handleDelete = () => {
    onDelete(group.id);
    setOpenPopover(false);
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <GroupForm
            group={group}
            onSave={onSave}
            onCancel={onCancelEdit}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <div className="space-y-2">
          <div className="font-medium">{group.name}</div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="domain">{group.domain}</Badge>
            <Badge variant="department">{group.department}</Badge>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="relative group">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>{group.members.length}</span>
          </div>

          {/* Hover popup */}
          <div className="absolute left-0 top-full mt-2 w-96 p-0 bg-white border-2 border-gray-300 shadow-xl rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Group Members
                </h3>
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {group.members.length}
                </span>
              </div>
            </div>

            {/* Members List */}
            <div className="max-h-80 overflow-y-auto">
              {group.members.map((member, index) => (
                <div
                  key={member.id}
                  className={`px-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    index === group.members.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {member.title}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="domain">{member.domain}</Badge>
                        <Badge variant="department">{member.department}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="max-w-xs truncate">
        {group.description}
      </TableCell>
      <TableCell>
        {group.reminder}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(group.id)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Popover
            open={openPopover}
            onOpenChange={setOpenPopover}
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
                    This will permanently delete this group.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenPopover(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
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
  );
}
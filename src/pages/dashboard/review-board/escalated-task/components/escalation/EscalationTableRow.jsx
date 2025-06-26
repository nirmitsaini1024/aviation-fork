// /components/escalation/EscalationTableRow.jsx
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  UserPlus,
  Calendar,
  FileText,
  User,
  AlarmClock,
} from "lucide-react";
import { teamMembers } from "../../mock-data/team-members";

export function EscalationTableRow({ escalation, index }) {
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [reassignPopoverOpen, setReassignPopoverOpen] = useState(false);
  const [notifyPopoverOpen, setNotifyPopoverOpen] = useState(false);

  const openReassignPopover = () => {
    setSelectedTeamMember("");
    setReassignPopoverOpen(true);
  };

  const closeReassignPopover = () => {
    setReassignPopoverOpen(false);
  };

  const openNotifyPopover = () => {
    setNotificationMessage(`Reminder: The "${escalation.documentName}" escalation requires your attention.`);
    setNotifyPopoverOpen(true);
  };

  const closeNotifyPopover = () => {
    setNotifyPopoverOpen(false);
  };

  const handleSendNotification = () => {
    console.log(`Notification sent to ${escalation.assignedTo}:`, notificationMessage);
    closeNotifyPopover();
  };

  const handleReassign = () => {
    const selectedMember = teamMembers.find(member => member.id === selectedTeamMember);
    console.log(`Reassigned from ${escalation.assignedTo} to ${selectedMember.name}`);
    closeReassignPopover();
  };

  return (
    <TableRow className="border-t-[1px] border-gray-400">
      <TableCell>
        <div className="flex items-center">
          {escalation.category}
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <a
          href={`/doc-center/doc-details/${index+1}`}
          className="text-blue-600 hover:underline flex items-center"
        >
          <FileText className="h-4 w-4 mr-2 text-blue-500" />
          {escalation.documentName}
        </a>
      </TableCell>
      <TableCell>{escalation.role}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-blue-500" />
          <span>{escalation.assignedTo}</span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-green-600" />
          {escalation.assignedAt}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="flex items-center">
          <Badge 
            className="flex items-center bg-red-100 text-red-800 hover:bg-red-200"
          >
            <AlarmClock className="h-4 w-4 mr-2" />
            {escalation.expiredAt}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          {/* Reassign Popover */}
          <Popover 
            open={reassignPopoverOpen} 
            onOpenChange={(open) => {
              if (open) {
                openReassignPopover();
              } else {
                closeReassignPopover();
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 "
                title="Reassign"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 mr-4">
              <div className="space-y-4">
                <h4 className="font-medium">Reassign Escalation</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Label htmlFor="escalation-id" className="text-sm">
                      Escalation
                    </Label>
                    <div className="col-span-2 font-medium text-sm">
                      {escalation.documentName}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Label htmlFor="current-assignee" className="text-sm">
                      Current Assignee
                    </Label>
                    <div className="col-span-2 text-sm">
                      {escalation.assignedTo}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Label htmlFor="new-assignee" className="text-sm">
                      New Assignee
                    </Label>
                    <div className="col-span-2">
                      <Select
                        value={selectedTeamMember}
                        onValueChange={setSelectedTeamMember}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers
                            .filter(member => member.name !== escalation.assignedTo)
                            .map(member => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name} ({member.role})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Label htmlFor="reason" className="text-sm">
                      Reason
                    </Label>
                    <Input
                      id="reason"
                      placeholder="Reason for reassignment"
                      className="col-span-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={closeReassignPopover}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleReassign} disabled={!selectedTeamMember} className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                    Reassign
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Notify Popover */}
          <Popover 
            open={notifyPopoverOpen} 
            onOpenChange={(open) => {
              if (open) {
                openNotifyPopover();
              } else {
                closeNotifyPopover();
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Notify"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4">
              <div className="space-y-4">
                <h4 className="font-medium">Send Notification</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Label htmlFor="recipient" className="text-sm">
                      Recipient
                    </Label>
                    <div className="col-span-2 font-medium text-sm">
                      {escalation.assignedTo}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Label htmlFor="message" className="text-sm">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      className="col-span-2"
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Label htmlFor="channel" className="text-sm">
                      Channel
                    </Label>
                    <Select defaultValue="email" className="col-span-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="app">In-App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={closeNotifyPopover}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSendNotification} className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                    Send Notification
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

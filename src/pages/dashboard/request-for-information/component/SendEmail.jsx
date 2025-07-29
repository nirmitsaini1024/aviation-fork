import React, { useContext, useEffect, useState } from "react";
import { X, ChevronDown, Link, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RequestInfoContext } from "../context/RequestInfoContext";
import { toast } from "sonner";

const EmailSender = ({ open, setOpen }) => {
  // Removed showEmailModal state - using only the prop from parent
  const [subject, setSubject] = useState("Request For Information");
  const [emailContent, setEmailContent] = useState("");
  const [emailDocument, setEmailDocument] = useState("Document.pdf");
  const [openRecipient, setOpenRecipient] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState([]);
  const { domain, category, templates } = useContext(RequestInfoContext);

  useEffect(() => {
    if (domain && category && templates) {
      setEmailContent(`Dear Shareholders,\n
I hope this email finds you well. I am writing to provide you with comprehensive information regarding our ${templates} implementation and documentation for your ${domain.toLowerCase()} operations.
Please find the attached documents containing detailed guidelines, procedures, and best practices that will assist you in understanding our ${category.toLowerCase()} framework and operational standards.\n
Best regards,
Olivia Brown`);
    }
  }, []);

  useEffect(() => {
    if (open) {
      // Store original overflow values
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      // Prevent scrolling
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Cleanup function to restore scrolling
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [open]);

  // Mock email options
  const emailOptions = [
    "john.doe@example.com",
    "jane.smith@company.com",
    "mike.johnson@business.org",
    "sarah.wilson@startup.io",
    "david.brown@corporation.net",
  ];

  const selectEmail = (email) => {
    if (!receiverAddress.includes(email)) {
      setReceiverAddress([...receiverAddress, email]);
    }
    setOpenRecipient(false); // Fixed: was setOpen(false)
  };

  const removeEmail = (emailToRemove) => {
    setReceiverAddress(
      receiverAddress.filter((email) => email !== emailToRemove)
    );
  };

  const handleSendEmail = () => {
    // Handle email sending logic here
    console.log("Sending email:", {
      to: receiverAddress,
      subject,
      content: emailContent,
      attachment: emailDocument,
    });

    // Close modal after sending - now uses parent's setOpen
    setOpen(false);

    // You can add your actual email sending API call here
    toast.success("Email sent successfully!", {
        duration: 1000
    });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  // Only render modal if open prop is true
  if (!open) return null;

  return (
    <div className="p-8 min-h-screen">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <h3 className="text-lg font-semibold text-blue-800">
              Compose Email
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-100 group hover:cursor-pointer"
              onClick={handleCloseModal}
            >
              <X className="w-4 h-4 transition-all ease-in-out duration-500 group-hover:rotate-180" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-auto">
            {/* Recipients */}
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Popover open={openRecipient} onOpenChange={setOpenRecipient}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-1 border-gray-300 focus:ring-0 ring-0 justify-between"
                    role="combobox"
                    aria-expanded={openRecipient}
                  >
                    Select receipient
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-80 max-h-96 p-0 border-gray-200 shadow-lg"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search contacts..."
                      className="h-9"
                    />
                    <CommandList className="max-h-80 overflow-y-auto">
                      <CommandEmpty>No contacts found.</CommandEmpty>
                      <CommandGroup>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Recent Contacts
                        </div>
                        {emailOptions.map((email, index) => (
                          <CommandItem
                            key={index}
                            value={email}
                            onSelect={() => selectEmail(email)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-semibold">
                                  {email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {email
                                    .split("@")[0]
                                    .replace(".", " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {email}
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {receiverAddress.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {receiverAddress.map((email, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {email}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeEmail(email)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={subject}
                className="border border-gray-300  focus-visible:ring-0 focus-visible:outline-none"
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Write your message here..."
                className="min-h-[200px] max-h-[200px] overflow-y-scroll scroll-container resize-none border border-gray-300 focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>

            {/* Attachment */}
            {emailDocument && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                Attachments:
                <Link className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-slate-600">{emailDocument}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={
                  !emailDocument ||
                  !emailContent ||
                  !subject ||
                  receiverAddress.length === 0
                }
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailSender;

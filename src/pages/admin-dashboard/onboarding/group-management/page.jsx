import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { GroupManagementApp } from "./components/GroupManagementApp";

export default function GroupsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin-dashboard">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            Onboarding
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-blue-600">Group Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Group Management</h1>
          <p className="text-muted-foreground">
            Create and manage user groups
          </p>
        </div>
        <Button
          className="bg-[#335aff] hover:bg-[#335aff]/80 flex items-center"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Group
        </Button>
      </div>
      
      {/* Use the new GroupManagementApp component with shared state */}
      <GroupManagementApp 
        showAddForm={isFormOpen} 
        onToggleForm={() => setIsFormOpen(false)} 
      />
    </div>
  );
}
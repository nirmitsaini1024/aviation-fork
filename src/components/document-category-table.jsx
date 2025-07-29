// src/components/DocumentCategoryTable.jsx

import { useState, useRef, useEffect } from "react"
import { Edit, Trash2, Search, ChevronUp, ChevronDown, ArrowUpDown, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { DocumentCategoryForm } from "@/components/document-category-form"

// Mock data for document categories with domains
const initialCategories = [
  {
    id: "1",
    domainName: "Technology",
    departmentName: "IT",
    categoryName: "Technical Documentation",
    description: "Technical specifications and documentation",
    receiveMode: "upload",
  },
  {
    id: "2",
    domainName: "Operations",
    departmentName: "HR",
    categoryName: "Employee Records",
    description: "Employee personal and professional records",
    receiveMode: "folder",
  },
  {
    id: "3",
    domainName: "Finance",
    departmentName: "Finance",
    categoryName: "Financial Reports",
    description: "Financial statements and reports",
    receiveMode: "email",
  },
  {
    id: "4",
    domainName: "Marketing",
    departmentName: "Marketing",
    categoryName: "Marketing Materials",
    description: "Marketing collateral and assets",
    receiveMode: "upload",
  },
  {
    id: "5",
    domainName: "Technology",
    departmentName: "IT",
    categoryName: "System Logs",
    description: "System and application logs",
    receiveMode: "folder",
  },
  {
    id: "6",
    domainName: "Sales",
    departmentName: "Sales",
    categoryName: "Sales Reports",
    description: "Sales performance and analytics reports",
    receiveMode: "email",
  },
  {
    id: "7",
    domainName: "Legal",
    departmentName: "Legal",
    categoryName: "Legal Documents",
    description: "Contracts, agreements, and legal documentation",
    receiveMode: "upload",
  },
  {
    id: "8",
    domainName: "Quality Assurance", 
    departmentName: "QA",
    categoryName: "Test Reports",
    description: "Quality assurance and testing documentation",
    receiveMode: "folder",
  },
  {
    id: "9",
    domainName: "Research & Development",
    departmentName: "R&D",
    categoryName: "Research Data",
    description: "Research findings and development documentation",
    receiveMode: "upload",
  },
  {
    id: "10",
    domainName: "Operations",
    departmentName: "Operations",
    categoryName: "Process Documentation",
    description: "Standard operating procedures and workflows",
    receiveMode: "email",
  },
]

export function DocumentCategoryTable() {
  const [categories, setCategories] = useState(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [openPopover, setOpenPopover] = useState(null)
  
  // Additional state for sorting and column-specific search
  const [sortConfig, setSortConfig] = useState(null)
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  const [descriptionSearchTerm, setDescriptionSearchTerm] = useState("")
  const [domainSearchTerm, setDomainSearchTerm] = useState("")
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("")
  const [categorySearchOpen, setCategorySearchOpen] = useState(false)
  const [descriptionSearchOpen, setDescriptionSearchOpen] = useState(false)
  const [domainSearchOpen, setDomainSearchOpen] = useState(false)
  const [departmentSearchOpen, setDepartmentSearchOpen] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)


  // Columns configuration
  const columns = [
    {
      key: "categoryName",
      label: "Category Name",
      sortValue: (category) => category.categoryName.toLowerCase(),
    },
    {
      key: "description",
      label: "Description",
      sortValue: (category) => category.description.toLowerCase(),
    },
    {
      key: "domainName",
      label: "Domain Name",
      sortValue: (category) => category.domainName.toLowerCase(),
    },
    {
      key: "departmentName",
      label: "Dept Name",
      sortValue: (category) => category.departmentName.toLowerCase(),
    },
  ]


  const sortedAndFilteredCategories = () => {
    const filtered = categories.filter((category) => {
      const searchLower = searchTerm.toLowerCase()
      
      // Apply global search filter
      const globalMatch = (
        category.categoryName.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower) ||
        category.domainName.toLowerCase().includes(searchLower) ||
        category.departmentName.toLowerCase().includes(searchLower)
      )

      // Apply specific column search filters
      const categoryMatch = categorySearchTerm ? 
        category.categoryName.toLowerCase().includes(categorySearchTerm.toLowerCase()) : true
      const descriptionMatch = descriptionSearchTerm ?
        category.description.toLowerCase().includes(descriptionSearchTerm.toLowerCase()) : true
      const domainMatch = domainSearchTerm ?
        category.domainName.toLowerCase().includes(domainSearchTerm.toLowerCase()) : true
      const departmentMatch = departmentSearchTerm ?
        category.departmentName.toLowerCase().includes(departmentSearchTerm.toLowerCase()) : true

      return globalMatch && categoryMatch && descriptionMatch && domainMatch && departmentMatch
    })

    if (sortConfig !== null) {
      const column = columns.find((col) => col.key === sortConfig.key)
      if (column) {
        return [...filtered].sort((a, b) => {
          const aValue = column.sortValue(a)
          const bValue = column.sortValue(b)
          if (aValue < bValue)
            return sortConfig.direction === "ascending" ? -1 : 1
          if (aValue > bValue)
            return sortConfig.direction === "ascending" ? 1 : -1
          return 0
        })
      }
    }

    return filtered
  }

  // Get paginated data
  const allFilteredData = sortedAndFilteredCategories()
  const totalPages = Math.ceil(allFilteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = allFilteredData.slice(startIndex, endIndex)

  // Page change handler
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Reset page when search changes
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const requestSort = (key) => {
    let direction = "ascending"
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
  }

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((category) => category.id !== categoryId))
    setOpenPopover(null)
  }

  const handleEditCategory = (categoryId) => {
    setEditingCategory(categoryId)
  }

  const handleSaveCategory = (updatedCategory) => {
    if (updatedCategory.id) {
      // Editing existing category
      setCategories(categories.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)))
    } else {
      // Creating new category
      const newCategory = {
        ...updatedCategory,
        id: Date.now().toString() // Simple ID generation
      }
      setCategories([...categories, newCategory])
    }
    setEditingCategory(null)
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
  }


  // Clear search handlers  
  const clearCategorySearch = () => {
    setCategorySearchTerm("")
    setCategorySearchOpen(false)
    setCurrentPage(1)
  }

  const clearDescriptionSearch = () => {
    setDescriptionSearchTerm("")
    setDescriptionSearchOpen(false)
    setCurrentPage(1)
  }

  const clearDomainSearch = () => {
    setDomainSearchTerm("")
    setDomainSearchOpen(false)
    setCurrentPage(1)
  }

  const clearDepartmentSearch = () => {
    setDepartmentSearchTerm("")
    setDepartmentSearchOpen(false)
    setCurrentPage(1)
  }

  const getReceiveModeBadge = (mode) => {
    switch (mode) {
      case "upload":
        return <Badge className="bg-blue-500">Upload</Badge>
      case "folder":
        return <Badge className="bg-green-500">File Watcher</Badge>
      case "email":
        return <Badge className="bg-amber-500">Email</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-blue-600">
              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Category Name</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={() => requestSort("categoryName")}
                      title="Sort by category name"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <Popover open={categorySearchOpen} onOpenChange={setCategorySearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${categorySearchOpen ? 'bg-blue-700' : ''}`}
                          title="Search by category name"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" side="top" align="center">
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              type="search"
                              placeholder="Search by category..."
                              className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                              value={categorySearchTerm}
                              onChange={(e) => { setCategorySearchTerm(e.target.value); setCurrentPage(1); }}
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                              onClick={clearCategorySearch}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {getSortIcon("categoryName")}
                </div>
              </TableHead>

              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Description</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={() => requestSort("description")}
                      title="Sort by description"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <Popover open={descriptionSearchOpen} onOpenChange={setDescriptionSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${descriptionSearchOpen ? 'bg-blue-700' : ''}`}
                          title="Search by description"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" side="top" align="center">
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              type="search"
                              placeholder="Search by description..."
                              className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                              value={descriptionSearchTerm}
                              onChange={(e) => { setDescriptionSearchTerm(e.target.value); setCurrentPage(1); }}
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                              onClick={clearDescriptionSearch}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {getSortIcon("description")}
                </div>
              </TableHead>

              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Domain Name</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={() => requestSort("domainName")}
                      title="Sort by domain name"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <Popover open={domainSearchOpen} onOpenChange={setDomainSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${domainSearchOpen ? 'bg-blue-700' : ''}`}
                          title="Search by domain name"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" side="top" align="center">
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              type="search"
                              placeholder="Search by domain..."
                              className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                              value={domainSearchTerm}
                              onChange={(e) => { setDomainSearchTerm(e.target.value); setCurrentPage(1); }}
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                              onClick={clearDomainSearch}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {getSortIcon("domainName")}
                </div>
              </TableHead>

              <TableHead className="text-white relative">
                <div className="flex items-center gap-2">
                  <span>Dept Name</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                      onClick={() => requestSort("departmentName")}
                      title="Sort by department name"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                    <Popover open={departmentSearchOpen} onOpenChange={setDepartmentSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${departmentSearchOpen ? 'bg-blue-700' : ''}`}
                          title="Search by department name"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" side="top" align="center">
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              type="search"
                              placeholder="Search by department..."
                              className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                              value={departmentSearchTerm}
                              onChange={(e) => { setDepartmentSearchTerm(e.target.value); setCurrentPage(1); }}
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                              onClick={clearDepartmentSearch}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {getSortIcon("departmentName")}
                </div>
              </TableHead>

              <TableHead className="text-center text-white">Receive Mode</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((category) =>
                editingCategory === category.id ? (
                  <TableRow key={category.id}>
                    <TableCell colSpan={6}>
                      <DocumentCategoryForm
                        category={category}
                        onSave={handleSaveCategory}
                        onCancel={handleCancelEdit}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.categoryName}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell className="font-medium">{category.domainName}</TableCell>
                    <TableCell>{category.departmentName}</TableCell>
                    <TableCell className="text-center">{getReceiveModeBadge(category.receiveMode)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditCategory(category.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        
                        {/* <Popover 
                          open={openPopover === category.id} 
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(category.id);
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
                          <PopoverContent className="w-72 p-4 mr-4" side="bottom">
                            <div className="space-y-4">
                              <div className="">
                                <h4 className="font-medium">Delete Category</h4>
                                <p className="text-sm text-muted-foreground">
                                  Are you sure you want to delete this document category? This action cannot be undone.
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
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover> */}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, allFilteredData.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, allFilteredData.length)} of {allFilteredData.length} entries
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"} transition-colors
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className={`cursor-pointer transition-colors ${currentPage === page ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-blue-50"}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                return null
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"} transition-colors
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
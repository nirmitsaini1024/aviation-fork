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
  const [showCategorySearch, setShowCategorySearch] = useState(false)
  const [showDescriptionSearch, setShowDescriptionSearch] = useState(false)
  const [showDomainSearch, setShowDomainSearch] = useState(false)
  const [showDepartmentSearch, setShowDepartmentSearch] = useState(false)

  // Refs for search popups
  const categoryPopupRef = useRef(null)
  const descriptionPopupRef = useRef(null)
  const domainPopupRef = useRef(null)
  const departmentPopupRef = useRef(null)

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

  // Effect to handle clicks outside search popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryPopupRef.current && !categoryPopupRef.current.contains(event.target)) {
        setShowCategorySearch(false)
        setCategorySearchTerm("")
      }
      if (descriptionPopupRef.current && !descriptionPopupRef.current.contains(event.target)) {
        setShowDescriptionSearch(false)
        setDescriptionSearchTerm("")
      }
      if (domainPopupRef.current && !domainPopupRef.current.contains(event.target)) {
        setShowDomainSearch(false)
        setDomainSearchTerm("")
      }
      if (departmentPopupRef.current && !departmentPopupRef.current.contains(event.target)) {
        setShowDepartmentSearch(false)
        setDepartmentSearchTerm("")
      }
    }

    if (showCategorySearch || showDescriptionSearch || showDomainSearch || showDepartmentSearch) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCategorySearch, showDescriptionSearch, showDomainSearch, showDepartmentSearch])

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

  // Search toggle handlers
  const handleCategorySearchToggle = () => {
    setShowCategorySearch(!showCategorySearch)
    if (showCategorySearch) {
      setCategorySearchTerm("")
    }
  }

  const handleDescriptionSearchToggle = () => {
    setShowDescriptionSearch(!showDescriptionSearch)
    if (showDescriptionSearch) {
      setDescriptionSearchTerm("")
    }
  }

  const handleDomainSearchToggle = () => {
    setShowDomainSearch(!showDomainSearch)
    if (showDomainSearch) {
      setDomainSearchTerm("")
    }
  }

  const handleDepartmentSearchToggle = () => {
    setShowDepartmentSearch(!showDepartmentSearch)
    if (showDepartmentSearch) {
      setDepartmentSearchTerm("")
    }
  }

  // Clear search handlers  
  const clearCategorySearch = () => {
    setCategorySearchTerm("")
    setShowCategorySearch(false)
  }

  const clearDescriptionSearch = () => {
    setDescriptionSearchTerm("")
    setShowDescriptionSearch(false)
  }

  const clearDomainSearch = () => {
    setDomainSearchTerm("")
    setShowDomainSearch(false)
  }

  const clearDepartmentSearch = () => {
    setDepartmentSearchTerm("")
    setShowDepartmentSearch(false)
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showCategorySearch ? 'bg-blue-700' : ''}`}
                        onClick={handleCategorySearchToggle}
                        title="Search by category name"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Category search popup */}
                      {showCategorySearch && (
                        <div
                          ref={categoryPopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by category..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={categorySearchTerm}
                                onChange={(e) => setCategorySearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
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
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
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
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showDescriptionSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleDescriptionSearchToggle}
                        title="Search by description"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Description search popup */}
                      {showDescriptionSearch && (
                        <div
                          ref={descriptionPopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by description..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={descriptionSearchTerm}
                                onChange={(e) => setDescriptionSearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
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
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
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
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showDomainSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleDomainSearchToggle}
                        title="Search by domain name"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Domain search popup */}
                      {showDomainSearch && (
                        <div
                          ref={domainPopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by domain..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={domainSearchTerm}
                                onChange={(e) => setDomainSearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
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
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
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
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showDepartmentSearch ? 'bg-blue-700' : ''}`}
                        onClick={handleDepartmentSearchToggle}
                        title="Search by department name"
                      >
                        <Search className="h-3 w-3" />
                      </Button>

                      {/* Department search popup */}
                      {showDepartmentSearch && (
                        <div
                          ref={departmentPopupRef}
                          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                        >
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[250px]">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search by department..."
                                className="pl-8 pr-8 border-blue-500 focus:border-blue-600 text-gray-900 placeholder-gray-500"
                                value={departmentSearchTerm}
                                onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                                autoFocus
                                style={{ color: '#111827', backgroundColor: '#ffffff' }}
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
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {getSortIcon("departmentName")}
                </div>
              </TableHead>

              <TableHead className="text-center text-white">Receive Mode</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredCategories().length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredCategories().map((category) =>
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
    </div>
  )
}
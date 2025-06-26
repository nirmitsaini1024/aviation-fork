import { useState } from "react";
import { 
  Edit, 
  Trash2, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpDown,
  X,
  Database,
  Eye,
  FileText,
  File,
  Loader2,
  Calendar,
  HardDrive
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock files data
const mockFiles = [
  {
    id: "1",
    fileName: "users_wc_001.dat",
    fileType: "data",
    sizeBytes: 2048576,
    createdAt: "2025-04-15T10:30:00Z",
    lastUpdatedAt: "2025-04-15T11:30:00Z",
    indexes: [
      { name: "user_profile_wc", type: "working_copy", description: "Primary user data index" },
      { name: "user_analytics_wc", type: "working_copy", description: "User analytics tracking" }
    ]
  },
  {
    id: "2",
    fileName: "users_wc_001.idx",
    fileType: "index",
    sizeBytes: 512000,
    createdAt: "2025-04-15T10:30:00Z",
    lastUpdatedAt: "2025-04-15T11:15:00Z",
    indexes: [
      { name: "user_profile_wc", type: "working_copy", description: "Primary user data index" }
    ]
  },
  {
    id: "3",
    fileName: "users_metadata.json",
    fileType: "metadata",
    sizeBytes: 4096,
    createdAt: "2025-04-15T10:30:00Z",
    lastUpdatedAt: "2025-04-15T11:05:00Z",
    indexes: [
      { name: "user_profile_wc", type: "working_copy", description: "Primary user data index" },
      { name: "metadata_ref", type: "reference", description: "Metadata reference index" }
    ]
  },
  {
    id: "4",
    fileName: "products_ref.dat",
    fileType: "data",
    sizeBytes: 15728640,
    createdAt: "2025-04-12T14:22:00Z",
    lastUpdatedAt: "2025-04-12T16:22:00Z",
    indexes: [
      { name: "product_catalog_ref", type: "reference", description: "Product catalog reference" },
      { name: "inventory_linked", type: "linked", description: "Inventory management index" }
    ]
  },
  {
    id: "5",
    fileName: "products_ref.idx",
    fileType: "index",
    sizeBytes: 8388608,
    createdAt: "2025-04-12T14:22:00Z",
    lastUpdatedAt: "2025-04-12T16:15:00Z",
    indexes: [
      { name: "product_catalog_ref", type: "reference", description: "Product catalog reference" }
    ]
  },
  {
    id: "6",
    fileName: "catalog_config.txt",
    fileType: "config",
    sizeBytes: 2048,
    createdAt: "2025-04-12T14:22:00Z",
    lastUpdatedAt: "2025-04-12T16:00:00Z",
    indexes: [
      { name: "product_catalog_ref", type: "reference", description: "Product catalog reference" }
    ]
  },
  {
    id: "7",
    fileName: "product_schema.json",
    fileType: "metadata",
    sizeBytes: 4096,
    createdAt: "2025-04-12T14:22:00Z",
    lastUpdatedAt: "2025-04-12T16:30:00Z",
    indexes: [
      { name: "product_catalog_ref", type: "reference", description: "Product catalog reference" },
      { name: "schema_validation_ref", type: "reference", description: "Schema validation index" }
    ]
  },
  {
    id: "8",
    fileName: "inventory_link.dat",
    fileType: "data",
    sizeBytes: 5242880,
    createdAt: "2025-04-10T09:15:00Z",
    lastUpdatedAt: "2025-04-10T12:15:00Z",
    indexes: [
      { name: "inventory_linked", type: "linked", description: "Inventory management index" }
    ]
  },
  {
    id: "9",
    fileName: "inventory_link.idx",
    fileType: "index",
    sizeBytes: 1048576,
    createdAt: "2025-04-10T09:15:00Z",
    lastUpdatedAt: "2025-04-10T12:30:00Z",
    indexes: [
      { name: "inventory_linked", type: "linked", description: "Inventory management index" }
    ]
  },
  {
    id: "10",
    fileName: "analytics_wc_agg.dat",
    fileType: "data",
    sizeBytes: 18874368,
    createdAt: "2025-04-08T16:45:00Z",
    lastUpdatedAt: "2025-04-08T18:45:00Z",
    indexes: [
      { name: "analytics_wc_agg", type: "working_copy_aggregate", description: "Analytics aggregation index" },
      { name: "reporting_ref_agg", type: "reference_aggregate", description: "Reporting aggregation" }
    ]
  }
];

// Utility function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Utility function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get file type icon
const getFileIcon = (fileName, fileType) => {
  if (fileType === 'config' || fileName.endsWith('.json') || fileName.endsWith('.txt')) {
    return <File className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
};

// Get file type badge styling
const getFileTypeBadge = (fileType) => {
  const badgeStyles = {
    'data': 'bg-blue-100 text-blue-800',
    'index': 'bg-green-100 text-green-800',
    'metadata': 'bg-purple-100 text-purple-800',
    'config': 'bg-orange-100 text-orange-800'
  };
  return badgeStyles[fileType] || 'bg-gray-100 text-gray-800';
};

// Get index type badge styling
const getIndexTypeBadge = (indexType) => {
  const badgeStyles = {
    'working_copy': 'bg-blue-100 text-blue-800',
    'reference': 'bg-green-100 text-green-800',
    'linked': 'bg-purple-100 text-purple-800',
    'working_copy_aggregate': 'bg-orange-100 text-orange-800',
    'reference_aggregate': 'bg-teal-100 text-teal-800'
  };
  return badgeStyles[indexType] || 'bg-gray-100 text-gray-800';
};

// Indexes Dialog Component
const IndexesDialog = ({ file }) => {
  const [indexSearchTerm, setIndexSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredIndexes = file.indexes.filter(index =>
    index.name.toLowerCase().includes(indexSearchTerm.toLowerCase()) ||
    index.type.toLowerCase().includes(indexSearchTerm.toLowerCase()) ||
    index.description.toLowerCase().includes(indexSearchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
          <Eye className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">{file.indexes.length} indexes</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Indexes for {file.fileName}</DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search indexes..."
            className="pl-8"
            value={indexSearchTerm}
            onChange={(e) => setIndexSearchTerm(e.target.value)}
          />
        </div>

        {/* Indexes List */}
        <div className="max-h-96 overflow-y-auto border rounded-md">
          {filteredIndexes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No indexes found
            </div>
          ) : (
            <div className="divide-y">
              {filteredIndexes.map((index, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Database className="h-4 w-4 mt-1 text-gray-600" />
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{index.name}</p>
                        <p className="text-xs text-gray-600">{index.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getIndexTypeBadge(index.type)}`}>
                      {index.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Indexes: {filteredIndexes.length}</span>
            <span>File Size: {formatFileSize(file.sizeBytes)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main file details page component
export default function FileDetailsPage() {
  const [files, setFiles] = useState(mockFiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [typeSearchTerm, setTypeSearchTerm] = useState("");
  const [sizeSearchTerm, setSizeSearchTerm] = useState("");
  const [createdSearchTerm, setCreatedSearchTerm] = useState("");
  const [lastUpdatedSearchTerm, setLastUpdatedSearchTerm] = useState("");
  const [indexesSearchTerm, setIndexesSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "fileName", direction: "ascending" });
  const [openPopover, setOpenPopover] = useState(null);
  const [showNameSearch, setShowNameSearch] = useState(false);
  const [showTypeSearch, setShowTypeSearch] = useState(false);
  const [showSizeSearch, setShowSizeSearch] = useState(false);
  const [showCreatedSearch, setShowCreatedSearch] = useState(false);
  const [showLastUpdatedSearch, setShowLastUpdatedSearch] = useState(false);
  const [showIndexesSearch, setShowIndexesSearch] = useState(false);

  // Table columns configuration
  const columns = [
    {
      key: "fileName",
      label: "File Name",
      sortValue: (file) => file.fileName.toLowerCase(),
    },
    {
      key: "fileType",
      label: "File Type",
      sortValue: (file) => file.fileType.toLowerCase(),
    },
    {
      key: "sizeBytes",
      label: "Size",
      sortValue: (file) => file.sizeBytes,
    },
    {
      key: "createdAt",
      label: "Created At",
      sortValue: (file) => file.createdAt,
    },
    {
      key: "lastUpdatedAt",
      label: "Last Updated At",
      sortValue: (file) => file.lastUpdatedAt || "",
    },
    {
      key: "indexes",
      label: "Indexes",
      sortValue: (file) => file.indexes.length,
    },
  ];

  // Filter and sort files based on search terms and sort config
  const sortedAndFilteredFiles = () => {
    let filtered = files.filter((file) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Apply global search filter
      const globalMatch = (
        file.fileName.toLowerCase().includes(searchLower) ||
        file.fileType.toLowerCase().includes(searchLower) ||
        formatFileSize(file.sizeBytes).toLowerCase().includes(searchLower) ||
        formatDate(file.createdAt).toLowerCase().includes(searchLower) ||
        (file.lastUpdatedAt && formatDate(file.lastUpdatedAt).toLowerCase().includes(searchLower)) ||
        file.indexes.some(index => 
          index.name.toLowerCase().includes(searchLower) ||
          index.type.toLowerCase().includes(searchLower) ||
          index.description.toLowerCase().includes(searchLower)
        )
      );

      // Apply specific search filters if active
      const nameMatch = nameSearchTerm ?
        file.fileName.toLowerCase().includes(nameSearchTerm.toLowerCase()) : true;
      const typeMatch = typeSearchTerm ?
        file.fileType.toLowerCase().includes(typeSearchTerm.toLowerCase()) : true;
      const sizeMatch = sizeSearchTerm ?
        formatFileSize(file.sizeBytes).toLowerCase().includes(sizeSearchTerm.toLowerCase()) : true;
      const createdMatch = createdSearchTerm ?
        formatDate(file.createdAt).toLowerCase().includes(createdSearchTerm.toLowerCase()) : true;
      const lastUpdatedMatch = lastUpdatedSearchTerm ?
        (file.lastUpdatedAt && formatDate(file.lastUpdatedAt).toLowerCase().includes(lastUpdatedSearchTerm.toLowerCase())) : true;
      const indexesMatch = indexesSearchTerm ?
        file.indexes.some(index => 
          index.name.toLowerCase().includes(indexesSearchTerm.toLowerCase()) ||
          index.type.toLowerCase().includes(indexesSearchTerm.toLowerCase()) ||
          index.description.toLowerCase().includes(indexesSearchTerm.toLowerCase())
        ) : true;

      return globalMatch && nameMatch && typeMatch && sizeMatch && createdMatch && lastUpdatedMatch && indexesMatch;
    });

    if (sortConfig !== null) {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (column) {
        return [...filtered].sort((a, b) => {
          const aValue = column.sortValue(a);
          const bValue = column.sortValue(b);
          if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        });
      }
    }

    return filtered;
  };

  // Handle sorting when column headers are clicked
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction icon for column header
  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Clear search handlers
  const clearNameSearch = () => {
    setNameSearchTerm("");
    setShowNameSearch(false);
  };

  const clearTypeSearch = () => {
    setTypeSearchTerm("");
    setShowTypeSearch(false);
  };

  const clearSizeSearch = () => {
    setSizeSearchTerm("");
    setShowSizeSearch(false);
  };

  const clearCreatedSearch = () => {
    setCreatedSearchTerm("");
    setShowCreatedSearch(false);
  };

  const clearLastUpdatedSearch = () => {
    setLastUpdatedSearchTerm("");
    setShowLastUpdatedSearch(false);
  };

  const clearIndexesSearch = () => {
    setIndexesSearchTerm("");
    setShowIndexesSearch(false);
  };

  // Handle delete file
  const handleDeleteFile = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId));
    setOpenPopover(null);
  };

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <a href="/admin-dashboard" className="hover:text-[#335aff]">Admin</a>
            <span>/</span>
            <span>Knowledge Based Details</span>
            <span>/</span>
            <span className="text-[#335aff] font-medium">File Details</span>
          </div>
        </nav>

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">File Details</h1>
            <p className="text-muted-foreground mt-1">
              Manage database files and their associated indexes
            </p>
          </div>
        </div>

        {/* Global search */}
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Files table */}
        <div className="rounded-md border border-gray-400">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-blue-600">
                <TableHead className="text-white relative">
                  <div className="flex items-center gap-2">
                    <span>File Name</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                        onClick={() => requestSort("fileName")}
                        title="Sort by file name"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                      <Popover 
                        open={showNameSearch} 
                        onOpenChange={(open) => {
                          setShowNameSearch(open);
                          if (!open) setNameSearchTerm("");
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showNameSearch ? 'bg-blue-700' : ''}`}
                            title="Search by file name"
                          >
                            <Search className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-3 mt-2" side="top">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Search by file name..."
                              className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                              value={nameSearchTerm}
                              onChange={(e) => setNameSearchTerm(e.target.value)}
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                              onClick={clearNameSearch}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {getSortIcon("fileName")}
                  </div>
                </TableHead>

                {columns.slice(1).map((column) => (
                  <TableHead key={column.key} className="text-white relative">
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                          onClick={() => requestSort(column.key)}
                          title={`Sort by ${column.label.toLowerCase()}`}
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                        
                        {column.key === 'fileType' && (
                          <Popover 
                            open={showTypeSearch} 
                            onOpenChange={(open) => {
                              setShowTypeSearch(open);
                              if (!open) setTypeSearchTerm("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showTypeSearch ? 'bg-blue-700' : ''}`}
                                title="Search by file type"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 mt-2" side="top">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by file type..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                                  value={typeSearchTerm}
                                  onChange={(e) => setTypeSearchTerm(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearTypeSearch}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}

                        {column.key === 'sizeBytes' && (
                          <Popover 
                            open={showSizeSearch} 
                            onOpenChange={(open) => {
                              setShowSizeSearch(open);
                              if (!open) setSizeSearchTerm("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showSizeSearch ? 'bg-blue-700' : ''}`}
                                title="Search by size"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 mt-2" side="top">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by size..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                                  value={sizeSearchTerm}
                                  onChange={(e) => setSizeSearchTerm(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearSizeSearch}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}

                        {column.key === 'createdAt' && (
                          <Popover 
                            open={showCreatedSearch} 
                            onOpenChange={(open) => {
                              setShowCreatedSearch(open);
                              if (!open) setCreatedSearchTerm("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showCreatedSearch ? 'bg-blue-700' : ''}`}
                                title="Search by created date"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 mt-2" side="top">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by created date..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                                  value={createdSearchTerm}
                                  onChange={(e) => setCreatedSearchTerm(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearCreatedSearch}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}

                        {column.key === 'lastUpdatedAt' && (
                          <Popover 
                            open={showLastUpdatedSearch} 
                            onOpenChange={(open) => {
                              setShowLastUpdatedSearch(open);
                              if (!open) setLastUpdatedSearchTerm("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showLastUpdatedSearch ? 'bg-blue-700' : ''}`}
                                title="Search by last updated date"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 mt-2" side="top">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by last updated date..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                                  value={lastUpdatedSearchTerm}
                                  onChange={(e) => setLastUpdatedSearchTerm(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearLastUpdatedSearch}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}

                        {column.key === 'indexes' && (
                          <Popover 
                            open={showIndexesSearch} 
                            onOpenChange={(open) => {
                              setShowIndexesSearch(open);
                              if (!open) setIndexesSearchTerm("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showIndexesSearch ? 'bg-blue-700' : ''}`}
                                title="Search by index names"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 mt-2" side="top">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by index names..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                                  value={indexesSearchTerm}
                                  onChange={(e) => setIndexesSearchTerm(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearIndexesSearch}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                      {getSortIcon(column.key)}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredFiles().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No files found
                  </TableCell>
                </TableRow>
              ) : (
                sortedAndFilteredFiles().map((file) => (
                  <TableRow key={file.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        {getFileIcon(file.fileName, file.fileType)}
                        <span className="font-medium ml-2">{file.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFileTypeBadge(file.fileType)}`}>
                        {file.fileType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{formatFileSize(file.sizeBytes)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">{formatDate(file.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">{formatDate(file.lastUpdatedAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <IndexesDialog file={file} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Popover 
                          open={openPopover === file.id} 
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopover(file.id);
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
                          <PopoverContent className="w-60 p-4 mr-4" side="bottom">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">Are you sure?</h4>
                                <p className="text-sm text-muted-foreground">
                                  This will permanently delete "{file.fileName}" and affect {file.indexes.length} associated indexes.
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
                                  onClick={() => handleDeleteFile(file.id)}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
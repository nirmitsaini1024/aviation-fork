import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpDown,
  X,
  Database,
  Eye,
  FileText,
  File,
  Calendar,
  HardDrive,
  Clock
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// TimestampDisplay component
function TimestampDisplay({ timestamp, size = "sm" }) {
  if (!timestamp) return <span className="text-gray-400">-</span>;
  
  // Parse the timestamp
  const [datePart, timePart] = timestamp.split(' ');
  const iconSize = size === "sm" ? 12 : 14;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  
  return (
    <div className="flex flex-col space-y-1">
      {/* Calendar icon + Date */}
      <div className="flex items-center space-x-1">
        <Calendar className={`h-${iconSize === 12 ? '3' : '4'} w-${iconSize === 12 ? '3' : '4'} text-blue-500`} />
        <span className={`${textSize} text-blue-700 font-medium`}>
          {datePart}
        </span>
      </div>
      {/* Clock icon + Time */}
      <div className="flex items-center space-x-1">
        <Clock className={`h-${iconSize === 12 ? '3' : '4'} w-${iconSize === 12 ? '3' : '4'} text-gray-500`} />
        <span className={`${textSize} text-gray-600`}>
          {timePart}
        </span>
      </div>
    </div>
  );
}

// Utility function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Get file type icon
const getFileIcon = (fileName, fileType) => {
  if (fileType === 'config' || fileName.endsWith('.json') || fileName.endsWith('.txt')) {
    return <File className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
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

// Files Dialog Component with table view
const FilesDialog = ({ index }) => {
  const navigate = useNavigate(); // Add this hook
  const [fileSearchTerm, setFileSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ 
    key: "name", 
    direction: "ascending" 
  });

  // Table columns configuration for files
  const fileColumns = [
    {
      key: "name",
      label: "Filename",
      sortValue: (file) => file.name.toLowerCase(),
    },
    {
      key: "type",
      label: "File Type",
      sortValue: (file) => file.type.toLowerCase(),
    },
    {
      key: "size",
      label: "Size",
      sortValue: (file) => file.size,
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
  ];

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Sort and filter files
  const sortedAndFilteredFiles = () => {
    let filtered = index.files.filter(file =>
      file.name.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
      file.type.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
      formatFileSize(file.size).toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
      (file.createdAt && file.createdAt.toLowerCase().includes(fileSearchTerm.toLowerCase())) ||
      (file.lastUpdatedAt && file.lastUpdatedAt.toLowerCase().includes(fileSearchTerm.toLowerCase()))
    );

    if (sortConfig) {
      const column = fileColumns.find((col) => col.key === sortConfig.key);
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

  // Updated navigation function
  const handleFileClick = (fileName) => {
    setIsOpen(false);
    // Store the target file name in sessionStorage
    sessionStorage.setItem('targetFileName', fileName);
    // Navigate using React Router
    navigate('/admin-dashboard/file-details');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
          <Eye className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">{index.files.length} files</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] flex flex-col" style={{width: '90vw', maxWidth: '90vw'}}>
        <DialogHeader>
          <DialogTitle>Files for {index.indexName}</DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-8 w-full"
            value={fileSearchTerm}
            onChange={(e) => setFileSearchTerm(e.target.value)}
          />
        </div>

        {/* Files Table */}
        <div className="flex-1 overflow-auto border rounded-md">
          <div className="min-w-[800px]">
            <Table className="w-full">
              <TableHeader className="sticky top-0 z-10 bg-blue-600">
                <TableRow className="hover:bg-blue-600 border-b bg-blue-600">
                  {fileColumns.map((column) => (
                    <TableHead key={column.key} className="whitespace-nowrap px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{column.label}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-blue-700 text-white"
                          onClick={() => requestSort(column.key)}
                          title={`Sort by ${column.label.toLowerCase()}`}
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                        {getSortIcon(column.key)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredFiles().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={fileColumns.length} className="text-center py-8 text-muted-foreground">
                      No files found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAndFilteredFiles().map((file, idx) => (
                    <TableRow 
                      key={idx} 
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => handleFileClick(file.name)}
                    >
                      <TableCell className="px-4 py-3 min-w-[250px]">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.name, file.type)}
                          <span className="font-medium text-blue-600 hover:text-blue-800">{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 min-w-[120px]">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFileTypeBadge(file.type)}`}>
                          {file.type}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 min-w-[100px]">
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{formatFileSize(file.size)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 min-w-[200px]">
                        <TimestampDisplay timestamp={file.createdAt} size="sm" />
                      </TableCell>
                      <TableCell className="px-4 py-3 min-w-[200px]">
                        <TimestampDisplay timestamp={file.lastUpdatedAt} size="sm" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Summary */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Files: {sortedAndFilteredFiles().length}</span>
            <span>Total Size: {formatFileSize(index.sizeBytes)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Updated mock indices data with new timestamp format
const mockIndices = [
  {
    id: "1",
    indexName: "user_profile_wc",
    indexType: "working_copy",
    files: [
      { 
        name: "users_wc_001.dat", 
        size: 2048576, 
        type: "data",
        createdAt: "05-04-2025 09:30:00",
        lastUpdatedAt: "05-04-2025 11:30:00"
      },
      { 
        name: "users_wc_001.idx", 
        size: 512000, 
        type: "index",
        createdAt: "05-04-2025 09:45:00",
        lastUpdatedAt: "05-04-2025 11:15:00"
      },
      { 
        name: "users_metadata.json", 
        size: 4096, 
        type: "metadata",
        createdAt: "05-04-2025 10:00:00",
        lastUpdatedAt: "05-04-2025 11:05:00"
      }
    ],
    sizeBytes: 3072672,
    createdAt: "05-04-2025 10:30:00",
    completedAt: "05-04-2025 11:00:00",
    lastUpdatedAt: "05-04-2025 11:30:00",
    expiresAt: "05-07-2025 10:30:00",
  },
  {
    id: "2",
    indexName: "product_catalog_ref",
    indexType: "reference",
    files: [
      { 
        name: "products_ref.dat", 
        size: 15728640, 
        type: "data",
        createdAt: "05-03-2025 13:00:00",
        lastUpdatedAt: "05-03-2025 15:00:00"
      },
      { 
        name: "products_ref.idx", 
        size: 8388608, 
        type: "index",
        createdAt: "05-03-2025 13:30:00",
        lastUpdatedAt: "05-03-2025 15:10:00"
      },
      { 
        name: "catalog_config.txt", 
        size: 2048, 
        type: "config",
        createdAt: "05-03-2025 14:15:00",
        lastUpdatedAt: "05-03-2025 15:15:00"
      },
      { 
        name: "product_schema.json", 
        size: 4096, 
        type: "metadata",
        createdAt: "05-03-2025 14:20:00",
        lastUpdatedAt: "05-03-2025 15:20:00"
      }
    ],
    sizeBytes: 24123392,
    createdAt: "05-03-2025 14:22:00",
    completedAt: "05-03-2025 15:00:00",
    lastUpdatedAt: "05-03-2025 16:15:00",
    expiresAt: "05-06-2025 14:22:00",
  },
  {
    id: "3",
    indexName: "inventory_linked",
    indexType: "linked",
    files: [
      { 
        name: "inventory_link.dat", 
        size: 5242880, 
        type: "data",
        createdAt: "05-02-2025 08:00:00",
        lastUpdatedAt: "05-02-2025 12:00:00"
      },
      { 
        name: "inventory_link.idx", 
        size: 1048576, 
        type: "index",
        createdAt: "05-02-2025 08:30:00",
        lastUpdatedAt: "05-02-2025 12:10:00"
      }
    ],
    sizeBytes: 6291456,
    createdAt: "05-02-2025 09:15:00",
    completedAt: "05-02-2025 10:00:00",
    lastUpdatedAt: "05-02-2025 12:30:00",
    expiresAt: "05-05-2025 09:15:00",
  },
  {
    id: "4",
    indexName: "analytics_wc_agg",
    indexType: "working_copy_aggregate",
    files: [
      { 
        name: "analytics_wc_agg_1.dat", 
        size: 18874368, 
        type: "data",
        createdAt: "05-01-2025 15:00:00",
        lastUpdatedAt: "05-01-2025 17:30:00"
      },
      { 
        name: "analytics_wc_agg_1.idx", 
        size: 4194304, 
        type: "index",
        createdAt: "05-01-2025 15:30:00",
        lastUpdatedAt: "05-01-2025 17:00:00"
      },
      { 
        name: "analytics_wc_agg_2.dat", 
        size: 18874368, 
        type: "data",
        createdAt: "05-01-2025 16:00:00",
        lastUpdatedAt: "05-01-2025 17:30:00"
      },
      { 
        name: "analytics_wc_agg_2.idx", 
        size: 4194304, 
        type: "index",
        createdAt: "05-01-2025 16:15:00",
        lastUpdatedAt: "05-01-2025 17:35:00"
      },
      { 
        name: "aggregation_rules.json", 
        size: 8192, 
        type: "config",
        createdAt: "05-01-2025 16:40:00",
        lastUpdatedAt: "05-01-2025 17:40:00"
      }
    ],
    sizeBytes: 23076864,
    createdAt: "05-01-2025 16:45:00",
    completedAt: "05-01-2025 17:30:00",
    lastUpdatedAt: "05-01-2025 18:00:00",
    expiresAt: "05-04-2025 16:45:00",
  },
  {
    id: "5",
    indexName: "reporting_ref_agg",
    indexType: "reference_aggregate",
    files: [
      { 
        name: "reports_ref_agg.dat", 
        size: 10485760, 
        type: "data",
        createdAt: "04-30-2025 10:00:00",
        lastUpdatedAt: "04-30-2025 14:00:00"
      },
      { 
        name: "reports_ref_agg.idx", 
        size: 2097152, 
        type: "index",
        createdAt: "04-30-2025 10:30:00",
        lastUpdatedAt: "04-30-2025 14:10:00"
      },
      { 
        name: "report_meta.json", 
        size: 1024, 
        type: "metadata",
        createdAt: "04-30-2025 11:15:00",
        lastUpdatedAt: "04-30-2025 14:15:00"
      }
    ],
    sizeBytes: 12583936,
    createdAt: "04-30-2025 11:20:00",
    completedAt: "04-30-2025 12:00:00",
    lastUpdatedAt: "04-30-2025 14:30:00",
    expiresAt: "05-03-2025 11:20:00",
  },
  {
    id: "6",
    indexName: "customer_data_wc",
    indexType: "working_copy",
    files: [
      { 
        name: "customers_wc.dat", 
        size: 7340032, 
        type: "data",
        createdAt: "04-29-2025 07:30:00",
        lastUpdatedAt: "04-29-2025 10:15:00"
      },
      { 
        name: "customers_wc.idx", 
        size: 1572864, 
        type: "index",
        createdAt: "04-29-2025 07:45:00",
        lastUpdatedAt: "04-29-2025 10:20:00"
      }
    ],
    sizeBytes: 8912896,
    createdAt: "04-29-2025 08:30:00",
    completedAt: "04-29-2025 09:00:00",
    lastUpdatedAt: "04-29-2025 10:15:00",
    expiresAt: "05-02-2025 08:30:00",
  },
  {
    id: "7",
    indexName: "geo_locations_ref",
    indexType: "reference",
    files: [
      { 
        name: "geo_ref.dat", 
        size: 3145728, 
        type: "data",
        createdAt: "04-28-2025 11:00:00",
        lastUpdatedAt: "04-28-2025 15:00:00"
      },
      { 
        name: "geo_ref.idx", 
        size: 786432, 
        type: "index",
        createdAt: "04-28-2025 11:30:00",
        lastUpdatedAt: "04-28-2025 15:10:00"
      },
      { 
        name: "geo_mapping.json", 
        size: 2048, 
        type: "config",
        createdAt: "04-28-2025 12:12:00",
        lastUpdatedAt: "04-28-2025 15:12:00"
      }
    ],
    sizeBytes: 3934208,
    createdAt: "04-28-2025 12:15:00",
    completedAt: "04-28-2025 13:00:00",
    lastUpdatedAt: "04-28-2025 15:45:00",
    expiresAt: "05-01-2025 12:15:00",
  },
];

// Main index details page component
export default function IndexDetailsPage() {
  const [indices, setIndices] = useState(mockIndices);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [typeSearchTerm, setTypeSearchTerm] = useState("");
  const [filesSearchTerm, setFilesSearchTerm] = useState("");
  const [sizeSearchTerm, setSizeSearchTerm] = useState("");
  const [dateSearchTerm, setDateSearchTerm] = useState("");
  const [completedSearchTerm, setCompletedSearchTerm] = useState("");
  const [lastUpdatedSearchTerm, setLastUpdatedSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "indexName", direction: "ascending" });
  const [showNameSearch, setShowNameSearch] = useState(false);
  const [showTypeSearch, setShowTypeSearch] = useState(false);
  const [showFilesSearch, setShowFilesSearch] = useState(false);
  const [showSizeSearch, setShowSizeSearch] = useState(false);
  const [showDateSearch, setShowDateSearch] = useState(false);
  const [showCompletedSearch, setShowCompletedSearch] = useState(false);
  const [showLastUpdatedSearch, setShowLastUpdatedSearch] = useState(false);

  // Table columns configuration
  const columns = [
    {
      key: "indexName",
      label: "Index Name",
      sortValue: (index) => index.indexName.toLowerCase(),
    },
    {
      key: "indexType",
      label: "Index Type",
      sortValue: (index) => index.indexType.toLowerCase(),
    },
    {
      key: "files",
      label: "Files",
      sortValue: (index) => index.files.length,
    },
    {
      key: "sizeBytes",
      label: "Size",
      sortValue: (index) => index.sizeBytes,
    },
    {
      key: "createdAt",
      label: "Created TS",
      sortValue: (index) => index.createdAt,
    },
    {
      key: "completedAt",
      label: "Completed TS",
      sortValue: (index) => index.completedAt || "",
    },
    {
      key: "lastUpdatedAt",
      label: "Last Updated TS",
      sortValue: (index) => index.lastUpdatedAt || "",
    },
  ];

  // Filter and sort indices based on search terms and sort config
  const sortedAndFilteredIndices = () => {
    let filtered = indices.filter((index) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Apply global search filter
      const globalMatch = (
        index.indexName.toLowerCase().includes(searchLower) ||
        index.indexType.toLowerCase().includes(searchLower) ||
        index.files.some(file => file.name.toLowerCase().includes(searchLower)) ||
        formatFileSize(index.sizeBytes).toLowerCase().includes(searchLower) ||
        (index.createdAt && index.createdAt.toLowerCase().includes(searchLower)) ||
        (index.completedAt && index.completedAt.toLowerCase().includes(searchLower)) ||
        (index.lastUpdatedAt && index.lastUpdatedAt.toLowerCase().includes(searchLower))
      );

      // Apply specific search filters if active
      const nameMatch = nameSearchTerm ?
        index.indexName.toLowerCase().includes(nameSearchTerm.toLowerCase()) : true;
      const typeMatch = typeSearchTerm ?
        index.indexType.toLowerCase().includes(typeSearchTerm.toLowerCase()) : true;
      const filesMatch = filesSearchTerm ?
        index.files.some(file => file.name.toLowerCase().includes(filesSearchTerm.toLowerCase())) : true;
      const sizeMatch = sizeSearchTerm ?
        formatFileSize(index.sizeBytes).toLowerCase().includes(sizeSearchTerm.toLowerCase()) : true;
      const dateMatch = dateSearchTerm ?
        (index.createdAt && index.createdAt.toLowerCase().includes(dateSearchTerm.toLowerCase())) : true;
      const completedMatch = completedSearchTerm ?
        (index.completedAt && index.completedAt.toLowerCase().includes(completedSearchTerm.toLowerCase())) : true;
      const lastUpdatedMatch = lastUpdatedSearchTerm ?
        (index.lastUpdatedAt && index.lastUpdatedAt.toLowerCase().includes(lastUpdatedSearchTerm.toLowerCase())) : true;

      return globalMatch && nameMatch && typeMatch && filesMatch && sizeMatch && dateMatch && completedMatch && lastUpdatedMatch;
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

  const clearFilesSearch = () => {
    setFilesSearchTerm("");
    setShowFilesSearch(false);
  };

  const clearSizeSearch = () => {
    setSizeSearchTerm("");
    setShowSizeSearch(false);
  };

  const clearDateSearch = () => {
    setDateSearchTerm("");
    setShowDateSearch(false);
  };

  const clearCompletedSearch = () => {
    setCompletedSearchTerm("");
    setShowCompletedSearch(false);
  };

  const clearLastUpdatedSearch = () => {
    setLastUpdatedSearchTerm("");
    setShowLastUpdatedSearch(false);
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
            <span className="text-[#335aff] font-medium">Index Details</span>
          </div>
        </nav>

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Index Details</h1>
            <p className="text-muted-foreground mt-1">
              Manage database indices and their associated files
            </p>
          </div>
        </div>

        {/* Global search */}
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search indices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Indices table */}
        <div className="rounded-md border border-gray-400">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-blue-600">
                <TableHead className="text-white relative">
                  <div className="flex items-center gap-2">
                    <span>Index Name</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-white hover:bg-blue-700"
                        onClick={() => requestSort("indexName")}
                        title="Sort by index name"
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
                            title="Search by index name"
                          >
                            <Search className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-3 mt-2" side="top">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Search by index name..."
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
                    {getSortIcon("indexName")}
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
                        
                        {column.key === 'indexType' && (
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
                                title="Search by index type"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 mt-2" side="top">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by index type..."
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

                        {column.key === 'files' && (
                          <Popover 
                            open={showFilesSearch} 
                            onOpenChange={(open) => {
                              setShowFilesSearch(open);
                              if (!open) setFilesSearchTerm("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showFilesSearch ? 'bg-blue-700' : ''}`}
                                title="Search by file names"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 mt-2" side="top">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by file names..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                                  value={filesSearchTerm}
                                  onChange={(e) => setFilesSearchTerm(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearFilesSearch}
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
                            open={showDateSearch} 
                            onOpenChange={(open) => {
                              setShowDateSearch(open);
                              if (!open) setDateSearchTerm("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showDateSearch ? 'bg-blue-700' : ''}`}
                                title="Search by date"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 mt-2" side="top">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by date..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                                  value={dateSearchTerm}
                                  onChange={(e) => setDateSearchTerm(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearDateSearch}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}

                        {column.key === 'completedAt' && (
                          <Popover 
                            open={showCompletedSearch} 
                            onOpenChange={(open) => {
                              setShowCompletedSearch(open);
                              if (!open) setCompletedSearchTerm("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 text-white hover:bg-blue-700 ${showCompletedSearch ? 'bg-blue-700' : ''}`}
                                title="Search by completed date"
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 mt-2" side="top">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="search"
                                  placeholder="Search by completed date..."
                                  className="pl-8 pr-8 border-blue-500 focus:border-blue-600"
                                  value={completedSearchTerm}
                                  onChange={(e) => setCompletedSearchTerm(e.target.value)}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={clearCompletedSearch}
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
                      </div>
                      {getSortIcon(column.key)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredIndices().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No indices found
                  </TableCell>
                </TableRow>
              ) : (
                sortedAndFilteredIndices().map((index) => (
                  <TableRow key={index.id} className="hover:bg-gray-50">
                    <TableCell className="py-4">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 mr-2 text-gray-600" />
                        <span className="font-medium">{index.indexName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getIndexTypeBadge(index.indexType)}`}>
                        {index.indexType}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <FilesDialog index={index} />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{formatFileSize(index.sizeBytes)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <TimestampDisplay timestamp={index.createdAt} size="sm" />
                    </TableCell>
                    <TableCell className="py-4">
                      <TimestampDisplay timestamp={index.completedAt} size="sm" />
                    </TableCell>
                    <TableCell className="py-4">
                      <TimestampDisplay timestamp={index.lastUpdatedAt} size="sm" />
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
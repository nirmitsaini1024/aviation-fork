import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  useNodesState,
  useEdgesState,
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  Background,
  Controls,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  FileText,
  User,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  Paperclip,
  Shield,
  Plane,
  Building,
  ChevronDown,
  ChevronUp,
  Download,
  CornerDownRight,
  UsersRound,
  X,
  Menu,
  Search
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// FullPagePopup component
const FullPagePopup = ({ isOpen, onClose, title, children, setIsDownloading, exportButton }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 z-50 overflow-auto">
        <div className="min-h-full bg-background">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex items-center gap-2">
              {exportButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDownloading && setIsDownloading(true)}
                >
                  Export
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample Data - updated to match the structure from documentData
const sampleDocumentVersions = [
  {
    id: "v1",
    version: "1.0",
    title: "Airport Security Protocol Manual",
    author: {
      name: "Sarah Mitchell",
      role: "Security Operations Manager",
      avatar: "SM"
    },
    createdAt: "2024-01-15T09:00:00Z",
    status: "approved",
    owner: {
      officer: "Officer 8",
      department: "Public Safety",
      title: "Crisis Manager",
    },
    uploadedByName: "Thomas Anderson",
    department: "TSA",
    category: "ASP",
    fileType: "pdf",
    reviewPanel: [
      {
        id: "r1",
        type: "user",
        name: "James Rodriguez",
        role: "Chief Security Officer",
        group: null,
        decision: "approved",
        comments: "Comprehensive guidelines. Approved for implementation.",
        reviewedAt: "2024-01-18T14:30:00Z"
      },
      {
        id: "r2",
        type: "group_user",
        name: "Maria Santos",
        role: "Senior Security Analyst",
        group: "Terminal Security Team",
        decision: "approved",
        comments: "All procedures align with current TSA requirements.",
        reviewedAt: "2024-01-19T10:15:00Z"
      }
    ],
    referenceDocuments: [
      "TSA Security Guidelines 2024",
      "Emergency Response Procedures"
    ],
    changes: [],
    comments: [
      {
        id: 'c1',
        name: 'John Davis',
        title: 'Finance Manager',
        group: 'Application Security Group',
        comment: 'Checked Baggage: Means property tendered by or on behalf of a passenger and accepted by an aircraft operator for transport, which is inaccessible to passengers during flight. Accompanied commercial courier consignments are not classified as checked baggage.',
        timestamp: '2024-01-18T09:30:00Z',
        replies: [
          {
            id: 'r1',
            name: 'Jane Wilson',
            title: 'Senior Auditor',
            group: 'Non-Application Security Group',
            comment: "I've reviewed them and they look correct.",
            timestamp: '2024-01-18T11:45:00Z'
          }
        ]
      }
    ]
  },
  {
    id: "v2",
    version: "2.0",
    title: "Airport Security Protocol Manual - Updated Screening Procedures",
    author: {
      name: "Michael Chen",
      role: "Security Systems Specialist",
      avatar: "MC"
    },
    createdAt: "2024-03-22T11:30:00Z",
    status: "approved",
    owner: {
      officer: "Officer 1",
      department: "TSA",
      title: "Security Manager",
    },
    uploadedByName: "Richard Williams",
    department: "FAA",
    category: "AEP",
    fileType: "pdf",
    reviewPanel: [
      {
        id: "r3",
        type: "user",
        name: "James Rodriguez",
        role: "Chief Security Officer",
        decision: "approved",
        comments: "New X-ray protocols are well documented.",
        reviewedAt: "2024-03-25T16:45:00Z"
      },
      {
        id: "r4",
        type: "group_user",
        name: "Lisa Park",
        role: "Training Coordinator",
        group: "Security Training Division",
        decision: "approved",
        comments: "Training modules updated accordingly.",
        reviewedAt: "2024-03-26T09:20:00Z"
      },
      {
        id: "r5",
        type: "group_user",
        name: "David Wilson",
        role: "Operations Lead",
        group: "Checkpoint Operations",
        decision: "approved",
        comments: "Operational feasibility confirmed.",
        reviewedAt: "2024-03-26T13:10:00Z"
      }
    ],
    referenceDocuments: [
      "Advanced Imaging Technology Standards",
      "Staff Training Manual v3.2",
      "Equipment Calibration Procedures"
    ],
    changes: [
      "Updated X-ray screening procedures for liquid containers",
      "Added biometric authentication protocols",
      "Enhanced threat detection algorithms"
    ],
    comments: [
      {
        id: 'c2',
        name: 'Alice Wong',
        title: 'Chief Financial Officer',
        group: 'Application Security Group',
        comment: 'Great work on the quarterly report. Please ensure all financial data complies with our security protocols.',
        timestamp: '2024-03-25T14:20:00Z',
        replies: [
          {
            id: 'r2',
            name: 'Robert Chen',
            title: 'Finance Team Lead',
            group: 'Application Security Group',
            comment: 'Thank you! We appreciate your feedback. All data has been encrypted following Application Security Group standards.',
            timestamp: '2024-03-25T15:30:00Z'
          }
        ]
      }
    ]
  },
  {
    id: "v3",
    version: "3.0",
    title: "Airport Security Protocol Manual - International Terminal Updates",
    author: {
      name: "Elena Kowalski",
      role: "International Operations Manager",
      avatar: "EK"
    },
    createdAt: "2024-06-10T14:15:00Z",
    status: "in_review",
    owner: {
      officer: "Officer 2",
      department: "Airport Security",
      title: "Finance Manager",
    },
    uploadedByName: "Lisa Brown",
    department: "Airport Security",
    category: "ACM",
    fileType: "pdf",
    reviewPanel: [
      {
        id: "r6",
        type: "user",
        name: "James Rodriguez",
        role: "Chief Security Officer",
        decision: "pending",
        comments: "",
        reviewedAt: null
      },
      {
        id: "r7",
        type: "group_user",
        name: "Ahmed Hassan",
        role: "International Security Coordinator",
        group: "International Terminal Security",
        decision: "approved",
        comments: "Customs integration protocols are excellent.",
        reviewedAt: "2024-06-12T11:30:00Z"
      },
      {
        id: "r8",
        type: "group_user",
        name: "Sophie Laurent",
        role: "Compliance Officer",
        group: "Regulatory Compliance Team",
        decision: "pending",
        comments: "",
        reviewedAt: null
      }
    ],
    referenceDocuments: [
      "ICAO Security Standards 2024",
      "Customs Integration Manual"
    ],
    changes: [
      "Added international passenger screening protocols",
      "Integrated customs security procedures",
      "Updated diplomatic baggage handling"
    ],
    comments: [
      {
        id: 'c3',
        name: 'David Miller',
        title: 'Security Officer',
        group: 'TSA',
        comment: 'This proposal needs TSA approval before implementation. Please submit the required security documentation.',
        timestamp: '2024-06-12T09:15:00Z',
        replies: []
      }
    ]
  }
];

// Sample users data
const sampleUsers = [
  {
    id: "user1",
    name: "James Rodriguez",
    role: "Chief Security Officer",
    avatar: "JR",
    department: "Security Operations",
    ownedDocuments: ["v1", "v2"],
    reviewedDocuments: ["v1", "v2", "v3"]
  },
  {
    id: "user2",
    name: "Sarah Mitchell",
    role: "Security Operations Manager",
    avatar: "SM",
    department: "Public Safety",
    ownedDocuments: ["v3"],
    reviewedDocuments: ["v2"]
  },
  {
    id: "user3",
    name: "Michael Chen",
    role: "Security Systems Specialist",
    avatar: "MC",
    department: "TSA",
    ownedDocuments: [],
    reviewedDocuments: ["v1", "v3"]
  },
  {
    id: "user4",
    name: "Maria Santos",
    role: "Senior Security Analyst",
    avatar: "MS",
    department: "Terminal Security",
    ownedDocuments: ["v2"],
    reviewedDocuments: ["v1"]
  }
];

// Available documents for dropdown
const availableDocuments = [
  { id: "doc1", name: "Airport Security Protocol Manual", versions: ["v1", "v2", "v3"] }
];

// Helper functions
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleString();
};

// Mock data for the table
const cctData = [
  {
    category: "Security Protocol Updates",
    references: ["ref1", "ref2"]
  }
];

const referenceTexts = {
  ref1: {
    author: "Sarah Mitchell",
    authorTitle: "Security Operations Manager",
    authorGroup: "Terminal Security Team",
    text: "Updated security screening procedures for international terminals including enhanced biometric verification and customs integration protocols.",
    timestamp: "2024-01-15T09:00:00Z"
  },
  ref2: {
    author: "Michael Chen",
    authorTitle: "Security Systems Specialist",
    authorGroup: "Technical Operations",
    text: "Implementation of new X-ray technology and threat detection algorithms with improved accuracy rates.",
    timestamp: "2024-03-22T11:30:00Z"
  }
};

const approverData = {
  ref1: {
    name: "James Rodriguez",
    title: "Chief Security Officer",
    group: "Executive Security Team",
    timestamp: "2024-01-18T14:30:00Z"
  },
  ref2: {
    name: "Lisa Park",
    title: "Training Coordinator",
    group: "Security Training Division",
    timestamp: "2024-03-26T09:20:00Z"
  }
};

// Node Components
const VersionNode = ({ data, selected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'in_review': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={14} className="text-green-600" />;
      case 'in_review': return <Clock size={14} className="text-yellow-600" />;
      case 'rejected': return <XCircle size={14} className="text-red-600" />;
      default: return <Eye size={14} className="text-gray-600" />;
    }
  };

  // Extract main title and subtitle
  const titleParts = data.title.split('-');
  const mainTitle = titleParts[0].trim();
  const subtitle = titleParts.length > 1 ? titleParts.slice(1).join('-').trim() : '';

  return (
    <div className="relative">
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3" style={{ background: "#3b82f6" }} />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3" style={{ background: "#3b82f6" }} />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3" style={{ background: "#3b82f6" }} />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3" style={{ background: "#3b82f6" }} />

      {/* Circular container */}
      <div
        className={`
          bg-white rounded-full border-3 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200
          size-48 flex flex-col items-center justify-center p-3 space-y-4
          ${selected ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          data.onClick();
        }}
      >
        {/* Version badge at top */}
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(data.status)} flex items-center gap-1 shadow-sm`}>
          <span>Version - {data.version}</span>
        </div>

        {/* Title - truncated to fit circle */}
        <div className="text-center">
          <h3 className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">
            {mainTitle} - {subtitle}
          </h3>
        </div>
      </div>
    </div>
  );
};

const UserNode = ({ data, selected }) => {
  return (
    <div className="relative">
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3" style={{ background: "#8b5cf6" }} />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3" style={{ background: "#8b5cf6" }} />
      <Handle type="source" position={Position.Left} id="left-source" className="w-3 h-3" style={{ background: "#8b5cf6" }} />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3" style={{ background: "#8b5cf6" }} />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3" style={{ background: "#8b5cf6" }} />

      {/* Circular container */}
      <div
        className={`
          bg-white rounded-full border-3 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200
          size-48 flex flex-col items-center justify-center p-3 space-y-4
          ${selected ? 'border-purple-500 ring-4 ring-purple-200' : 'border-purple-300 hover:border-purple-400'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          data.onClick && data.onClick();
        }}
      >
        {/* User avatar */}
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {data.avatar}
        </div>

        {/* User info */}
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">
            {data.name}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            {data.role}
          </p>
        </div>
      </div>
    </div>
  );
};

const DocumentNode = ({ data }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'in_review': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getNodeColor = (type) => {
    return type === 'owned' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50';
  };

  const getIconColor = (type) => {
    return type === 'owned' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600';
  };

  const getTypeColor = (type) => {
    return type === 'owned' ? 'text-blue-800' : 'text-green-800';
  };

  return (
    <div className={`bg-white rounded-lg border-2 p-3 w-64 relative shadow-sm ${getNodeColor(data.type)}`}>
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3" style={{ background: data.type === 'owned' ? "#3b82f6" : "#22c55e" }} />
      <Handle type="target" position={Position.Right} id="right" className="w-3 h-3" style={{ background: data.type === 'owned' ? "#3b82f6" : "#22c55e" }} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${getIconColor(data.type)}`}> 
              <FileText size={14} />
            </div>
            <span className={`text-xs font-semibold ${getTypeColor(data.type)}`}>
              {data.type === 'owned' ? 'OWNED' : 'REVIEWED'}
            </span>
          </div>
          <div className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${getStatusColor(data.status)}`}>
            {data.version}
          </div>
        </div>

        <div>
          <div className="font-medium text-sm text-gray-900 line-clamp-2">{data.title}</div>
          <div className="text-xs text-gray-600 mt-1">{data.category}</div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(data.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthorNode = ({ data }) => (
  <div className="bg-white rounded-lg border-2 border-blue-200 p-3 w-56 relative shadow-sm">
    <Handle type="source" position={Position.Right} id="right" className="w-3 h-3" style={{ background: "#3b82f6" }} />
    <div className="flex items-center gap-2 mb-3">
      <div className="p-1.5 bg-blue-100 rounded-lg">
        <User size={16} className="text-blue-600" />
      </div>
      <span className="text-xs font-semibold text-blue-800">AUTHOR</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
        {data.avatar}
      </div>
      <div className="min-w-0">
        <div className="font-medium text-sm text-gray-900 truncate">{data.name}</div>
        <div className="text-xs text-gray-600 truncate">{data.role}</div>
      </div>
    </div>
  </div>
);

const ReviewerNode = ({ data }) => {
  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionIcon = (decision) => {
    switch (decision) {
      case 'approved': return <CheckCircle size={14} className="text-green-600" />;
      case 'rejected': return <XCircle size={14} className="text-red-600" />;
      case 'pending': return <Clock size={14} className="text-yellow-600" />;
      default: return <Eye size={14} className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-green-200 p-3 w-60 relative shadow-sm">
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3" style={{ background: "#22c55e" }} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 rounded-lg">
              {data.type === 'group_user' ? <Users size={14} className="text-green-600" /> : <User size={14} className="text-green-600" />}
            </div>
            <span className="text-xs font-semibold text-green-800">REVIEWER</span>
          </div>
          <div className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${getDecisionColor(data.decision)}`}>
            {getDecisionIcon(data.decision)}
            {data.decision.toUpperCase()}
          </div>
        </div>

        <div>
          <div className="font-medium text-sm text-gray-900">{data.name}</div>
          <div className="text-xs text-gray-600">{data.role}</div>
          {data.group && (
            <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Building size={12} className="flex-shrink-0" />
              <span className="truncate">{data.group}</span>
            </div>
          )}
        </div>

        {data.comments && (
          <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
            <span className="font-medium">Comment:</span> "{data.comments}"
          </div>
        )}

        {data.reviewedAt && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} className="flex-shrink-0" />
            Reviewed on {new Date(data.reviewedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

const ReferenceNode = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-purple-200 p-3 w-56 relative shadow-sm">
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3" style={{ background: "#a855f7" }} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Paperclip size={14} className="text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-800">REFERENCE</span>
          </div>
          <div className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
            DOC
          </div>
        </div>

        <div className="text-sm font-medium text-gray-900 line-clamp-2">
          {data}
        </div>
      </div>
    </div>
  );
};

const SummaryNode = ({ data }) => (
  <div
    className="bg-white rounded-lg border-2 border-yellow-300 p-3 w-44 relative shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200"
    onClick={data.onClick}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 bg-yellow-100 rounded-lg">
        <FileText size={16} className="text-yellow-600" />
      </div>
      <span className="text-xs font-semibold text-yellow-800">SUMMARY</span>
    </div>
    <div className="text-xs text-gray-700 truncate">{data.title || 'Summary'}</div>
    <Handle type="target" position={Position.Left} id="left" className="w-3 h-3" style={{ background: "#f59e42" }} />
  </div>
);

const nodeTypes = {
  version: VersionNode,
  user: UserNode,
  document: DocumentNode,
  author: AuthorNode,
  reviewer: ReviewerNode,
  reference: ReferenceNode,
  summary: SummaryNode,
};

// Sidebar Component
const Sidebar = ({ selectedDocument, setSelectedDocument, selectedUser, setSelectedUser }) => {
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const showUserResults = userSearch.trim().length > 0;

  return (
    <div className="w-80 h-full bg-white border-gray-200 flex flex-col border-r">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 ">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Workflow </h2>
            <p className="text-xs text-gray-600">Document & User Management</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Document Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <label className="text-sm font-semibold text-gray-900">Documents</label>
            </div>
            <Select
              value={selectedDocument}
              onValueChange={(value) => {
                setSelectedDocument(value);
                setSelectedUser(null);
                setUserSearch("");
              }}
            >
              <SelectTrigger className="w-full bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <SelectValue placeholder="Select document to analyze..." />
                  {!selectedDocument && (
                    <span className="text-gray-400">Select document to analyze...</span>
                  )}
                </div>
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                {availableDocuments.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id} className="py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate" style={{ maxWidth: '200px' }}>{doc.name}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedDocument && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Document Selected</span>
                </div>
                <p className="text-xs text-blue-700 truncate">
                  {availableDocuments.find(d => d.id === selectedDocument)?.name}
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* User Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-purple-100 rounded">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <label className="text-sm font-semibold text-gray-900">Users</label>
            </div>

            <div className="relative border-2 rounded-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Type to search users..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  if (e.target.value.trim() === "") {
                    setSelectedUser(null);
                  }
                }}
                className="pl-10 bg-white border-gray-300 hover:border-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>

            {showUserResults && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`group p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedUser === user.id
                          ? 'bg-purple-100 border-2 border-purple-300 shadow-md'
                          : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                        }`}
                      onClick={() => {
                        setSelectedUser(user.id);
                        setSelectedDocument(null);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-transform group-hover:scale-105 ${selectedUser === user.id ? 'bg-purple-600' : 'bg-purple-500'
                          }`}>
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 truncate">{user.name}</div>
                          <div className="text-xs text-gray-600 truncate">{user.role}</div>
                          <div className="text-xs text-gray-500 mt-1 truncate">{user.department}</div>
                        </div>
                        {selectedUser === user.id && (
                          <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No users found matching "{userSearch}"</p>
                  </div>
                )}
              </div>
            )}

            {selectedUser && (
              <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">User Selected</span>
                </div>
                <p className="text-xs text-purple-700 truncate">
                  {sampleUsers.find(u => u.id === selectedUser)?.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{sampleUsers.length} users</span>
          <span>{availableDocuments.length} documents</span>
        </div>
      </div>
    </div>
  );
};

// Main Component
const DocumentVersionTree = () => {
  const [expandedVersion, setExpandedVersion] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  // Get current view mode
  const viewMode = selectedUser ? 'user' : selectedDocument ? 'document' : null;

  const initialNodes = useMemo(() => {
    if (viewMode === 'user') {
      // ...existing code...
      const userData = sampleUsers.find(u => u.id === selectedUser);
      if (!userData) return [];
      const nodes = [];
      // ...existing code...
      nodes.push({
        id: `user-${userData.id}`,
        type: 'user',
        position: { x: 400, y: 300 },
        data: {
          ...userData,
          onClick: () => {
            if (expandedUser === userData.id) {
              setExpandedUser(null);
            } else {
              setExpandedUser(userData.id);
            }
          },
        },
      });
      // ...existing code...
      if (expandedUser === userData.id) {
        // ...existing code...
        userData.ownedDocuments.forEach((docId, index) => {
          const docData = sampleDocumentVersions.find(v => v.id === docId);
          if (docData) {
            nodes.push({
              id: `owned-${docId}`,
              type: 'document',
              position: { x: 50, y: 150 + index * 120 },
              data: {
                ...docData,
                type: 'owned',
              },
            });
          }
        });
        // ...existing code...
        userData.reviewedDocuments.forEach((docId, index) => {
          const docData = sampleDocumentVersions.find(v => v.id === docId);
          if (docData) {
            nodes.push({
              id: `reviewed-${docId}`,
              type: 'document',
              position: { x: 750, y: 150 + index * 120 },
              data: {
                ...docData,
                type: 'reviewed',
              },
            });
          }
        });
      }
      return nodes;
    } else if (viewMode === 'document') {
      // Document version tree view (existing logic)
      const versionNodes = sampleDocumentVersions.map((version, index) => ({
        id: version.id,
        type: 'version',
        position: { x: 400, y: 100 + index * 220 },
        data: {
          ...version,
          isExpanded: expandedVersion === version.id,
          onClick: () => {
            setExpandedVersion(version.id);
          },
        },
      }));

      // Add detail nodes for expanded version
      if (expandedVersion) {
        const versionData = sampleDocumentVersions.find(v => v.id === expandedVersion);
        const versionIndex = sampleDocumentVersions.findIndex(v => v.id === expandedVersion);
        const baseY = 100 + versionIndex * 220;

        // Author node (left side)
        versionNodes.push({
          id: `${expandedVersion}-author`,
          type: 'author',
          position: { x: 100, y: baseY },
          data: versionData.author,
        });

        // Reviewer nodes (right side)
        versionData.reviewPanel.forEach((reviewer, index) => {
          versionNodes.push({
            id: `${expandedVersion}-reviewer-${reviewer.id}`,
            type: 'reviewer',
            position: { x: 700, y: baseY - 40 + index * 140 },
            data: reviewer,
          });
        });

        // Reference nodes (left side, below author)
        versionData.referenceDocuments.forEach((ref, index) => {
          versionNodes.push({
            id: `${expandedVersion}-reference-${index}`,
            type: 'reference',
            position: { x: 100, y: baseY + 120 + index * 120 },
            data: ref,
          });
        });
      }

      // Add summary node only for the expanded document node
      if (expandedVersion) {
        const version = sampleDocumentVersions.find(v => v.id === expandedVersion);
        const versionIndex = sampleDocumentVersions.findIndex(v => v.id === expandedVersion);
        if (version) {
          versionNodes.push({
            id: `${version.id}-summary`,
            type: 'summary',
            // Move summary node further right for better spacing
            position: { x: 700, y:  versionIndex * 220 - 50 },
            data: {
              title: version.title,
              onClick: () => {
                setSelectedVersion(version);
                setIsViewerOpen(true);
              },
            },
          });
        }
      }
      return versionNodes;
    }
    return [];
  }, [expandedVersion, selectedUser, selectedDocument, expandedUser, viewMode]);

  const initialEdges = useMemo(() => {
    if (viewMode === 'user') {
      // ...existing code...
      const userData = sampleUsers.find(u => u.id === selectedUser);
      if (!userData || expandedUser !== userData.id) return [];
      const edges = [];
      // ...existing code...
      userData.ownedDocuments.forEach((docId) => {
        edges.push({
          id: `user-owned-${docId}`,
          source: `user-${userData.id}`,
          target: `owned-${docId}`,
          sourceHandle: 'left-source',
          targetHandle: 'right',
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          label: 'OWNS',
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#3b82f6', color: 'white', fillOpacity: 1 },
          labelStyle: {
            fontSize: '10px',
            fontWeight: 'bold',
            fill: 'white'
          },
        });
      });
      // ...existing code...
      userData.reviewedDocuments.forEach((docId) => {
        edges.push({
          id: `user-reviewed-${docId}`,
          source: `user-${userData.id}`,
          target: `reviewed-${docId}`,
          sourceHandle: 'right',
          targetHandle: 'left',
          type: 'smoothstep',
          style: { stroke: '#22c55e', strokeWidth: 2 },
          label: 'REVIEWED',
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#22c55e', color: 'white', fillOpacity: 1 },
          labelStyle: {
            fontSize: '10px',
            fontWeight: 'bold',
            fill: 'white'
          },
        });
      });
      return edges;
    } else if (viewMode === 'document') {
      // Document version tree edges (existing logic)
      const versionEdges = [];
      // Version to version connections (vertical timeline)
      for (let i = 0; i < sampleDocumentVersions.length - 1; i++) {
        versionEdges.push({
          id: `${sampleDocumentVersions[i].id}-${sampleDocumentVersions[i + 1].id}`,
          source: sampleDocumentVersions[i].id,
          target: sampleDocumentVersions[i + 1].id,
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        });
      }
      // Add detail edges for expanded version
      if (expandedVersion) {
        const versionData = sampleDocumentVersions.find(v => v.id === expandedVersion);
        // Author to version connection
        versionEdges.push({
          id: `${expandedVersion}-author-edge`,
          source: `${expandedVersion}-author`,
          target: expandedVersion,
          sourceHandle: 'right',
          targetHandle: 'left',
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        });
        // Version to reviewer connections
        versionData.reviewPanel.forEach((reviewer) => {
          versionEdges.push({
            id: `${expandedVersion}-reviewer-${reviewer.id}-edge`,
            source: expandedVersion,
            target: `${expandedVersion}-reviewer-${reviewer.id}`,
            sourceHandle: 'right',
            targetHandle: 'left',
            type: 'smoothstep',
            style: { stroke: '#22c55e', strokeWidth: 2 },
          });
        });
        // Reference to version connections
        versionData.referenceDocuments.forEach((ref, index) => {
          versionEdges.push({
            id: `${expandedVersion}-reference-${index}-edge`,
            source: `${expandedVersion}-reference-${index}`,
            target: expandedVersion,
            sourceHandle: 'right',
            targetHandle: 'left',
            type: 'smoothstep',
            style: { stroke: '#a855f7', strokeWidth: 2 },
          });
        });
      }
      // Add summary edge only for the expanded document node
      if (expandedVersion) {
        versionEdges.push({
          id: `${expandedVersion}-summary-edge`,
          source: expandedVersion,
          target: `${expandedVersion}-summary`,
          sourceHandle: 'right',
          targetHandle: 'left',
          type: 'smoothstep',
          style: { stroke: '#f59e42', strokeWidth: 2 },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#f59e42', color: 'white', fillOpacity: 1 },
          labelStyle: {
            fontSize: '10px',
            fontWeight: 'bold',
            fill: 'white'
          },
        });
      }
      return versionEdges;
    }
    return [];
  }, [expandedVersion, selectedUser, selectedDocument, expandedUser, viewMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when view changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [expandedVersion, expandedUser, selectedUser, selectedDocument, viewMode, setNodes, setEdges, initialNodes, initialEdges]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((_, node) => {
    if (node.type === 'version') {
      const versionId = node.data.id;
      if (expandedVersion === versionId) {
        setSelectedVersion(sampleDocumentVersions.find(v => v.id === versionId));
        setIsViewerOpen(true);
      } else {
        setExpandedVersion(versionId);
      }
    } else if (node.type === 'user') {
      const userId = node.data.id;
      if (expandedUser === userId) {
        setExpandedUser(null);
      } else {
        setExpandedUser(userId);
      }
    }
  }, [expandedVersion, expandedUser]);

  const getHeaderTitle = () => {
    if (viewMode === 'user') {
      const userData = sampleUsers.find(u => u.id === selectedUser);
      return `User Workflow - ${userData?.name || 'Unknown User'}`;
    } else if (viewMode === 'document') {
      const docData = availableDocuments.find(d => d.id === selectedDocument);
      return `Document Version Tree - ${docData?.name || 'Unknown Document'}`;
    }
    return 'Document Version Tree';
  };

  const getHeaderSubtitle = () => {
    if (viewMode === 'user') {
      const userData = sampleUsers.find(u => u.id === selectedUser);
      return `${userData?.role || ''} - Document Ownership & Review History`;
    } else if (viewMode === 'document') {
      return 'Version History & Review Workflow';
    }
    return 'Select a document or user from the sidebar to view workflow';
  };

  const getLegend = () => {
    if (viewMode === 'user') {
      return (
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
            <span>User</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
            <span>Owned Documents</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <span>Reviewed Documents</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
            <span>Author/Reference</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <span>Reviewer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
            <span>Reference Doc</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex -m-6">
      {/* Sidebar */}
      <Sidebar
        selectedDocument={selectedDocument}
        setSelectedDocument={setSelectedDocument}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 ">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="text-blue-600" size={20} />
                {getHeaderTitle()}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{getHeaderSubtitle()}</p>
            </div>
            {getLegend()}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1">
          {viewMode ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
              fitViewOptions={{ padding: 0.5 }}
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={true}
              zoomOnDoubleClick={false}
              panOnDrag={true}
              minZoom={0.3}
              maxZoom={1.5}
              defaultEdgeOptions={{
                type: "smoothstep",
                animated: false,
              }}
            >
              <Background variant="dots" gap={24} size={1} color="#e5e7eb" />
              <Controls
                className="!bg-white !border !border-gray-200 !shadow-sm !rounded-lg"
                position="bottom-right"
              />
            </ReactFlow>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Workflow Selected</h3>
                <p className="text-gray-600 mb-4 max-w-md">
                  Choose a document or user from the sidebar to view the workflow visualization and explore relationships.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Document Analysis</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>User Workflow</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Details Modal */}
      {selectedVersion && (
        <FullPagePopup
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedVersion(null);
          }}
          title={`${selectedVersion?.title || "Document"} - Review Summary`}
        >
          <div>
            <div className="w-full border border-[#e5e7eb] border-b-0 overflow-hidden">
              {/* Header */}
              <div className="bg-[#f3f4f6] p-2 border-b border-b-[#d1d5db]">
                <h3 className="font-medium text-lg">Document Details</h3>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-6 text-sm">
                {/* Existing Fields */}
                <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                  Owner:
                </div>
                <div className="col-span-2 p-2 border-r border-b border-[#e5e7eb] text-[#1a56db]">
                  {selectedVersion?.owner?.officer ||
                    selectedVersion?.owner ||
                    "N/A"}
                </div>

                <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                  Uploaded By:
                </div>
                <div className="col-span-2 p-2 border-b border-[#e5e7eb] text-[#1a56db]">
                  {selectedVersion?.uploadedByName ||
                    selectedVersion?.owner?.officer ||
                    "N/A"}
                </div>

                <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                  Department:
                </div>
                <div className="col-span-2 p-2 border-r border-b border-[#e5e7eb] text-[#1a56db]">
                  {selectedVersion?.department ||
                    selectedVersion?.owner?.department ||
                    "N/A"}
                </div>

                <div className="col-span-1 p-2 border-r border-b border-[#e5e7eb] font-medium bg-[#f9fafb]">
                  Uploaded TS:
                </div>
                <div className="col-span-2 p-2 border-b border-[#e5e7eb] text-[#1a56db]">
                  {formatTimestamp(selectedVersion?.createdAt)}
                </div>

                <div className="col-span-1 p-2 border-r border-[#e5e7eb] font-medium bg-[#f9fafb]">
                  Category:
                </div>
                <div className="col-span-2 p-2 border-r border-[#e5e7eb] text-[#1a56db]">
                  {selectedVersion?.category || "N/A"}
                </div>

                <div className="col-span-1 p-2 border-r border-[#e5e7eb] font-medium bg-[#f9fafb]">
                  File Type:
                </div>
                <div className="col-span-2 p-2 border-[#e5e7eb]">
                  {isDownloading ? (
                    <p className="text-[#dc2626] text-xs px-2">pdf</p>
                  ) : (
                    <Badge className="bg-[#fef2f2] text-[#dc2626] text-xs px-2">
                      {selectedVersion?.fileType || "N/A"}
                    </Badge>
                  )}
                </div>

                {/* Reference Documents Section */}
                <div className="col-span-1 p-2 border-r border-t border-[#e5e7eb] font-medium bg-[#f9fafb]">
                  Reference Documents Linked:
                </div>
                <div className="col-span-5 p-2 border-t border-[#e5e7eb] text-[#1a56db] space-y-1 ">
                  {selectedVersion?.referenceDocuments?.map((item, index) => (
                    <p key={index} className="">{item}</p>
                  ))}
                </div>
              </div>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium">
                    Change Control Title/Modification
                  </th>
                  <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium w-72">
                    Review Content Selected
                  </th>
                  <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium min-w-72">
                    Comments
                  </th>
                  <th className="border border-[#E5E7EB] bg-[#f3f4f6] p-2 text-left font-medium w-64">
                    Approval Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {cctData.map((cct, cctIndex) => (
                  <React.Fragment key={cctIndex}>
                    {cct.references.map((ref, refIndex) => {
                      const isFirstRef = refIndex === 0;
                      const reference = referenceTexts[ref];
                      const approver = approverData[ref];

                      return (
                        <tr key={`${cctIndex}-${refIndex}`}>
                          {isFirstRef && (
                            <td
                              className="border border-[#E5E7EB] p-2 align-top"
                              rowSpan={cct.references.length}
                            >
                              <div className="font-medium">{cct.category}</div>
                              {reference && (
                                <div className="mt-2 text-sm text-[#1a56db] border-t pt-2">
                                  <div>
                                    <span className="text-[#000000] font-medium">
                                      Author:
                                    </span>{" "}
                                    {reference.author}
                                  </div>
                                  <div>
                                    <span className="text-[#000000] font-medium">
                                      Title:
                                    </span>{" "}
                                    {reference.authorTitle}
                                  </div>
                                  <div>
                                    <span className="text-[#000000] font-medium">
                                      Group:
                                    </span>{" "}
                                    {reference.authorGroup}
                                  </div>
                                  <div>
                                    <span className="text-[#000000] font-medium">
                                      Created:
                                    </span>{" "}
                                    {formatTimestamp(reference.timestamp)}
                                  </div>
                                </div>
                              )}
                            </td>
                          )}
                          <td className="border border-[#E5E7EB] p-2 align-top">
                            <div className="text-sm text-[#4b5563] whitespace-pre-line">
                              {reference?.text || "No content available"}
                            </div>
                            {reference && (
                              <div className="mt-2 text-sm text-[#2563eb] border-t pt-2">
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Author:
                                  </span>{" "}
                                  {reference.author}
                                </div>
                                <div>
                                  <span className="text-[#000000] font-medium">
                                    Created:
                                  </span>{" "}
                                  {formatTimestamp(reference.timestamp)}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="border border-[#E5E7EB] p-2 align-top">
                            {selectedVersion?.comments?.length > 0 ? (
                              selectedVersion.comments.map((comment) => (
                                <div key={comment.id} className="mb-4">
                                  <div className="bg-[#ffffff] p-3 rounded-md border border-[#e5e7eb]">
                                    <div className="flex items-start gap-3">
                                      <div className="flex-1">
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                              {comment.name}
                                            </span>
                                            {isDownloading ? (
                                              <p className="text-[#000000] text-xs">
                                                {comment.title}
                                              </p>
                                            ) : (
                                              <Badge className="bg-[#e5e7eb] text-[#000000] text-xs">
                                                {comment.title}
                                              </Badge>
                                            )}
                                          </div>
                                          {isDownloading ? (
                                            <p className="text-xs w-fit text-[#2563eb]">
                                              {comment.group}
                                            </p>
                                          ) : (
                                            <Badge className="bg-[#2563eb] text-[#ffffff] text-xs w-fit flex items-center gap-1">
                                              <UsersRound size={12} />
                                              {comment.group}
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="mt-2 text-sm">
                                          {comment.comment}
                                        </p>
                                        <p className="text-xs text-[#6b7280] mt-1">
                                          {formatTimestamp(comment.timestamp)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {comment.replies?.map((reply) => (
                                    <div
                                      key={reply.id}
                                      className="ml-6 mt-2 bg-[#eff6ff] p-3 rounded-md border border-[#bfdbfe]"
                                    >
                                      <div className="flex items-start gap-2">
                                        <CornerDownRight
                                          size={16}
                                          className="text-[#4b5563] mt-1"
                                        />
                                        <div className="flex-1">
                                          <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium">
                                                {reply.name}
                                              </span>
                                              {isDownloading ? (
                                                <p className="text-[#000000] text-xs">
                                                  {reply.title}
                                                </p>
                                              ) : (
                                                <Badge className="bg-[#e5e7eb] text-[#000000] text-xs">
                                                  {reply.title}
                                                </Badge>
                                              )}
                                            </div>
                                            {isDownloading ? (
                                              <p className="text-xs w-fit text-[#2563eb]">
                                                {reply.group}
                                              </p>
                                            ) : (
                                              <Badge className="bg-[#2563eb] text-[#ffffff] text-xs w-fit flex items-center gap-1">
                                                <UsersRound size={12} />
                                                {reply.group}
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="mt-2 text-sm">
                                            {reply.comment}
                                          </p>
                                          <p className="text-xs text-[#6b7280] mt-1">
                                            {formatTimestamp(reply.timestamp)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-[#6B7280]">
                                No comments available for this document.
                              </div>
                            )}
                          </td>
                          <td className="border border-[#E5E7EB] p-2 align-top">
                            {approver ? (
                              <div className="flex flex-col gap-2">
                                <div className="font-medium">{approver.name}</div>
                                {isDownloading ? (
                                  <p className="text-[#000000] text-xs">
                                    {approver.title}
                                  </p>
                                ) : (
                                  <Badge className="bg-[#e5e7eb] text-[#000000] text-xs">
                                    {approver.title}
                                  </Badge>
                                )}
                                {isDownloading ? (
                                  <p className="text-xs w-fit text-[#2563eb]">
                                    {approver.group}
                                  </p>
                                ) : (
                                  <Badge className="bg-[#2563eb] text-[#ffffff] text-xs w-fit flex items-center gap-1">
                                    <UsersRound size={12} />
                                    {approver.group}
                                  </Badge>
                                )}
                                <div className="text-sm mt-2 text-[#2563eb]">
                                  <span className="text-[#000000] font-medium">
                                    Approved at:
                                  </span>{" "}
                                  {formatTimestamp(approver.timestamp)}
                                </div>
                                <div className="mt-2 border-t pt-2">
                                  <div className="text-xs text-[#6b7280]">
                                    Signature:
                                  </div>
                                  <img
                                    src={"/sig-2.png"}
                                    alt={`Signature of ${approver.name}`}
                                    className="h-24 object-contain mt-1"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-[#6B7280]">
                                No approval details available.
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </FullPagePopup>
      )}
    </div>
  );
};

export default DocumentVersionTree;
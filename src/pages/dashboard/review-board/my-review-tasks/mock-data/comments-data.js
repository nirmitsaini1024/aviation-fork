// /mockdata/comments-data.js

// Current user info
export const currentUser = {
  id: "current-user",
  name: "John Doe",
  avatar: "/placeholder.svg?height=40&width=40",
  initials: "JD",
};

export const enhancedSampleCommentsData = [
  {
    id: 97,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1011,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 98,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1012,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 99,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1013,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 100,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1014,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 101,
    user: {
      name: "Document Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DR",
    },
    text: "This document needs some clarification in section 3.",
    likes: 5,
    dislikes: 1,
    timestamp: "2 days ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1015,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for pointing this out. I'll make the necessary changes.",
        timestamp: "1 day ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 102,
    user: {
      name: "User 1",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "U1",
    },
    text: "CONFIDENTIAL: Found some issues with the security section that need urgent attention.",
    likes: 3,
    dislikes: 0,
    timestamp: "3 days ago",
    rating: 0,
    visibility: "private",
    replies: [],
    restrictedTo: ["user1", "user2"]
  },
  {
    id: 103,
    user: {
      name: "Technical Editor",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TE",
    },
    text: "Great job on improving the diagrams in the appendix.",
    likes: 8,
    dislikes: 0,
    timestamp: "4 days ago",
    rating: 0,
    visibility: "individual",
    replies: [
      {
        id: 1031,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thank you! I spent extra time on those.",
        timestamp: "4 days ago",
        taggedUser: null,
        likes: 3,
        dislikes: 0,
        rating: 0,
      },
      {
        id: 1032,
        user: {
          name: "Project Manager",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "PM",
        },
        text: "These diagrams will be very helpful for the client presentation.",
        timestamp: "3 days ago",
        taggedUser: null,
        likes: 1,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 104,
    user: {
      name: "Quality Assurance",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "QA",
    },
    text: "I've reviewed the compliance section and everything looks good. The documentation meets our internal standards.",
    likes: 12,
    dislikes: 0,
    timestamp: "5 days ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1041,
        user: {
          name: "Compliance Officer",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "CO",
        },
        text: "Excellent work! This will make the audit process much smoother.",
        timestamp: "5 days ago",
        taggedUser: null,
        likes: 4,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 105,
    user: {
      name: "Senior Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    text: "The financial projections in section 8 need to be updated with the latest quarterly figures. Please revise accordingly.",
    likes: 7,
    dislikes: 2,
    timestamp: "6 days ago",
    rating: 0,
    visibility: "public",
    replies: [],
  },
  {
    id: 106,
    user: {
      name: "Legal Team",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "LT",
    },
    text: "From a legal perspective, we need to add disclaimers in sections 4 and 7. I'll send the specific language separately.",
    likes: 9,
    dislikes: 1,
    timestamp: "1 week ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1061,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Thanks for the guidance. I'll wait for your email with the specific disclaimer text.",
        timestamp: "1 week ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 0,
      },
      {
        id: 1062,
        user: {
          name: "Legal Team",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "LT",
        },
        text: "Email sent with the required disclaimers. Please implement by end of week.",
        timestamp: "6 days ago",
        taggedUser: null,
        likes: 1,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 107,
    user: {
      name: "Marketing Team",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MT",
    },
    text: "The product descriptions could be more engaging. Consider adding customer testimonials or case studies.",
    likes: 6,
    dislikes: 0,
    timestamp: "1 week ago",
    rating: 0,
    visibility: "public",
    replies: [],
  },
  {
    id: 108,
    user: {
      name: "IT Security",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ITS",
    },
    text: "Security review completed. All data handling procedures comply with our security policies. Approved for publication.",
    likes: 15,
    dislikes: 0,
    timestamp: "1 week ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1081,
        user: {
          name: "Document Owner",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DO",
        },
        text: "Great! Thanks for the thorough security review.",
        timestamp: "1 week ago",
        taggedUser: null,
        likes: 3,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  // Additional comments for load more testing
  {
    id: 109,
    user: {
      name: "UX Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "UX",
    },
    text: "The user interface mockups look fantastic. The color scheme and layout are very user-friendly.",
    likes: 11,
    dislikes: 0,
    timestamp: "1 week ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1091,
        user: {
          name: "Frontend Developer",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "FD",
        },
        text: "I agree! This will be much easier to implement than the previous design.",
        timestamp: "6 days ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 110,
    user: {
      name: "Data Analyst",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DA",
    },
    text: "The data validation rules in section 12 need to be more specific. Current rules are too broad.",
    likes: 4,
    dislikes: 1,
    timestamp: "1 week ago",
    rating: 0,
    visibility: "individual",
    replies: [],
  },
  {
    id: 111,
    user: {
      name: "System Administrator",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SA",
    },
    text: "Infrastructure requirements look good. All server specifications meet our current capacity.",
    likes: 8,
    dislikes: 0,
    timestamp: "2 weeks ago",
    rating: 0,
    visibility: "public",
    replies: [
      {
        id: 1111,
        user: {
          name: "DevOps Engineer",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "DE",
        },
        text: "Perfect! This aligns with our deployment pipeline as well.",
        timestamp: "2 weeks ago",
        taggedUser: null,
        likes: 5,
        dislikes: 0,
        rating: 0,
      },
      {
        id: 1112,
        user: {
          name: "Network Engineer",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "NE",
        },
        text: "Bandwidth requirements are within acceptable limits.",
        timestamp: "1 week ago",
        taggedUser: null,
        likes: 2,
        dislikes: 0,
        rating: 0,
      },
    ],
  },
  {
    id: 112,
    user: {
      name: "Product Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "PM2",
    },
    text: "Feature roadmap needs adjustment. Priority should be given to user authentication before payment integration.",
    likes: 6,
    dislikes: 2,
    timestamp: "2 weeks ago",
    rating: 0,
    visibility: "private",
    replies: [
      {
        id: 1121,
        user: {
          name: "Tech Lead",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "TL",
        },
        text: "@Product Manager I understand the concern, but payment integration has dependencies that need early implementation.",
        timestamp: "2 weeks ago",
        taggedUser: {
          name: "Product Manager",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "PM2",
        },
        likes: 3,
        dislikes: 1,
        rating: 0,
      },
    ],
    restrictedTo: ["product-team", "tech-team"]
  },
];

// Export additional utility functions if needed
export const getCommentById = (commentId) => {
  return enhancedSampleCommentsData.find(comment => comment.id === commentId);
};

export const getReplyById = (commentId, replyId) => {
  const comment = getCommentById(commentId);
  if (!comment || !comment.replies) return null;
  return comment.replies.find(reply => reply.id === replyId);
};

export const getCommentsByVisibility = (visibility) => {
  return enhancedSampleCommentsData.filter(comment => comment.visibility === visibility);
};

export const getCommentsByUser = (userName) => {
  return enhancedSampleCommentsData.filter(comment => comment.user.name === userName);
};

/**
 * Filter documents based on status
 */
export const filterDocumentsByStatus = (documents, status) => {
  switch (status) {
    case "active":
      return documents.filter(doc => doc.status === "In Review");
    case "refdoc":
      return documents.filter(doc => doc.type === "Reference");
    case "approved":
      return documents.filter(doc => doc.status === "Approved");
    case "disapproved":
      return documents.filter(doc => doc.status === "Rejected");
    default:
      return documents;
  }
};

/**
 * Get unique values from an array of objects for a specific property
 */
export const getUniqueValues = (array, property) => {
  const values = array.map(item => {
    const props = property.split('.');
    return props.reduce((obj, prop) => obj?.[prop], item);
  }).filter(Boolean);
  
  return [...new Set(values)];
};

/**
 * Filter documents based on applied filters
 */
export const applyDocumentFilters = (documents, filters) => {
  let filteredDocs = [...documents];

  if (filters.documentType) {
    filteredDocs = filteredDocs.filter(doc => doc.type === filters.documentType);
  }

  if (filters.documentName) {
    filteredDocs = filteredDocs.filter(doc => doc.name === filters.documentName);
  }

  if (filters.domain) {
    // Assuming there's a mapping between domain and some document property
    // This would need to be adjusted based on your data structure
  }

  if (filters.department) {
    filteredDocs = filteredDocs.filter(doc => doc.owner?.department === filters.department);
  }

  if (filters.category) {
    filteredDocs = filteredDocs.filter(doc => doc.category === filters.category);
  }

  if (filters.ownerName) {
    filteredDocs = filteredDocs.filter(doc => doc.owner?.officer === filters.ownerName);
  }

  if (filters.cct) {
    filteredDocs = filteredDocs.filter(doc => doc.cct === filters.cct);
  }

  if (filters.refDocs) {
    filteredDocs = filteredDocs.filter(doc => doc.referenceDocs?.includes(filters.refDocs));
  }

  if (filters.dateFrom) {
    filteredDocs = filteredDocs.filter(doc => {
      const docDate = new Date(doc.createdAt || doc.date);
      return docDate >= filters.dateFrom;
    });
  }

  if (filters.dateTo) {
    filteredDocs = filteredDocs.filter(doc => {
      const docDate = new Date(doc.createdAt || doc.date);
      return docDate <= filters.dateTo;
    });
  }

  return filteredDocs;
};

/**
 * Get available options based on current filters and document set
 */
export const getAvailableOptions = (documents, filters, property) => {
  const filteredDocs = applyDocumentFilters(documents, { ...filters, [property]: null });
  return getUniqueValues(filteredDocs, property);
};

/**
 * Check if a filter value is valid
 */
export const isValidFilterValue = (value) => {
  return value && value !== "all_types" && value !== "all_documents" && 
         value !== "all_cct" && value !== "all_domains" && 
         value !== "all_departments" && value !== "all_categories" &&
         value !== "all_owners" && value !== "all_refdocs";
};

/**
 * Format filter value for display
 */
export const formatFilterValue = (value, type) => {
  if (!value) return "All";
  
  switch (type) {
    case "date":
      return new Date(value).toLocaleDateString();
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return value;
  }
};

/**
 * Get department options based on domain
 */
export const getDepartmentsByDomain = (domain, departmentOptions) => {
  if (!domain || domain === "all_domains") {
    return Object.values(departmentOptions).flat();
  }
  return departmentOptions[domain] || [];
};

/**
 * Get category options based on domain
 */
export const getCategoriesByDomain = (domain, categoryOptions) => {
  if (!domain || domain === "all_domains") {
    return Object.values(categoryOptions).flat();
  }
  return categoryOptions[domain] || [];
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Create filter object from current state
 */
export const createFilterObject = (state) => {
  const filters = {};
  
  Object.entries(state).forEach(([key, value]) => {
    if (isValidFilterValue(value)) {
      filters[key] = value;
    }
  });

  return filters;
};
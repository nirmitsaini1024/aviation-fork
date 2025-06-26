// /utils/escalation-filters.js
export function filterEscalations(escalations, globalFilter, columnFilters) {
  return escalations.filter((escalation) => {
    // Apply global filter
    if (globalFilter) {
      const searchableValues = [
        escalation.category,
        escalation.documentName,
        escalation.role,
        escalation.assignedTo,
        escalation.assignedAt,
        escalation.expiredAt,
        escalation.status,
        escalation.priority,
      ];

      if (
        !searchableValues.some((value) =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      ) {
        return false;
      }
    }

    // Apply column filters
    for (const [key, value] of Object.entries(columnFilters)) {
      if (!value) continue;

      const escalationValue = escalation[key];
      if (!String(escalationValue).toLowerCase().includes(value.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

export function sortEscalations(escalations, sortColumn, sortDirection) {
  if (!sortColumn || !sortDirection) return escalations;

  return [...escalations].sort((a, b) => {
    const aValue = String(a[sortColumn]);
    const bValue = String(b[sortColumn]);

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
}
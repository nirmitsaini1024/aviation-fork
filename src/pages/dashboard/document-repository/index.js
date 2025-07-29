// Main component
export { default } from './DocCenter';

// Context
export { DocCenterProvider, useDocCenter } from './context/DocCenterContext';

// Components
export { FilterSection } from './components/FilterSection';
export { AdvancedFilters } from './components/AdvancedFilters';
export { DocumentTabs } from './components/DocumentTabs.jsx';

// Hooks
export { useDocumentFilters } from './hooks/useDocumentFilters';
export { useTabManagement } from './hooks/useTabManagement';
export { useUrlParams } from './hooks/useUrlParams';

// Utils
export * from './utils/filterHelpers';
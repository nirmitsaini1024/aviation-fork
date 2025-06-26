import UniversalDocumentViewer from '@/components/universal-document-viewer';
import React from 'react';

const NewTabViewer = ({ 
  documentUrl = '/sample.pdf',
  documentType = 'pdf',
  onSetSearchPluginInstance 
}) => {
  return (
    <div className="h-screen w-full">
      <UniversalDocumentViewer
        documentUrl={documentUrl}
        documentType={documentType}
        mode="fullpage"
        enableToolbar={true}
        enableSearch={true}
        enableAnnotations={true}
        height="100vh"
        width="100%"
        onLoadComplete={() => console.log("PDF document loaded successfully")}
        onError={(error) => console.error("Error loading document:", error)}
        // Custom toolbar buttons to replicate the original functionality
        customToolbarButtons={[
          {
            title: 'Custom Search',
            img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
            onClick: () => {
              // Custom search functionality
              console.log('Custom search clicked');
            }
          }
        ]}
        // Additional features that were in the original toolbar
        enableFeatures={[
          'UI.Feature.Print',
          'UI.Feature.Download',
          'UI.Feature.Search'
        ]}
      />
    </div>
  );
};

export default NewTabViewer;
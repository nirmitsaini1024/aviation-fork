import React from 'react';
import NewTabViewer from './newtabviewer'; // Your updated NewTabViewer component

const RefDocPage = () => {
  return (
    <div className="h-screen w-full">
      <NewTabViewer 
        documentUrl="/sample.pdf" // Replace with actual document URL
        documentType="pdf"
      />
    </div>
  );
};

export default RefDocPage;
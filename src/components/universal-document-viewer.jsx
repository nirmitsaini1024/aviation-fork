import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import WebViewer from '@pdftron/webviewer';

const UniversalDocumentViewer = forwardRef(({
  documentUrl = '/sample.pdf',
  documentType = 'pdf', // 'pdf', 'docx', 'doc'
  mode = 'single', // 'single', 'compare', 'fullpage'
  compareDocument = null, // For comparison mode
  enableEditing = false,
  enableAnnotations = true,
  enableSearch = true,
  enableToolbar = true,
  height = '100%',
  width = '100%',
  className = '',
  onLoadComplete = () => {},
  onError = () => {},
  licenseKey = 'demo:1745619411379:6100596e0300000000cec4e228950dd6be8e57b6f5fcff99172249fc5f',
  customToolbarButtons = [],
  disableFeatures = [],
  enableFeatures = [],
}, ref) => {
  const viewerRef = useRef(null);
  const instanceRef = useRef(null);

  // ADDED: Helper function to check if URL is a blob URL
  const isBlobUrl = (url) => {
    return url && url.startsWith('blob:');
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getInstance: () => instanceRef.current,
    loadDocument: (url) => {
      if (instanceRef.current) {
        const { documentViewer } = instanceRef.current.Core;
        documentViewer.loadDocument(url);
      }
    },
    enableSync: () => {
      if (instanceRef.current && mode === 'compare') {
        instanceRef.current.UI.enableMultiViewerSync();
      }
    },
    disableSync: () => {
      if (instanceRef.current && mode === 'compare') {
        instanceRef.current.UI.disableMultiViewerSync();
      }
    },
    search: (term) => {
      if (instanceRef.current) {
        instanceRef.current.UI.searchText(term);
      }
    }
  }), [mode]);

  useEffect(() => {
    const initWebViewer = async () => {
      try {
        const config = {
          path: '/lib/webviewer',
          fullAPI: true,
          licenseKey: licenseKey,
        };

        // UPDATED: Handle blob URLs differently
        const isBlob = isBlobUrl(documentUrl);
        
        if (isBlob) {
          // For blob URLs, don't set initialDoc in config
          // We'll load it after WebViewer initializes
          console.log('Detected blob URL, will load after initialization');
        } else {
          // For static files, configure as before
          if (documentType === 'docx' || documentType === 'doc') {
            config.enableOfficeEditing = enableEditing;
            config.initialDoc = documentUrl;
          } else {
            config.initialDoc = documentUrl;
          }
        }

        // ADDED: Add additional config for blob URL compatibility
        if (isBlob) {
          config.useSharedWorker = false;
          config.enableOptimizedWorkers = false;
        }

        // Initialize WebViewer
        const instance = await WebViewer(config, viewerRef.current);
        instanceRef.current = instance;

        const { UI, Core } = instance;

        // Configure features
        if (enableFeatures.length > 0) {
          UI.enableFeatures(enableFeatures);
        }

        if (disableFeatures.length > 0) {
          UI.disableFeatures(disableFeatures);
        }

        // Configure toolbar
        if (!enableToolbar) {
          UI.disableElements(['header']);
        }

        // Configure annotations
        if (!enableAnnotations) {
          UI.disableFeatures([UI.Feature.Annotations]);
        }

        // Handle different modes
        if (mode === 'compare' && compareDocument) {
          await setupCompareMode(UI, Core);
        } else if (mode === 'fullpage') {
          setupFullPageMode(UI);
        }

        // Add custom toolbar buttons
        if (customToolbarButtons.length > 0) {
          addCustomToolbarButtons(UI, customToolbarButtons);
        }

        // Setup event listeners
        const { documentViewer } = Core;
        
        documentViewer.addEventListener('documentLoaded', () => {
          console.log('Document loaded successfully');
          onLoadComplete();
        });

        documentViewer.addEventListener('documentLoadError', (error) => {
          console.error('Error loading document:', error);
          onError(error);
        });

        // UPDATED: Handle blob URLs after initialization
        if (isBlob && documentUrl) {
          try {
            console.log('Loading blob URL:', documentUrl);
            await documentViewer.loadDocument(documentUrl);
          } catch (error) {
            console.error('Error loading blob URL:', error);
            onError(error);
          }
        } else if (!config.initialDoc && documentUrl) {
          // Load initial document if not set in config (for static files)
          documentViewer.loadDocument(documentUrl);
        }

      } catch (error) {
        console.error('Error initializing WebViewer:', error);
        onError(error);
      }
    };

    const setupCompareMode = async (UI, Core) => {
      // Enable side-by-side view feature
      UI.enableFeatures([UI.Feature.SideBySideView]);
      
      // Enter multi-viewer mode programmatically
      UI.enterMultiViewerMode();
      
      // Wait for multi-viewer mode to be ready
      UI.addEventListener(UI.Events.MULTI_VIEWER_READY, async () => {
        // Get references to both document viewers
        const [documentViewer1, documentViewer2] = Core.getDocumentViewers();
        
        // Load documents in both viewers
        documentViewer1.loadDocument(documentUrl);
        if (compareDocument) {
          documentViewer2.loadDocument(compareDocument);
        }
        
        // Enable document comparison feature
        UI.enableFeatures([UI.Feature.ComparePages]);
        
        // Create a sync toggle button
        const syncButton = UI.createButton({
          title: 'Toggle Sync',
          img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>',
        });
        
        // Initialize sync state
        let isSyncEnabled = true;
        
        // Add button to the header
        UI.setHeaderItems(header => {
          header.push(syncButton);
        });
        
        // Set initial button style
        syncButton.element.style.backgroundColor = '#e1f5fe';
        
        // Toggle sync when button is clicked
        syncButton.addEventListener('click', () => {
          isSyncEnabled = !isSyncEnabled;
          
          if (isSyncEnabled) {
            syncButton.title = 'Sync: ON (Click to disable)';
            syncButton.element.style.backgroundColor = '#e1f5fe';
            UI.enableMultiViewerSync();
          } else {
            syncButton.title = 'Sync: OFF (Click to enable)';
            syncButton.element.style.backgroundColor = '';
            UI.disableMultiViewerSync();
          }
        });
        
        // Enable sync by default
        UI.enableMultiViewerSync();
      });
    };

    const setupFullPageMode = (UI) => {
      // Add any full page specific configurations
      UI.setFitMode(UI.FitMode.FitWidth);
    };

    const addCustomToolbarButtons = (UI, buttons) => {
      buttons.forEach(buttonConfig => {
        const button = UI.createButton(buttonConfig);
        UI.setHeaderItems(header => {
          header.push(button);
        });
      });
    };

    initWebViewer();

    // Cleanup
    return () => {
      if (instanceRef.current) {
        instanceRef.current.UI.dispose();
      }
    };
  }, [documentUrl, documentType, mode, compareDocument, enableEditing]);

  return (
    <div 
      className={`universal-document-viewer ${className}`}
      style={{ height, width }}
    >
      <div 
        ref={viewerRef} 
        style={{ height: '100%', width: '100%' }} 
      />
    </div>
  );
});

UniversalDocumentViewer.displayName = 'UniversalDocumentViewer';

export default UniversalDocumentViewer;
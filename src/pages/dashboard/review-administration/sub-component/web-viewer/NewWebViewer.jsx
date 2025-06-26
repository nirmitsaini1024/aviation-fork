import WebViewer from "@pdftron/webviewer";
import React, { useEffect, useRef, useCallback } from "react";

const createStableCallback = (callback) => {
  return (text) => {
    if (typeof callback === 'function') {
      callback(text);
    }
  };
};

const WebViewerComponent = React.memo(({
  onLoadComplete,
  initialPage = 1,
  setSelectedText,
  setSelectedPage,
  searchText,
  onPageChange,
  setSelectedTextPages = () =>{}
}) => {
  const ref = useRef(null);
  const viewerInstance = useRef(null);
  const lastReportedPage = useRef(null);
  const isInitializing = useRef(false);
  const selectionBuffer = useRef({
    pageTexts: {},
    timeout: null,
    isSelecting: false,
    processedSelections: {},
    startSelection: null,
    endSelection: null,
  });
  
  const stableSetSelectedText = useRef(createStableCallback(setSelectedText));
  const stableSetSelectedPage = useRef(createStableCallback(setSelectedPage));
  const stableOnPageChange = useRef(createStableCallback(onPageChange));
  const stableOnLoadComplete = useRef(createStableCallback(onLoadComplete));
  
  useEffect(() => {
    stableSetSelectedText.current = createStableCallback(setSelectedText);
    stableSetSelectedPage.current = createStableCallback(setSelectedPage);
    stableOnPageChange.current = createStableCallback(onPageChange);
    stableOnLoadComplete.current = createStableCallback(onLoadComplete);
  }, [setSelectedText, setSelectedPage, onPageChange, onLoadComplete]);

  const prepareSearchText = useCallback((text, portionSize = 100) => {
    if (!text) return [];
    const portions = [];
    let currentIndex = 0;
    const textLength = text.length;

    while (currentIndex < textLength) {
      let portion;
      if (currentIndex + portionSize >= textLength) {
        portion = text.substring(currentIndex);
      } else {
        portion = text.substring(currentIndex, currentIndex + portionSize);
        const lastSpaceIndex = portion.lastIndexOf(" ");
        if (lastSpaceIndex > 20) portion = portion.substring(0, lastSpaceIndex);
      }

      portion = portion.replace(/\s+/g, " ").trim();
      if (portion) portions.push(portion);
      currentIndex += portion.length + 1;
    }

    return portions;
  }, []);

  const searchMultiplePortions = useCallback(async (portions) => {
    if (!viewerInstance.current) return;
    
    const { documentViewer, Search } = viewerInstance.current.Core;
    const searchModes = [Search.Mode.HIGHLIGHT, Search.Mode.PAGE_STOP];
    documentViewer.clearSearchResults();

    const allResults = [];
    for (let i = 0; i < portions.length; i++) {
      const result = await new Promise((resolve) => {
        documentViewer.textSearchInit(portions[i], searchModes, {
          fullSearch: true,
          onResult: resolve,
          onDocumentEnd: () => resolve(null),
          onError: () => resolve(null),
        });
      });
      if (result) allResults.push(result);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (allResults.length > 0) {
      documentViewer.displaySearchResult(allResults[0]);
      for (let i = 1; i < allResults.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        documentViewer.displayAdditionalSearchResult(allResults[i]);
      }
    }
  }, []);

  const performSingleSearch = useCallback((searchText) => {
    if (!viewerInstance.current) return;
    
    const { documentViewer, Search } = viewerInstance.current.Core;
    const searchModes = [Search.Mode.HIGHLIGHT, Search.Mode.PAGE_STOP];

    documentViewer.textSearchInit(searchText, searchModes, {
      fullSearch: true,
      onResult: (result) => documentViewer.displaySearchResult(result),
      onError: () => {
        if (searchText.includes(" ")) {
          const firstFewWords = searchText.split(" ").slice(0, 3).join(" ");
          setTimeout(() => {
            documentViewer.clearSearchResults();
            documentViewer.textSearchInit(firstFewWords, searchModes, {
              fullSearch: true,
              onError: () => {
                const firstWord = searchText.split(" ")[0];
                setTimeout(() => {
                  documentViewer.clearSearchResults();
                  documentViewer.textSearchInit(firstWord, searchModes, {
                    fullSearch: true,
                  });
                }, 200);
              },
            });
          }, 200);
        }
      },
    });
  }, []);

  const performSearch = useCallback((text) => {
    console.log("Performing search for:", text);
    
    if (!text || !viewerInstance.current) {
      console.log("No text or viewer instance");
      return;
    }

    const { documentViewer } = viewerInstance.current.Core;
    
    documentViewer.setSearchHighlightColors({
      searchResult: "rgba(255, 255, 0, 0.5)",
      activeSearchResult: "rgba(255, 255, 0, 0.8)",
    });
    
    documentViewer.clearSearchResults();

    setTimeout(() => {
      const textPortions = prepareSearchText(text);
      console.log("Text portions:", textPortions);
      
      if (textPortions.length === 0) return;
      
      if (textPortions.length === 1) {
        console.log("Performing single search");
        performSingleSearch(textPortions[0]);
      } else {
        console.log("Performing multiple portions search");
        searchMultiplePortions(textPortions);
      }
    }, 300);
  }, [prepareSearchText, performSingleSearch, searchMultiplePortions]);

  // Initialize only once
  useEffect(() => {
    if (viewerInstance.current) {
      console.log("WebViewer already initialized, skipping initialization");
      return;
    }
    
    console.log("Initializing WebViewer");
    isInitializing.current = true;
    
    WebViewer(
      {
        path: "/lib/webviewer",
        enableOfficeEditing: true,
        initialDoc: "/sample.docx",
        licenseKey:
          "demo:1745783371265:611dd9f60300000000f53ccc859bd9dbdd9cc80649258f285c88bfd5f3",
        fullAPI: true,
      },
      ref.current
    ).then((instance) => {
      console.log("WebViewer initialized");
      viewerInstance.current = instance;
      const { documentViewer } = instance.Core;

      // Document loaded event handler
      documentViewer.addEventListener("documentLoaded", () => {
        console.log("Document loaded in WebViewer");
        
        setTimeout(() => {
          const savedPage = sessionStorage.getItem("currentPage");
          const pageToSet = savedPage ? Number(savedPage) : initialPage || 1;
          
          console.log("Setting initial page to:", pageToSet);
          lastReportedPage.current = pageToSet;
          documentViewer.setCurrentPage(pageToSet);
          documentViewer.zoomTo(0.7);
          
          if(onLoadComplete) {
            stableOnLoadComplete.current();
          }
          
          isInitializing.current = false;
        }, 1000);

        documentViewer.setDisplayMode(documentViewer.DisplayModes.Continuous);
        documentViewer.enableScrollOnlyMode(false);
      });

      documentViewer.addEventListener("pageNumberUpdated", () => {
        if (isInitializing.current) {
          console.log("Skipping page update during initialization");
          return;
        }
        
        const currentPage = documentViewer.getCurrentPage?.();
        console.log("Page changed to:", currentPage, "Last reported:", lastReportedPage.current);
        
        if (currentPage && currentPage !== lastReportedPage.current) {
          lastReportedPage.current = currentPage;
          stableOnPageChange.current(currentPage);
        }
      });

      // Text selection handling
      documentViewer.addEventListener("mouseLeftDown", () => {
        if (selectionBuffer.current.timeout) {
          clearTimeout(selectionBuffer.current.timeout);
        }
        console.log("Starting text selection...");
        selectionBuffer.current.isSelecting = true;
        selectionBuffer.current.pageTexts = {};
        selectionBuffer.current.processedSelections = {};
        selectionBuffer.current.startSelection = null;
        selectionBuffer.current.endSelection = null;
      });

      documentViewer.addEventListener(
        "textSelected",
        (quads, selectedText, pageNumber) => {
          if (!selectionBuffer.current.isSelecting) return;

          const selectionKey = `${pageNumber}:${selectedText}`;
          if (selectionBuffer.current.processedSelections[selectionKey]) return;

          selectionBuffer.current.processedSelections[selectionKey] = true;

          if (selectedText && selectedText.trim() !== "") {
            selectionBuffer.current.pageTexts[pageNumber] = selectedText;
            console.log(`Text selected on page ${pageNumber}:`, selectedText.substring(0, 50) + "...");

            if (!selectionBuffer.current.startSelection) {
              selectionBuffer.current.startSelection = {
                pageNumber,
                text: selectedText,
                quads,
              };
            }
            selectionBuffer.current.endSelection = {
              pageNumber,
              text: selectedText,
              quads,
            };
          }
        }
      );

      documentViewer.addEventListener("mouseLeftUp", () => {
        if (!selectionBuffer.current.isSelecting) return;

        selectionBuffer.current.timeout = setTimeout(() => {
          console.log("Finalizing text selection...");
          console.log("Pages with text:", Object.keys(selectionBuffer.current.pageTexts));
          setSelectedTextPages(Object.keys(selectionBuffer.current.pageTexts))
          
          if (
            selectionBuffer.current.startSelection &&
            selectionBuffer.current.endSelection &&
            selectionBuffer.current.startSelection.pageNumber !==
              selectionBuffer.current.endSelection.pageNumber
          ) {
            console.log("Multi-page selection detected, using large selection handler");
            handleLargeSelection(documentViewer);
          } else {
            console.log("Single or simple multi-page selection, using standard handler");
            const pageNumbers = Object.keys(selectionBuffer.current.pageTexts)
              .map(Number)
              .sort((a, b) => a - b);

            let finalText = "";
            pageNumbers.forEach((page) => {
              const pageText = selectionBuffer.current.pageTexts[page];
              finalText = finalText ? finalText + "\n" + pageText : pageText;
            });

            if (finalText) {
              stableSetSelectedText.current(finalText);
              // FIXED: Pass all page numbers instead of just the first one
              if (pageNumbers.length > 0) {
                console.log("Selected pages (regular selection):", pageNumbers);
                stableSetSelectedPage.current(pageNumbers);
              }
            }
          }
          selectionBuffer.current.isSelecting = false;
          console.log("Text selection completed");
        }, 200);
      });

      const handleLargeSelection = async (docViewer) => {
        try {
          const { startSelection, endSelection } = selectionBuffer.current;
          if (!startSelection || !endSelection)
            return fallbackToStandardSelection();

          const startPage = startSelection.pageNumber;
          const endPage = endSelection.pageNumber;

          if (endPage - startPage > 3) {
            let combinedText =
              selectionBuffer.current.pageTexts[startPage] || "";

            // Collect all pages that will have text
            const allSelectedPages = [startPage];

            for (let page = startPage + 1; page < endPage; page++) {
              try {
                const pageText = await getFullPageText(page, docViewer);
                combinedText += "\n" + pageText;
                allSelectedPages.push(page);
              } catch {
                if (selectionBuffer.current.pageTexts[page]) {
                  combinedText +=
                    "\n" + selectionBuffer.current.pageTexts[page];
                  allSelectedPages.push(page);
                }
              }
            }

            if (selectionBuffer.current.pageTexts[endPage]) {
              combinedText += "\n" + selectionBuffer.current.pageTexts[endPage];
              allSelectedPages.push(endPage);
            }

            if (combinedText) {
              stableSetSelectedText.current(combinedText);
              // FIXED: Pass all selected page numbers
              console.log("Selected pages (large selection):", allSelectedPages);
              stableSetSelectedPage.current(allSelectedPages);
            } else fallbackToStandardSelection();
          } else {
            fallbackToStandardSelection();
          }
        } catch {
          fallbackToStandardSelection();
        }
      };

      const getFullPageText = (pageNumber, docViewer) => {
        return new Promise((resolve, reject) => {
          docViewer.getPageText(pageNumber, (text) => {
            text ? resolve(text) : reject();
          });
        });
      };

      const fallbackToStandardSelection = () => {
        const pageNumbers = Object.keys(selectionBuffer.current.pageTexts)
          .map(Number)
          .sort((a, b) => a - b);

        let finalText = "";
        pageNumbers.forEach((page) => {
          const pageText = selectionBuffer.current.pageTexts[page];
          finalText = finalText ? finalText + "\n" + pageText : pageText;
        });

        if (finalText) {
          stableSetSelectedText.current(finalText);
          // FIXED: Pass all page numbers instead of just the first one
          if (pageNumbers.length > 0) {
            console.log("Selected pages (fallback selection):", pageNumbers);
            stableSetSelectedPage.current(pageNumbers);
          }
        }
      };
    });
  }, [initialPage]);

  useEffect(() => {
    if (
      viewerInstance.current &&
      viewerInstance.current.Core.documentViewer.getDocument() &&
      !isInitializing.current
    ) {
      const { documentViewer } = viewerInstance.current.Core;
      const currentDocPage = documentViewer.getCurrentPage();

      if (initialPage && currentDocPage !== initialPage && initialPage !== lastReportedPage.current) {
        console.log("Updating page from", currentDocPage, "to", initialPage);
        lastReportedPage.current = initialPage;
        documentViewer.setCurrentPage(initialPage);
      }
    }
  }, [initialPage]);

  useEffect(() => {
    console.log("Search effect triggered:", { searchText, hasInstance: !!viewerInstance.current });
    
    if (viewerInstance.current) {
      if (searchText && searchText.trim()) {
        console.log("Starting search for:", searchText);
        performSearch(searchText.trim());
      } else {
        console.log("Clearing search results");
        viewerInstance.current.Core.documentViewer.clearSearchResults();
      }
    }
  }, [searchText, performSearch]);

  return (
    <div
      ref={ref}
      style={{
        height: "100%",
        overflowY: "hidden",
        position: "relative",
      }}
      className="webviewer-container"
    />
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.initialPage === nextProps.initialPage &&
    prevProps.searchText === nextProps.searchText
  );
});

export default WebViewerComponent;
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DocumentSignature from "./sections/document-review-signature";
import UploadAndTableSection from "./sections/uploadSection";
import ReviewManagement from "./sections/review-management/ReviewManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Stepper from "./sub-component/stepper-head/Stepper";
import { DocumentProvider } from "./contexts/DocumentContext";
import DocumentPendingTable from "./tables/pending/documentpendingtable";
import DocumentRefDocumentTable from "./tables/reference-documents/documentRefDocuments";
import DocumentApprovedTable from "./tables/approved/documentapprovedtable";
import DeactivatedDocumentsTable from "./tables/deactivated/deactivedtable";
import { CircleArrowLeft } from "lucide-react";
import { GlobalContext } from "@/GlobalContext/GlobalProvider";

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

function StepperApp({setIsBotOpen}) {
  const [activeStep, setActiveStep] = useState(3);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const { setIsReviewManagementOpen } = useContext(GlobalContext);

  // Search and filter states
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});

  useEffect(()=>{
    if(activeStep === 3){
      setIsReviewManagementOpen(false)
      console.log("This is 3 step")
    }

    if(activeStep === 0){
      console.log("This is 0 step");
      setIsReviewManagementOpen(false);
    }

    if(activeStep === 1){
      console.log("This is 1 step")
      setIsReviewManagementOpen(true);
    }

    if(activeStep == 2){
      console.log("This is 2 step");
      setIsReviewManagementOpen(false);
    }
  }, [activeStep])

  const steps = [
    { number: 1, title: "Upload" },
    { number: 2, title: "Review Management" },
    { number: 3, title: "Start Review Process" },
  ];

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle column filter change
  const handleFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  // Handle step click in the stepper
  const handleStepClick = (index) => {
    // If clicking on the Upload step (index 0) that's already active
    if (index === 0 && activeStep === 0) {
      // Toggle the upload section visibility
      showUploadSection === true ? setActiveStep(3) : setActiveStep(0);
      setShowUploadSection(!showUploadSection);
    }
    // Otherwise, set the active step normally
    else {
      setActiveStep(index);

      // Only show upload section when Upload step is explicitly clicked
      if (index === 0) {
        setShowUploadSection(true);
      } else {
        setShowUploadSection(false);
      }
    }
  };

  // When the component first mounts, we want to show the document list, not the upload section
  useEffect(() => {
    setShowUploadSection(false);
  }, []);

  const handleDocumentStore = () => {
    setActiveStep(3);
    setShowUploadSection(false);
  };

  // Reset search and filters when switching steps or tabs
  const resetSearchAndFilters = () => {
    setSortColumn(null);
    setSortDirection(null);
    setColumnFilters({});
  };

  // Pass search props to table components
  const tableProps = {
    sortColumn,
    sortDirection,
    columnFilters,
    handleSort,
    handleFilterChange,
    setIsBotOpen
  };

  return (
    <DocumentProvider>
      <div className="mt-5">
        <div className="space-y-6 pl-10">
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onStepClick={handleStepClick}
            />
        
          <button
           onClick={handleDocumentStore}
            className={`flex border-none font-semibold transition-all ease-in-out duration-300 hover:cursor-pointer pl-2 py-2 rounded-md`}
          >
           <CircleArrowLeft />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-soft py-8 md:py-6  min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeStep}`}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeStep === 0 && (
                <>
                  {/* When Upload step is clicked, show upload section above document list */}
                  {showUploadSection && (
                    <motion.div
                      key="upload"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className="mb-8 border-b pb-8"
                    >
                      <UploadAndTableSection />
                    </motion.div>
                  )}

                  {/* Always show document list table */}
                  <motion.div
                    key="document-list"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="mb-6">
                      <Tabs 
                        defaultValue="pending" 
                        className="w-full"
                        onValueChange={resetSearchAndFilters}
                      >
                        <TabsList className="mb-4 bg-blue-50 w-full">
                          <TabsTrigger
                            value="pending"
                            className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                          >
                            Pending
                          </TabsTrigger>
                          <TabsTrigger
                            value="approved"
                            className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                          >
                            Approved
                          </TabsTrigger>
                          <TabsTrigger
                            value="disapproved"
                            className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
                          >
                            Deactivated
                          </TabsTrigger>
                           <TabsTrigger
                            value="refdoc"
                            className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                          >
                            Reference Documents
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">
                          <DocumentPendingTable 
                            setActiveStep={setActiveStep} 
                            {...tableProps}
                          />
                        </TabsContent>

                        <TabsContent value="approved">
                          <DocumentApprovedTable {...tableProps} />
                        </TabsContent>

                        <TabsContent value="disapproved">
                          <DeactivatedDocumentsTable {...tableProps} />
                        </TabsContent>

                        <TabsContent value="refdoc">
                          <DocumentRefDocumentTable {...tableProps} />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </motion.div>
                </>
              )}

              {activeStep === 1 && <ReviewManagement />}
              {activeStep === 2 && <DocumentSignature />}
              {activeStep === 3 && (
                <div key="document-list">
                  <div className="mb-6">
                    <Tabs 
                      defaultValue="pending" 
                      className="w-full"
                      onValueChange={resetSearchAndFilters}
                    >
                      <TabsList className="mb-4 bg-blue-50 w-full">
                        <TabsTrigger
                          value="pending"
                          className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        >
                          Pending
                        </TabsTrigger>
                        <TabsTrigger
                          value="approved"
                          className="flex-1 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                        >
                          Approved
                        </TabsTrigger>
                        <TabsTrigger
                          value="disapproved"
                          className="flex-1 data-[state=active]:bg-red-400 data-[state=active]:text-white"
                        >
                          Deactivated
                        </TabsTrigger>
                        <TabsTrigger
                          value="refdoc"
                          className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                        >
                          Reference Documents
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="pending">
                        <DocumentPendingTable 
                          setActiveStep={setActiveStep} 
                          {...tableProps}
                        />
                      </TabsContent>

                      <TabsContent value="approved">
                        <DocumentApprovedTable {...tableProps} />
                      </TabsContent>

                      <TabsContent value="disapproved">
                        <DeactivatedDocumentsTable {...tableProps} />
                      </TabsContent>

                      <TabsContent value="refdoc">
                        <DocumentRefDocumentTable {...tableProps} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DocumentProvider>
  );
}

export default StepperApp;
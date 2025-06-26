import { documents } from "@/mock-data/doc-center";
import { documentCctData, departmentToDomain, typeToCategory } from "../../mock-data/Document-Table-constant";
import { parse } from "date-fns";


export const FullPagePopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-white w-11/12 max-w-[1400px] h-5/6 rounded-lg shadow-xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-900 text-3xl font-bold z-10"
        >
          &times;
        </button>
        <div className="p-6 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );
};

export const parseDocumentDate = (dateString) => {
  try {
    return parse(dateString, "dd MMMM yyyy", new Date());
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

// Enhancement: Determine document domain and category based on owner department
export const getDomainAndCategory = (doc) => {
  // Map departments to domains
  

  // Determine domain based on department
  const domain = departmentToDomain[doc.owner.department] || "Airport";

  // Determine category based on type
  let category = typeToCategory[doc.type] || "ASP";

  // Ensure category is valid for the domain
  if (domain === "Airline" && !["ASP", "ADFP"].includes(category)) {
    category = "ASP"; // Default to ASP for Airline domain if category is not valid
  }

  return { domain, category };
};

export const mergeDocumentData = () => {
  const cctDataMap = documentCctData.reduce((map, cctData) => {
    map[cctData.id] = cctData;
    return map;
  }, {});

  return documents.map((doc, index) => {
    const docId = `doc${index + 1}`;
    const cctData =
      cctDataMap[docId] ||
      cctDataMap[Object.keys(cctDataMap)[index % documentCctData.length]];

    // Determine domain and category for the document
    const { domain, category } = getDomainAndCategory(doc);

    return {
      ...doc,
      domain: domain,
      category: category,
      cct: cctData
        ? {
            category: cctData.cctCategory,
            subCategory: cctData.cctSubCategory,
            owner: cctData.cctOwner,
            reviewers: cctData.cctReviewers,
            nextReview: cctData.cctNextReview,
            version: cctData.cctVersion,
          }
        : null,
    };
  });
};

export const enrichedDocuments = mergeDocumentData();
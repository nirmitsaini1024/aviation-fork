import { ChevronDown, Cog, MessageCircleCode } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const FileTree = ({
  categories,
  selectedCategory,
  onSelectCategory,
  cctFilter,
}) => {
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const initialExpanded = {};
    if (selectedCategory) {
      const [category] = selectedCategory.split("/");
      initialExpanded[category] = true;
    }
    Object.keys(categories).forEach((cat) => {
      if (!(cat in initialExpanded)) {
        initialExpanded[cat] = false;
      }
    });
    return initialExpanded;
  });

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Filter categories based on cctFilter
  const filteredCategories = useMemo(() => {
    if (!cctFilter || cctFilter === "all_cct") return categories;

    return Object.keys(categories).reduce((acc, category) => {
      if (category.toLowerCase().includes(cctFilter.toLowerCase())) {
        acc[category] = categories[category];
      }
      return acc;
    }, {});
  }, [categories, cctFilter]);

  const handleCategorySelect = useCallback(
    (categoryPath) => {
      if (categoryPath !== selectedCategory) {
        onSelectCategory(categoryPath);
      }
    },
    [selectedCategory, onSelectCategory]
  );

  const toggleCategory = useCallback((category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const [category] = selectedCategory.split("/");
      setExpandedCategories((prev) => ({
        ...prev,
        [category]: true, // Expand the category of the selected subcategory
      }));
    }
  }, [selectedCategory]);

  return (
    <div className="w-64 border-r border-gray-200 pr-4 h-full">
      <h3 className="font-bold text-sm mb-3 text-gray-700">
        Change Control Title/Modifications
      </h3>
      <div className="space-y-1">
        {Object.keys(filteredCategories).map((category) => (
          <div key={category} className="space-y-1">
            <div
              className={`flex items-center p-1.5 rounded-md cursor-pointer ${
                selectedCategory === category
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleCategory(category)}
            >
              <button className="mr-1 flex items-center justify-center">
                {expandedCategories[category] ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500 transform -rotate-90" />
                )}
              </button>
              <div className="flex items-center flex-1">
                <Cog className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-md truncate font-medium">{category}</span>
              </div>
            </div>

            {expandedCategories[category] && (
              <div className="ml-6 space-y-1">
                {categories[category].map((subCategory) => (
                  <div
                    key={subCategory}
                    className={`flex items-center p-1.5 rounded-md cursor-pointer ${
                      selectedCategory === `${category}/${subCategory}`
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      handleCategorySelect(`${category}/${subCategory}`)
                    }
                    title={subCategory}
                  >
                    <MessageCircleCode className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium truncate">
                      {truncateText(subCategory)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export default FileTree;
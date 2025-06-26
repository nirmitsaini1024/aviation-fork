// /components/comment-section/StarRating.jsx
import { useState } from "react";
import { Star } from "lucide-react";

export function StarRating({ value, onChange, readOnly = false }) {
  const [hoverValue, setHoverValue] = useState(0);

  const getRatingFromMousePosition = (event, star) => {
    if (readOnly) return;
    
    // Always use full integer values only
    onChange(star);
  };

  const getStarState = (star, value) => {
    if (value >= star) return "full";
    return "empty";
  };

  const handleMouseMove = (event, star) => {
    if (readOnly) return;
    
    // Always use full integer values only
    setHoverValue(star);
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const effectiveValue = hoverValue || value;
        const starState = getStarState(star, effectiveValue);

        return (
          <button
            key={star}
            type="button"
            className={`focus:outline-none relative ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            onClick={(e) => !readOnly && getRatingFromMousePosition(e, star)}
            onMouseMove={(e) => !readOnly && handleMouseMove(e, star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            disabled={readOnly}
          >
            <Star className="h-5 w-5 text-gray-300" />
            {starState === "full" && (
              <div className="absolute top-0 left-0">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
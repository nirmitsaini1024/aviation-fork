import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar } from "lucide-react";

// Custom Tree Dropdown Component for Groups
export function TreeDropdown({ value, onValueChange, placeholder, className, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState('root');
  const [selectedPath, setSelectedPath] = useState([]);
  
  const dropdownRef = useRef(null);

  const menuStructure = {
    root: [
      { id: 'days', label: 'Days', type: 'parent' },
      { id: 'weeks', label: 'Weeks', type: 'parent' }
    ],
    days: [
      { id: 'back', label: '← Back', type: 'back' },
      { id: '1-day', label: '1 Day', type: 'item', value: '1 day' },
      { id: '2-days', label: '2 Days', type: 'item', value: '2 days' },
      { id: '3-days', label: '3 Days', type: 'item', value: '3 days' },
      { id: '4-days', label: '4 Days', type: 'item', value: '4 days' },
      { id: '5-days', label: '5 Days', type: 'item', value: '5 days' },
      { id: '6-days', label: '6 Days', type: 'item', value: '6 days' },
      { id: '7-days', label: '7 Days', type: 'item', value: '7 days' }
    ],
    weeks: [
      { id: 'back', label: '← Back', type: 'back' },
      { id: '1-week', label: '1 Week', type: 'item', value: '1 week' },
      { id: '2-weeks', label: '2 Weeks', type: 'item', value: '2 weeks' },
      { id: '3-weeks', label: '3 Weeks', type: 'item', value: '3 weeks' },
      { id: '4-weeks', label: '4 Weeks', type: 'item', value: '4 weeks' }
    ]
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setCurrentLevel('root');
        setSelectedPath([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    if (item.type === 'parent') {
      setCurrentLevel(item.id);
      setSelectedPath([...selectedPath, item.label]);
    } else if (item.type === 'back') {
      setCurrentLevel('root');
      setSelectedPath([]);
    } else if (item.type === 'item') {
      onValueChange(item.value);
      setIsOpen(false);
      setCurrentLevel('root');
      setSelectedPath([]);
    }
  };

  const getCurrentItems = () => {
    return menuStructure[currentLevel] || [];
  };

  return (
    <div className="text-sm relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-10 px-3 py-2 text-left border rounded-md flex items-center justify-between transition-all ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {/* Breadcrumb for current navigation */}
          {selectedPath.length > 0 && (
            <div className="px-3 py-2 bg-gray-50 border-b text-sm text-gray-600">
              Root {selectedPath.map(path => ` > ${path}`).join('')}
            </div>
          )}
          
          {/* Menu items */}
          <div className="py-1 max-h-60 overflow-y-auto">
            {getCurrentItems().map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                  item.type === 'parent' 
                    ? 'flex items-center justify-between font-medium' 
                    : item.type === 'back'
                    ? 'text-blue-600 hover:bg-blue-50'
                    : 'pl-6'
                }`}
              >
                <span>{item.label}</span>
                {item.type === 'parent' && (
                  <ChevronDown className="h-4 w-4 text-gray-400 -rotate-90" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
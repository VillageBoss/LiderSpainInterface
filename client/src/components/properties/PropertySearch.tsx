import { useState } from "react";
import { useLocation } from "wouter";
import { PROPERTY_CATEGORIES, PROPERTY_LOCATIONS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";

const PropertySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [_, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTagClick = (tag: string, type: "location" | "category") => {
    navigate(`/search?${type}=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search luxury properties..."
            className="w-full py-2 pl-10 pr-4 border-b-2 border-gray-200 focus:outline-none focus:border-leader-red search-animation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search absolute left-2 top-3 text-gray-400"></i>
        </div>
      </form>
      
      <motion.div 
        className="flex flex-wrap gap-2 mt-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, staggerChildren: 0.05 }}
      >
        {/* Popular categories */}
        {PROPERTY_CATEGORIES.slice(0, 4).map((category) => (
          <motion.span
            key={category}
            className="text-xs bg-leader-gray text-gray-700 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTagClick(category, "category")}
          >
            {category}
          </motion.span>
        ))}
        
        {/* Popular locations */}
        {PROPERTY_LOCATIONS.slice(0, 3).map((location) => (
          <motion.span
            key={location}
            className="text-xs bg-leader-gray text-gray-700 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTagClick(location, "location")}
          >
            {location}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default PropertySearch;

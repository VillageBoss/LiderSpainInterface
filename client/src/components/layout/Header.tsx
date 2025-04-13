import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import PropertySearch from "../properties/PropertySearch";

const Header = () => {
  const { toggleSideMenu, isSearchOpen, toggleSearchOverlay } = useAppContext();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-2xl font-playfair font-bold text-leader-red">LeaderSpain</a>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/favorites">
            <a className="p-2">
              <i className="far fa-heart text-xl"></i>
            </a>
          </Link>
          <button 
            className="p-2" 
            onClick={() => toggleSearchOverlay(!isSearchOpen)}
            aria-label="Search"
          >
            <i className="fas fa-search text-xl"></i>
          </button>
          <button 
            className="p-2" 
            onClick={() => toggleSideMenu(true)}
            aria-label="Menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white py-4 px-4 shadow-md"
          >
            <PropertySearch />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

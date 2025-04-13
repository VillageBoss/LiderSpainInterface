import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import PropertySearch from "../properties/PropertySearch";
import { Search, Menu, Heart, Home, Phone, Map } from "lucide-react";

const Header = () => {
  const { toggleSideMenu, isSearchOpen, toggleSearchOverlay } = useAppContext();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <a className="text-2xl font-playfair font-bold text-[#C10D28]">LeaderSpain</a>
          </Link>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink href="/" icon={<Home size={18} />} label="Home" />
          <NavLink href="/search" icon={<Map size={18} />} label="Properties" />
          <NavLink href="/contact" icon={<Phone size={18} />} label="Contact" />
          <NavLink href="/favorites" icon={<Heart size={18} />} label="Favorites" />
        </div>
        
        {/* Mobile Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <button 
            className="p-2 text-gray-700 hover:text-[#C10D28] transition-colors"
            onClick={() => toggleSearchOverlay(!isSearchOpen)}
            aria-label="Search"
          >
            <Search size={22} />
          </button>
          
          {/* Menu Button - Only visible on mobile */}
          <button 
            className="p-2 text-gray-700 hover:text-[#C10D28] transition-colors" 
            onClick={() => toggleSideMenu(true)}
            aria-label="Menu"
          >
            <Menu size={24} />
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

// Navigation Link Component
const NavLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => {
  // Using window.location.pathname directly 
  const isActive = window.location.pathname === href;
  
  return (
    <Link href={href}>
      <a className={`flex items-center px-2 py-1 font-medium text-sm transition-colors ${
        isActive 
          ? 'text-[#C10D28]' 
          : 'text-gray-700 hover:text-[#C10D28]'
      }`}>
        <span className="mr-1">{icon}</span>
        {label}
      </a>
    </Link>
  );
};

export default Header;

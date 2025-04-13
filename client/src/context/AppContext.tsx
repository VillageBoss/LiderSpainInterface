import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "@shared/schema";

// Create a default value to avoid undefined errors
const defaultContextValue = {
  isLoading: true,
  isSideMenuOpen: false,
  isSearchOpen: false,
  selectedProperty: null as Property | null,
  toggleLoading: () => {},
  toggleSideMenu: () => {},
  toggleSearchOverlay: () => {},
  setSelectedProperty: () => {},
  favorites: [] as number[],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
  userId: null as number | null
};

interface AppContextType {
  isLoading: boolean;
  isSideMenuOpen: boolean;
  isSearchOpen: boolean;
  selectedProperty: Property | null;
  toggleLoading: (value: boolean) => void;
  toggleSideMenu: (value: boolean) => void;
  toggleSearchOverlay: (value: boolean) => void;
  setSelectedProperty: (property: Property | null) => void;
  favorites: number[];
  addToFavorites: (propertyId: number) => void;
  removeFromFavorites: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
  userId: number | null;
}

// Create context with default value to prevent undefined errors
const AppContext = createContext<AppContextType>(defaultContextValue);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [userId, setUserId] = useState<number | null>(1); // Start with dummy user ID
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Initialize app with loading state
  useEffect(() => {
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleLoading = (value: boolean) => setIsLoading(value);
  const toggleSideMenu = (value: boolean) => setIsSideMenuOpen(value);
  const toggleSearchOverlay = (value: boolean) => setIsSearchOpen(value);

  // Simplified favorites functionality
  const addToFavorites = (propertyId: number) => {
    setFavorites(prev => [...prev, propertyId]);
  };

  const removeFromFavorites = (propertyId: number) => {
    setFavorites(prev => prev.filter(id => id !== propertyId));
  };

  const isFavorite = (propertyId: number) => {
    return favorites.includes(propertyId);
  };

  const value = {
    isLoading,
    isSideMenuOpen,
    isSearchOpen,
    selectedProperty,
    toggleLoading,
    toggleSideMenu,
    toggleSearchOverlay,
    setSelectedProperty,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    userId
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}

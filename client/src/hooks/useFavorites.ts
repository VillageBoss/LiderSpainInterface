import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import useTelegram from "./useTelegram";

const useFavorites = (userId: number | null) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { hapticFeedback } = useTelegram();

  useEffect(() => {
    // Load favorites when userId is available
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchFavorites = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/favorites`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }
      
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load your favorites",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (propertyId: number) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save favorites",
        variant: "destructive"
      });
      return;
    }
    
    // Optimistic update
    setFavorites(prev => [...prev, propertyId]);
    hapticFeedback?.impact("light");
    
    try {
      await apiRequest("POST", "/api/favorites", {
        userId,
        propertyId
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/favorites`] });
      toast({
        title: "Added to Favorites",
        description: "Property has been added to your favorites"
      });
    } catch (error) {
      // Revert optimistic update
      setFavorites(prev => prev.filter(id => id !== propertyId));
      console.error("Error adding favorite:", error);
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive"
      });
    }
  };

  const removeFromFavorites = async (propertyId: number) => {
    if (!userId) return;
    
    // Optimistic update
    setFavorites(prev => prev.filter(id => id !== propertyId));
    hapticFeedback?.impact("light");
    
    try {
      await apiRequest("DELETE", "/api/favorites", {
        userId,
        propertyId
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/favorites`] });
      toast({
        title: "Removed from Favorites",
        description: "Property has been removed from your favorites"
      });
    } catch (error) {
      // Revert optimistic update
      setFavorites(prev => [...prev, propertyId]);
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive"
      });
    }
  };

  const isFavorite = (propertyId: number) => {
    return favorites.includes(propertyId);
  };

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refresh: fetchFavorites
  };
};

export default useFavorites;

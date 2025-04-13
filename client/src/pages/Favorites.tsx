import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import useTelegram from "@/hooks/useTelegram";

const Favorites = () => {
  const [_, navigate] = useLocation();
  const { userId, favorites } = useAppContext();
  const { webApp } = useTelegram();

  const { data: favoriteProperties, isLoading } = useQuery<Property[]>({
    queryKey: userId ? [`/api/users/${userId}/favorite-properties`] : undefined,
    enabled: !!userId,
  });

  useEffect(() => {
    // Set page title and BackButton functionality
    if (webApp) {
      document.title = "My Favorites | LeaderSpain";
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        navigate("/");
      });
    }
  }, [webApp, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-8"
    >
      <div className="container mx-auto">
        <motion.h1
          className="font-playfair text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Favorites
        </motion.h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        ) : favoriteProperties && favoriteProperties.length > 0 ? (
          <PropertyGrid
            properties={favoriteProperties}
            emptyMessage="You haven't added any properties to your favorites yet."
          />
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-5xl mb-4 text-gray-300">
              <i className="far fa-heart"></i>
            </div>
            <h3 className="text-xl font-medium mb-2">No Favorites Yet</h3>
            <p className="text-gray-600 mb-8">
              You haven't added any properties to your favorites yet.
            </p>
            <Button
              onClick={() => navigate("/search")}
              className="bg-leader-red hover:bg-leader-red/90 text-white"
            >
              Explore Properties
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;

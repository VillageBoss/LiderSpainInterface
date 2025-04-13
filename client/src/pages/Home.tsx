import { useEffect } from "react";
import { motion } from "framer-motion";
import useTelegram from "@/hooks/useTelegram";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import LocationsSection from "@/components/home/LocationsSection";

const Home = () => {
  const { webApp } = useTelegram();

  useEffect(() => {
    // Set page title in the Telegram WebApp
    if (webApp) {
      document.title = "LeaderSpain Luxury Real Estate";
      // Hide back button on home page
      webApp.BackButton.hide();
    }
  }, [webApp]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Categories */}
      <FeaturedCategories />
      
      {/* Featured Properties */}
      <FeaturedProperties />
      
      {/* Locations Section */}
      <LocationsSection />
    </motion.div>
  );
};

export default Home;

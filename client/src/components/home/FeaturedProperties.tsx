import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PropertyGrid from "../properties/PropertyGrid";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";

const FeaturedProperties = () => {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties?featured=true&limit=3'],
  });

  return (
    <section className="py-12 px-4 bg-leader-gray">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h3 
            className="font-playfair text-3xl font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Featured Properties
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/search">
              <a className="text-leader-red hover:underline">View All</a>
            </Link>
          </motion.div>
        </div>
        
        <PropertyGrid 
          properties={properties}
          isLoading={isLoading}
          limit={3}
          emptyMessage="No featured properties available at the moment."
        />
      </div>
    </section>
  );
};

export default FeaturedProperties;

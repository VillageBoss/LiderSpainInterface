import { useEffect } from "react";
import { Property } from "@shared/schema";
import PropertyCard from "./PropertyCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyGridProps {
  properties?: Property[];
  queryUrl?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  featured?: boolean;
  limit?: number;
}

const PropertyGrid = ({
  properties,
  queryUrl,
  emptyMessage = "No properties found",
  isLoading: externalLoading,
  featured,
  limit,
}: PropertyGridProps) => {
  const { data, isLoading: queryLoading } = useQuery<Property[]>({
    queryKey: queryUrl ? [queryUrl] : undefined,
    enabled: !!queryUrl && !properties,
  });

  const displayProperties = properties || data || [];
  const isLoading = externalLoading || (queryUrl && queryLoading);

  // Limit properties if specified
  const limitedProperties = limit
    ? displayProperties.slice(0, limit)
    : displayProperties;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: limit || 3 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (limitedProperties.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {limitedProperties.map((property, index) => (
        <PropertyCard
          key={property.id}
          property={property}
          priority={index < 3}
        />
      ))}
    </motion.div>
  );
};

const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md">
    <Skeleton className="h-64 w-full" />
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  </div>
);

export default PropertyGrid;

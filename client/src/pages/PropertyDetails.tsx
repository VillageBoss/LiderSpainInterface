import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useAppContext } from "@/context/AppContext";
import { Property, PropertyFeature, PropertyImage } from "@shared/schema";
import { motion } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import { formatCurrency, formatLocation, cn } from "@/lib/utils";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyFeatures from "@/components/properties/PropertyFeatures";
import AgentCard from "@/components/agents/AgentCard";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import useTelegram from "@/hooks/useTelegram";
import { Link } from "wouter";

interface PropertyDetailsResponse extends Property {
  images: PropertyImage[];
  features: PropertyFeature[];
}

const PropertyDetails = () => {
  const params = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const { isFavorite, addToFavorites, removeFromFavorites, setSelectedProperty } = useAppContext();
  const { webApp, hapticFeedback } = useTelegram();
  const propertyId = parseInt(params.id, 10);

  const { data: property, isLoading, error } = useQuery<PropertyDetailsResponse>({
    queryKey: [`/api/properties/${propertyId}`],
  });

  const { data: agent } = useQuery({
    queryKey: ['/api/agents/1'],
    enabled: !!property,
  });

  useEffect(() => {
    // Set page title and BackButton functionality
    if (webApp) {
      document.title = property ? `${property.title} | LeaderSpain` : "Property Details | LeaderSpain";
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        navigate("/");
      });
    }
    
    // Store selected property in context
    if (property) {
      setSelectedProperty(property);
    }

    return () => {
      setSelectedProperty(null);
    };
  }, [webApp, property, navigate, setSelectedProperty]);

  const propertyIsFavorite = propertyId ? isFavorite(propertyId) : false;
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!propertyId) return;
    
    hapticFeedback?.impact("light");
    
    if (propertyIsFavorite) {
      removeFromFavorites(propertyId);
    } else {
      addToFavorites(propertyId);
    }
  };

  const handleBackClick = () => {
    hapticFeedback?.impact("light");
    navigate("/");
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h2 className="text-2xl font-playfair mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-8">We couldn't find the property you're looking for.</p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading ? (
        <PropertyDetailsSkeleton />
      ) : property ? (
        <>
          {/* Property Gallery */}
          <PropertyGallery 
            images={property.images.length ? property.images : [{
              id: 0,
              propertyId: property.id,
              imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
              isPrimary: true
            }]}
            onBackClick={handleBackClick}
          />
          
          {/* Property Information */}
          <section className="px-4 py-8 bg-white">
            <div className="container mx-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-playfair text-3xl font-bold mb-2">{property.title}</h2>
                  <p className="text-gray-600 flex items-center mb-4">
                    <i className="fas fa-map-marker-alt mr-2 text-leader-red"></i>
                    {formatLocation(property.location)}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-leader-red text-2xl font-semibold mb-1">
                    {formatCurrency(property.price)}
                  </h3>
                  <span className="text-gray-500 text-sm">Reference: {property.reference}</span>
                </div>
              </div>

              <motion.div 
                className="flex flex-wrap gap-6 mt-6 mb-8"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                <PropertyInfoItem 
                  icon="fas fa-ruler-combined" 
                  label="Built Area" 
                  value={`${property.area} m²`} 
                />
                
                {property.plotSize && (
                  <PropertyInfoItem 
                    icon="fas fa-vector-square" 
                    label="Plot Size" 
                    value={`${property.plotSize} m²`} 
                  />
                )}
                
                <PropertyInfoItem 
                  icon="fas fa-bed" 
                  label="Bedrooms" 
                  value={property.bedrooms.toString()} 
                />
                
                <PropertyInfoItem 
                  icon="fas fa-bath" 
                  label="Bathrooms" 
                  value={property.bathrooms.toString()} 
                />
              </motion.div>

              <div className="border-t border-gray-200 pt-8">
                <h4 className="font-playfair text-xl font-semibold mb-4">Description</h4>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {property.description}
                </p>
              </div>

              {/* Property Features */}
              {property.features && property.features.length > 0 && (
                <PropertyFeatures features={property.features} />
              )}

              <div className="mt-8">
                <Link href="/contact">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-leader-red text-white py-4 font-semibold hover:bg-leader-red/90 transition-colors flex justify-center items-center"
                  >
                    Request Information
                  </motion.a>
                </Link>
              </div>
            </div>
          </section>

          {/* Agent Information */}
          <section className="px-4 py-8 bg-leader-gray">
            <div className="container mx-auto">
              {agent && <AgentCard agent={agent} />}
            </div>
          </section>

          {/* Similar Properties */}
          <section className="px-4 py-12">
            <div className="container mx-auto">
              <h3 className="font-playfair text-2xl font-semibold mb-8">Similar Properties</h3>
              
              <PropertyGrid 
                queryUrl={`/api/properties?category=${encodeURIComponent(property.category)}&limit=3`}
                emptyMessage="No similar properties available at the moment."
              />
            </div>
          </section>
        </>
      ) : null}
    </motion.div>
  );
};

// Property Info Item Component
const PropertyInfoItem = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: string; 
  label: string; 
  value: string;
}) => {
  return (
    <motion.div 
      className="flex items-center"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
      }}
    >
      <i className={`${icon} text-leader-red text-xl mr-3`}></i>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </motion.div>
  );
};

// Loading Skeleton
const PropertyDetailsSkeleton = () => {
  return (
    <div>
      <div className="h-[60vh] relative">
        <Skeleton className="w-full h-full" />
      </div>
      
      <div className="px-4 py-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-start">
            <div className="w-2/3">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2 mb-4" />
            </div>
            <div className="text-right w-1/3">
              <Skeleton className="h-8 w-full mb-1 ml-auto" />
              <Skeleton className="h-4 w-2/3 ml-auto" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6 mt-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-10 w-10 mr-3 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <Skeleton className="h-7 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
          </div>
          
          <div className="mt-8">
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

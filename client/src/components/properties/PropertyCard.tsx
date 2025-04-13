import { formatCurrency, formatLocation, cn, getImageUrl } from "@/lib/utils";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { Heart } from "lucide-react";
import useTelegram from "@/hooks/useTelegram";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
  className?: string;
}

const PropertyCard = ({ property, priority = false, className }: PropertyCardProps) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useAppContext();
  const { hapticFeedback } = useTelegram();
  
  const propertyIsFavorite = isFavorite(property.id);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    hapticFeedback?.impact("light");
    
    if (propertyIsFavorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "property-card bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      <Link href={`/property/${property.id}`}>
        <a className="block">
          <div className="relative h-64 overflow-hidden">
            <img 
              src={getImageUrl(`https://images.unsplash.com/photo-1600607687939-ce8a6c25118c`, 80, 800)} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
            <div className="property-card-overlay absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity flex items-center justify-center">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-leader-red rounded-full p-3 transform hover:scale-110 transition-transform"
              >
                <i className="fas fa-search text-xl"></i>
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleFavorite}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-leader-red hover:text-white transition-colors"
            >
              <Heart className={cn(
                "w-4 h-4",
                propertyIsFavorite ? "fill-leader-red text-leader-red" : "fill-none text-gray-700"
              )} />
            </motion.button>
            
            {property.featured && (
              <div className="absolute bottom-4 left-4 bg-leader-red text-white px-3 py-1 text-sm font-semibold rounded">
                Featured
              </div>
            )}
            
            {property.isNewListing && (
              <div className="absolute bottom-4 left-4 bg-leader-gold text-white px-3 py-1 text-sm font-semibold rounded">
                New Listing
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-playfair text-xl font-semibold">{property.title}</h4>
              <span className="text-leader-red font-semibold">{formatCurrency(property.price)}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{formatLocation(property.location)}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span><i className="fas fa-ruler-combined mr-2"></i>{property.area} m²</span>
              <span><i className="fas fa-bed mr-2"></i>{property.bedrooms} Bedrooms</span>
              <span><i className="fas fa-bath mr-2"></i>{property.bathrooms} Baths</span>
            </div>
          </div>
        </a>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;

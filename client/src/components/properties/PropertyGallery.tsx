import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";
import { PropertyImage } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyGalleryProps {
  images: PropertyImage[];
  onBackClick?: () => void;
}

const PropertyGallery = ({ images, onBackClick }: PropertyGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const scrollToImage = (index: number) => {
    setActiveIndex(index);
    if (slideContainerRef.current) {
      const container = slideContainerRef.current;
      const scrollAmount = container.clientWidth * index;
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Update indicator when scroll happens
  useEffect(() => {
    const container = slideContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollLeft;
      const slideWidth = container.clientWidth;
      const newIndex = Math.round(scrollPosition / slideWidth);
      
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  return (
    <section className="relative">
      <div className="relative h-[60vh] overflow-hidden">
        <motion.div
          ref={slideContainerRef}
          className="slide-container flex snap-x overflow-x-scroll h-full scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {images.map((image, index) => (
            <div key={index} className="slide w-full flex-shrink-0">
              <img 
                src={getImageUrl(image.imageUrl)} 
                alt={`Property view ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </motion.div>
        
        {/* Gallery Navigation */}
        <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 flex justify-between pointer-events-none">
          {activeIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white text-gray-700 shadow-md pointer-events-auto"
              onClick={() => scrollToImage(activeIndex - 1)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          
          {activeIndex < images.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white text-gray-700 shadow-md pointer-events-auto"
              onClick={() => scrollToImage(activeIndex + 1)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
        
        {/* Gallery Indicators */}
        <div className="absolute inset-x-0 bottom-8 flex justify-center space-x-2">
          {images.map((_, index) => (
            <motion.div
              key={index}
              className={`gallery-indicator h-1 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'active' : 'bg-white/50'
              }`}
              onClick={() => scrollToImage(index)}
            ></motion.div>
          ))}
        </div>
        
        {/* Back Button */}
        {onBackClick && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBackClick}
            className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-md hover:bg-leader-red hover:text-white transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default PropertyGallery;

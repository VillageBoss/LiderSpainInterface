import { motion } from "framer-motion";
import CategoryCard from "../properties/CategoryCard";
import { LUXURY_PROPERTY_IMAGES } from "@/lib/constants";

const LocationsSection = () => {
  const locations = [
    {
      title: "Marbella",
      imageUrl: LUXURY_PROPERTY_IMAGES[11],
      count: 52,
      href: "/search?location=Marbella",
    },
    {
      title: "Ibiza",
      imageUrl: LUXURY_PROPERTY_IMAGES[12],
      count: 38,
      href: "/search?location=Ibiza",
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <motion.h3 
          className="font-playfair text-3xl font-semibold mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Premium Locations
        </motion.h3>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {locations.map((location) => (
            <motion.div
              key={location.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
            >
              <CategoryCard 
                title={location.title}
                imageUrl={location.imageUrl}
                count={location.count}
                href={location.href}
                height="h-64"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LocationsSection;

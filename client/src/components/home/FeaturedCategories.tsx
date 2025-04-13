import { motion } from "framer-motion";
import CategoryCard from "../properties/CategoryCard";
import { LUXURY_PROPERTY_IMAGES } from "@/lib/constants";

const FeaturedCategories = () => {
  const categories = [
    {
      title: "Beachfront",
      imageUrl: LUXURY_PROPERTY_IMAGES[1],
      href: "/search?category=Beachfront",
    },
    {
      title: "Villas",
      imageUrl: LUXURY_PROPERTY_IMAGES[2],
      href: "/search?category=Villa",
    },
    {
      title: "Penthouses",
      imageUrl: LUXURY_PROPERTY_IMAGES[3],
      href: "/search?category=Penthouse",
    },
    {
      title: "New Development",
      imageUrl: LUXURY_PROPERTY_IMAGES[4],
      href: "/search?category=New%20Development",
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
          Prestigious Collections
        </motion.h3>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
            >
              <CategoryCard 
                title={category.title}
                imageUrl={category.imageUrl}
                href={category.href}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

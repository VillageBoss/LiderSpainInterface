import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";
import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={getImageUrl("https://images.unsplash.com/photo-1580587771525-78b9dba3b914", 80, 1200)} 
          alt="Luxury villa with pool" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="container mx-auto">
          <motion.h2 
            className="text-white font-playfair text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Exceptional Luxury Properties
          </motion.h2>
          
          <motion.p 
            className="text-white font-montserrat text-lg mb-8 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Discover the most prestigious homes and estates in Spain's most coveted locations.
          </motion.p>
          
          <Link href="/search">
            <motion.a
              className="inline-block bg-leader-red text-white py-3 px-8 font-medium hover:bg-leader-red/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Explore Properties
            </motion.a>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";
import { Link } from "wouter";

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  count?: number;
  href: string;
  height?: string;
}

const CategoryCard = ({ 
  title, 
  imageUrl, 
  count,
  href,
  height = "h-40" 
}: CategoryCardProps) => {
  return (
    <Link href={href}>
      <a className={`relative rounded-lg overflow-hidden group ${height} block`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          <img 
            src={getImageUrl(imageUrl)} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h4 className="font-playfair text-lg font-medium">{title}</h4>
            {count !== undefined && (
              <p className="text-sm">{count} Exclusive Properties</p>
            )}
          </div>
        </motion.div>
      </a>
    </Link>
  );
};

export default CategoryCard;

import { motion } from "framer-motion";
import { staggeredAnimationVariants, itemAnimationVariants } from "@/lib/utils";
import { PropertyFeature } from "@shared/schema";

interface PropertyFeaturesProps {
  features: PropertyFeature[];
}

const PropertyFeatures = ({ features }: PropertyFeaturesProps) => {
  return (
    <div className="border-t border-gray-200 pt-8">
      <h4 className="font-playfair text-xl font-semibold mb-4">Features</h4>
      <motion.div
        variants={staggeredAnimationVariants(0.03)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-y-4"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemAnimationVariants()}
            className="flex items-center"
          >
            <i className="fas fa-check text-leader-red mr-2"></i>
            <span className="text-gray-700">{feature.feature}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PropertyFeatures;

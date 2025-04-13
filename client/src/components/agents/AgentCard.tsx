import { Agent } from "@shared/schema";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
        <img 
          src={getImageUrl(agent.imageUrl || "", 80, 200)} 
          alt={agent.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="text-center md:text-left md:flex-1">
        <h4 className="font-playfair text-xl font-semibold mb-1">{agent.name}</h4>
        <p className="text-gray-600 mb-3">{agent.title}</p>
        <p className="text-gray-700 mb-4">{agent.description}</p>
        <div className="flex justify-center md:justify-start space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-leader-red text-white py-2 px-6 font-medium hover:bg-leader-red/90 transition-colors"
          >
            <i className="fas fa-phone-alt mr-2"></i> Call
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-leader-red text-leader-red py-2 px-6 font-medium hover:bg-leader-red/10 transition-colors"
          >
            <i className="fas fa-envelope mr-2"></i> Email
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentCard;

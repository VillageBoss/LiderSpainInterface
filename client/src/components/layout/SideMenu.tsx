import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-64 bg-leader-black overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-white font-playfair text-xl">Menu</h2>
                <button className="text-white" onClick={onClose} aria-label="Close menu">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <nav>
                <motion.ul className="space-y-6">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link href={item.href} onClick={onClose}>
                        <a className="text-white hover:text-leader-red transition-colors block font-montserrat">
                          {item.label}
                        </a>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
              
              <motion.div 
                className="mt-12 pt-6 border-t border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <a href="#" className="text-white hover:text-leader-red text-sm block mb-4">Privacy Policy</a>
                <a href="#" className="text-white hover:text-leader-red text-sm block">Terms of Service</a>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Luxury Properties", href: "/search" },
  { label: "Locations", href: "/search" },
  { label: "Our Agents", href: "/contact" },
  { label: "About Us", href: "/contact" },
  { label: "Contact", href: "/contact" },
  { label: "Favorites", href: "/favorites" },
];

export default SideMenu;

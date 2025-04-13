import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MobileNavbar = () => {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={location === item.href}
          />
        ))}
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  href: string;
  isActive: boolean;
}

const NavItem = ({ icon, label, href, isActive }: NavItemProps) => {
  return (
    <Link href={href}>
      <a className={cn(
        "py-3 px-4 flex flex-col items-center relative",
        isActive ? "text-leader-red" : "text-gray-500"
      )}>
        {isActive && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-leader-red"
            layoutId="activeTab"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <i className={`${icon} text-lg`}></i>
        <span className="text-xs mt-1">{label}</span>
      </a>
    </Link>
  );
};

const navItems = [
  { label: "Home", icon: "fas fa-home", href: "/" },
  { label: "Search", icon: "fas fa-search", href: "/search" },
  { label: "Favorites", icon: "far fa-heart", href: "/favorites" },
  { label: "Contact", icon: "fas fa-envelope", href: "/contact" },
];

export default MobileNavbar;

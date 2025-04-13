import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import { getImageUrl } from "@/lib/utils";
import useTelegram from "@/hooks/useTelegram";

const Contact = () => {
  const [_, navigate] = useLocation();
  const { webApp } = useTelegram();

  useEffect(() => {
    // Set page title and BackButton functionality
    if (webApp) {
      document.title = "Contact Us | LeaderSpain";
      webApp.BackButton.show();
      webApp.BackButton.onClick(() => {
        navigate("/");
      });
    }
  }, [webApp, navigate]);

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="relative">
        <div className="h-[30vh] relative overflow-hidden">
          <img 
            src={getImageUrl("https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf", 80, 1200)} 
            alt="Luxury real estate" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="font-playfair text-white text-4xl font-bold">Contact Us</h2>
          </div>
          <button 
            className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-md hover:bg-leader-red hover:text-white transition-colors"
            onClick={handleBackClick}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
      </section>

      <section className="px-4 py-12 bg-white">
        <div className="container mx-auto max-w-3xl">
          <motion.p 
            className="text-center text-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Please complete the form below to inquire about our exclusive properties or to schedule a personalized consultation with one of our luxury real estate specialists.
          </motion.p>
          
          <ContactForm />
        </div>
      </section>

      <section className="px-4 py-12 bg-leader-gray">
        <div className="container mx-auto max-w-5xl">
          <ContactInfo />
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;

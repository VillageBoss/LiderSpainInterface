import { motion } from "framer-motion";

const ContactInfo = () => {
  const contactItems = [
    {
      title: "Visit Us",
      icon: "fas fa-map-marker-alt",
      content: (
        <>
          Centro Comercial Plaza, Office 26<br />
          Puerto Banús, Marbella<br />
          Spain 29660
        </>
      ),
    },
    {
      title: "Call Us",
      icon: "fas fa-phone-alt",
      content: (
        <>
          <p>+34 951 000 000<br />+34 600 000 000</p>
          <p className="text-gray-600 text-sm mt-2">
            Mon-Fri: 9:30AM - 7:00PM<br />
            Sat: 10:00AM - 2:00PM
          </p>
        </>
      ),
    },
    {
      title: "Email Us",
      icon: "fas fa-envelope",
      content: (
        <>
          <p>info@leaderspain.com<br />sales@leaderspain.com</p>
          <p className="text-gray-600 text-sm mt-2">We typically respond within 24 hours</p>
        </>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {contactItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-md text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-leader-red text-white">
            <i className={`${item.icon} text-2xl`}></i>
          </div>
          <h4 className="font-playfair text-xl font-semibold mb-3">{item.title}</h4>
          <div className="text-gray-700">{item.content}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContactInfo;

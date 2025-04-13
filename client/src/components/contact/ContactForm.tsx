import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PROPERTY_CATEGORIES, BUDGET_RANGES } from "@/lib/constants";
import useTelegram from "@/hooks/useTelegram";

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  propertyInterest: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Please provide more details in your message"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { hapticFeedback } = useTelegram();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      propertyInterest: "",
      budget: "",
      message: "",
      agreeToTerms: false,
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    hapticFeedback?.impact("medium");
    
    try {
      await apiRequest("POST", "/api/inquiries", {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        propertyInterest: data.propertyInterest,
        budget: data.budget,
        message: data.message,
      });
      
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for your inquiry. Our team will contact you shortly.",
        variant: "default",
      });
      
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      hapticFeedback?.notification("error");
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input 
            type="text" 
            id="fullName"
            className="w-full px-4 py-3 border border-gray-300 focus:border-leader-red focus:outline-none transition-colors"
            placeholder="John Doe"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input 
            type="email" 
            id="email"
            className="w-full px-4 py-3 border border-gray-300 focus:border-leader-red focus:outline-none transition-colors"
            placeholder="your@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
          <input 
            type="tel" 
            id="phone"
            className="w-full px-4 py-3 border border-gray-300 focus:border-leader-red focus:outline-none transition-colors"
            placeholder="+34 000 000 000"
            {...register("phone")}
          />
        </div>
        <div>
          <label htmlFor="propertyInterest" className="block text-gray-700 font-medium mb-2">Property Interest</label>
          <select 
            id="propertyInterest"
            className="w-full px-4 py-3 border border-gray-300 focus:border-leader-red focus:outline-none transition-colors"
            {...register("propertyInterest")}
          >
            <option value="" disabled>Select property type</option>
            {PROPERTY_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="budget" className="block text-gray-700 font-medium mb-2">Budget Range</label>
        <select 
          id="budget"
          className="w-full px-4 py-3 border border-gray-300 focus:border-leader-red focus:outline-none transition-colors"
          {...register("budget")}
        >
          <option value="" disabled>Select budget range</option>
          {BUDGET_RANGES.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
        <textarea 
          id="message"
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 focus:border-leader-red focus:outline-none transition-colors"
          placeholder="Please provide any specific requirements or questions you may have..."
          {...register("message")}
        ></textarea>
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>
      
      <div className="flex items-start">
        <input 
          type="checkbox" 
          id="agreeToTerms"
          className="custom-checkbox sr-only"
          {...register("agreeToTerms")}
        />
        <label 
          htmlFor="agreeToTerms" 
          className="pl-8 relative text-gray-700 cursor-pointer select-none"
        >
          <span className="absolute left-0 top-0 w-6 h-6 border border-gray-300 rounded"></span>
          I consent to LeaderSpain collecting and processing my personal data in accordance with the <a href="#" className="text-leader-red hover:underline">Privacy Policy</a>.
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
      )}
      
      <div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-leader-red text-white py-4 font-semibold hover:bg-leader-red/90 transition-colors flex justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Submitting...</span>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            </>
          ) : (
            "Submit Inquiry"
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ContactForm;

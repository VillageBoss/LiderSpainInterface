import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-leader-black text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-4">LeaderSpain</h3>
            <p className="text-gray-400 text-sm mb-4">
              Specialists in luxury real estate across Spain's most prestigious locations, offering exceptional properties and personalized service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/"><a className="hover:text-white transition-colors">Home</a></Link></li>
              <li><Link href="/search"><a className="hover:text-white transition-colors">Luxury Properties</a></Link></li>
              <li><Link href="/search?category=New Development"><a className="hover:text-white transition-colors">New Developments</a></Link></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><Link href="/contact"><a className="hover:text-white transition-colors">Contact</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Locations</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/search?location=Marbella"><a className="hover:text-white transition-colors">Marbella</a></Link></li>
              <li><Link href="/search?location=Ibiza"><a className="hover:text-white transition-colors">Ibiza</a></Link></li>
              <li><Link href="/search?location=Mallorca"><a className="hover:text-white transition-colors">Mallorca</a></Link></li>
              <li><Link href="/search?location=Costa del Sol"><a className="hover:text-white transition-colors">Costa del Sol</a></Link></li>
              <li><Link href="/search?location=Madrid"><a className="hover:text-white transition-colors">Madrid</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <address className="text-sm text-gray-400 not-italic space-y-2">
              <p>Centro Comercial Plaza, Office 26</p>
              <p>Puerto Banús, Marbella</p>
              <p>Spain 29660</p>
              <p className="mt-4"><a href="tel:+34951000000" className="hover:text-white transition-colors">+34 951 000 000</a></p>
              <p><a href="mailto:info@leaderspain.com" className="hover:text-white transition-colors">info@leaderspain.com</a></p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LeaderSpain. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

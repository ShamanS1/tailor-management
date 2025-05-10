import React from 'react';
import { FaInstagram, FaFacebook, FaPinterest, FaEnvelope, FaPhone, FaTools, FaUsers } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Services Column */}
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-4 flex items-center text-teal-300">
              <FaTools className="mr-2" /> <span>Our Services</span>
            </h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <span className="border-b border-transparent hover:border-teal-300">Custom Tailoring</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <span className="border-b border-transparent hover:border-teal-300">Alterations</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <span className="border-b border-transparent hover:border-teal-300">Fabric Selection</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <span className="border-b border-transparent hover:border-teal-300">Measurements Guide</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <span className="border-b border-transparent hover:border-teal-300">Delivery and Returns</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Social Media Column */}
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-4 flex items-center text-teal-300">
              <FaUsers className="mr-2" /> <span>Follow Us</span>
            </h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <FaInstagram className="mr-2" />
                    <span className="border-b border-transparent hover:border-teal-300">Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <FaFacebook className="mr-2" />
                    <span className="border-b border-transparent hover:border-teal-300">Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <FaPinterest className="mr-2" />
                    <span className="border-b border-transparent hover:border-teal-300">Pinterest</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Column */}
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-4 flex items-center text-teal-300">
              <FaEnvelope className="mr-2" /> <span>Contact Us</span>
            </h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:tailor@example.com" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <FaEnvelope className="mr-2" />
                    <span className="border-b border-transparent hover:border-teal-300">tailor@example.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+123456789" className="text-gray-300 hover:text-teal-300 transition-colors duration-200 flex items-center">
                    <FaPhone className="mr-2" />
                    <span className="border-b border-transparent hover:border-teal-300">+123 456 789</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-600 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TailorNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// src/Pages/OrderOptionsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderOptionsPage: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [acceptAll, setAcceptAll] = useState(false);
  const navigate = useNavigate();

  // Updated order options including women's items
  const orderOptions = [
    "Shirts", 
    "Pants", 
    "Kurta",
    "Palazzo Pants",
    "Sherwani",
    "Suits", 
    "Blazers",
    "Salwaar Kammez",
    "Skirts", 
    "Lehengas",
    "Anarkali Suits",
    "Tops",  
  ];

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleAcceptAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptAll(e.target.checked);
    setSelectedOptions(e.target.checked ? orderOptions : []);
  };

  const handleRegisterClick = () => {
    alert("Registered with options: " + selectedOptions.join(", "));
    navigate('/');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-emerald-200 to-lime-100 p-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8"
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold mb-6 text-center text-emerald-600 font-sans"
        >
          What orders do you take?
        </motion.h2>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {orderOptions.map((option) => (
            <motion.div
              key={option}
              variants={itemVariants}
              className="flex items-center"
            >
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`option-${option}`}
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`option-${option}`} className="font-medium text-gray-700 cursor-pointer hover:text-emerald-600 transition-colors">
                    {option}
                  </label>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-6 flex items-center"
        >
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="accept-all"
                type="checkbox"
                checked={acceptAll}
                onChange={handleAcceptAllChange}
                className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="accept-all" className="font-medium text-gray-700 cursor-pointer hover:text-emerald-600 transition-colors">
                I accept all orders
              </label>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <button
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 transform ${
              selectedOptions.length || acceptAll
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:-translate-y-1 hover:shadow-lg'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleRegisterClick}
            disabled={!selectedOptions.length && !acceptAll}
          >
            Register
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderOptionsPage;

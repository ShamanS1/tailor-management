// src/Pages/RegistrationTailorOrderPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import axios from 'axios';
import MapCard from '../Components/MapCard';
import { motion } from 'framer-motion';

const RegistrationTailorOrderPage: React.FC = () => {
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [priceMap, setPriceMap] = useState<{ [key: string]: string }>({});
  const [isDelivery, setIsDelivery] = useState('No');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  };

  const handleRegister = async () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};
  
    if (!name) newErrors.name = "Please enter your name.";
    if (!email) newErrors.email = "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address.";
    if (!phone) newErrors.phone = "Please enter your phone number.";
    if (!/^\d{10}$/.test(phone)) newErrors.phone = "Please enter a valid phone number (10 digits).";
    if (!shopName) newErrors.shopName = "Please enter your shop name.";
    if (!password) newErrors.password = "Please create a password.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters long.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!currentLocation) {
      alert("Please select your location on the map.");
      return;
    }
  
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const dressData = selectedOptions.map(option => ({
        name: option,
        price: Number(priceMap[option]), // convert to number
      }));
      
      const tailorData = {
        name,
        shopName,
        email,
        phone,
        password,
        isDelivery: isDelivery === "Yes", // convert to boolean
        dress: dressData,
        role: "tailor",
        completed: 0,
        revenue: 0,
        ordersCount: 1,
        status: "pending",
        firebaseUid: user.uid,
        location: currentLocation || undefined, // Avoid sending null
      };
      
      const tailort = {
        firebaseUid: user.uid,
        name,
        role: "tailor"
      };
      
      // Send location along with the rest of the data
      await axios.post('http://localhost:5010/api/tailor', tailorData);
      await axios.post('http://localhost:5010/api/user', tailort);
      
      alert('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Error registering tailor:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handlePriceChange = (option: string, value: string) => {
    setPriceMap(prev => ({ ...prev, [option]: value }));
  };

  const orderOptions = [
    "Shirts", "Pants", "Kurta", "Palazzo Pants", "Sherwani", "Suits", 
    "Blazers", "Salwaar Kameez", "Skirts", "Lehengas", "Anarkali Suits", "Tops",
  ];

  const handleLocationChange = (lat: number, lng: number) => {
    setCurrentLocation({ latitude: lat, longitude: lng });
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-lime-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-400 to-green-500"></div>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold text-gray-800 mb-2"
                >
                  Register As Tailor
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-gray-600"
                >
                  Create your tailor account by filling out the details below.
                </motion.p>
              </div>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                {/* Personal Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Tailor Name Field */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Tailor Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </motion.div>
                  
                  {/* Email Field */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </motion.div>
                  
                  {/* Phone Field */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </motion.div>
                  
                  {/* Shop Name Field */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Name
                    </label>
                    <input
                      id="shopName"
                      type="text"
                      placeholder="Enter your shop name"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        errors.shopName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.shopName && (
                      <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>
                    )}
                  </motion.div>
                  
                  {/* Password Field */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </motion.div>
                  
                  {/* Confirm Password Field */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </motion.div>
                </div>
                
                {/* Delivery Option */}
                <motion.div variants={itemVariants} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you deliver/take orders?
                  </label>
                  <div className="flex space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-emerald-600"
                        checked={isDelivery === "Yes"}
                        onChange={() => setIsDelivery("Yes")}
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-emerald-600"
                        checked={isDelivery === "No"}
                        onChange={() => setIsDelivery("No")}
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </motion.div>
                
                {/* Order Options Section */}
                <motion.div variants={itemVariants} className="mt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">What orders do you take?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {orderOptions.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`option-${option}`}
                          type="checkbox"
                          checked={selectedOptions.includes(option)}
                          onChange={() => handleOptionChange(option)}
                          className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                        />
                        <label htmlFor={`option-${option}`} className="ml-2 text-gray-700 cursor-pointer">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Price Inputs for Selected Options */}
                {selectedOptions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Set your prices</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedOptions.map((option) => (
                        <div key={`price-${option}`} className="flex flex-col">
                          <label htmlFor={`price-${option}`} className="text-sm font-medium text-gray-700 mb-1">
                            Price for {option}
                          </label>
                          <input
                            id={`price-${option}`}
                            type="number"
                            placeholder="Enter price"
                            value={priceMap[option] || ''}
                            onChange={(e) => handlePriceChange(option, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Map Location Section */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6 border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Location Preview</h3>
                    <p className="text-sm text-gray-600">Select your shop location on the map</p>
                  </div>
                  <div className="h-[300px] w-full relative overflow-hidden">
                    <MapCard onLocationSelect={handleLocationChange} />
                  </div>
                  {currentLocation && (
                    <div className="p-3 bg-green-50 text-sm text-green-800 border-t border-green-200">
                      Location selected successfully!
                    </div>
                  )}
                </motion.div>
                
                {/* General Error */}
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm py-2 px-3 bg-red-50 rounded-md"
                  >
                    {errors.general}
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-md text-white font-medium transition-all duration-300 ${
                    isLoading 
                      ? "bg-emerald-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
                
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-6 text-center text-sm"
              >
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-emerald-600 hover:text-emerald-800 font-medium">
                    Sign in
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrationTailorOrderPage;

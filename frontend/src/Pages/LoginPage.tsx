// src/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useUserContext } from '../UserContext';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    navigate('/');
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDoc = await axios.get(`http://localhost:5010/api/user/${user.uid}`);
      
      if (userDoc) {
        const role = userDoc.data.role;
        
        if (role === 'tailor') {
          setUser(userDoc.data);
          navigate('/tailorhome');
        } else if (role === 'customer') {
          setUser(userDoc.data);
          navigate('/customerhome');
        } else if (role === 'admin') {
          setUser(userDoc.data);
          navigate('/adminhome');
        } else {
          setError('Unknown user role');
        }
      } else {
        setError('User data not found');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to sign in. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold text-gray-800 mb-2"
                >
                  Sign In
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-gray-600"
                >
                  Please enter your credentials below
                </motion.p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                </div>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm py-2 px-3 bg-red-50 rounded-md"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 space-y-4"
              >
                <button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium transition-all duration-300 ${
                    isLoading 
                      ? "bg-indigo-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
                
                <button
                  onClick={handleCancel}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6 text-center text-sm"
              >
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Sign up
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

export default LoginPage;

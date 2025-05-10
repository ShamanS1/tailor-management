// src/Components/TopBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "../Components/ui/menu";
import { Tooltip } from "../Components/ui/tooltip";

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegisterUser = () => {
    navigate('/registerUser'); // Adjust as necessary
  };

  const handleRegisterTailor = () => {
    navigate('/registerTailor'); // Adjust the route as needed
  };

  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-500 shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold text-white font-serif tracking-wide">
        SmartStitch
        </h1>
        
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4">
          <Tooltip content="Click here to Login">
            <button 
              onClick={handleLogin}
              className="px-5 py-2 bg-white text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              Login
            </button>
          </Tooltip>
          
          <Tooltip content="Click here to Register">
            <MenuRoot>
              <MenuTrigger asChild>
                <button className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm">
                  Register As
                </button>
              </MenuTrigger>
              <MenuContent className="bg-white rounded-lg shadow-lg py-1 min-w-[150px]">
                <MenuItem onClick={handleRegisterUser} className="px-4 py-2 text-gray-700 hover:bg-teal-50 cursor-pointer">
                  User
                </MenuItem>
                <MenuItem onClick={handleRegisterTailor} className="px-4 py-2 text-gray-700 hover:bg-teal-50 cursor-pointer">
                  Tailor
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

import React, { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';
import axios from 'axios';
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "../Components/ui/menu";
import { useNavigate } from 'react-router-dom';

interface Dress {
  name: string;
  price: number;
}

interface TailorData {
  name: string;
  shopName: string;
  location: string; 
  email: string;
  phone: string;
  revenue: number;
  ordersCount: number;
  completed: number;
  password: string;
  status: string;
  isDelivery: string;
  dress: Dress[]; 
  firebaseUid: string;
  role: string;
}

const TopBar: React.FC = () => {
  const { user, logout } = useUserContext();
  const [tailorData, setTailorData] = useState<TailorData | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  useEffect(() => {
    const fetchTailorData = async () => {
      if (user?.firebaseUid) {
        try {
          const res = await axios.get(`http://localhost:5010/api/tailor/uid/${user?.firebaseUid}`);
          setTailorData(res.data[0]);
        } catch (error) {
          console.error('Error fetching tailor data:', error);
        }
      }
    };

    fetchTailorData();
  }, [user?.firebaseUid]);

  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-500 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold text-white font-serif tracking-wide">
          TAILORNEST
        </h1>
        
        {/* Navigation */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <button className="text-white hover:text-teal-100 transition-colors font-medium">
              Home
            </button>
            <button className="text-white hover:text-teal-100 transition-colors font-medium">
              Reports
            </button>
          </nav>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <MenuRoot>
              <MenuTrigger asChild>
                <div className="relative cursor-pointer">
                  <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center text-teal-700 font-semibold">
                    {(tailorData?.name || user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${tailorData?.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </MenuTrigger>
              <MenuContent className="bg-white rounded-lg shadow-lg py-1 min-w-[150px]">
                <MenuItem onClick={handleLogout} className="px-4 py-2 text-gray-700 hover:bg-teal-50 cursor-pointer">
                  Logout
                </MenuItem>
              </MenuContent>
            </MenuRoot>
            
            <div className="flex flex-col">
              <span className="text-white font-medium text-sm">
                {tailorData?.name || user?.name}
              </span>
              <span className="text-teal-100 text-xs">
                {tailorData?.shopName || 'Shop name not available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

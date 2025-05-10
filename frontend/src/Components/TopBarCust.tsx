// src/components/TopBar.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import axios from 'axios';
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "../Components/ui/menu";

interface CustomerData {
  name: string,
  email: string,
  password: string,
  phone: string,
  firebaseUid: string,
  role: string
}

const TopBarCust: React.FC = () => {
  const { user, logout } = useUserContext();
  const [customerdata, setCustomerData] = useState<CustomerData | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const handleHome = () => {
    navigate('/customerhome');
  }

  useEffect(() => {
    const fetchCustomer = async () => {
      if(user?.firebaseUid) {
        try{
          const res = await axios.get(`http://localhost:5010/api/customer/uid/${user?.firebaseUid}`);
          setCustomerData(res.data);
        } catch(e){
          console.error("Error fetching customer data");
        }
      }
    };
    fetchCustomer();
  }, [user?.firebaseUid]);

  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-500 shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold text-white font-serif tracking-wide">
          TAILORNEST
        </h1>
        
        {/* Navigation and User Profile */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleHome}
            className="text-white hover:text-teal-100 transition-colors font-medium"
          >
            Home
          </button>
          
          <div className="flex items-center space-x-3">
            <MenuRoot>
              <MenuTrigger asChild>
                <div className="w-8 h-8 bg-teal-200 rounded-full flex items-center justify-center text-teal-700 font-semibold cursor-pointer">
                  {(customerdata?.name || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              </MenuTrigger>
              <MenuContent className="bg-white rounded-lg shadow-lg py-1 min-w-[150px]">
                <MenuItem onClick={handleLogout} className="px-4 py-2 text-gray-700 hover:bg-teal-50 cursor-pointer">
                  Logout
                </MenuItem>
              </MenuContent>
            </MenuRoot>
            
            <span className="text-white font-medium">
              {customerdata?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBarCust;

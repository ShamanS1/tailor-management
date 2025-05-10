// src/pages/TailorHomePage.tsx
import React, { useState, useEffect } from 'react';
import OrdersTable from '../Components/OrderTailor';
import TopBarTailor from '../Components/TopBarTailor';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserContext'; 
import TailorProfile from '../Components/Profile';
import TailorReportsPage from './TailorReportsPage';
import axios from 'axios';

const TailorHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();

  const [currentSection, setCurrentSection] = useState<'orders' | 'profile' | 'reports'>('orders');
  const [tailorData, setTailorData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch tailor profile data
  useEffect(() => {
    const fetchTailorData = async () => {
      console.log(user?.firebaseUid)
      const res = await axios.get(`http://localhost:5010/api/tailor/uid/${user?.firebaseUid}`)
      setTailorData(res.data[0]); 
      console.log(tailorData)
    };
    fetchTailorData();
  }, []);

  const renderSection = () => {
    switch (currentSection) {
      case 'orders':
        return <OrdersTable />;
      case 'profile':
        return tailorData ? <TailorProfile {...tailorData} /> : 
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>;
      case 'reports':
        return <TailorReportsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBarTailor />
      
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Sidebar Toggle */}
        {/* <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mb-4 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Menu
        </button> */}

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center text-teal-700 mb-6 drop-shadow-sm">
          TAILOR DASHBOARD
        </h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop (always visible) and Mobile (conditional) */}
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300`}>
            <div className="p-4 bg-teal-600 text-white">
              <h2 className="text-xl font-semibold flex items-center justify-between">
                Menu
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="md:hidden text-white hover:text-gray-200 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </h2>
            </div>
            <div className="p-4">
              <button 
                className={`w-full mb-2 p-3 text-left rounded-lg transition-all duration-200 flex items-center gap-2 ${currentSection === 'orders' ? 'bg-teal-100 text-teal-800 font-medium' : 'hover:bg-gray-100'}`}
                onClick={() => { setCurrentSection('orders'); setIsSidebarOpen(false); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Current Orders
              </button>
              <button 
                className={`w-full mb-2 p-3 text-left rounded-lg transition-all duration-200 flex items-center gap-2 ${currentSection === 'profile' ? 'bg-teal-100 text-teal-800 font-medium' : 'hover:bg-gray-100'}`}
                onClick={() => { setCurrentSection('profile'); setIsSidebarOpen(false); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button 
                className={`w-full mb-2 p-3 text-left rounded-lg transition-all duration-200 flex items-center gap-2 ${currentSection === 'reports' ? 'bg-teal-100 text-teal-800 font-medium' : 'hover:bg-gray-100'}`}
                onClick={() => { setCurrentSection('reports'); setIsSidebarOpen(false); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Reports
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
            {renderSection()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TailorHome;
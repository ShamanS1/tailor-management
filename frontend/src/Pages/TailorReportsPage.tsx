import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';
import { useUserContext } from '../UserContext'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const TailorReportsPage: React.FC = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [failedOrders, setFailedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchTailorOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5010/api/order/tailor/${user?.firebaseUid}`);
        const orders = response.data;

        let completed = 0;
        let failed = 0;
        let pending = 0;
        let revenue = 0;

        orders.forEach((order: any) => {
          if (order.orderStatus === 'Completed') completed++;
          else if (order.orderStatus === 'Cancelled') failed++;
          else pending++;

          revenue += order.amount || 0;
        });

        setTotalOrders(orders.length);
        setCompletedOrders(completed);
        setFailedOrders(failed);
        setPendingOrders(pending);
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Failed to fetch tailor orders", error);
      }
    };

    fetchTailorOrders();
  }, [user?.firebaseUid]);

  const pieData = {
    labels: ['Completed Orders', 'Failed Orders', 'Pending Orders'],
    datasets: [
      {
        data: [completedOrders, failedOrders, pendingOrders],
        backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
        hoverBackgroundColor: ['#059669', '#DC2626', '#D97706'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8 drop-shadow-sm">
          Tailor Reports Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
                <div className="p-2 bg-emerald-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-emerald-600">{totalOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Completed</h2>
                <div className="p-2 bg-green-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-green-600">{completedOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Failed</h2>
                <div className="p-2 bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-red-600">{failedOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Pending</h2>
                <div className="p-2 bg-amber-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-amber-600">{pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Revenue Analysis */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-emerald-700">Revenue Analysis</h2>
              <div className="p-2 bg-emerald-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-emerald-600">$</span>
              <span className="text-4xl font-bold text-emerald-600 ml-1">{totalRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Orders Distribution */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-emerald-700">Orders Distribution</h2>
              <div className="p-2 bg-emerald-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
            </div>
            <div className="w-64 h-64 mx-auto">
              <Pie data={pieData} options={{ 
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: {
                        size: 12
                      }
                    }
                  } 
                } 
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailorReportsPage;

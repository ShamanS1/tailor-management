import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../UserContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
    _id: string;
    customerId: string;
    tailorId: string;
    deliveryDate: string;
    orderStatus: string;
    amount: number;
    dresses: string[];
    placedDate: string;
    firebaseUidc?: string;
}

interface Dress {
    name: string;
    chest: number;
    waist: number;
    length: number;
    sleeve: number;
    inseam: number;
    collar: number;
    shoulder: number;
}

const OrdersTailor: React.FC = () => {
    const { user } = useUserContext();
    const [orders, setOrders] = useState<Order[]>([]);
    const [updatedOrders, setUpdatedOrders] = useState<Order[]>([]);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [measurements, setMeasurements] = useState<Dress[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:5010/api/order/tailor/${user?.firebaseUid}`);
                setOrders(response.data);
                setUpdatedOrders(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders. Please try again later.");
                setIsLoading(false);
            }
        };

        if (user?.firebaseUid) {
            fetchOrders();
        }
    }, [user?.firebaseUid]);

    const handleStatusChange = (orderId: string, status: string) => {
        setUpdatedOrders(prevOrders =>
            prevOrders.map(order => {
                if (order._id === orderId) {
                    setHasChanges(true);
                    return { ...order, orderStatus: status };
                }
                return order;
            })
        );
    };

    const saveChanges = async () => {
        setIsLoading(true);
        try {
            const updatePromises = updatedOrders.map(order =>
                axios.put(`http://localhost:5010/api/order/tailor/${order._id}`, order)
            );
            await Promise.all(updatePromises);
            const response = await axios.get(`http://localhost:5010/api/order/tailor/${user?.firebaseUid}`);
            setOrders(response.data);
            setHasChanges(false);
            setIsLoading(false);
        } catch (error) {
            console.error("Error saving order status:", error);
            setError("Failed to save changes. Please try again.");
            setIsLoading(false);
        }
    };

    const cancelChanges = () => {
        setUpdatedOrders(orders);
        setHasChanges(false);
    };

    const handleViewDetails = async (order: Order) => {
        setSelectedOrder(order);
        setIsDrawerOpen(true);
        setIsLoading(true);
    
        try {
            const response = await axios.get(`http://localhost:5010/api/measurement/${order._id}`);
            setMeasurements(response.data[0]?.dressMeasures || []); 
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching measurements:", error);
            setMeasurements([]); // Reset on error
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Accepted': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancel': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusButtonColor = (orderStatus: string, buttonStatus: string) => {
        if (orderStatus === buttonStatus) {
            switch (buttonStatus) {
                case 'Pending': return 'bg-yellow-500 text-white';
                case 'Accepted': return 'bg-blue-500 text-white';
                case 'Completed': return 'bg-green-500 text-white';
                case 'Cancel': return 'bg-red-500 text-white';
                default: return 'bg-gray-500 text-white';
            }
        }
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    };

    return (
        <div className="flex justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden"
            >
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Orders Dashboard</h2>
                    <p className="text-teal-100">Manage and track your customer orders</p>
                </div>
                
                {isLoading && !isDrawerOpen ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center">
                        <div className="text-red-500 mb-4">{error}</div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                ) : updatedOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                        <p className="mt-1 text-gray-500">You don't have any orders to complete at the moment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dresses</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {updatedOrders.map((order) => (
                                    <motion.tr 
                                        key={order._id} 
                                        className="hover:bg-gray-50"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.firebaseUidc || order.customerId}</div>
                                            <div className="text-xs text-gray-500">Order #{order._id.slice(-6)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{new Date(order.deliveryDate).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500">
                                                {Math.ceil((new Date(order.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {order.dresses.map((dress, index) => (
                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
                                                        {dress}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <button 
                                                    onClick={() => handleViewDetails(order)}
                                                    className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded text-sm transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                    Details
                                                </button>
                                                <div className="dropdown relative inline-block">
                                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm transition-colors duration-200 flex items-center justify-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                        </svg>
                                                        Status
                                                    </button>
                                                    <div className="dropdown-content hidden absolute right-0 mt-1 bg-white shadow-lg rounded-md overflow-hidden z-10 w-32 border border-gray-200 group-hover:block">
                                                        {["Pending", "Accepted", "Completed", "Cancel"].map((status) => (
                                                            <button
                                                                key={status}
                                                                className={`block w-full text-left px-4 py-2 text-sm ${getStatusButtonColor(order.orderStatus, status)}`}
                                                                onClick={() => handleStatusChange(order._id, status)}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <AnimatePresence>
                    {hasChanges && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center"
                        >
                            <div className="text-sm text-gray-600">You have unsaved changes</div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={cancelChanges}
                                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded shadow-sm transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={saveChanges}
                                    disabled={isLoading}
                                    className={`bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded shadow-sm transition-colors duration-200 flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Drawer for Order Details */}
                <AnimatePresence>
                    {isDrawerOpen && (
                        <div className="fixed inset-0 overflow-hidden z-50">
                            <div className="absolute inset-0 overflow-hidden">
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 bg-gray-500 bg-opacity-75" 
                                    onClick={() => setIsDrawerOpen(false)}
                                ></motion.div>
                                <div className="fixed inset-y-0 right-0 max-w-full flex">
                                    <motion.div 
                                        className="relative w-screen max-w-2xl"
                                        initial={{ x: "100%" }}
                                        animate={{ x: 0 }}
                                        exit={{ x: "100%" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                            <div className="px-4 py-6 sm:px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                                                <div className="flex items-start justify-between">
                                                    <h2 className="text-lg font-medium">Order Details</h2>
                                                    <button 
                                                        onClick={() => setIsDrawerOpen(false)}
                                                        className="rounded-md text-teal-100 hover:text-white focus:outline-none"
                                                    >
                                                        <span className="sr-only">Close</span>
                                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                                {isLoading ? (
                                                    <div className="flex justify-center items-center h-full">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                                                    </div>
                                                ) : selectedOrder && (
                                                    <div className="space-y-6">
                                                        <div className="bg-teal-50 p-4 rounded-lg">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h3 className="text-lg font-medium text-teal-800">Order Summary</h3>
                                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                                                                    {selectedOrder.orderStatus}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Customer ID</p>
                                                                    <p className="text-sm font-medium text-gray-900">{selectedOrder.customerId}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Order ID</p>
                                                                    <p className="text-sm font-medium text-gray-900">#{selectedOrder._id.slice(-8)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Placed On</p>
                                                                    <p className="text-sm font-medium text-gray-900">{new Date(selectedOrder.placedDate).toLocaleDateString()}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Delivery Date</p>
                                                                    <p className="text-sm font-medium text-gray-900">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Amount</p>
                                                                    <p className="text-sm font-medium text-gray-900">${selectedOrder.amount.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <h3 className="text-lg font-medium text-gray-800 mb-3">Ordered Items</h3>
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                                {selectedOrder.dresses.map((dress, index) => (
                                                                    <div key={index} className="bg-white p-3 rounded-md border border-gray-200 text-center">
                                                                        <span className="text-sm font-medium text-gray-800">{dress}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <h3 className="text-lg font-medium text-gray-800 mb-3">Measurements</h3>
                                                            {measurements.length > 0 ? (
                                                                <div className="overflow-x-auto border rounded-lg bg-white">
                                                                    <table className="min-w-full divide-y divide-gray-200">
                                                                        <thead className="bg-gray-50">
                                                                            <tr>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chest</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waist</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sleeve</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inseam</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collar</th>
                                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shoulder</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                                            {measurements.map((measure, index) => (
                                                                                <tr key={index} className="hover:bg-gray-50">
                                                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{measure.name}</td>
                                                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{measure.chest}</td>
                                                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{measure.waist}</td>
                                                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{measure.length}</td>
                                                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{measure.sleeve}</td>
                                                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{measure.inseam}</td>
                                                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{measure.collar}</td>
                                                                                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{measure.shoulder}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                <div className="bg-white p-4 text-center rounded-lg border border-gray-200">
                                                                    <p className="text-gray-500">No measurements available for this order.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex justify-end">
                                                            <button
                                                                onClick={() => setIsDrawerOpen(false)}
                                                                className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded shadow-sm transition-colors duration-200"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
            
            {/* Add this CSS for the dropdown functionality */}
            <style jsx>{`
                .dropdown:hover .dropdown-content {
                    display: block;
                }
            `}</style>
        </div>
    );
};

export default OrdersTailor;

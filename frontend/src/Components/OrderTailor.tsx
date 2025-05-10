import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../UserContext';

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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:5010/api/order/tailor/${user?.firebaseUid}`);
                setOrders(response.data);
                setUpdatedOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

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
        try {
            const updatePromises = updatedOrders.map(order =>
                axios.put(`http://localhost:5010/api/order/tailor/${order._id}`, order)
            );
            await Promise.all(updatePromises);
            const response = await axios.get(`http://localhost:5010/api/order/tailor/${user?.firebaseUid}`);
            setOrders(response.data);
            setHasChanges(false);
        } catch (error) {
            console.error("Error saving order status:", error);
        }
    };

    const cancelChanges = () => {
        setUpdatedOrders(orders);
        setHasChanges(false);
    };

    const handleViewDetails = async (order: Order) => {
        setSelectedOrder(order);
        setIsDrawerOpen(true);
    
        try {
            const response = await axios.get(`http://localhost:5010/api/measurement/${order._id}`);
            setMeasurements(response.data[0].dressMeasures || []); 
        } catch (error) {
            console.error("Error fetching measurements:", error);
            setMeasurements([]); // Reset on error
        }
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-teal-700">Orders to Complete</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dresses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {updatedOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.firebaseUidc || order.customerId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <ul className="list-disc pl-5">
                                            {order.dresses.map((dress, index) => (
                                                <li key={index}>{dress}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button 
                                            onClick={() => handleViewDetails(order)}
                                            className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded text-sm transition-colors duration-200"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex rounded-md shadow-sm">
                                            {["Pending", "Accepted", "Completed", "Cancel"].map((status) => (
                                                <button
                                                    key={status}
                                                    className={`px-3 py-1 text-sm font-medium ${
                                                        order.orderStatus === status
                                                            ? "bg-teal-500 text-white"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    } ${
                                                        status === "Pending" ? "rounded-l-md" : ""
                                                    } ${
                                                        status === "Cancel" ? "rounded-r-md" : ""
                                                    } transition-colors duration-200`}
                                                    onClick={() => handleStatusChange(order._id, status)}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {hasChanges && (
                    <div className="mt-6 flex justify-between">
                        <button 
                            onClick={cancelChanges}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={saveChanges}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
                
                {/* Drawer for Order Details */}
                {isDrawerOpen && (
                    <div className="fixed inset-0 overflow-hidden z-50">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
                            <div className="fixed inset-y-0 right-0 max-w-full flex">
                                <div className="relative w-screen max-w-2xl">
                                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                        <div className="px-4 py-6 sm:px-6 border-b border-gray-200">
                                            <div className="flex items-start justify-between">
                                                <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
                                                <button 
                                                    onClick={() => setIsDrawerOpen(false)}
                                                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                                >
                                                    <span className="sr-only">Close</span>
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                            {selectedOrder && (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-gray-700"><span className="font-medium">Customer ID:</span> {selectedOrder.customerId}</p>
                                                    <p className="text-sm text-gray-700"><span className="font-medium">Placed On:</span> {new Date(selectedOrder.placedDate).toLocaleDateString()}</p>
                                                    <p className="text-sm text-gray-700"><span className="font-medium">Delivery Date:</span> {new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                                                    <p className="text-sm text-gray-700"><span className="font-medium">Order Status:</span> {selectedOrder.orderStatus}</p>
                                                    <p className="text-sm text-gray-700"><span className="font-medium">Amount:</span> ${selectedOrder.amount.toFixed(2)}</p>
                                                    
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Dresses:</p>
                                                        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                                                            {selectedOrder.dresses.map((dress, index) => (
                                                                <li key={index}>{dress}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    
                                                    <div className="mt-6">
                                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Measurements:</h3>
                                                        <div className="overflow-x-auto border rounded-lg">
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
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
                                                                    {measurements.length > 0 ? (
                                                                        measurements.map((measure, index) => (
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
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan={8} className="px-3 py-2 text-center text-xs text-gray-500">No measurements available.</td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersTailor;

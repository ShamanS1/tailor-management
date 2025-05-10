import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';
import TopBarCust from '../Components/TopBarCust';
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot, DialogTrigger } from "../Components/ui/dialog";
import { useUserContext } from '../UserContext';
import MapCard from '../Components/MapCard';
import jsPDF from 'jspdf';

const ShopDetailsPage = () => {
  const { user } = useUserContext();
  const { firebaseUidt, dress } = useParams();
  const navigate = useNavigate();
  const [tailor, setTailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [pendingAcceptedCount, setPendingAcceptedCount] = useState(0);
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState(0);
  const [dressM, setdressM] = useState({
    name: dress,
    chest: 0,
    waist: 0,
    len: 0,
    sleeve: 0,
    inseam: 0,
    collar: 0,
    shoulder: 0
  });
  const [reviews, setReviews] = useState([]);
  
  const roundToHalf = (number) => {
    if (number === 0) {
        setEstimatedDeliveryDays(2);
        return 2;
    }
    setEstimatedDeliveryDays(Math.round(number * 2) / 2);
    return Math.round(number * 2) / 2;
  };
  
  useEffect(() => {
    const fetchTailorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5010/api/tailor/uid/${firebaseUidt}`);
        setTailor(response.data[0]);
        const ratingResponse = await axios.get(`http://localhost:5010/api/review/${firebaseUidt}`);
        const ratings = ratingResponse.data;
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, review) => sum + review.rating, 0) / ratings.length 
          : 0;

        const roundedRating = roundToHalf(averageRating);
        setRating(roundedRating);

        // Fetch orders to calculate pending/accepted orders count
        const ordersResponse = await axios.get(`http://localhost:5010/api/order/tailor/${firebaseUidt}`);
        
        const pendingAcceptedOrders = ordersResponse.data.filter(order => 
         order.orderStatus === 'Pending' || order.orderStatus === 'Accepted'
        );
        setPendingAcceptedCount(pendingAcceptedOrders.length);
        setEstimatedDeliveryDays(pendingAcceptedCount*2);

        // Fetch reviews
        const reviewsResponse = await axios.get(`http://localhost:5010/api/review/${firebaseUidt}`);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError('Error fetching tailor details');
      } finally {
        setLoading(false);
      }
    };

    fetchTailorDetails();
  }, [firebaseUidt]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const { shopName } = tailor;
    const dressName = dress;
    const cost = tailor.dress.find(d => d.name === dress)?.price.toFixed(2);
    const measurementEntries = Object.entries(dressM)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value} inches`);
  
    // Title
    doc.setFontSize(16);
    doc.text('Order Summary', 20, 20);
  
    // Content
    doc.setFontSize(12);
    doc.text(`Dress: ${dressName}`, 20, 30);
    doc.text(`Shop: ${shopName}`, 20, 40);
    doc.text(`Cost: $${cost}`, 20, 50);
    doc.text('Measurements:', 20, 60);
  
    // Measurements List
    measurementEntries.forEach((entry, index) => {
      doc.text(entry, 20, 70 + (index * 10));
    });
  
    // Save the PDF
    doc.save(`Order_Summary_${shopName}_${dressName}.pdf`);
  };

  const handleReviewOrder = () => {
    setShowSummary(true);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      firebaseUidc: user?.firebaseUid,
      firebaseUidt: firebaseUidt,
      shopName: tailor.shopName,
      deliveryDate: new Date(),
      orderStatus: 'Pending',
      amount: (tailor.dress.find(d => d.name === dress)).price.toFixed(2),
      orderType: 'custom',
      deliveryType: 'home',
      dresses: [dress],
    };

    const response = await axios.post('http://localhost:5010/api/order/', orderData);
    
    const measurementData = {
      customerId: orderData.firebaseUidc, 
      orderId: response.data._id,
      dressMeasures: [{
        name: dress,
        chest: dressM.chest,
        waist: dressM.waist,
        length: dressM.len,
        sleeve: dressM.sleeve,
        inseam: dressM.inseam,
        collar: dressM.collar,
        shoulder: dressM.shoulder
      }]
    }

    await axios.post('http://localhost:5010/api/measurement/', measurementData);
    setShowSummary(false);
    generatePDF();
    navigate('/customerhome');
  };

  const renderMeasurementFields = () => {
    if (dress === 'Shirts' ||dress === 'Kurta' || dress === 'Sherwani' || dress === 'Suits' || dress ==='Blazers' || dress === 'Salwar Kameez' || dress === 'Lehenga' || dress === 'Churidar Tops') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Collar Size (inches)</label>
            <input 
              type="number" 
              name="collar" 
              value={dressM.collar} 
              onChange={(e) => setdressM(prev => ({...prev, collar: Number(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dress Length (inches)</label>
            <input 
              type="number" 
              name="length" 
              value={dressM.len} 
              onChange={(e) => setdressM(prev => ({...prev, len: Number(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sleeve Length (inches)</label>
            <input 
              type="number" 
              name="sleeves" 
              value={dressM.sleeve} 
              onChange={(e) => setdressM(prev => ({...prev, sleeve: Number(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chest Measurement (inches)</label>
            <input 
              type="number" 
              name="chest" 
              value={dressM.chest} 
              onChange={(e) => setdressM(prev => ({...prev, chest: Number(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Shoulder Width (inches)</label>
            <input 
              type="number" 
              name="shoulder" 
              value={dressM.shoulder} 
              onChange={(e) => setdressM(prev => ({...prev, shoulder: Number(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </>
      );
    } else if (dress === 'Pants' || dress === 'Skirts' || dress ==='Palazzo Pants') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Waist Width (inches)</label>
            <input 
              type="number" 
              name="waist" 
              value={dressM.waist} 
              onChange={(e) => setdressM(prev => ({...prev, waist: Number(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Inseam Width (inches)</label>
            <input 
              type="number" 
              name="inseam" 
              value={dressM.inseam} 
              onChange={(e) => setdressM(prev => ({...prev, inseam: Number(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pant Length (inches)</label>
            <input 
              type="number" 
              name="length" 
              value={dressM.len} 
              onChange={(e) => setdressM(prev => ({...prev, len: Number(e.target.value)}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </>
      );
    }
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBarCust />
      
      <div className="container mx-auto px-4 py-8">
        {/* Shop Header Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">{tailor.shopName}</h1>
                <p className="text-teal-100">by {tailor.name}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <div className="flex mr-2">
                  {renderStars(rating)}
                </div>
                <span className="text-white font-medium">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Estimated Delivery</h2>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">{estimatedDeliveryDays} days</span>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Selected Dress</h2>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-gray-600">{dress}</span>
                </div>
                <div className="flex items-center mt-2">
                  <svg className="w-5 h-5 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600 font-medium">
                    ₹{tailor.dress.find(d => d.name === dress)?.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <DialogRoot>
                <DialogTrigger asChild>
                  <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Place Order
                  </button>
                </DialogTrigger>
                
                {!showSummary ? (
                  <DialogContent className="bg-white rounded-xl shadow-xl max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-800">Enter your measurements</DialogTitle>
                    </DialogHeader>
                    <DialogBody className="py-4">
                      <p className="text-gray-600 mb-4">
                        Please provide the measurements for the {dress}.
                      </p>
                      <div className="space-y-4">
                        {renderMeasurementFields()}
                      </div>
                    </DialogBody>
                    <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <DialogActionTrigger asChild>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                      </DialogActionTrigger>
                      <button 
                        onClick={handleReviewOrder}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                      >
                        Review Order
                      </button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                  </DialogContent>
                ) : (
                  <DialogContent className="bg-white rounded-xl shadow-xl max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-800">Order Summary</DialogTitle>
                    </DialogHeader>
                    <DialogBody className="py-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold text-gray-800 mb-2">Dress: {dress}</h3>
                          <p className="text-gray-600">Shop: {tailor.shopName}</p>
                          <p className="text-gray-600">Cost: ₹{tailor.dress.find(d => d.name === dress)?.price.toFixed(2)}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">Measurements:</h3>
                          <ul className="space-y-1 text-gray-600">
                            {Object.entries(dressM).map(([key, value]) => (
                              value > 0 && key !== 'name' && (
                                <li key={key} className="flex justify-between">
                                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                  <span>{value} inches</span>
                                </li>
                              )
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DialogBody>
                    <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <button 
                        onClick={() => setShowSummary(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Back to Edit
                      </button>
                      <button 
                        onClick={handlePlaceOrder}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                      >
                        Place Order
                      </button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </DialogRoot>
              
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Shops
              </button>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
            
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews yet.</p>
            )}
          </div>
        </div>
        
        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop Location</h2>
            <div className="h-64 rounded-lg overflow-hidden">
              <MapCard address={tailor.address} />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ShopDetailsPage;

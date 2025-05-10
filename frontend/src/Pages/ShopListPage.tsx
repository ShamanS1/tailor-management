import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Components/Footer';
import SearchBar from '../Components/SearchBar';
import TopBarCust from '../Components/TopBarCust';

interface Tailor {
  firebaseUid: string;
  name: string;
  shopName: string;
  isDelivery: boolean;
  dress: Array<{
    name: string;
    price: number;
  }>;
  averageRating: number;
}

const ShopListPage: React.FC = () => {
  const { dress } = useParams(); 
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        const response = await axios.get(`http://localhost:5010/api/tailor/dress/${dress}`);
        const tailorsWithRatings = await Promise.all(response.data.map(async (tailor: any) => {
          const ratingResponse = await axios.get(`http://localhost:5010/api/review/${tailor.firebaseUid}`);
          const ratings = ratingResponse.data;
          const averageRating = ratings.length > 0 
            ? ratings.reduce((sum: number, review: any) => sum + review.rating, 0) / ratings.length 
            : 0; // Default to 0 if no ratings

          return { ...tailor, averageRating };
        }));

        setTailors(tailorsWithRatings);
      } catch (err) {
        setError('Error fetching tailors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTailors();
  }, [dress]); 

  const handlePlaceOrder = (firebaseUidt: string) => {
    navigate(`/shop/${dress}/${firebaseUidt}`);
  };

  // Function to render star rating
  const renderStars = (rating: number) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBarCust />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar />
        </div>
        
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          {dress ? `Tailors for ${dress}` : 'Available Tailors'}
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {tailors.map((tailor) => {
              // Find the specific dress that matches the passed parameter
              const specificDress = tailor.dress.find(d => d.name === dress);

              // If the dress is not found, return null
              if (!specificDress) return null;

              return (
                <div 
                  key={tailor.firebaseUid}
                  className="w-full sm:w-[320px] bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xl">
                        {tailor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{tailor.shopName}</h2>
                        <p className="text-sm text-gray-600">Tailored by: {tailor.name}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center mb-1">
                        <span className="text-gray-700 font-medium mr-2">Delivery:</span>
                        <span className={`text-sm px-2 py-1 rounded ${tailor.isDelivery ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {tailor.isDelivery ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-gray-700 font-medium">{specificDress.name}:</span>
                        <span className="text-lg font-bold text-indigo-600">₹{specificDress.price.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {renderStars(tailor.averageRating)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {tailor.averageRating.toFixed(1)}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handlePlaceOrder(tailor.firebaseUid)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      View Shop
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShopListPage;

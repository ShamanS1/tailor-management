import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dressItems = [
    {
        title: "Shirts",
        description: "Classic and versatile, this shirt dress combines timeless elegance with modern comfort, perfect for any occasion.",
        image: "https://static.vecteezy.com/system/resources/previews/012/705/555/large_2x/men-s-shirts-mockup-design-template-mockup-free-photo.jpg"
    },
    {
        title: "Pants",
        description: "Stylishly tailored for a perfect fit, these pants offer a blend of comfort and sophistication, ideal for both casual and formal looks.",
        image: "https://static.vecteezy.com/system/resources/previews/002/782/836/large_2x/pants-on-white-background-free-photo.jpg"
    },
    {
        title: "Kurta",
        description: "Stylishly crafted with fine details, this kurta is perfect for casual outings or festive celebrations.",
        image: "https://5.imimg.com/data5/OD/BD/SJ/SELLER-3581259/cotton-kurta-pajama-500x500-500x500.jpg"
    },
    {
        title: "Palazzo Pants",
        description: "These palazzo pants combine comfort and style, perfect for a chic, relaxed look.",
        image: "https://st.mngbcn.com/rcs/pics/static/T4/fotos/S20/47098633_36_B.jpg?ts=1678952344968&imwidth=164&imdensity=2"
    },
    {
        title: "Sherwani",
        description: "Opulently designed, this sherwani is the perfect choice for grooms seeking a regal appearance on their big day.",
        image: "https://5.imimg.com/data5/GO/BY/QT/SELLER-81847244/mens-sherwani-500x500.jpg"
    },
    {
        title: "Suits",
        description: "Tailored to perfection, this classic men's suit combines sophistication and comfort, ideal for business meetings or formal events.",
        image: "https://img.freepik.com/premium-photo/mens-suit-isolated-white-background_1034910-17338.jpg"
    },
    {
        title: "Blazers",
        description: "This timeless classic blazer features a tailored fit and versatile design, perfect for elevating both casual and formal outfits.",
        image: "https://th.bing.com/th/id/OIP.6nAFbFG4W7Q2bKdTLlQouAHaHa?w=600&h=600&rs=1&pid=ImgDetMain"
    },
    {
        title: "Salwaar Kameez",
        description: "This salwar kameez offers comfort and style, making it ideal for daily wear or family gatherings.",
        image: "https://lerevecraze.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/customer-registration/6f761eabdc6882123c8d6f64477a5ac8.jpg"
    },
    {
        title: "Skirts",
        description: "Flattering and versatile, this A-line skirt gracefully cinches at the waist and flows beautifully, perfect for both casual and formal occasions.",
        image: "https://i5.walmartimages.com/asr/b302eb3a-297e-4e78-9b88-09cf6ab79a15_1.756833f116dabcfaecc998b48c8616ac.jpeg"
    },
    {
        title: "Lehenga",
        description: "Elegant and richly embellished, this lehenga is designed to make a statement at weddings and special events.",
        image: "https://ds393qgzrxwzn.cloudfront.net/resize/m720x480/cat1/img/images/0/aRJE753bOV.jpg"
    },
    {
        title: "Anarkali Suits",
        description: "Flowing and graceful, this Anarkali suit adds a touch of glamour to any festive occasion.",
        image: "https://cdn.shopify.com/s/files/1/0285/1004/files/3_caa89fd3-f282-435a-94c4-43b5cf5c906d.jpg?v=1599214828"
    },
    {
        title: "Churidar Tops",
        description: "Elegantly designed, this churidar top features intricate patterns and a flattering silhouette, perfect for pairing with churidar pants for a classic and sophisticated look.",
        image: "https://th.bing.com/th/id/OIP.OEwFCxWkaGIycKmL_7lJEQAAAA?w=189&h=259&c=7&r=0&o=5&pid=1.7"
    },
];

const DressList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const filteredDresses = dressItems.filter(dress =>
        dress.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOrderNow = (dress: string) => {
        navigate(`/shops/${dress}`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-teal-600">
                What would you like to have stitched?
            </h2>
            
            <div className="relative mb-6 max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Search for dresses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {filteredDresses.map((dress, index) => (
                    <div key={index} className="w-full max-w-xs bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="h-48 overflow-hidden">
                            <img
                                src={dress.image}
                                alt={dress.title}
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4 flex-1">
                            <h3 className="font-bold text-lg text-gray-700 mb-2">
                                {dress.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                {dress.description}
                            </p>
                        </div>
                        <div className="p-4 mt-auto">
                            <button 
                                onClick={() => handleOrderNow(dress.title)} 
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 transform hover:scale-105"
                            >
                                Stitch Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredDresses.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No dresses found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default DressList;
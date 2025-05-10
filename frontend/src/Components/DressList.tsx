import React, { useState } from 'react';
import { Box, Button, Flex, Text, Image, Input, Heading } from "@chakra-ui/react";
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
    const navigate = useNavigate(); // Initialize useNavigate

    const filteredDresses = dressItems.filter(dress =>
        dress.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOrderNow = (dress: string) => {
        navigate(`/shops/${dress}`); 
    };

    return (
        <Box bg="white" p={6} rounded="lg" shadow="md" textAlign="center">
            <Heading as="h2" fontSize="2xl" fontWeight="bold" mb={4} color="teal.600">
                What would you like to have stitched?
            </Heading>
            <Input
                placeholder="Search for dresses..."
                mb={4}
                value={searchTerm}
                borderRadius="full"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Flex wrap="wrap" justify="center" gap={6}>
                {filteredDresses.map((dress, index) => (
                    <Box key={index} maxW="200px" borderWidth="1px" borderRadius="md" overflow="hidden" shadow="lg" textAlign="center" display="flex" flexDirection="column" justifyContent="space-between">
                        <Image
                            src={dress.image}
                            alt={dress.title}
                            objectFit="cover"
                            boxSize="200px"
                            width="100%"
                        />
                        <Box p={4} flex="1">
                            <Text fontWeight="bold" fontSize="lg" color="gray.700" mb={2}>
                                {dress.title}
                            </Text>
                            <Text fontSize="sm" color="gray.500" noOfLines={2}>
                                {dress.description}
                            </Text>
                        </Box>
                        <Box p={4} mt="auto">
                            <Button onClick={() => handleOrderNow(dress.title)} colorScheme="teal" variant="solid" size="sm" width="full">
                                Stitch Now
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

export default DressList;
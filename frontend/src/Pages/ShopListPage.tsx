import React, { useEffect, useState } from 'react';
import { Card, Stack, Spinner, Text, HStack, Center } from '@chakra-ui/react';
import { Avatar } from '../Components/ui/avatar';
import { Button } from '../Components/ui/button';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Components/Footer';
import { Rating } from '../Components/ui/rating';
import SearchBar from '../Components/SearchBar';
import TopBarCust from '../Components/TopBarCust';

const ShopListPage = () => {
  const { dress } = useParams(); 
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        const response = await axios.get(`http://localhost:5010/api/tailor/dress/${dress}`);
        const tailorsWithRatings = await Promise.all(response.data.map(async (tailor) => {
          const ratingResponse = await axios.get(`http://localhost:5010/api/review/${tailor.firebaseUid}`);
          const ratings = ratingResponse.data;
          const averageRating = ratings.length > 0 
            ? ratings.reduce((sum, review) => sum + review.rating, 0) / ratings.length 
            : 0; // Default to 0 if no ratings

          return { ...tailor, averageRating };
        }));

        setTailors(tailorsWithRatings);
      } catch (err) {
        setError('Error fetching tailors');
      } finally {
        setLoading(false);
      }
    };

    fetchTailors();
  }, [dress]); 

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handlePlaceOrder = (firebaseUidt) => {
    navigate(`/shop/${dress}/${firebaseUidt}`);
  };

  return (
    <>
      <TopBarCust />
      <SearchBar />
      <Center width="100%">
        <Stack gap="4" direction="row" wrap="wrap" maxWidth="1000px" width="100%">
          {tailors.map((tailor) => {
            // Find the specific dress that matches the passed parameter
            const specificDress = tailor.dress.find(d => d.name === dress);

            // If the dress is not found, return null
            if (!specificDress) return null;

            return (
              <Card.Root width="320px" variant="subtle" key={tailor.firebaseUid} shadow="lg">
                <Card.Body gap="2">
                  <HStack>
                    <Avatar
                      name={tailor.name}
                      size="lg"
                      shape="rounded"
                    />
                    <Card.Title mb="2">{tailor.shopName}</Card.Title>
                  </HStack>
                  <Card.Description>
                    Tailored by: {tailor.name}<br />
                    Collection/Delivery Available: {tailor.isDelivery}
                  </Card.Description>
                  <Text>
                    {specificDress.name}: ₹{specificDress.price.toFixed(2)}
                  </Text>
                  <Rating allowHalf value={tailor.averageRating} readOnly />
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                  <Button variant="outline" onClick={() => handlePlaceOrder(tailor.firebaseUid)}>
                    View shop
                  </Button>
                </Card.Footer>
              </Card.Root>
            );
          })}
        </Stack>
      </Center>
      <Footer />
    </>
  );
};

export default ShopListPage;

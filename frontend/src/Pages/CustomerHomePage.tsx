import { Box, Stack, Text, Button, Container, Table, Textarea } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from "../Components/SearchBar";
import TopBarCust from "../Components/TopBarCust";
import DressList from "../Components/DressList";
import Footer from "../Components/Footer";
import { useUserContext } from '../UserContext'; 
import { Rating } from "../Components/ui/rating"
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../Components/ui/drawer";
import { EmptyState } from "../Components/ui/empty-state"; // Adjust the import path as necessary
import { LuShoppingCart } from "react-icons/lu";
import CustomerProfile from "../Components/CustomerProfile";

const CustomerHomePage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<'home' | 'dashboard'| 'profile'>('home');
  const [orders, setOrders] = useState<any[]>([]); // Use a proper type here for Order

  const { user, logout } = useUserContext();

  const [tailor, setTailor] = useState<any []>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5010/api/order/customer/${user?.firebaseUid}`);       
        setOrders(res.data)
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Handle error appropriately
      }
    };

    if (currentSection === 'dashboard') {
      fetchOrders();
    }
  }, [currentSection]);

  const handleReviewClick = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCancelClick = async(orderId: string) => {
    console.log(orderId);
    const res = await axios.delete(`http://localhost:5010/api/order/customer/${orderId}`);
  }


  const handleReviewSubmit = async () => {
    if (!selectedOrderId) return;

    const selectedOrder = orders.find(order => order._id === selectedOrderId);
    if (!selectedOrder) return;

    const reviewData = {
      firebaseUidc: user?.firebaseUid,
      firebaseUidt: selectedOrder.firebaseUidt,
      rating:rating.value,
      comment
    };
    console.log(reviewData);
    try {
      await axios.post(`http://localhost:5010/api/review/${user?.firebaseUid}`, reviewData);
      setSelectedOrderId(null);
      setRating(0);
      setComment("");
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <DressList />;
      case 'profile':
        return <CustomerProfile/>;
      case 'dashboard':
        return orders.length === 0 ? (
          <EmptyState
            icon={<LuShoppingCart />}
            title="Your orders are empty"
            description="Explore our products and place your orders"
          />
        ) : (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="teal.600">
              Customer Dashboard
            </Text>
            <Table.Root variant="outline">
              <Table.ColumnGroup>
                <Table.Column htmlWidth="20%" />
                <Table.Column htmlWidth="20%" />
                <Table.Column htmlWidth="20%" />
                <Table.Column htmlWidth="30%" />
                <Table.Column />
                <Table.Column />
              </Table.ColumnGroup>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Shop</Table.ColumnHeader>
                  <Table.ColumnHeader>Placed Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Delivery Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Dresses</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Amount</Table.ColumnHeader>
                  <Table.ColumnHeader>Order Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {orders.map(order => (
                  <React.Fragment key={order._id}>
                    <Table.Row>
                      <Table.Cell>{order.shopName}</Table.Cell>
                      <Table.Cell>{new Date(order.placedDate).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>{new Date(order.deliveryDate).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>{order.dresses.join(", ")}</Table.Cell>
                      <Table.Cell textAlign="end">{order.amount.toFixed(2)}</Table.Cell>
                      <Table.Cell>{order.orderStatus}</Table.Cell>
                      <Table.Cell>
                        {order.orderStatus === 'Completed' && (
                          <Button size="sm" colorScheme="teal" onClick={() => handleReviewClick(order._id)}>
                            Review
                          </Button>
                        )}

                        {
                          order.orderStatus === 'Pending' && (
                            <Button size="sm" onClick={() => handleCancelClick(order._id)}>
                              Cancel
                            </Button>
                          )
                        }
                      </Table.Cell>
                    </Table.Row>
                    {/* Conditionally render review card for selected order */}
                    {selectedOrderId === order._id && (
                      <Table.Row>
                        <Table.Cell colSpan={7}>
                          <Box borderWidth="1px" borderRadius="lg" p={4} mt={2} bg="gray.50">
                            <Text fontWeight="bold" mb="2">Rate the shop:</Text>
                            <Rating defaultValue={rating} allowHalf onValueChange={(e) => setRating(e)} size="md" />
                            <Text fontWeight="bold" mt="4" mb="2">Add a comment:</Text>
                            <Textarea
                              placeholder="Comment..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                            <Button mt={4} colorScheme="teal" onClick={handleReviewSubmit}>
                              Submit Review
                            </Button>
                          </Box>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </React.Fragment>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TopBarCust />
      
      <Container maxW="container.lg" mt={6} p={4}>
        <Stack direction="row" align="center">
          <DrawerRoot placement="start">
            <DrawerTrigger asChild>
              <Button color="teal" variant="outline" size="sm" backgroundColor={"white"}>
                Menu
              </Button>
            </DrawerTrigger>
            <DrawerBackdrop />
            <DrawerContent offset="4" rounded="md">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerCloseTrigger />
              </DrawerHeader>
              <DrawerBody>
                <Button onClick={() => { setCurrentSection('home'); }} variant="ghost" rounded="md" w="100%" mb={2}>
                  Home
                </Button>
                <Button onClick={() => { setCurrentSection('dashboard'); }} variant="ghost" rounded="md" w="100%">
                  Customer Dashboard
                </Button>
                <Button onClick={() => { setCurrentSection('profile'); }} variant="ghost" rounded="md" w="100%">
                  Profile
                </Button>
              </DrawerBody>
              <DrawerFooter>
                <DrawerActionTrigger asChild>
                  <Button variant="outline">Close</Button>
                </DrawerActionTrigger>
              </DrawerFooter>
            </DrawerContent>
          </DrawerRoot>

          <SearchBar />
        </Stack>

        {/* Render section based on menu selection */}
        <Box bg="white" p={6} rounded="lg" shadow="md" mt={4}>
          {renderSection()}
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default CustomerHomePage;

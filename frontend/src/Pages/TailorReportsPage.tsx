import React, { useEffect, useState } from 'react';
import { Box, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';
import { useUserContext } from '../UserContext'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const TailorReportsPage: React.FC = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [failedOrders, setFailedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0); // State for total revenue
  const { user } = useUserContext();

  useEffect(() => {
    const fetchTailorOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5010/api/order/tailor/${user?.firebaseUid}`);
        const orders = response.data;

        let completed = 0;
        let failed = 0;
        let pending = 0;
        let revenue = 0; // Initialize revenue

        orders.forEach((order: any) => {
          if (order.orderStatus === 'Completed') completed++;
          else if (order.orderStatus === 'Cancelled') failed++;
          else pending++;

          revenue += order.amount || 0; // Sum up the amount for each order
        });

        setTotalOrders(orders.length);
        setCompletedOrders(completed);
        setFailedOrders(failed);
        setPendingOrders(pending);
        setTotalRevenue(revenue); // Set the total revenue
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
        backgroundColor: ['#4CAF50', '#FF5252', '#FFC107'],
        hoverBackgroundColor: ['#45A049', '#FF4444', '#FFB300'],
      },
    ],
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.lg" mt={6} p={4}>
        <Heading as="h1" size="2xl" mb={4} textAlign="center" color="teal.600">
          Tailor Reports Dashboard
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={8}>
          <Box bg="white" p={6} rounded="md" shadow="md" textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="teal.500">Total Orders</Text>
            <Text fontSize="2xl" fontWeight="bold" mt={2}>{totalOrders}</Text>
          </Box>
          <Box bg="white" p={6} rounded="md" shadow="md" textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="teal.500">Completed Orders</Text>
            <Text fontSize="2xl" fontWeight="bold" mt={2}>{completedOrders}</Text>
          </Box>
          <Box bg="white" p={6} rounded="md" shadow="md" textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="teal.500">Failed Orders</Text>
            <Text fontSize="2xl" fontWeight="bold" mt={2}>{failedOrders}</Text>
          </Box>
          <Box bg="white" p={6} rounded="md" shadow="md" textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="teal.500">Pending Orders</Text>
            <Text fontSize="2xl" fontWeight="bold" mt={2}>{pendingOrders}</Text>
          </Box>
        </SimpleGrid>

        <Box bg="white" p={6} rounded="md" shadow="md" mb={8}>
          <Heading as="h2" size="lg" mb={4} color="teal.500">
             Revenue Analysis
          </Heading>
          <Text fontSize="2xl" fontWeight="bold" color="teal.600">{totalRevenue.toFixed(2)}</Text>
        </Box>

        <Box bg="white" p={6} rounded="md" shadow="md">
          <Heading as="h2" size="lg" mb={4} color="teal.500">
            Orders Distribution
          </Heading>
          <Box width="300px" height="300px" mx="auto">
            <Pie data={pieData} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TailorReportsPage;

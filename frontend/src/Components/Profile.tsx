// src/Components/TailorProfile.tsx
import React from 'react';
import { Box, Text, Stack, HStack, VStack, Button } from '@chakra-ui/react';
import { Radio, RadioGroup } from "../Components/ui/radio"

interface Location {
  latitude: number;
  longitude: number;
}

interface Dress {
  name: string;
  price: number;
}

interface TailorProfileProps {
  name: string;
  shopName: string;
  location: Location;
  email: string;
  phone: string;
  revenue: number;
  ordersCount: number;
  completed: number;
  status: string;
  isDelivery: string;
  dress: Dress[];
  firebaseUid: string;
  role: string;
}

const TailorProfile: React.FC<TailorProfileProps> = ({
  name,
  shopName,
  location,
  email,
  phone,
  revenue,
  ordersCount,
  completed,
  status,
  isDelivery,
  dress,
  firebaseUid,
  role,
}) => {
  return (
    <Box maxW="800px" mx="auto" p={6} bg="white" boxShadow="lg" borderRadius="8px">
      <Text fontSize="2xl" fontWeight="bold" mb="6">Tailor Profile</Text>
      
      <VStack align="start" spacing={4}>
        {/* Tailor Name and Shop Name */}
        <HStack spacing={4}>
          <Text fontWeight="bold">Name:</Text>
          <Text>{name}</Text>
        </HStack>

        <HStack spacing={4}>
          <Text fontWeight="bold">Shop Name:</Text>
          <Text>{shopName}</Text>
        </HStack>

        {/* Tailor Contact Information */}
        <HStack spacing={4}>
          <Text fontWeight="bold">Email:</Text>
          <Text>{email}</Text>
        </HStack>

        <HStack spacing={4}>
          <Text fontWeight="bold">Phone:</Text>
          <Text>{phone}</Text>
        </HStack>

        

        <HStack spacing={4}>
          <Text fontWeight="bold">Status:</Text>
            <RadioGroup value={status} >
              <HStack gap="6">
                <Radio value="open">Open</Radio>
                <Radio value="closed">Closed</Radio>
              </HStack>
            </RadioGroup>
        </HStack>

        <HStack spacing={4}>
          <Text fontWeight="bold">Delivery Option:</Text>
          <RadioGroup value={isDelivery} >
              <HStack gap="6">
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
        </HStack>

        {/* List of Dresses */}
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Dress Options and Prices:</Text>
          {dress.map((item, index) => (
            <HStack key={index} spacing={4}>
              <Text fontWeight="bold">{item.name}:</Text>
              <Text>{`${item.price.toFixed(2)}`}</Text>
            </HStack>
          ))}
        </VStack>

        {/* Edit Profile Button */}
        <Button colorScheme="blue" mt="4">Edit Profile</Button>
      </VStack>
    </Box>
  );
};

export default TailorProfile;

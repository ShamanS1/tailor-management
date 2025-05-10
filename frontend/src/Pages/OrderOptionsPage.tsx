// src/Pages/OrderOptionsPage.tsx
import React, { useState } from 'react';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { Checkbox } from "../Components/ui/checkbox"; // Import custom Checkbox component
import { useNavigate } from 'react-router-dom';

const OrderOptionsPage: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [acceptAll, setAcceptAll] = useState(false);
  const navigate = useNavigate();

  // Updated order options including women's items
  const orderOptions = [
    "Shirts", 
    "Pants", 
    "Kurta",
    "Palazzo Pants",
    "Sherwani",
    "Suits", 
    "Blazers",
    "Salwaar Kammez",
    "Skirts", 
    "Lehengas",
    "Anarkali Suits",
    "Tops",  
    
  ];

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleAcceptAllChange = (e: { checked: boolean }) => {
    setAcceptAll(!!e.checked);
    setSelectedOptions(e.checked ? orderOptions : []);
  };

  const handleRegisterClick = () => {
    alert("Registered with options: " + selectedOptions.join(", "));
    navigate('/');
  };

  return (
    <>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="linear-gradient(to right, #a8e6cf, #dcedc1)" // Green gradient background
      padding="20px"
    >
      <Box
        maxW="500px"
        p={6}
        bg="white"
        boxShadow="md"
        borderRadius="10px"
        textAlign="center"
      >
        <Text
          as="h2"
          fontSize="24px"
          fontWeight="bold"
          mb="24px"
          fontFamily="Poppins"
          color="#38a169" // Green color for the title
        >
          What orders do you take?
        </Text>
        <Stack mb="20px">
          {orderOptions.map((option) => (
            <Checkbox
              key={option}
              checked={selectedOptions.includes(option)}
              onCheckedChange={() => handleOptionChange(option)}
              fontSize="lg"
              fontFamily="Poppins"
              colorScheme="green" // Green color for checkboxes
            >
              {option}
            </Checkbox>
          ))}
        </Stack>
        <Checkbox
          checked={acceptAll}
          onCheckedChange={handleAcceptAllChange}
          fontSize="md"
          fontFamily="Poppins"
          colorScheme="green" // Green color for "I accept all orders" checkbox
          mb="16px"
        >
          I accept all orders
        </Checkbox>
        <Button
          bg="#38a169" // Green button background
          color="white"
          _hover={{ bg: "#2f855a" }} // Darker green on hover
          size="lg"
          w="full"
          fontFamily="Poppins"
          onClick={handleRegisterClick}
          disabled={!selectedOptions.length && !acceptAll}
        >
          Register
        </Button>
      </Box>
    </Box>
    </>
    
  );
};

export default OrderOptionsPage;

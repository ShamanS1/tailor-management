// src/Pages/RegistrationTailorOrderPage.tsx
import React, { useState } from 'react';
import { Input, Button, Box, Stack, Text, HStack } from '@chakra-ui/react';
import { Field } from '../Components/ui/field';
import { PasswordInput } from '../Components/ui/password-input';
import { Checkbox } from '../Components/ui/checkbox';
import { Radio, RadioGroup } from "../Components/ui/radio";
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import axios from 'axios';
import Map from '../map/Map'; // Import the Map component
import MapCard from '../Components/MapCard';

const RegistrationTailorOrderPage: React.FC = () => {
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [priceMap, setPriceMap] = useState<{ [key: string]: string }>({});
  const [isDelivery, setIsDelivery] = useState('No');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  };

  const handleRegister = async () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};
  
    if (!name) newErrors.name = "Please enter your name.";
    if (!email) newErrors.email = "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address.";
    if (!phone) newErrors.phone = "Please enter your phone number.";
    if (!/^\d{10}$/.test(phone)) newErrors.phone = "Please enter a valid phone number (10 digits).";
    if (!shopName) newErrors.shopName = "Please enter your shop name.";
    if (!password) newErrors.password = "Please create a password.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters long.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!currentLocation) {
      alert("Please select your location on the map.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const dressData = selectedOptions.map(option => ({
        name: option,
        price: Number(priceMap[option]), // convert to number
      }));
      
      const tailorData = {
        name,
        shopName,
        email,
        phone,
        password,
        isDelivery: isDelivery === "Yes", // convert to boolean
        dress: dressData,
        role: "tailor",
        completed: 0,
        revenue: 0,
        ordersCount: 1,
        status: "pending",
        firebaseUid: user.uid,
        location: currentLocation || undefined, // Avoid sending null
      };
      
      const tailort = {
        firebaseUid: user.uid,
        name,
        role: "tailor"
      };
  console.log(tailorData);
      // Send location along with the rest of the data
      await axios.post('http://localhost:5010/api/tailor', tailorData);
      await axios.post('http://localhost:5010/api/user', tailort);
      
      alert('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Error registering tailor:', error);
      alert('Registration failed. Please try again.');
    }
  };
  

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handlePriceChange = (option: string, value: string) => {
    setPriceMap(prev => ({ ...prev, [option]: value }));
  };

  const orderOptions = [
    "Shirts", "Pants", "Kurta", "Palazzo Pants", "Sherwani", "Suits", 
    "Blazers", "Salwaar Kameez", "Skirts", "Lehengas", "Anarkali Suits", "Tops",
  ];

  const handleLocationChange = (lat: number, lng: number) => {
    setCurrentLocation({ latitude: lat, longitude: lng });
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bg="linear-gradient(to right, #a8e6cf, #dcedc1)" padding="20px">
        <Box maxW="500px" p={6} bg="white" boxShadow="md" borderRadius="10px" textAlign="center">
          <Text as="h2" className="card-title">Register As Tailor</Text>
          <Text mb="20px" fontFamily="Poppins" fontSize="16px" color="gray.600">Create your tailor account by filling out the details below.</Text>
          <Stack mb="20px">
            <Field label="Tailor Name">
              <Input placeholder="Enter your name" value={name} onChange={(e) => setUsername(e.target.value)} isInvalid={!!errors.name} />
              {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
            </Field>
            <Field label="Email">
              <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} isInvalid={!!errors.email} />
              {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
            </Field>
            <Field label="Phone Number">
              <Input type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} isInvalid={!!errors.phone} />
              {errors.phone && <Text color="red.500" fontSize="sm">{errors.phone}</Text>}
            </Field>
            <Field label="Shop Name">
              <Input placeholder="Enter your Shop name" value={shopName} onChange={(e) => setShopName(e.target.value)} isInvalid={!!errors.shopName} />
              {errors.shopName && <Text color="red.500" fontSize="sm">{errors.shopName}</Text>}
            </Field>
            <Field label="Password">
              <PasswordInput placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} isInvalid={!!errors.password} />
              {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
            </Field>
            <Field label="Confirm Password">
              <PasswordInput placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} isInvalid={!!errors.confirmPassword} />
              {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>}
            </Field>
            <Field label="Do you deliver/take orders">
              <RadioGroup value={isDelivery} onValueChange={(e) => setIsDelivery(e.value)}>
                <HStack gap="6">
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </HStack>
              </RadioGroup>
            </Field>
          </Stack>

          <Text as="h3" fontSize="20px" fontWeight="bold" mb="16px" fontFamily="Poppins" color="black">What orders do you take?</Text>
          <Stack mb="20px">
            {orderOptions.map((option) => (
              <Checkbox key={option} checked={selectedOptions.includes(option)} onChange={() => handleOptionChange(option)} fontSize="lg" fontFamily="Poppins" colorScheme="green">{option}</Checkbox>
            ))}
          </Stack>
          {selectedOptions.map((option) => (
            <Field key={option} label={`Price for ${option}`}>
              <Input type="number" placeholder="Enter price" value={priceMap[option] || ''} onChange={(e) => handlePriceChange(option, e.target.value)} />
            </Field>
          ))}

          {/* Card for Map Preview */}
          <Box border="1px solid #ccc" p="16px" borderRadius="8px" mb="20px">
            <Text as="h4" fontSize="18px" mb="10px" fontFamily="Poppins" color="black">Location Preview</Text>
            <Box style={{ height: '300px', width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
            <MapCard onLocationSelect={handleLocationChange} />
            </Box>
            {/* <Text mt="10px" fontSize="16px" color="gray.600">Latitude: {currentLocation?.latitude}</Text>
            <Text fontSize="16px" color="gray.600">Longitude: {currentLocation?.longitude}</Text> */}
          </Box>

          <Button mt={4} colorScheme="teal" onClick={handleRegister}>Continue</Button>
          <Button mt={4} ml={4} variant="outline" onClick={handleCancel}>Cancel</Button>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default RegistrationTailorOrderPage;

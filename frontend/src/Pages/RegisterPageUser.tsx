// src/Pages/RegistrationPageUser.tsx
import React, { useState } from 'react';
import { Input, Button, Box, Stack, Text } from '@chakra-ui/react';
import { Field } from '../Components/ui/field';
import { PasswordInput } from "../Components/ui/password-input";
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import axios from 'axios';

const RegistrationPageUser: React.FC = () => {
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  };

  const handleRegister = async () => {
    // Reset errors
    setErrors({});
    
    // Validation logic
    const newErrors: { [key: string]: string } = {};
    
    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!name) newErrors.name = "Please enter your username.";
    else if (name.length < 3) newErrors.name = "Username must be at least 3 characters long.";
    else if (!usernameRegex.test(name)) newErrors.name = "Username can only contain letters, numbers, and underscores.";
  
    // Email validation
    if (!email) newErrors.email = "Please enter your email.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address.";
    
    // Phone validation
    if (!phone) newErrors.phone = "Please enter your phone number.";
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = "Please enter a valid phone number (10 digits).";
    
    // Password validation
    if (!password) newErrors.password = "Please create a password.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters long.";
    
    // Confirm password validation
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
  
    // If errors exist, update state and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Prepare data for Firestore
      const userData = {
        name,
        email,
        phone,
        password,
        role: "customer", // Assigning role as customer
        firebaseUid: user.uid, // Store Firebase UID for reference
      };
      
      const useru = {
        firebaseUid: user.uid,
        name,
        role: "customer",
      }
      // await setDoc(doc(db, 'customer', user.uid), userData);
  
      await axios.post('http://localhost:5010/api/customer', userData);
      await axios.post('http://localhost:5010/api/user', useru);
      
      alert('Registration successful!');
      navigate('/'); 
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed. Please try again.');
    }
  };
  

  return (
    <>
      <div className="login-container" style={{ 
        
        padding: '20px', 
        minHeight: '100vh' 
      }}>
        <Box className="card-root" bg="white" boxShadow="lg" borderRadius="md" p={6}>
          <div className="card-header">
            <Text as="h2" className="card-title">Register</Text>
            <Text className="card-description">Create your account by filling out the details below.</Text>
          </div>
          <div className="card-body">
            <Stack spacing={4}>
              <Field label="Username">
                <Input
                  className="input-field"
                  placeholder="Choose a username"
                  value={name}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!errors.name}
                />
                {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
              </Field>
              <Field label="Email">
                <Input
                  className="input-field"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                />
                {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
              </Field>
              <Field label="Phone Number">
                <Input
                  className="input-field"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  isInvalid={!!errors.phone}
                />
                {errors.phone && <Text color="red.500" fontSize="sm">{errors.phone}</Text>}
              </Field>
              <Field label="Password">
                <PasswordInput
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                />
                {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
              </Field>
              <Field label="Confirm Password">
                <PasswordInput
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>}
              </Field>
            </Stack>
          </div>
          <div className="card-footer">
            <Button rounded="md" onClick={handleRegister}>Continue</Button>
            <Button rounded="md" variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </Box>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationPageUser;

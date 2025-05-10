// src/LoginPage.tsx
import React, { useState } from 'react';
import { Input, Button, Box, Stack, Text } from '@chakra-ui/react';
import { Field } from '../Components/ui/field';
import { PasswordInput } from "../Components/ui/password-input";
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { auth } from '../firebase'; // Ensure you have db imported
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useUserContext } from '../UserContext'; // Import your custom hook

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const { setUser } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCancel = () => {
    navigate('/');
  };

  const handleSignIn = async () => {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      

      const userDoc = await axios.get(`http://localhost:5010/api/user/${user.uid}`);
      
      if (userDoc) {
        const role = userDoc.data.role;
        
        if (role === 'tailor') {
          setUser(userDoc.data);
          navigate('/tailorhome');
        } else if (role === 'customer') {
          setUser(userDoc.data);
          navigate('/customerhome');
        } else if (role === 'admin') {
          setUser(userDoc.data);
          navigate('/adminhome');
        }
        else {
          setError('Unknown user role');
        }
      } else {
        setError('User data not found');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to sign in. Please check your email and password.');
    }
  };

  return (
    <>
      <div className="login-container">
        <Box className="card-root">
          <div className="card-header">
            <Text as="h2" className="card-title">Sign In</Text>
            <Text className="card-description">Please enter your credentials below.</Text>
          </div>
          <div className="card-body">
            <Stack>
              <Field label="Email">
                <Input
                  className="input-field"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Password">
                <PasswordInput
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              {error && <Text color="red.500">{error}</Text>}
            </Stack>
          </div>
          <div className="card-footer">
            <Button rounded="md" onClick={handleSignIn}>Sign In</Button>
            <Button rounded="md" onClick={handleCancel}>Cancel</Button>
          </div>
        </Box>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;

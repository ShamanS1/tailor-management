// src/Components/TopBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, HStack, Button } from '@chakra-ui/react';
import {MenuContent, MenuItem, MenuRoot, MenuTrigger,} from "../Components/ui/menu";
import { Tooltip } from "../Components/ui/tooltip";

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegisterUser = () => {
    navigate('/registerUser'); // Adjust as necessary
  };

  const handleRegisterTailor = () => {
    navigate('/registerTailor'); // Adjust the route as needed
  };

  return (
    <Box as="header" display="flex" justifyContent="space-between" alignItems="center" padding="1rem" bg="teal.500" color="white">
      <Heading as="h2" fontFamily="Newsreader" fontSize="2rem">TAILORNEST</Heading>
      
      <HStack>
        <Tooltip content="Click here to Login">
          <Button colorScheme="teal" marginRight="1rem" onClick={handleLogin}>Login</Button>
        </Tooltip>
        <Tooltip content="Click here to Register">
          <MenuRoot >
            <MenuTrigger asChild>
              <Button colorScheme="teal" marginRight="1rem">
                Register As
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem onClick={handleRegisterUser}>User</MenuItem>
              <MenuItem onClick={handleRegisterTailor}>Tailor</MenuItem>
            </MenuContent>
          </MenuRoot>
        </Tooltip>
      </HStack>
    </Box>
  );
};

export default TopBar;

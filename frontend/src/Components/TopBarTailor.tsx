import React, { useEffect, useState } from 'react';
import { Stack, Flex, Heading, HStack, Button, Text, Circle, Float, Avatar } from "@chakra-ui/react"
import { useUserContext } from '../UserContext';
import axios from 'axios';
import {MenuContent, MenuItem, MenuRoot, MenuTrigger,} from "../Components/ui/menu";
import { useNavigate } from 'react-router-dom';


 interface Dress {
  name: string;
  price: number;
}

interface TailorData  {
  name: string;
  shopName: string;
  location: string; 
  email: string;
  phone: string;
  revenue: number;
  ordersCount: number;
  completed: number;
  password: string;
  status: string;
  isDelivery: string;
  dress: Dress[]; 
  firebaseUid: string;
  role: string;

}

const TopBar: React.FC = () => {
  const { user, logout } = useUserContext();
  const [tailorData, setTailorData] = useState<TailorData | null>(null);

  const navigate = useNavigate();

  const handleLogout=() => {
    logout();
    navigate('/');
  }

  useEffect(() => {
    const fetchTailorData = async () => {
      if (user?.firebaseUid) {
        try {
          const res = await axios.get(`http://localhost:5010/api/tailor/uid/${user?.firebaseUid}`);
          setTailorData(res.data[0]);
        } catch (error) {
          console.error('Error fetching tailor data:', error);
        }
      }
    };

    fetchTailorData();
  }, [user?.firebaseUid]);

  const statusColor = tailorData?.status === 'open' ? 'green.500' : 'red.500';

  return (
    <Flex as="header" padding="1rem" bg="teal.500" color="white" justifyContent="space-between">
      <Heading as="h2" fontFamily="Newsreader" fontSize="2rem">TAILORNEST</Heading>
      <HStack spacing={4}>
        <Button variant="link" color="black">Home</Button>
        <Button variant="link" color="black">Reports</Button>
        <MenuRoot >
            <MenuTrigger asChild>
            <Avatar.Root colorPalette="green" variant="subtle">
            <Float placement="bottom-end" offsetX="1" offsetY="1">
              <Circle
                bg={statusColor}
                size="8px"
                outline="0.2em solid"
                outlineColor="bg"
              />
            </Float>
        </Avatar.Root>
            </MenuTrigger>
            <MenuContent>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuContent>
          </MenuRoot>
        
          
        
        <Stack gap="0">
          <Text fontWeight="medium">{tailorData?.name || user?.name}</Text>
          <Text color="fg.muted" textStyle="sm">
            {tailorData?.shopName || 'Shop name not available'}
          </Text>
        </Stack>
      </HStack>
    </Flex>
  );
};

export default TopBar;

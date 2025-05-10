// src/Components/SearchBar.tsx
import React from 'react';
import { Input, Box, Flex, IconButton } from '@chakra-ui/react';
import { LuSearch } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {

  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/shops');
  };

  return(
    <Box margin="1rem">
      <Flex>
        <Input
          placeholder="Find tailors near me"
          size="lg"
          bg="white"
          borderRadius="full"
          shadow="sm"
          _hover={{ bg: "gray.50" }}
          flex="1" // This makes the input take available space
        />
        <IconButton 
          size="lg" 
          aria-label="Search database" 
          variant="subtle"  
          onClick={handleSearch}
          rounded="full"
        >
          <LuSearch />
        </IconButton>
      </Flex>
    </Box>
  );

}

export default SearchBar;

// src/Components/SearchBar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { motion } from 'framer-motion';

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    navigate('/shops', { state: { query: searchQuery } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="m-4">
      {/* <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center bg-white rounded-full shadow-sm overflow-hidden transition-all duration-300 ${
          isFocused ? 'shadow-md ring-2 ring-indigo-300' : 'hover:shadow'
        }`}
      >
        <input
          type="text"
          placeholder="Find tailors near me"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="w-full py-3 px-6 outline-none text-gray-700 placeholder-gray-400"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          className="flex items-center justify-center h-12 w-12 bg-indigo-500 text-white rounded-full mr-1 transition-colors hover:bg-indigo-600"
          aria-label="Search"
        >
          <LuSearch className="h-5 w-5" />
        </motion.button>
      </motion.div> */}
    </div>
  );
};

export default SearchBar;

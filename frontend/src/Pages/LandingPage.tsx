import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Button, Stack, Link, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import TopBar from '../Components/TopBar';
import SearchBar from '../Components/SearchBar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

// Variants for Framer Motion
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
    window.scrollTo(0, 0);
  };
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const targetCount = 1000;
    const duration = 2000;
    const intervalTime = 20;
    const totalSteps = duration / intervalTime;
    const increment = Math.ceil(targetCount / totalSteps);
    let currentCount = 0;

    const interval = setInterval(() => {
      if (isMounted && currentCount < targetCount) {
        currentCount += increment;
        if (currentCount > targetCount) currentCount = targetCount;
        setCount(currentCount);
      } else {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Box className="landing-page" bgGradient="linear(to-r, #f4f4f4, #e9e9e9)">
      <TopBar />
      <SearchBar />

      {/* Enhanced Welcome Box */}
<Box
  className="welcome-box"
  textAlign="center"
  padding="3rem 2rem"
  borderRadius="lg"
  boxShadow="lg"
  bg="white"
  mx="auto"
  maxW="800px"
  mt="10"
  transition="transform 0.3s ease, box-shadow 0.3s ease"
  _hover={{ transform: 'scale(1.02)', boxShadow: '2xl' }}
  fontFamily="'Playfair Display', serif"
>
  <Heading as="h2" fontSize="3xl" color="#2d3748" mb="4" letterSpacing="wide">
    Welcome to TailorNest!
  </Heading>
  <Text fontSize="lg" fontFamily="Poppins" mt="2" color="#444" maxW="600px" mx="auto" fontWeight="medium">
    Where every stitch tells a story, and each creation is crafted with precision.
  </Text>
  <Text fontSize="lg" fontFamily="sans-serif" mt="6" mx="auto" lineHeight="1.8" >
    At TailorNest, we connect skilled artisans with individuals who value quality and personalization. Whether you're
    here to find a talented tailor or showcase your craftsmanship, our goal is to make your journey seamless and
    rewarding.
  </Text>
  <Box
    as="div"
    mt="10"
    fontSize="larger"
    color="#4a5568"
    fontFamily="'Poppins', sans-serif"
    fontWeight="bold"
    padding="0.5rem 1rem"
    borderRadius="md"
    bg="#e6f5e9"
    display="inline-block"
    transition="background-color 0.3s ease, transform 0.2s ease"
    _hover={{ bg: '#cce7dc', transform: 'translateY(-3px)' }}
  >
    {count}+ Registered Tailors
  </Box>
</Box>


      {/* Information Boxes */}
      <Flex
        className="info-boxes"
        justifyContent="space-around"
        mt="10"
        wrap="wrap"
        maxW="1000px"
        mx="auto"
        gap="8"
      >
        {[
          { title: 'About Us', text: 'Learn more about our mission and values, and what drives us to create.', id: 'about-us' },
          { title: 'What We Do', text: 'Discover the tailored services we offer to bring you the best experience.', id: 'what-we-do' },
          { title: 'Our Story', text: 'Read about our journey from humble beginnings to a thriving community.', id: 'our-story' },
        ].map((box, index) => (
          <Box
            key={index}
            className="info-box"
            p="8"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="xl"
            bg="#f3f3f3"
            transition="transform 0.3s ease, background-color 0.3s ease"
            _hover={{ transform: 'translateY(-5px)', bg: '#ececec' }}
            maxW="320px"
            textAlign="center"
            cursor="pointer"
            fontFamily="'Poppins', sans-serif"
            onClick={() => {
              const section = document.getElementById(box.id);
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Heading as="h3" fontSize="2xl" color="#3b82f6" mb="4">
              {box.title}
            </Heading>
            <Text fontSize="md" color="#666">
              {box.text}
            </Text>
          </Box>
        ))}
      </Flex>

      {/* About Us Section */}
      <Box id="about-us" height={'vh'} bg="#e6f5e9" color="black" pt="10rem" pb="10rem" textAlign="center">
        <Box as={motion.div} variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.5 }} maxW="700px" mx="auto" mb="6">
          <Heading as="h2" fontSize="5xl" mb="6" fontFamily="'Playfair Display', serif" color="#2d3748" mt={10}>
            About Us
          </Heading>
          <Text fontSize="larger" fontFamily="Poppins" mb="4" mt={'20'}>
            At TailorNest, we are passionate about connecting skilled artisans with those seeking personalized clothing
            solutions. Our community values creativity, craftsmanship, and the unique stories woven into every piece.
          </Text>
          <Text fontSize="larger" fontFamily="Poppins">
            Our journey began with a vision to create a platform where tailors and clients can collaborate effortlessly,
            ensuring that every garment is a true reflection of individual style and identity.
          </Text>
        </Box>
      </Box>

      {/* What We Do Section */}
      <Box id="what-we-do" height={'vh'} bg="#daf7f5" color="black" pt="10rem" pb="10rem" textAlign="center">
        <Box as={motion.div} variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.5 }} maxW="700px" mx="auto" mb="6">
          <Heading as="h2" fontSize="5xl" mb="6" fontFamily="'Playfair Display', serif" color="#2d3748" mt={10}>
            What We Do
          </Heading>
          <Text fontSize="larger" fontFamily="Poppins" mb="4" mt={'20'}>
            We provide a range of tailoring services including custom clothing design, alterations, and styling
            consultations. Our expert tailors are dedicated to crafting garments that not only fit perfectly but also
            reflect your personal style.
          </Text>
          <Text fontSize="larger" fontFamily="Poppins">
            Whether it's a wedding dress, a business suit, or casual wear, we ensure that each piece is made with
            precision and care.
          </Text>
        </Box>
      </Box>

      {/* Our Story Section */}
      <Box id="our-story" height={'vh'} bg="#e0e4f7" color="black" pt="10rem" pb="10rem" textAlign="center">
        <Box as={motion.div} variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.5 }} maxW="700px" mx="auto" mb="6">
          <Heading as="h2" fontSize="5xl" mb="6" fontFamily="'Playfair Display', serif" color="#2d3748">
            Our Story
          </Heading>
          <Text fontSize="larger" fontFamily="Poppins" mb="4" mt={'20'}>
            Our journey began in a small workshop, where our founders shared their love for fashion and tailoring. Over
            the years, we have grown into a thriving community of tailors and clients. Our story is one of resilience,
            creativity, and dedication to craftsmanship, and we are excited to continue this journey with you.
          </Text>
          <Text fontSize="larger" fontFamily="Poppins">
            Join us as we strive to create a platform that not only celebrates individuality but also fosters a sense of
            belonging within the tailoring community.
          </Text>
        </Box>
      </Box>

      {/* Call to Action Button */}
      <Stack direction="row" justify="center" mt="10">
        <Button
          size="2xl"
          width={'2/12'}
          colorScheme="blue"
          borderRadius="full"
          px="8"
          boxShadow="md"
          transition="transform 0.2s"
          _hover={{ transform: 'scale(1.05)' }}
          onClick={handleLogin}
        >
          Get Started
        </Button>
      </Stack>

      <Footer />
    </Box>
  );
};

export default LandingPage;

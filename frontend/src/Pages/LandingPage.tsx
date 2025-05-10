import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import TopBar from '../Components/TopBar';
import SearchBar from '../Components/SearchBar';
import Footer from '../Components/Footer';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  
  // Animation controls
  const controls = useAnimation();
  const aboutRef = useRef(null);
  const whatWeDoRef = useRef(null);
  const ourStoryRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
  const isWhatWeDoInView = useInView(whatWeDoRef, { once: false, amount: 0.3 });
  const isOurStoryInView = useInView(ourStoryRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isAboutInView) {
      controls.start('visible');
    }
  }, [controls, isAboutInView]);

  const handleLogin = () => {
    navigate('/login');
    window.scrollTo(0, 0);
  };

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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" // Changed from array to a valid string value
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
      <TopBar />
      <SearchBar />

      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20"></div>
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 font-serif"
          >
            Welcome to TailorNest
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-700 mb-8 font-light max-w-3xl mx-auto"
          >
            Where every stitch tells a story, and each creation is crafted with precision.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="inline-block text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {count}+ Registered Tailors
          </motion.div>
        </motion.div>
      </div>

      {/* Information Boxes */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto px-4 py-16"
      >
        {[
          { 
            title: 'About Us', 
            text: 'Learn more about our mission and values, and what drives us to create.', 
            id: 'about-us',
            color: 'from-blue-400 to-indigo-500',
            icon: '👋'
          },
          { 
            title: 'What We Do', 
            text: 'Discover the tailored services we offer to bring you the best experience.', 
            id: 'what-we-do',
            color: 'from-purple-400 to-pink-500',
            icon: '✂️'
          },
          { 
            title: 'Our Story', 
            text: 'Read about our journey from humble beginnings to a thriving community.', 
            id: 'our-story',
            color: 'from-amber-400 to-orange-500',
            icon: '📖'
          },
        ].map((box, index) => (
          <motion.div
            key={index}
            variants={scaleIn}
            whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            className="w-full sm:w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
            onClick={() => {
              const section = document.getElementById(box.id);
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <div className={`h-2 bg-gradient-to-r ${box.color}`}></div>
            <div className="p-8">
              <div className="text-4xl mb-4">{box.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">{box.title}</h3>
              <p className="text-gray-600">{box.text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* About Us Section */}
      <div id="about-us" ref={aboutRef} className="py-24 bg-gradient-to-b from-blue-50 to-indigo-100">
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate={isAboutInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isAboutInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-8 p-2 rounded-full bg-blue-100"
          >
            <span className="text-4xl">🧵</span>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-5xl font-bold mb-8 text-gray-800 font-serif"
          >
            About Us
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-700 mb-6 leading-relaxed"
          >
            At TailorNest, we are passionate about connecting skilled artisans with those seeking personalized clothing
            solutions. Our community values creativity, craftsmanship, and the unique stories woven into every piece.
          </motion.p>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-700 leading-relaxed"
          >
            Our journey began with a vision to create a platform where tailors and clients can collaborate effortlessly,
            ensuring that every garment is a true reflection of individual style and identity.
          </motion.p>
        </motion.div>
      </div>

      {/* What We Do Section */}
      <div id="what-we-do" ref={whatWeDoRef} className="py-24 bg-gradient-to-b from-purple-50 to-pink-100">
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate={isWhatWeDoInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isWhatWeDoInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-8 p-2 rounded-full bg-purple-100"
          >
            <span className="text-4xl">👔</span>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-5xl font-bold mb-8 text-gray-800 font-serif"
          >
            What We Do
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-700 mb-6 leading-relaxed"
          >
            We provide a range of tailoring services including custom clothing design, alterations, and styling
            consultations. Our expert tailors are dedicated to crafting garments that not only fit perfectly but also
            reflect your personal style.
          </motion.p>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-700 leading-relaxed"
          >
            Whether it's a wedding dress, a business suit, or casual wear, we ensure that each piece is made with
            precision and care.
          </motion.p>
        </motion.div>
      </div>

      {/* Our Story Section */}
      <div id="our-story" ref={ourStoryRef} className="py-24 bg-gradient-to-b from-amber-50 to-orange-100">
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate={isOurStoryInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isOurStoryInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-8 p-2 rounded-full bg-amber-100"
          >
            <span className="text-4xl">📚</span>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-5xl font-bold mb-8 text-gray-800 font-serif"
          >
            Our Story
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-700 mb-6 leading-relaxed"
          >
            Our journey began in a small workshop, where our founders shared their love for fashion and tailoring. Over
            the years, we have grown into a thriving community of tailors and clients. Our story is one of resilience,
            creativity, and dedication to craftsmanship, and we are excited to continue this journey with you.
          </motion.p>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-700 leading-relaxed"
          >
            Join us as we strive to create a platform that not only celebrates individuality but also fosters a sense of
            belonging within the tailoring community.
          </motion.p>
        </motion.div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-8"
          >
            Ready to get started?
          </motion.h2>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="bg-white text-indigo-600 text-xl font-bold py-4 px-10 rounded-full shadow-lg"
          >
            Get Started
          </motion.button>
        </div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="fixed top-1/4 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 opacity-20 animate-float"></div>
      <div className="fixed top-1/3 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 animate-float animation-delay-2000"></div>
      <div className="fixed bottom-1/4 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 animate-float animation-delay-4000"></div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default LandingPage;

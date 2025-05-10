// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPageUser from './Pages/RegisterPageUser';
import RegistrationPageTailor from './Pages/RegistrationPageTailor';
import { Provider } from './Components/ui/provider';
import TailorHome from './Pages/TailorHome';
import TailorReportsPage from './Pages/TailorReportsPage';
import DressList from './Components/DressList';
import ShopListPage from './Pages/ShopListPage';
import ShopDetailsPage from './Pages/ShopDetailsPage';
import CustomerHomePage from './Pages/CustomerHomePage';
import AdminHomePage from './Pages/AdminHomePage';
import ProtectedRoute from './ProtectedRoute';



const App: React.FC = () => {
  
  return (
    <Provider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registerUser" element={<RegisterPageUser />} />
          <Route path="/registerTailor" element={<RegistrationPageTailor />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute role="customer" />}>

            {/* Customer-only pages */}
            <Route path="/customerhome" element={<CustomerHomePage />} />
            <Route path="/shops/:dress" element={<ShopListPage />} />
            <Route path="/shop/:dress/:firebaseUidt" element={<ShopDetailsPage />} />
            <Route path="/dresslist" element={<DressList />} />
          </Route>

          <Route element={<ProtectedRoute role="tailor" />}>
            {/* Tailor-only pages */}
            <Route path="/tailorhome" element={<TailorHome />} />
            <Route path="/tailorreports" element={<TailorReportsPage />} />
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            {/* Admin-only page */}
            <Route path="/adminhome" element={<AdminHomePage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;




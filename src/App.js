import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Studios from './pages/Studios';
import CreateListing from './pages/CreateListing';
import BookStudio from './pages/BookStudio';
import Basket from './pages/Basket'; 
import Home from './components/Home';
import StudioDetail from './components/StudioDetail'; 

export const AuthContext = React.createContext();

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        setAuth({ token, user: JSON.parse(user) });
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setAuth(null);
    window.location.href = '/auth'; 
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, handleLogout }}>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* 1. MAIN PAGES */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* 2. STUDIO PAGES */}
            <Route path="/studios" element={<Studios />} />
            <Route path="/studio/:id" element={<StudioDetail />} />
            
            {/* 3. MARKETPLACE & BOOKING */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/book-studio" element={<BookStudio />} />
            <Route path="/basket" element={<Basket />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
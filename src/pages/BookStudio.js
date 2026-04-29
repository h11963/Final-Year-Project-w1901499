import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BookStudio = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const studio = location.state?.studio;

  const [formData, setFormData] = useState({
    date: '',
    phone: '',
    userName: auth?.user?.name || '' 
  });

  useEffect(() => {
    if (!studio || !studio._id) {
      alert("No studio selected. Redirecting...");
      navigate('/studios');
    }
  }, [studio, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth?.user) {
      alert("Please log in to book a studio.");
      return;
    }

    const bookingData = {
      userId: auth.user._id,        // ID of the person booking
      userName: formData.userName,  // Name of the person booking
      phone: formData.phone,
      studio: studio._id,           // The Studio ID
      studioName: studio.name, 
      date: formData.date,
      status: "Pending",
      
      // --- THE CRITICAL FIXES FOR YOUR DASHBOARD ---
      ownerId: studio.owner,        // ID of the Studio Owner
      studioOwner: studio.ownerName // Name of the Studio Owner
    };

    try {
      await axios.post('http://localhost:5005/api/bookings', bookingData);
      alert("🚀 Booking Request Sent! Redirecting to Dashboard...");
      navigate('/dashboard');
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err.message);
      alert("Booking failed. Check console for details.");
    }
  };

  if (!studio) return null;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 p-4">
            <h2 className="text-center mb-4">Book {studio.name}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Your Name</label>
                <input type="text" className="form-control" value={formData.userName} onChange={(e) => setFormData({...formData, userName: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Phone Number</label>
                <input type="tel" className="form-control" placeholder="07xxx xxxxxx" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Select Date</label>
                <input type="date" className="form-control" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-primary w-100 btn-lg shadow-sm">Confirm Booking Request</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookStudio;
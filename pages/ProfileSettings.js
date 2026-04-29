import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const ProfileSettings = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    newPassword: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  // This ensures the form updates when the user data finally loads
  useEffect(() => {
    if (auth?.user) {
      setFormData({
        email: auth.user.email || '',
        phone: auth.user.phone || '',
        newPassword: ''
      });
    }
  }, [auth]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userId = auth?.user?.id || auth?.user?._id || JSON.parse(localStorage.getItem('user'))?.id;

    if (!userId) {
      setStatus({ type: 'danger', msg: 'User ID missing. Please log out and back in once.' });
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5005/api/auth/update/${userId}`, formData);

      setStatus({ type: 'success', msg: 'Profile updated successfully!' });
      
      const updatedUser = { 
        ...auth.user, 
        email: res.data.email, 
        phone: res.data.phone 
      };
      
      setAuth({ ...auth, user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setFormData(prev => ({ ...prev, newPassword: '' }));
    } catch (err) {
      setStatus({ type: 'danger', msg: 'Failed to update: ' + (err.response?.data?.msg || err.message) });
    }
  };

  const handleDeleteAccount = async () => {
    // 1. Find the ID (checking all possible locations)
    const userId = auth?.user?.id || auth?.user?._id || JSON.parse(localStorage.getItem('user'))?.id;

    if (!userId) {
      alert("Cannot delete: User ID is missing. Please log out and back in.");
      return;
    }

    const confirmed = window.confirm("ARE YOU SURE? This will permanently delete your account and all your data. This cannot be undone.");
    
    if (confirmed) {
      try {
        // 2. Send the delete request
        await axios.delete(`http://localhost:5005/api/auth/delete/${userId}`);
        
        alert("Account successfully deleted.");
        
        // 3. Clear everything and redirect
        localStorage.clear();
        window.location.href = '/register';
      } catch (err) {
        console.error("Delete Request Failed:", err.response?.data || err.message);
        alert("Error deleting account: " + (err.response?.data?.msg || "Server unreachable"));
      }
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h3 className="fw-bold mb-4">Manage Profile</h3>
      {status.msg && <div className={`alert alert-${status.type}`}>{status.msg}</div>}

      <form onSubmit={handleUpdate}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold small">Email Address</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold small">Phone Number</label>
            <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="e.g. +44 123 456" />
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label fw-bold small">Change Password</label>
          <input type="password" name="newPassword" className="form-control" placeholder="Enter new password (optional)" value={formData.newPassword} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary fw-bold">Save Changes</button>
      </form>

      <div className="mt-5 p-3 bg-light rounded border border-danger">
        <h6 className="text-danger fw-bold">Danger Zone</h6>
        <button className="btn btn-sm btn-outline-danger mt-2" onClick={handleDeleteAccount}>Delete My Account</button>
      </div>
    </div>
  );
};

export default ProfileSettings;


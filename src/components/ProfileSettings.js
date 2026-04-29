import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const ProfileSettings = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: auth.user.email || '',
    phone: auth.user.phone || '',
    password: '',
    newPassword: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5005/api/auth/update/${auth.user._id}`, formData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setStatus({ type: 'success', msg: 'Profile updated successfully!' });
      // Update local storage and context with new user data
      const updatedUser = { ...auth.user, email: formData.email, phone: formData.phone };
      setAuth({ ...auth, user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setStatus({ type: 'danger', msg: 'Failed to update profile.' });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("ARE YOU SURE? This will permanently delete your account and all your beats. This cannot be undone.");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5005/api/auth/delete/${auth.user._id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        alert("Account deleted.");
        localStorage.clear();
        window.location.href = '/register';
      } catch (err) {
        alert("Error deleting account.");
      }
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <h3 className="fw-bold mb-4">Manage Profile</h3>
      
      {status.msg && <div className={`alert alert-${status.type}`}>{status.msg}</div>}

      <form onSubmit={handleUpdate}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Phone Number</label>
            <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="e.g. +44 7123 456789" />
          </div>
        </div>

        <hr className="my-4" />
        <h5 className="fw-bold">Change Password</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">New Password</label>
            <input type="password" name="newPassword" className="form-control" placeholder="Leave blank to keep current" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary fw-bold px-4 mt-2">Save Changes</button>
      </form>

      <div className="mt-5 p-4 bg-light rounded border border-danger">
        <h5 className="text-danger fw-bold">Danger Zone</h5>
        <p className="small text-muted">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="btn btn-outline-danger btn-sm" onClick={handleDeleteAccount}>Delete My Account</button>
      </div>
    </div>
  );
};

export default ProfileSettings;
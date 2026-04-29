import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'artist' });
  const [message, setMessage] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Path matches your backend routes
    const endpoint = isLogin ? 'http://localhost:5005/api/auth/login' : 'http://localhost:5005/api/auth/register';
    
    try {
      const res = await axios.post(endpoint, formData);

      const { token, user } = res.data;

      const userData = user || {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };
      
      // 1. Save to LocalStorage so it persists if you refresh
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // 2. Update Global State
      setAuth({ token, user: userData });

      setMessage('Success! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', margin: 'auto' }}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label>Name</label>
              <input type="text" className="form-control" onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
          )}
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          
          <button className="btn btn-primary w-100">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button className="btn btn-link w-100 mt-2" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
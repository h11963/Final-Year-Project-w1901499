import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';

const CreateListing = () => {
  const { auth } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    type: 'Collaboration', 
    genre: 'Pop',
    price: 0, 
    image: 'https://placehold.co/400?text=Listing'
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // --- PROFESSIONAL LOCK UI ---
  if (!auth || !auth.user) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="card p-5 shadow-lg border-0 d-inline-block" style={{ maxWidth: '500px' }}>
          <div className="display-1 mb-3">🔒</div>
          <h2 className="fw-bold">Members Only</h2>
          <p className="text-muted">You must be logged in to share your projects or post beats to the marketplace.</p>
          <div className="mt-4 d-grid gap-2">
            
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

 const onSubmit = async (e) => {
  e.preventDefault();
  const myId = auth.user._id || auth.user.id;

  const data = new FormData();
  data.append('name', formData.name);
  data.append('price', formData.price);
  data.append('description', formData.description);
  data.append('genre', formData.genre);
  data.append('type', formData.type);
  data.append('artist', auth.user.name); // This is what you have now
  
  // THIS IS WHAT WAS MISSING:
  data.append('owner', myId); 
  data.append('user', myId);

  data.append('audioFile', selectedFile); 

  try {
    await axios.post('http://localhost:5005/api/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('Posted successfully!');
    window.location.href = '/dashboard';
  } catch (err) {
    console.error("Upload Error:", err);
  }
};

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg border-0" style={{maxWidth: '600px', margin: 'auto'}}>
        <h2 className="text-center mb-4 fw-bold">Monetise Your Music</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Project Title</label>
            <input type="text" className="form-control" onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
         
          <div className="mb-3">
            <label className="form-label fw-bold">Pitch</label>
            <textarea className="form-control" rows="3" onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold text-primary">🎵 Upload Audio</label>
            <input type="file" className="form-control" accept="audio/*" onChange={handleFileChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Price (£)</label>
            <input type="number" className="form-control" onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-success w-100 py-2 fw-bold">Post to Marketplace</button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
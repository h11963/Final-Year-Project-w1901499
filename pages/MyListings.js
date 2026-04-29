import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});


  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newGenre, setNewGenre] = useState('Pop');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const API_URL = 'http://localhost:5005/api/products';

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await axios.get(API_URL);
      setListings(res.data);
    } catch (err) { console.error(err); }
  };


  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!audioFile) return alert("Please select an audio file!");

    setIsUploading(true);
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('price', newPrice);
    formData.append('genre', newGenre);
    formData.append('audioFile', audioFile); 
    if (imageFile) formData.append('imageFile', imageFile); 

    try {
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Listing created successfully!");
      
      setNewName('');
      setNewPrice('');
      setAudioFile(null);
      setImageFile(null);
      fetchMyListings(); 
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setListings(listings.filter(item => item._id !== id));
      } catch (err) { alert("Delete failed"); }
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditData(item);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, editData);
      setEditingId(null);
      fetchMyListings();
      alert("Updated successfully!");
    } catch (err) { alert("Update failed"); }
  };

  return (
    <div className="container">
    
      <div className="card shadow-sm p-4 mt-4 mb-5">
        <h3 className="mb-4">Create New Beat Listing</h3>
        <form onSubmit={handleCreateListing}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Beat Name</label>
              <input className="form-control" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
              <label>Price (£)</label>
              <input type="number" className="form-control" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
              <label>Upload Audio (MP3)</label>
              <input type="file" className="form-control" accept="audio/mp3" onChange={(e) => setAudioFile(e.target.files[0])} required />
            </div>
            
            
            <div className="col-md-6 mb-3">
              <label>Upload Cover Art (Optional - Will default to studio aesthetic)</label>
              <input 
                type="file" 
                className="form-control" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])} 
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Post Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    
      <div className="card shadow-sm p-4 mt-4">
        <h3 className="mb-4">Manage My Listings</h3>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Genre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(item => (
                <tr key={item._id}>
                  <td>
                    {editingId === item._id ? (
                      <input 
                        className="form-control"
                        value={editData.name} 
                        onChange={(e) => setEditData({...editData, name: e.target.value})} 
                      />
                    ) : item.name}
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <input 
                        type="number"
                        className="form-control"
                        value={editData.price} 
                        onChange={(e) => setEditData({...editData, price: e.target.value})} 
                      />
                    ) : `£${item.price}`}
                  </td>
                  <td>{item.genre}</td>
                  <td>
                    {editingId === item._id ? (
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdate(item._id)}>Save</button>
                    ) : (
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(item)}>Edit</button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyListings;
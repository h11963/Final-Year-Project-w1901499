import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../App';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProfileSettings from './ProfileSettings';
import { useNavigate } from 'react-router-dom'; 


const ProducerView = () => <div className="p-4"><h3>Studio Owner Management View</h3></div>;
const ArtistView = () => <div className="p-4"><h3>Artist Overview</h3></div>;

const Dashboard = () => {

  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState('');
  const location = useLocation();
  const alertShown = useRef(false);
  const userRole = auth?.user?.role?.toLowerCase();

  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [collabRequests, setCollabRequests] = useState([]); 
  const [sentRequests, setSentRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
 
 

  const [purchasedItems, setPurchasedItems] = useState(() => {
    const saved = localStorage.getItem("my_purchases");
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "success") {
      const urlNames = params.get("name") ? decodeURIComponent(params.get("name")).split(',') : [];
      const urlAudios = params.get("audio") ? decodeURIComponent(params.get("audio")).split(',') : [];
      const urlIds = params.get("id") ? params.get("id").split(',') : [];

      if (urlNames.length > 0) {
        const newPurchases = urlNames.map((name, index) => ({
          _id: urlIds[index] || `temp-${Date.now()}-${index}`,
          name: name,
          audioPreview: urlAudios[index] || '' 
        }));

        setPurchasedItems(prev => {
          // prevents duplicates
          const filtered = newPurchases.filter(newItem => 
            !prev.some(oldItem => oldItem._id === newItem._id)
          );
          const updated = [...prev, ...filtered];
          localStorage.setItem("my_purchases", JSON.stringify(updated));
          return updated;
        });

        if (!alertShown.current) {
          alert("Payment Successful! Your beats are now available.");
          alertShown.current = true;

          window.history.replaceState({}, document.title, "/dashboard");
        }
      }
    }
    

    fetchData();
  
  }, [location.search, auth]);

  // --- 3. CLEAR PURCHASES FUNCTION ---
  const clearPurchases = () => {
    setPurchasedItems([]);
    localStorage.removeItem("my_purchases");
    window.history.replaceState({}, document.title, "/dashboard");
  };
  

  

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editData, setEditData] = useState({ date: '', phone: '', userName: '' });
  const [editingListingId, setEditingListingId] = useState(null);
  const [listingEditData, setListingEditData] = useState({ name: '', price: 0, description: '' });

  const [newStudio, setNewStudio] = useState({
    name: '',
    price: '',
    location: '',
    hardware: '',
    software: '',
    description: '',
    amenities: '',
  });



const handlePublishStudio = async () => {
 
  if (!newStudio.name.trim()) return alert("Studio Name is required");
  if (!newStudio.location.trim()) return alert("Location is required");
  if (!newStudio.price) return alert("Price per hour is required");

  const studioData = {
    name: newStudio.name,
    location: newStudio.location,
    pricePerHour: Number(newStudio.price), 
    description: newStudio.description || "",
    hardware: newStudio.hardware || "",
    software: newStudio.software || "",
    amenities: newStudio.amenities || "",
    owner: auth.user._id || auth.user.id, 
    
  
    category: 'studio',           
    artist: auth?.user?.name || "", 
   
    
    imageUrl: "" 
  };

  try {
   
    const res = await axios.post('http://localhost:5005/api/studios', studioData, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });

    if (res.status === 201 || res.status === 200) {
      alert("🚀 Studio Published!");
      setNewStudio({ 
        name: '', price: '', location: '', description: '', 
        hardware: '', software: '', amenities: '' 
      }); 
      fetchData(); 
    }
  } catch (err) {
    console.error("Post Error Details:", err.response?.data || err);
    alert(`Failed to post: ${err.response?.data?.message || "Check network connection"}`);
  }
};



  const handleSuccessfulPayment = (newBeat) => {

  const existingPurchases = JSON.parse(localStorage.getItem('my_purchases')) || [];
  
  
  const updatedPurchases = [...existingPurchases, newBeat];
  

  localStorage.setItem('my_purchases', JSON.stringify(updatedPurchases));
  
  
  navigate('/dashboard');
};

  
  const handleUpgrade = async () => {
  if (secretKey === 'STUDIO2026') {
    try {
      const res = await axios.post('http://localhost:5005/api/auth/upgrade', {
        userId: auth.user._id || auth.user.id,
        newRole: 'studio owner'
      });
      if (res.data) {
        const updatedUser = { ...auth.user, role: 'studio owner' };

       
        const existingAuth = JSON.parse(localStorage.getItem('user')); 
        if (existingAuth) {
          existingAuth.role = 'studio owner';
          localStorage.setItem('user', JSON.stringify(existingAuth));
        }

       
        setAuth({ ...auth, user: updatedUser });

        alert("Success! Switching to Studio Console.");
        
      
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    }
  }
};

  const handleDowngrade = async () => {
    if (window.confirm("Switch back to Artist view?")) {
      try {
        const res = await axios.post('http://localhost:5005/api/auth/upgrade', {
          userId: auth.user._id || auth.user.id,
          newRole: 'artist'
        });

        if (res.data) {
          
          const updatedUser = { ...auth.user, role: 'artist' };
          setAuth({ ...auth, user: updatedUser });

       
          const existingAuth = JSON.parse(localStorage.getItem('user')); 
          if (existingAuth) {
            existingAuth.role = 'artist';
            localStorage.setItem('user', JSON.stringify(existingAuth));
          }

          alert("Switched to Artist View.");
          
          
          window.location.reload();
        }
      } catch (err) {
        console.error("Downgrade error:", err);
        alert("Failed to switch roles.");
      }
    }
  };

 const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this listing?")) return;

  try {
    await axios.delete(`http://localhost:5005/api/products/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });


    
    setListings(prev => prev.filter(item => item._id !== id));
    
    alert("Listing deleted successfully.");
  } catch (err) {
    console.error("Delete error:", err);
    alert("Could not delete the listing.");
  }
};

const handleUpdateStatus = async (requestId, newStatus) => {
  try {
    await axios.put(`http://localhost:5005/api/bookings/${requestId}`, {
      status: newStatus
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });

    
    setCollabRequests(prev => 
      prev.map(r => r._id === requestId ? { ...r, status: newStatus } : r)
    );
  } catch (err) {
    console.error("Update error:", err);
  }
};
  
const fetchData = async () => {
  const myID = auth?.user?._id || auth?.user?.id;
  const myName = auth?.user?.name;
  
  if (!myID) return;

  setLoading(true);
  try {
    const [bookRes, listRes] = await Promise.all([
      axios.get('http://localhost:5005/api/bookings'),
      axios.get('http://localhost:5005/api/products'),
    
    ]);

    const currentUserIdStr = String(myID).toLowerCase().trim();
    const currentUserNameStr = String(myName || "").toLowerCase().trim();

const allItems = listRes.data;



    
    const allSentByMe = bookRes.data.filter(b => {
      const matchesID = String(b.user?._id || b.user || "").toLowerCase().trim() === currentUserIdStr;
      const matchesName = b.userName === auth.user.name; 
      return matchesID || matchesName;
    });

    const myArtistBookings = allSentByMe.filter(b => b.phone !== "N/A"); 
    
    const myCollabRequests = allSentByMe.filter(b => b.phone === "N/A" || b.type === "Marketplace Collab");

    
    const received = bookRes.data.filter(b => {
      const targetOwnerId = String(b.ownerId || "").toLowerCase().trim();
      const matchesID = targetOwnerId !== "" && targetOwnerId === currentUserIdStr;
      const isSentToMyBeat = b.studioName === "test" && currentUserNameStr === "jessica"; 

      return matchesID || isSentToMyBeat;
    });



   
    const myOwnBeats = listRes.data.filter(item => {
      const itemOwnerID = String(item.owner || item.user || item.userId || "").toLowerCase().trim();
      const matchesID = itemOwnerID !== "" && itemOwnerID === currentUserIdStr;

      const itemArtistName = String(item.artist || "").toLowerCase().trim();
      const matchesName = itemArtistName !== "" && itemArtistName === currentUserNameStr;

      return (matchesID || matchesName) && item.category !== 'studio';
    });

 
    setBookings(myArtistBookings);      
    setListings(myOwnBeats);     
        
    
  
    if (typeof setSentRequests === "function") setSentRequests(myCollabRequests);
    if (typeof setCollabRequests === "function") setCollabRequests(received);

  } catch (err) {
    console.error("Fetch Error:", err);
  } finally {
    setLoading(false);
  }
};

 const handleDeleteListing = async (listingId) => {
  if (!window.confirm("Are you sure you want to delete this? This action is permanent.")) return;

  try {
    await axios.delete(`http://localhost:5005/api/products/${listingId}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
   
    setListings(prev => prev.filter(item => item._id !== listingId));
  } catch (err) {
    console.error("Delete Error:", err);
    alert("Failed to delete the listing. Make sure your server is running.");
  }
};



const handleCancelBooking = async (id) => {
  if (!window.confirm("Are you sure you want to cancel this?")) return;
  try {
    await axios.delete(`http://localhost:5005/api/bookings/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    alert("Cancelled successfully.");
    fetchData(); 
  } catch (err) {
    alert("Failed to cancel.");
  }
};

const handleBookingStatus = async (id, status) => {
  try {
    await axios.put(`http://localhost:5005/api/bookings/${id}`, { status });
    alert(`Request ${status}`);
    fetchData();
  } catch (err) {
    console.error("Update failed", err);
  }
};

const handleDeleteStudio = async (id) => {
  if (!id) return;

  if (window.confirm("Are you sure you want to permanently delete this studio listing?")) {
    try {
      
      await axios.delete(`http://localhost:5005/api/studios/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      alert("Studio deleted successfully");
      
     
      fetchData(); 
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err);
      alert("Failed to delete studio. Check if you are the owner.");
    }
  }
};



  const handleCollabStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5005/api/collabs/${id}`, { status: newStatus });
      alert(`Collab ${newStatus}!`);
      
    } catch (err) { alert("Failed to update status"); }
  };

 

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleEditClick = (booking) => { setSelectedBooking(booking); setEditData({ date: booking.date, phone: booking.phone, userName: booking.userName }); };
  const handleUpdate = async (e) => { e.preventDefault(); try { await axios.put(`http://localhost:5005/api/bookings/${selectedBooking._id}`, editData); alert("Updated!"); setSelectedBooking(null); fetchData(); } catch (err) { alert("Failed"); } };
  const handleCancel = async () => { if (window.confirm("Cancel?")) { try { await axios.delete(`http://localhost:5005/api/bookings/${selectedBooking._id}`); setSelectedBooking(null); fetchData(); } catch (err) { alert("Failed"); } } };
  const handleListingDelete = async (id) => { if (window.confirm("Delete?")) { try { await axios.delete(`http://localhost:5005/api/products/${id}`); fetchData(); } catch (err) { alert("Failed"); } } };


  return (
    <div className="container mt-5 pb-5">
      <div className="row">
        {/* SIDEBAR */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 p-3 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-3">Hello, {auth?.user?.name || 'Musician'}</h5>
            <p className={`badge ${userRole === 'studio owner' ? 'bg-dark' : 'bg-primary'} text-uppercase mb-2`}>
              {auth?.user?.role}
            </p>
            <hr />
            <div className="d-grid gap-2">
              <button
                className={`btn text-start fw-bold ${activeTab === 'overview' ? 'btn-primary' : 'btn-light'}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Dashboard
              </button>
              <button
                className={`btn text-start fw-bold ${activeTab === 'settings' ? 'btn-primary' : 'btn-light'}`}
                onClick={() => setActiveTab('settings')}
              >
                ⚙️ Manage Account
              </button>

              {userRole === 'studio owner' && (
                <button className="btn btn-outline-danger btn-sm mt-3 fw-bold" onClick={handleDowngrade}>
                  🔄 Switch to Artist View
                </button>
              )}
            </div>
          </div>
        </div>

       
        <div className="col-md-9">
          {activeTab === 'settings' ? (
            <ProfileSettings />
          ) : (
            <>
              {(userRole === 'studio_owner' || userRole === 'studio owner') ? (
               
                <div className="studio-owner-portal animate__animated animate__fadeIn">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-dark">Studio Owner Manager</h2>
                  </div>

                 
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="card border-0 shadow-sm p-3 bg-white">
                        <small className="text-muted fw-bold">ACTIVE BOOKINGS</small>
                        <h3 className="fw-bold m-0">{bookings.length}</h3>
                      </div>
                    </div>
                  </div>

                {/* BOOKING MANAGEMENT */}
                  <div className="card shadow-sm border-0 p-4 mb-4">
                    <h4 className="fw-bold mb-3 text-primary">Studio Booking Requests</h4>
                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead>
                          <tr>
                            <th>Artist</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.length === 0 ? (
                            <tr><td colSpan="4" className="text-center text-muted">No bookings yet.</td></tr>
                          ) : (
                            bookings.map(b => (
                              <tr key={b._id}>
                                <td><strong>{b.userName || 'Customer'}</strong></td>
                                <td>{formatDate(b.date)}</td>
                                <td><span className="badge bg-info text-dark">{b.status || 'Pending'}</span></td>
                                <td>
                                  <div className="btn-group">
                                    <button className="btn btn-sm btn-success" onClick={() => handleBookingStatus(b._id, 'Accepted')}>Accept</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleBookingStatus(b._id, 'Declined')}>Reject</button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* LISTING NEW STUDIO FORM */}
                  <div className="card shadow-sm border-0 p-4 mb-4 bg-dark text-white">
                    <h4 className="fw-bold mb-3 text-warning">➕ List a New Studio Space</h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="small fw-bold">Studio Name</label>
                        <input type="text" className="form-control" value={newStudio.name} onChange={(e) => setNewStudio({...newStudio, name: e.target.value})} />
                      </div>
                      <div className="col-md-3">
                        <label className="small fw-bold">Price / Hour (£)</label>
                        <input type="number" className="form-control" value={newStudio.price} onChange={(e) => setNewStudio({...newStudio, price: e.target.value})} />
                      </div>
                      <div className="col-md-3">
                        <label className="small fw-bold">Location</label>
                        <input type="text" className="form-control" value={newStudio.location} onChange={(e) => setNewStudio({...newStudio, location: e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-bold">Hardware Gear</label>
                        <textarea className="form-control" rows="3" value={newStudio.hardware} onChange={(e) => setNewStudio({...newStudio, hardware: e.target.value})}></textarea>
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-bold">Software & Plugins</label>
                        <textarea className="form-control" rows="3" value={newStudio.software} onChange={(e) => setNewStudio({...newStudio, software: e.target.value})}></textarea>
                      </div>
                      <div className="col-md-12">
                        <label className="small fw-bold text-warning">Studio Amenities</label>
                        <textarea className="form-control bg-dark text-white border-secondary" rows="2" value={newStudio.amenities} onChange={(e) => setNewStudio({...newStudio, amenities: e.target.value})}></textarea>
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="small fw-bold text-primary">About this Space (Description)</label>
                        <textarea className="form-control" rows="4" value={newStudio.description} onChange={(e) => setNewStudio({...newStudio, description: e.target.value})}></textarea>
                      </div>
                      <div className="col-12 text-end">
                        <button className="btn btn-warning px-5 fw-bold text-dark shadow" onClick={handlePublishStudio}>Publish to Studios</button>
                      </div>
                    </div>
                  </div>
                </div> 
              ) : (
                
                <div className="artist-portal animate__animated animate__fadeIn">
                  
                  

                 
                  <div className="card shadow-sm border-0 bg-dark text-white mb-4 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0 fw-bold text-warning">🎧 Purchased Beats</h4>
                      {purchasedItems.length > 0 && (
                        <button className="btn btn-outline-danger btn-sm" onClick={clearPurchases}>Clear All</button>
                      )}
                    </div>
                    <div className="row">
                      {purchasedItems.length === 0 ? (
                        <p className="small opacity-75">No purchases found.</p>
                      ) : (
                        purchasedItems.map((item) => (
                          <div key={item._id} className="col-md-4 mb-3">
                            <div className="card bg-secondary border-0 p-3 h-100 text-center text-white">
                              <h6 className="fw-bold mb-2">{item.name}</h6>
                              {item.audioPreview ? (
                                <a
                                  href={`http://localhost:5005/download-file?file=${encodeURIComponent(item.audioPreview.split('/').pop())}`}
                                  className="btn btn-sm btn-warning w-100 mt-auto fw-bold text-dark"
                                  download
                                >
                                  📥 Download
                                </a>
                              ) : (
                                <button className="btn btn-sm btn-outline-danger w-100 mt-auto" disabled>No File</button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  
<div className="artist-view-container">
  
 
  <div className="dashboard-section" style={{ marginBottom: '40px' }}>
    <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold' }}>
      My Marketplace Beats
    </h2>
    
    <div className="listings-grid" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
      gap: '20px' 
    }}>
      {listings.length > 0 ? (
        listings.map((item) => (
          <div key={item._id} className="card item-card" style={{ 
            background: '#1a1a1a', 
            border: '1px solid #333', 
            borderRadius: '12px', 
            padding: '20px',
            transition: 'transform 0.2s'
          }}>
            <div className="card-body">
              <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>{item.name}</h4>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>
                Price: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>£{item.price}</span>
              </p>
              
              <button 
                onClick={() => handleDeleteListing(item._id)}
                className="btn btn-danger"
                style={{ 
                  width: '100%', 
                  backgroundColor: '#ff4d4d', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}
              >
                Delete Beat
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: '#666', italic: 'true' }}>No beats uploaded to the marketplace yet.</p>
      )}
    </div>
  </div>

  <hr style={{ borderColor: '#333', marginBottom: '40px' }} />

  
</div>

                 

                  
                  <div className="card shadow-sm border-0 p-4 mb-4">
                    <h5 className="mb-3 fw-bold">My Studio Bookings</h5>
                    <div className="table-responsive">
                      <table className="table align-middle small">
                        <thead>
                          <tr><th>Studio</th><th>Date</th><th>Status</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {bookings.map(b => (
                            <tr key={b._id}>
                              <td>{b.studioName}</td>
                              <td>{formatDate(b.date)}</td>
                              <td><span className="badge bg-info text-dark">{b.status}</span></td>
                              <td><button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditClick(b)}>Edit</button></td>
                              <td>
     
      <button 
        className="btn btn-outline-danger btn-sm"
        onClick={() => handleCancelBooking(b._id)}
      >
        Cancel
      </button>
    </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                 
                  <div className="card mt-5 p-4 border-0 shadow-sm bg-dark text-white">
                    <h5 className="fw-bold">🚀 Become a Studio Owner</h5>
                    <div className="d-flex gap-2">
                      <input type="text" className="form-control w-50" placeholder="Secret Key..." value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
                      <button className="btn btn-primary px-4" onClick={handleUpgrade}>Unlock</button>
                    </div>
                  </div>
                </div> 
              )}
            </>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {selectedBooking && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <div className="d-flex justify-content-between mb-3">
                <h4 className="fw-bold">Edit Booking</h4>
                <button className="btn-close" onClick={() => setSelectedBooking(null)}></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="small fw-bold">New Date</label>
                  <input type="date" className="form-control" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} required />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
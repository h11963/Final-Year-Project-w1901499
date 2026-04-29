import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  
  // State for the professional Auth Warning box
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5005/api/products');
        setItems(res.data);
      } catch (err) { console.error("Fetch Error:", err); }
    };
    fetchItems();
  }, []);

  // --- THE LOCK CHECKER ---
  const isAllowed = () => {
    if (!auth || !auth.user) {
      setShowAuthWarning(true);
      return false;
    }
    return true;
  };




  // --- STRIPE PAYMENT LOGIC ---
  const handlePurchase = async (item) => {
  if (!isAllowed()) return;

  try {
    const res = await axios.post('http://localhost:5005/api/payment/create-checkout-session', {
      name: item.name,
      price: item.price,
      productId: item._id,
      audioPreview: item.audioPreview 
    });
    window.location.href = res.data.url;
  } catch (err) {
    console.error("Checkout Error:", err);
    alert("Checkout failed.");
  }
};

  const handlePlay = (audioUrl, id) => {
    if (playingId === id) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current.src = encodeURI(audioUrl);
    audioRef.current.play().then(() => setPlayingId(id));
  };

  const addToBasket = (item) => {
    if (!isAllowed()) return;
    const currentBasket = JSON.parse(localStorage.getItem('basket')) || [];
    localStorage.setItem('basket', JSON.stringify([...currentBasket, item]));
    window.dispatchEvent(new Event("storage")); 
    alert(`${item.name} added to basket!`);
  };

  return (
    <div className="container mt-5 pb-5">
      <h2 className="fw-bold mb-4">🎵 Marketplace</h2>

      {/* --- PROFESSIONAL AUTH MODAL --- */}
      {showAuthWarning && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-5 text-center">
              <div className="display-4 mb-3">🔒</div>
              <h3 className="fw-bold">Join the Community</h3>
              <p className="text-muted">Log in to purchase beats, start collaborations, or save items to your basket.</p>
              <div className="d-grid gap-2 mt-4">
                <button className="btn btn-primary py-2 fw-bold" onClick={() => navigate('/auth')}>Login Now</button>
                <button className="btn btn-outline-secondary py-2" onClick={() => navigate('/auth')}>Create Account</button>
                <button className="btn btn-link text-muted small mt-2" onClick={() => setShowAuthWarning(false)}>Continue Browsing</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
     {items.filter(item => item.category !== 'studio').map(item => (
          <div className="col-md-3 mb-4" key={item._id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="position-relative">
                <img src={item.image || 'https://via.placeholder.com/300x200'} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} alt="" />
                <button 
                  className="btn btn-success position-absolute top-50 start-50 translate-middle rounded-circle shadow" 
                  onClick={() => handlePlay(item.audioPreview, item._id)}
                >
                  {playingId === item._id ? '■' : '▶'}
                </button>
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold mb-1">{item.name}</h5>
          
                <h5 className="text-primary fw-bold mt-auto">£{item.price}</h5>
                
                <div className="d-grid gap-2 mt-3">
                  <button className="btn btn-primary btn-sm fw-bold" onClick={() => handlePurchase(item)}>
                    Buy Now
                  </button>
                 
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => addToBasket(item)}>
                    + Basket
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
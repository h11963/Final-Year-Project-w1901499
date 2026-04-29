import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

const Basket = () => {
  const [cartItems, setCartItems] = useState([]);

  const loadBasket = () => {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      setCartItems(JSON.parse(savedBasket));
    }
  };

  useEffect(() => {
    loadBasket();
    window.addEventListener('storage', loadBasket);
    return () => window.removeEventListener('storage', loadBasket);
  }, []);

  const removeItem = (index) => {
    const newBasket = [...cartItems];
    newBasket.splice(index, 1);
    setCartItems(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
    window.dispatchEvent(new Event("storage"));
  };


  const handleBasketCheckout = async () => {
    if (cartItems.length === 0) return alert("Your basket is empty!");

    try {
      
      const res = await axios.post('http://localhost:5005/api/payment/create-basket-checkout', {
        basketItems: cartItems 
      });

     
      localStorage.removeItem('basket');
      window.dispatchEvent(new Event("storage")); 

      
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Checkout failed. Check your backend terminal!");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🛒 Your Basket</h2>
        <Link to="/marketplace" className="btn btn-outline-primary btn-sm">← Back to Beats</Link>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5 border rounded bg-light">
          <p className="text-muted mb-4">Your basket is currently empty.</p>
          <Link to="/marketplace" className="btn btn-primary px-4">Browse Marketplace</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {cartItems.map((item, index) => (
              <div key={index} className="card mb-3 shadow-sm border-0">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px' }} 
                      className="me-3"
                    />
                    <div>
                      <h5 className="mb-0 fw-bold">{item.name}</h5>
                      <span className="badge bg-info text-dark">{item.genre}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold mb-0 h5">£{Number(item.price).toFixed(2)}</p>
                    <button 
                      className="btn btn-link text-danger text-decoration-none p-0 mt-1" 
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-4 border-0 bg-dark text-white">
              <h4 className="mb-4">Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal:</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-secondary">VAT (0%):</span>
                <span>£0.00</span>
              </div>
              <hr className="bg-secondary" />
              <div className="d-flex justify-content-between mb-4">
                <span className="h5">Total:</span>
                <span className="h4 text-success">£{total.toFixed(2)}</span>
              </div>
              
             
              <button 
                className="btn btn-success w-100 py-3 fw-bold shadow"
                onClick={handleBasketCheckout}
              >
                Checkout with Stripe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Basket;
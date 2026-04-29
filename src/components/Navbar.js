import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

const Navbar = () => {
  const { auth, handleLogout } = useContext(AuthContext);
  const [basketCount, setBasketCount] = useState(0);


  const updateBasketCount = () => {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    setBasketCount(basket.length);
  };

  useEffect(() => {
    updateBasketCount();
    

    window.addEventListener('storage', updateBasketCount);
    

    return () => window.removeEventListener('storage', updateBasketCount);
  }, []);

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark mb-4 shadow-sm" style={{ padding: '10px' }}>
      <div className="container">
    
        <Link className="navbar-brand fw-bold" to="/">Music Collab</Link>
        

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/marketplace">Marketplace</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/studios">Studios</Link>
            </li>
            {auth && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link text-success fw-bold" to="/create-listing">+ Post</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
           
            <Link to="/basket" className="btn btn-outline-light me-3 position-relative">
              🛒 Basket
              {basketCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {basketCount}
                </span>
              )}
            </Link>

       
            {auth ? (
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout {auth.user && `(${auth.user.name})`}
              </button>
            ) : (
              <Link className="btn btn-success" to="/auth">Login / Register</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Home = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* --- HERO SECTION --- */}
      <section className="bg-dark text-white text-center py-5 shadow-lg" style={{ 
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container">
          <h1 className="display-3 fw-bold mb-3">Elevate Your Sound.</h1>
          <p className="lead mb-4 fs-4">The all-in-one marketplace to book studios, buy beats, and collaborate.</p>
          
          <div className="d-flex justify-content-center gap-3">
            {auth?.user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg px-5 fw-bold">Go to Dashboard</Link>
            ) : (
              <>
                
                <Link to="/studios" className="btn btn-outline-light btn-lg px-5 fw-bold">Explore Studios</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- VALUE PROPS --- */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="p-4 shadow-sm rounded bg-white h-100 border-top border-primary border-4">
              <div className="display-4 mb-3">🎙️</div>
              <h4 className="fw-bold">Premium Studios</h4>
              <p className="text-muted">Access professional recording environments and top-tier gear in your city.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-4 shadow-sm rounded bg-white h-100 border-top border-success border-4">
              <div className="display-4 mb-3">🎹</div>
              <h4 className="fw-bold">Exclusive Beats</h4>
              <p className="text-muted">Browse thousands of high-quality beats from the world's best producers.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-4 shadow-sm rounded bg-white h-100 border-top border-info border-4">
              <div className="display-4 mb-3">🤝</div>
              <h4 className="fw-bold">All In 1!</h4>
              <p className="text-muted">Simple and accessible from anywhere in the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row align-items-center">
            <div className="col-md-6 mb-4">
              <h3 className="fw-bold text-primary">For Artists</h3>
              <ul className="list-unstyled">
                <li className="mb-3"><strong>1. Explore:</strong> Search for studios by location or beats by genre.</li>
                <li className="mb-3"><strong>2. Book & Buy:</strong> Secure your session or license beats instantly.</li>
                <li className="mb-3"><strong>3. Create:</strong> Get into the studio and bring your vision to life.</li>
              </ul>
              <button className="btn btn-outline-primary" onClick={() => navigate('/studios')}>Find a Studio</button>
            </div>
            <div className="col-md-6 mb-4">
              <h3 className="fw-bold text-dark">For Studio Owners</h3>
              <ul className="list-unstyled">
                <li className="mb-3"><strong>1. List:</strong> Add your studio details, gear list, and pricing.</li>
                <li className="mb-3"><strong>2. Manage:</strong> Control your bookings from your dashboard.</li>
                <li className="mb-3"><strong>3. Earn:</strong> Get paid directly and grow your client base.</li>
              </ul>
              
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="container py-5 text-center">
        <div className="bg-primary text-white p-5 rounded-4 shadow">
          <h2 className="fw-bold mb-3">Ready to start your next project?</h2>
          <p className="lead mb-4">Join hundreds of artists and producers already making waves.</p>
         
        </div>
      </section>
    </div>
  );
};

export default Home;
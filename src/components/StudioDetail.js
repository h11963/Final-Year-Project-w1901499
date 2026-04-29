import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StudioDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const studio = location.state?.studio;


  const renderList = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string' && data.trim() !== '') {
      return data.split(',').map(item => item.trim());
    }
    return [];
  };

  if (!studio) {
    return (
      <div className="container mt-5 text-center">
        <h3>🎙️ Studio Not Found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/studios')}>Back to Studios</button>
      </div>
    );
  }

  return (
    <div className="container mt-5 pb-5">
      <button className="btn btn-link text-decoration-none text-dark mb-4 p-0 fw-bold" onClick={() => navigate(-1)}>
        ← BACK TO EXPLORE
      </button>

      <div className="row g-5">
    
        <div className="col-lg-7">
          <div className="overflow-hidden rounded-4 shadow-sm mb-4">
            <img 
              src={studio.imageUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200'} 
              className="img-fluid w-100" 
              alt={studio.name} 
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
          
          <h1 className="fw-bold display-5">{studio.name}</h1>
          <p className="text-muted fs-5 mb-4">📍 {studio.location}</p>
          
          <div className="p-4 bg-light rounded-4 mb-5">
            <h4 className="fw-bold mb-3">About this Space</h4>
            <p className="text-secondary mb-0">{studio.description || "No description provided."}</p>
          </div>
          
          <div className="row g-4 mt-2">
            <div className="col-md-6">
              <div className="card h-100 border-0 bg-white shadow-sm p-3">
                <h5 className="fw-bold text-primary mb-3">🛠️ Hardware Gear</h5>
               
                <p className="text-muted small mb-0">{studio.hardware || "Contact owner for full gear list."}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 border-0 bg-white shadow-sm p-3">
                <h5 className="fw-bold text-primary mb-3">💻 Software & DAWs</h5>
                <div className="d-flex flex-wrap gap-1">
                    {renderList(studio.software).length > 0 ? renderList(studio.software).map((sw, i) => (
                        <span key={i} className="badge bg-light text-dark border">{sw}</span>
                    )) : <span className="text-muted small">Standard software included.</span>}
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="col-lg-5">
          <div className="card border-0 shadow-lg p-4 sticky-top" style={{ top: '2rem', zIndex: 10 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-success mb-0">£{studio.pricePerHour}</h3>
              <span className="text-muted">per hour</span>
            </div>
            
            <hr />

            <div className="my-4">
              <label className="small fw-bold text-uppercase text-muted">Included Amenities</label>
              <div className="d-flex flex-wrap gap-2 mt-3">
                {renderList(studio.amenities).length > 0 ? renderList(studio.amenities).map((item, i) => (
                  <span key={i} className="badge bg-light text-dark border px-3 py-2 fw-normal rounded-pill">
                    ✓ {item}
                  </span>
                )) : <span className="text-muted small">WiFi, Lounge, Water</span>}
              </div>
            </div>

            <div className="d-grid">
              <button 
                className="btn btn-primary btn-lg fw-bold shadow-sm py-3"
                onClick={() => navigate('/book-studio', { state: { studio } })}
              >
                Instant Book Space
              </button>
            </div>
            
            <div className="mt-4 pt-3 border-top">
              <p className="text-center text-muted small mb-0">
                ⭐ Trusted Studio Owner
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioDetail;
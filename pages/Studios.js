import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Studios = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [studios, setStudios] = useState([]);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const res = await axios.get('http://localhost:5005/api/studios');
        setStudios(res.data);
      } catch (err) { 
        console.error("Fetch error:", err); 
      }
    };
    fetchStudios();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Explore Studios</h2>
        <span className="badge bg-primary rounded-pill">{studios.length} Spaces Available</span>
      </div>

      <div className="row">
        {studios.length > 0 ? (
          studios.map((s) => (
            <div className="col-md-4 mb-4" key={s._id}>
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
               
                <img 
                  src={s.imageUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400'} 
                  className="card-img-top" 
                  alt={s.name} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                
                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    <h5 className="fw-bold mb-1">{s.name}</h5>
                    <p className="text-muted small mb-2">📍 {s.location}</p>
                  </div>
                  
                  <p className="text-secondary small text-truncate mb-3">
                    {s.description || "Top-tier recording space with pro equipment."}
                  </p>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold text-success fs-5">£{s.pricePerHour}/hr</span>
                    </div>
                    
                    
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary fw-bold" 
                        onClick={() => navigate(`/studio/${s._id}`, { state: { studio: s } })}
                      >
                        View Details & Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="text-muted">Loading amazing studios for you...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Studios;
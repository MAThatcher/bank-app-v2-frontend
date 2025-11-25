import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/NotFoundPage.css';
import imperialAquila from '../assets/images/40k_imperial_aquila__transparent__by_fuguestock_d91enql-fullview.png';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <div className="error-icon"><img src={imperialAquila} alt="Imperial Aquila" /></div>
                <h1 className="error-code">404</h1>
                <h2 className="error-title">SECTOR NOT FOUND</h2>
                <p className="error-message">
                    The coordinates you seek have been lost to the Warp. 
                    This sector of the Imperium does not exist in our records.
                </p>
                <div className="error-details">
                    <div className="detail-icon">⚠</div>
                    <p>
                        The Administratum has no knowledge of this location. 
                        It may have been purged by the Inquisition or consumed by xenos forces.
                    </p>
                </div>
                <div className="action-buttons">
                    <button 
                        className="primary-btn"
                        onClick={() => navigate('/')}
                    >
                        <span className="btn-icon">⛨</span>
                        RETURN TO TERRA
                    </button>
                    <button 
                        className="secondary-btn"
                        onClick={() => navigate(-1)}
                    >
                        <span className="btn-icon">↩</span>
                        PREVIOUS SECTOR
                    </button>
                </div>
                <div className="imperial-quote">
                    "Even in the vastness of the Imperium, some paths lead only to darkness."
                    <br />
                    <span className="quote-author">- Administratum Warning 404.M41</span>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('upload'); // 'upload' or 'reels'
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Your existing feedData would live here
  const [feedData, setFeedData] = useState(null);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate processing the PDF into reels
    setTimeout(() => {
      setIsUploading(false);
      setView('reels'); 
      // setFeedData(responseFromYourBackend);
    }, 1500);
  };

  return (
    <div className="app-wrapper">
      {view === 'upload' ? (
        <div className="upload-container">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf" 
            hidden 
          />
          <button 
            className={`upload-button ${isUploading ? 'loading' : ''}`}
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? 'Generating Reels...' : 'Upload PDF to Create Reels'}
          </button>
        </div>
      ) : (
        /* Your original Reels logic - Untouched */
        <div className="feed-container">
          {feedData?.chunks?.map((chunk, index) => (
            <div key={index} className="chunk-slide">
              <div className="top-progress-container">
                <div 
                  className="top-progress-fill" 
                  style={{ width: `${((index + 1) / feedData.chunks.length) * 100}%` }}
                ></div>
              </div>
              <div className="difficulty-badge">{chunk.difficulty_level}</div>
              <h1 className="hook-text">{chunk.hook}</h1>
              <p className="content-text">{chunk.content}</p>
              <ul className="bullet-points">
                {chunk.bullet_points?.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
//ddddddd
export default App;
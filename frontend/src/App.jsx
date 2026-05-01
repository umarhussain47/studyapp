import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // MOCK DATA: Replace this with your actual feedData variable
  const [feedData, setFeedData] = useState({
    chunks: [
      {
        difficulty_level: "Beginner",
        hook: "Back to Business!",
        content: "Your reels are back. Use the button at the top to add more.",
        bullet_points: ["Scroll down to see more", "Upload PDF at the top", "Fixed the layout"]
      }
    ]
  });

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    // Logic for backend upload goes here
    setTimeout(() => setIsUploading(false), 1500);
  };

  return (
    <div className="feed-container">
      {/* UPLOAD SECTION (Stays at the top of the scroll) */}
      <div className="chunk-slide upload-slide">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" hidden />
        <button 
          className={`upload-button ${isUploading ? 'loading' : ''}`}
          onClick={handleUploadClick}
        >
          {isUploading ? 'Processing PDF...' : '＋ Upload PDF to Create Reels'}
        </button>
        <p style={{color: '#666', marginTop: '10px', fontSize: '0.8rem'}}>Scroll down to view reels</p>
      </div>

      {/* REELS SECTION */}
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
  );
}

export default App;
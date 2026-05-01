import { useState } from 'react'
import './App.css'

function App() {
  const [feedData, setFeedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const clean = (text) => typeof text === 'string' ? text.replace(/[*_]/g, '') : '';

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Replaced localhost with your live Render URL
      const response = await fetch('https://studyapp-yk9p.onrender.com/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Generation failed. Check backend logs.');

      const data = await response.json();
      setFeedData(data);
    } catch (err) {
      setError(err.message || "Connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // The landing page UI with the improved Upload Button
  if (!feedData) return (
    <div className="landing-container">
      <div className="hero-header">
        <h1 className="logo-text">PDF FLICK</h1>
        <p className="subtitle-ui">Transforming notes into reels</p>
      </div>

      {/* The Styled Upload Button (Label acts as the button) */}
      <label className="upload-dropzone">
        <div className="icon-wrapper">
          {isLoading ? <div className="spinner"></div> : "📄"}
        </div>
        
        {isLoading ? (
          <div className="loading-status">CRUNCHING PDF...</div>
        ) : (
          <div className="upload-content">
            <h3>Ready to Study?</h3>
            <p>Click to browse or drag your PDF here</p>
            <div className="select-btn-ui">SELECT PDF</div>
          </div>
        )}

        {/* Hidden actual input */}
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
          disabled={isLoading}
        />
      </label>

      {error && <div className="error-pill">⚠️ {error}</div>}
    </div>
  );

  return (
    <div className="feed-container">
      {feedData?.chunks?.map((chunk, index) => (
        <div key={index} className="chunk-slide">
          <div className="top-progress-container">
            <div 
              className="top-progress-fill" 
              style={{ width: `${((index + 1) / feedData.chunks.length) * 100}%` }}
            ></div>
          </div>

          <div className="difficulty-badge">{clean(chunk.difficulty_level)}</div>
          <h1 className="hook-text">{clean(chunk.hook)}</h1>
          <p className="content-text">{clean(chunk.content)}</p>
          
          <ul className="bullet-points">
            {chunk.bullet_points?.map((point, i) => (
              <li key={i}>{clean(point)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
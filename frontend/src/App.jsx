import { useState } from 'react'
import './App.css'

function App() {
  const [feedData, setFeedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const cleanText = (str) => typeof str === 'string' ? str.replace(/[*_]/g, '') : str;

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // FIX: Ensure no trailing slash on the base URL and no double slash before the endpoint
      const API_BASE = "https://studyapp-yk9p.onrender.com";
      const response = await fetch(`${API_BASE}/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (response.status === 404) {
        throw new Error("Endpoint not found (404). Check backend router.");
      }
      if (!response.ok) throw new Error('Generation failed. Check API Key.');

      const data = await response.json();
      setFeedData(data);
    } catch (err) {
      setError(err.message || "Connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="center-screen">
      <div className="loader"></div>
      <h2 style={{color: '#00ffcc', letterSpacing: '2px'}}>CRUNCHING PDF...</h2>
    </div>
  );

  if (!feedData) return (
    <div className="center-screen">
      <h1 className="logo-text">PDF FLICK</h1>
      <p className="subtitle">Swipe through your notes</p>
      
      <label className="upload-card">
        <div style={{fontSize: '2rem', marginBottom: '10px'}}>📄</div>
        <div style={{color: '#fff', fontWeight: '600'}}>Drop your PDF here</div>
        <div style={{color: '#555', fontSize: '0.8rem'}}>or click to browse</div>
        <div className="upload-btn">SELECT FILE</div>
        <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
      </label>

      {error && <p className="error-msg">⚠️ {error}</p>}
    </div>
  );

  return (
    <div className="feed-container">
      {feedData?.chunks?.map((chunk, index) => (
        <div key={index} className="chunk-slide">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${((index + 1) / feedData.chunks.length) * 100}%` }}></div>
          </div>
          <div className="difficulty-badge">{cleanText(chunk.difficulty_level)}</div>
          <h1 className="hook-text">{cleanText(chunk.hook)}</h1>
          <p className="content-text">{cleanText(chunk.content)}</p>
          <ul className="bullet-points">
            {(chunk.bullet_points || []).map((point, i) => (
              <li key={i}>{cleanText(point)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
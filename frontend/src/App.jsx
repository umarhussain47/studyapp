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
      // Remember to update this URL with your Render URL when you deploy!
      const response = await fetch('http://localhost:10000/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Backend failed');
      const data = await response.json();
      setFeedData(data);
    } catch (err) {
      setError("Unable to connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="center-screen">
      <div className="loader"></div>
      <h2 style={{color: '#00ffcc'}}>FLICKING THROUGH PDF...</h2>
    </div>
  );

  if (!feedData) return (
    <div className="center-screen">
      <h1 style={{fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px'}}>PDF FLICK</h1>
      <label className="upload-btn">
        SELECT PDF
        <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
      </label>
      {error && <p style={{ color: '#ff4444', marginTop: '20px' }}>{error}</p>}
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
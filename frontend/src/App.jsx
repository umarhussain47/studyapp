import { useState } from 'react'
import './App.css'

function App() {
  const [feedData, setFeedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Helper to remove markdown symbols like ** or __
  const cleanText = (str) => typeof str === 'string' ? str.replace(/[*_]/g, '') : str;

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Backend error');
      const data = await response.json();
      setFeedData(data);
    } catch (err) {
      setError("Server connection failed. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      <h2 style={{ color: '#00ffcc', animate: 'pulse 1s infinite' }}>Crunching PDF...</h2>
    </div>
  );

  if (!feedData) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      <h1 style={{ color: '#fff', marginBottom: '30px', fontWeight: '900' }}>PDF FLICK</h1>
      <label style={{ cursor: 'pointer', backgroundColor: '#00ffcc', color: '#000', padding: '16px 40px', borderRadius: '50px', fontWeight: 'bold' }}>
        UPLOAD PDF
        <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
      </label>
      {error && <p style={{ color: '#ff4444', marginTop: '20px' }}>{error}</p>}
    </div>
  );

  return (
    <div className="feed-container">
      {feedData?.chunks?.map((chunk, index) => (
        <div key={index} className="chunk-slide">
          <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', background: '#222', width: '100%' }}>
            <div style={{ height: '100%', background: '#00ffcc', width: `${((index + 1) / feedData.chunks.length) * 100}%`, transition: 'width 0.3s' }}></div>
          </div>

          <div className="difficulty-badge">{cleanText(chunk.difficulty_level || "Lesson")}</div>
          <h1 className="hook-text">{cleanText(chunk.hook || chunk.title)}</h1>
          <p className="content-text">{cleanText(chunk.content || chunk.text)}</p>
          
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
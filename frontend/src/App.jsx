import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [feedData, setFeedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const clean = (text) => typeof text === 'string' ? text.replace(/[*_]/g, '') : '';

  // Logic to handle file upload...
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://studyapp-yk9p.onrender.com/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setFeedData(data);
    } catch (err) {
      console.error("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!feedData) {
    return (
      <div className="landing-container">
        <h1 className="logo-text">PDF FLICK</h1>
        <label className="upload-card">
           <div className="icon-box">📁</div>
           <h3>{isLoading ? "GENERATING REELS..." : "Select Study PDF"}</h3>
           <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{display:'none'}}/>
        </label>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {feedData?.chunks?.map((chunk, index) => (
        <div key={index} className="chunk-slide">
          <div className="side-progress">
            <div 
              className="progress-fill" 
              style={{ height: `${((index + 1) / feedData.chunks.length) * 100}%` }}
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
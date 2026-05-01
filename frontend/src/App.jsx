return (
  <div className="feed-container">
    {feedData?.chunks?.map((chunk, index) => (
      <div key={index} className="chunk-slide">
        {/* Progress bar moved to top */}
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
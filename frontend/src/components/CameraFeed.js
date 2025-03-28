import React, { useRef, useEffect, useState } from 'react';
import '../styles/CameraFeed.css';

const CameraFeed = () => {
  const videoRef = useRef();
  const containerRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ 
    x: window.innerWidth - 280,  // Initial right position
    y: window.innerHeight - 210  // Initial bottom position
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      
      // Keep within viewport boundaries
      const boundedX = Math.max(0, Math.min(newX, window.innerWidth - containerRef.current.offsetWidth));
      const boundedY = Math.max(0, Math.min(newY, window.innerHeight - containerRef.current.offsetHeight));

      setPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleMouseDown = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="camera-container"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: 'move'
      }}
      onMouseDown={handleMouseDown}
    >
      <video ref={videoRef} autoPlay muted />
    </div>
  );
};

export default CameraFeed;

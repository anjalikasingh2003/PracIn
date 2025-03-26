// components/CameraFeed.js
import React, { useRef, useEffect } from 'react';
import '../styles/CameraFeed.css';

const CameraFeed = () => {
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  }, []);

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay muted />
    </div>
  );
};

export default CameraFeed;

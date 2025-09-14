import React, { useState, useEffect, useRef } from 'react';

const AdminTopbar = ({ toggleSidebar, api, activeSection }) => {
  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const notificationRef = useRef(null);

  const searchableSections = ['manage-authors', 'manage-books', 'user-management'];

  // --- Full Screen Logic ---
  const handleFullScreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);


  // --- Notification Logic ---
  const fetchNotification = async () => {
    try {
      const response = await api.get('/notification/');
      setNotification(response.data.message);
    } catch (error) {
      console.error("Failed to fetch notification:", error);
      setNotification("Could not load notifications.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleBellClick = () => {
    if (!notification) {
      fetchNotification();
    }
    setShowNotification(!showNotification);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <header style={{
        backgroundColor: '#f3f4f8',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 1000,
        gap: '1rem'
    }}>
      <button onClick={toggleSidebar} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>
        <i className="fas fa-bars"></i>
      </button>

      {searchableSections.includes(activeSection) && (
        <div style={{flexGrow: 1, maxWidth: '400px'}}>
          <input type="search" placeholder="Search..." style={{width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e5e7eb'}} />
        </div>
      )}

      <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
        <span>{today}</span>

        {/* Full Screen Button */}
        <button onClick={handleFullScreenToggle} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>
            <i className={`fas ${isFullScreen ? 'fa-compress' : 'fa-expand'}`}></i>
        </button>

        <div style={{position: 'relative'}} ref={notificationRef}>
            <button onClick={handleBellClick} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>
                <i className="fas fa-bell"></i>
            </button>
            {showNotification && (
                <div style={{position: 'absolute', top: '150%', right: 0, background: 'white', borderRadius: '8px', padding: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', width: '250px'}}>
                    {notification || "Loading..."}
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
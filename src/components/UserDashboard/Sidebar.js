import React from 'react';

const Sidebar = ({ user, userProfile, activeSection, setActiveSection, isOpen }) => {
  // --- STYLES ---

  const sidebarContainerStyle = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    left: isOpen ? '0' : '20px',
    height: '95vh',
    width: isOpen ? '260px' : '90px',
    background: 'linear-gradient(180deg, #4568dc 0%, #2a52b6 100%)',
    borderRadius: isOpen ? '0 25px 25px 0' : '25px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.4s ease-in-out',
    zIndex: 1000,
    padding: '20px 0',
  };

  const sidebarHeaderStyle = {
    padding: isOpen ? '10px 25px' : '10px 0',
    textAlign: 'center',
    // ✅ FIX: Reduced bottom margin when collapsed for better vertical spacing
    marginBottom: isOpen ? '30px' : '20px',
    transition: 'margin-bottom 0.4s ease-in-out',
  };

  const brandCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '15px 5px',
    display: isOpen ? 'block' : 'none',
  };

  const brandNameStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    fontFamily: `'Noto Sans Devanagari', sans-serif`,
    background: 'linear-gradient(45deg, #ffffff, #d1e0ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  };
  
  const navButtonStyle = (section) => ({
    width: 'calc(100% - 30px)',
    margin: '8px auto',
    padding: '15px 0', // ✅ FIX: Consistent vertical padding
    background: activeSection === section ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // ✅ FIX: Always center content
    borderRadius: '12px',
    position: 'relative',
  });
  
  const iconStyle = {
    fontSize: '1.2rem',
    width: '30px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    // ✅ FIX: Add left padding when open to make space for the icon
    paddingLeft: isOpen ? '25px' : '0',
  };
  
  const navTextStyle = {
    // ✅ FIX: Use flex-grow to fill remaining space when open
    flexGrow: 1,
    textAlign: 'left',
    marginLeft: '15px',
    fontWeight: 500,
    opacity: isOpen ? 1 : 0,
    // ✅ FIX: A very short transition makes it feel snappy
    transition: 'opacity 0.2s ease',
    whiteSpace: 'nowrap',
    // ✅ FIX: Hide the element completely from the layout when collapsed
    display: isOpen ? 'block' : 'none',
  };
  
  const sidebarFooterStyle = {
    marginTop: 'auto',
    padding: '10px 0', // ✅ FIX: Consistent padding for centering
    // ✅ FIX: Use flexbox to perfectly center the avatar
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  const userAvatarStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    objectFit: 'cover',
  };
  
  const userInfoStyle = {
    // ✅ FIX: Hiding with display: none is the most reliable way
    display: isOpen ? 'block' : 'none',
    marginLeft: '10px',
    textAlign: 'left',
  };

  return (
    <aside style={sidebarContainerStyle}>
      <div style={sidebarHeaderStyle}>
        <div style={brandCardStyle}>
          <h2 style={brandNameStyle}>ग्रन्थालय</h2>
        </div>
      </div>
      
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['dashboard', 'available-books', 'borrowing-history', 'my-account'].map((item) => {
            const icons = {
              dashboard: 'fa-tachometer-alt',
              'available-books': 'fa-book',
              'borrowing-history': 'fa-history',
              'my-account': 'fa-user-circle',
            };
            const text = item.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            return (
              <li key={item}>
                <button style={navButtonStyle(item)} onClick={() => setActiveSection(item)}>
                  <i className={`fas ${icons[item]}`} style={iconStyle}></i>
                  {/* ✅ FIX: Conditionally render the span for foolproof layout */}
                  {isOpen && <span style={navTextStyle}>{text}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div style={sidebarFooterStyle}>
        <img
          src={userProfile?.profile_photo || `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=e0e0e0&color=2a52b6`}
          alt="User"
          style={userAvatarStyle}
        />
        <div style={userInfoStyle}>
          <span style={{ fontWeight: '600', display: 'block', color: 'white' }}>
            {userProfile?.first_name || user?.first_name}
          </span>
          <span style={{ fontSize: '0.8rem', opacity: '0.8' }}>Member</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


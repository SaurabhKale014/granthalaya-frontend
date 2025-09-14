import React from 'react';

// --- STYLES OBJECT ---
const styles = {
  sidebarContainer: {
    width: '250px',
    background: 'linear-gradient(180deg, #4e73df 0%, #224abe 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarContainerMobile: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    overflowX: 'auto',
  },
  header: {
    padding: '20px',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  nav: {
    flex: 1,
    padding: '20px 0',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navListMobile: {
    display: 'flex',
  },
  navButton: (isActive) => ({
    width: '100%',
    padding: '12px 20px',
    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'none',
    border: 'none',
    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    whiteSpace: 'nowrap',
  }),
  footer: {
    padding: '15px',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  footerMobile: {
    display: 'none', // Hide footer on mobile sidebar to save space
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '600',
  },
  userRole: {
    fontSize: '0.8rem',
    opacity: '0.8',
  },
};

const Sidebar = ({ user, userProfile, activeSection, setActiveSection, isMobile }) => {
  const navItems = [
    { key: 'dashboard', icon: 'fa-tachometer-alt', text: 'Dashboard' },
    { key: 'available-books', icon: 'fa-book', text: 'Available Books' },
    { key: 'borrowing-history', icon: 'fa-history', text: 'Borrowing History' },
    { key: 'my-account', icon: 'fa-user-circle', text: 'My Account' },
  ];

  const sidebarContainerStyle = {
    ...styles.sidebarContainer,
    ...(isMobile ? styles.sidebarContainerMobile : {}),
  };
  
  const navListStyle = {
    ...styles.navList,
    ...(isMobile ? styles.navListMobile : {}),
  };
  
  const footerStyle = {
    ...styles.footer,
    ...(isMobile ? styles.footerMobile : {}),
  }

  return (
    <aside style={sidebarContainerStyle}>
      {!isMobile && (
        <div style={styles.header}>
          <h2>Granthalaya</h2>
        </div>
      )}
      <nav style={styles.nav}>
        <ul style={navListStyle}>
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                style={styles.navButton(activeSection === item.key)}
                onClick={() => setActiveSection(item.key)}
              >
                <i className={`fas ${item.icon}`}></i>
                {!isMobile || item.key === 'dashboard' ? item.text : ''} {/* Show text for dashboard or desktop */}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div style={footerStyle}>
        <div style={styles.userInfo}>
          <img
            src={userProfile?.profile_pic || `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`}
            alt="User"
            style={styles.userAvatar}
          />
          <div style={styles.userDetails}>
            <span style={styles.userName}>{user?.first_name} {user?.last_name}</span>
            <span style={styles.userRole}>Member</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
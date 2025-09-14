

// import React, { useState } from 'react';

// const AdminSidebar = ({ user, activeSection, setActiveSection, isOpen, onLogout }) => {
//   const [isApprovalMenuOpen, setApprovalMenuOpen] = useState(false);

//   // --- Styles ---
//   const sidebarStyle = {
//     backgroundColor: '#ffffff',
//     width: '260px',
//     height: '100vh',
//     position: 'fixed', // Changed for responsiveness
//     left: 0,
//     top: 0,
//     borderRight: '1px solid #e5e7eb',
//     display: 'flex',
//     flexDirection: 'column',
//     padding: '24px',
//     zIndex: 1001,
//   };

//   const navItemStyle = (id) => ({
//     display: 'flex', alignItems: 'center', padding: '12px 16px',
//     borderRadius: '8px', marginBottom: '8px', cursor: 'pointer',
//     color: activeSection === id ? '#ffffff' : '#111827',
//     backgroundColor: activeSection === id ? '#0f172a' : 'transparent',
//     fontWeight: 500,
//   });

//   const subNavItemStyle = (id) => ({ ...navItemStyle(id), paddingLeft: '48px' });

//   // --- Nav Items ---
//   const mainNavItems = [
//     { id: 'dashboard', text: 'Dashboard', icon: 'fa-th-large' },
//     { id: 'manage-authors', text: 'Authors', icon: 'fa-feather-alt' },
//     { id: 'manage-books', text: 'Books', icon: 'fa-book' },
//     { id: 'all-records', text: 'All Records', icon: 'fa-history' },
//     { id: 'user-management', text: 'Users', icon: 'fa-users' },
//     { id: 'my-account', text: 'My Account', icon: 'fa-user-circle' },
//   ];

//   return (
//     <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} style={sidebarStyle}>
//       <div style={{ marginBottom: '2rem' }}><h1 style={{ color: '#0f172a', fontSize: '1.5rem' }}>GRANTHALAYA</h1></div>
//       <nav style={{ flexGrow: 1, overflowY: 'auto' }}>
//         {mainNavItems.map(item => (
//           <div key={item.id} style={navItemStyle(item.id)} onClick={() => setActiveSection(item.id)}>
//             <i className={`fas ${item.icon}`} style={{ width: '20px', marginRight: '16px' }}></i>
//             <span>{item.text}</span>
//           </div>
//         ))}
//         <div>
//           <div style={navItemStyle('')} onClick={() => setApprovalMenuOpen(!isApprovalMenuOpen)}>
//             <i className="fas fa-check-double" style={{ width: '20px', marginRight: '16px' }}></i>
//             <span>Approvals</span>
//             <i className={`fas fa-chevron-down`} style={{ marginLeft: 'auto', transform: isApprovalMenuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}></i>
//           </div>
//           {isApprovalMenuOpen && (
//             <div>
//               <div style={subNavItemStyle('borrow-requests')} onClick={() => setActiveSection('borrow-requests')}>Borrow Requests</div>
//               <div style={subNavItemStyle('return-requests')} onClick={() => setActiveSection('return-requests')}>Return Requests</div>
//             </div>
//           )}
//         </div>
//       </nav>
//       <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', flexShrink: 0 }}>
//           <div style={{display: 'flex', alignItems: 'center'}}>
//             <img src={`https://ui-avatars.com/api/?name=${user.first_name}&background=0f172a&color=fff`} alt="user" style={{width: 40, height: 40, borderRadius: '50%'}}/>
//             <div style={{marginLeft: '12px', overflow: 'hidden', whiteSpace: 'nowrap'}}>
//                 <div style={{fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden'}}>{user.first_name}</div>
//                 <div style={{fontSize: '0.8rem', color: '#6b7280', textOverflow: 'ellipsis', overflow: 'hidden'}}>{user.email}</div>
//             </div>
//             <button onClick={onLogout} style={{marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>
//                 <i className="fas fa-sign-out-alt"></i>
//             </button>
//           </div>
//       </div>
//     </aside>
//   );
// };

// export default AdminSidebar;

import React, { useState } from 'react';

const AdminSidebar = ({ user, activeSection, setActiveSection, isOpen, onLogout }) => {
  const [isApprovalMenuOpen, setApprovalMenuOpen] = useState(false);

  // --- Styles ---
  const sidebarStyle = {
    backgroundColor: '#ffffff',
    width: isOpen ? '260px' : '90px',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001,
    transition: 'width 0.3s ease-in-out, transform 0.3s ease-in-out',
  };

  const headerStyle = {
    padding: '24px 16px', marginBottom: '1rem', flexShrink: 0,
    textAlign: 'center',
  };

  const navStyle = { flexGrow: 1, overflowY: 'auto', padding: '0 16px' };
  
  const footerStyle = { borderTop: '1px solid #e5e7eb', padding: '16px', flexShrink: 0 };

  const navItemStyle = (id) => ({
    display: 'flex', alignItems: 'center', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '8px', cursor: 'pointer',
    color: activeSection === id ? '#ffffff' : '#111827',
    backgroundColor: activeSection === id ? '#0f172a' : 'transparent',
    fontWeight: 500, whiteSpace: 'nowrap',
    justifyContent: isOpen ? 'flex-start' : 'center',
  });

  const subNavItemStyle = (id) => ({ ...navItemStyle(id), paddingLeft: isOpen ? '48px' : '16px' });

  const mainNavItems = [
    { id: 'dashboard', text: 'Dashboard', icon: 'fa-th-large' },
    { id: 'manage-authors', text: 'Authors', icon: 'fa-feather-alt' },
    { id: 'manage-books', text: 'Books', icon: 'fa-book' },
    { id: 'all-records', text: 'All Records', icon: 'fa-history' },
    { id: 'user-management', text: 'Users', icon: 'fa-users' },
    { id: 'my-account', text: 'My Account', icon: 'fa-user-circle' },
  ];
  
  // --- This is the new, robust footer rendering logic ---
  const renderFooter = () => {
    // If the user object isn't loaded yet, return a placeholder to prevent crashing.
    if (!user) {
      return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
           <div style={{width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f0f0f0'}}></div>
        </div>
      );
    }

    // If the user object IS loaded, render the full details.
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center'}}>
        <img 
          src={`https://ui-avatars.com/api/?name=${user.first_name}&background=0f172a&color=fff`} 
          alt="user" 
          style={{width: 40, height: 40, borderRadius: '50%'}}
        />
        {isOpen && (
          <div style={{marginLeft: '12px', overflow: 'hidden', whiteSpace: 'nowrap'}}>
              <div style={{fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden'}}>{user.first_name}</div>
              <div style={{fontSize: '0.8rem', color: '#6b7280', textOverflow: 'ellipsis', overflow: 'hidden'}}>{user.email}</div>
          </div>
        )}
        {isOpen && (
          <button onClick={onLogout} style={{marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>
              <i className="fas fa-sign-out-alt"></i>
          </button>
        )}
      </div>
    );
  };


  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} style={sidebarStyle}>
      <div style={headerStyle}>
        <h1 style={{ color: '#0f172a', fontSize: '1.5rem', display: isOpen ? 'block' : 'none' }}>GRANTHALAYA</h1>
        <i className="fas fa-book-reader" style={{color: '#0f172a', fontSize: '2rem', display: isOpen ? 'none' : 'block'}}></i>
      </div>

      <nav style={navStyle}>
        {mainNavItems.map(item => (
          <div key={item.id} style={navItemStyle(item.id)} onClick={() => setActiveSection(item.id)}>
            <i className={`fas ${item.icon}`} style={{ width: '20px', marginRight: isOpen ? '16px' : '0' }}></i>
            {isOpen && <span>{item.text}</span>}
          </div>
        ))}
        <div>
          <div style={navItemStyle('')} onClick={() => setApprovalMenuOpen(!isApprovalMenuOpen)}>
            <i className="fas fa-check-double" style={{ width: '20px', marginRight: isOpen ? '16px' : '0' }}></i>
            {isOpen && <span>Approvals</span>}
            {isOpen && <i className={`fas fa-chevron-down`} style={{ marginLeft: 'auto', transform: isApprovalMenuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}></i>}
          </div>
          {isApprovalMenuOpen && isOpen && (
            <div>
              <div style={subNavItemStyle('borrow-requests')} onClick={() => setActiveSection('borrow-requests')}>Borrow Requests</div>
              <div style={subNavItemStyle('return-requests')} onClick={() => setActiveSection('return-requests')}>Return Requests</div>
            </div>
          )}
        </div>
      </nav>

      <div style={footerStyle}>
          {renderFooter()}
      </div>
    </aside>
  );
};

export default AdminSidebar;
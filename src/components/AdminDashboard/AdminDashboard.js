// import React, { useState } from 'react';
// import api from '../../services/api'; 
// import './AdminDashboard.css';

// import AdminSidebar from './AdminSidebar';
// import AdminTopbar from './AdminTopbar';
// import AdminHome from './AdminHome';
// import ManageAuthors from './ManageAuthors';
// import ManageBooks from './ManageBooks';
// import BorrowRequests from './BorrowRequests';
// import ReturnRequests from './ReturnRequests';
// import AllRecords from './AllRecords';
// import UserManagement from './UserManagement';
// import AdminMyAccount from './AdminMyAccount'; // ✅ IMPORT THE NEW COMPONENT

// const AdminDashboard = ({ user, onLogout }) => {
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(prev => !prev);
//   };

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'dashboard': return <AdminHome api={api} />;
//       case 'manage-authors': return <ManageAuthors api={api} />;
//       case 'manage-books': return <ManageBooks api={api} />;
//       case 'borrow-requests': return <BorrowRequests api={api} />;
//       case 'return-requests': return <ReturnRequests api={api} />;
//       case 'all-records': return <AllRecords api={api} />;
//       case 'user-management': return <UserManagement api={api} />;
//       // ✅ USE THE NEW AdminMyAccount COMPONENT
//       case 'my-account': return <AdminMyAccount user={user} onLogout={onLogout} api={api} />;
//       default: return <AdminHome api={api} />;
//     }
//   };

//   const mainContentClass = `admin-main-content ${!isSidebarOpen ? 'collapsed' : ''}`;

//   return (
//     <div className="admin-dashboard-layout">
//       <AdminSidebar
//         user={user}
//         activeSection={activeSection}
//         setActiveSection={setActiveSection}
//         isOpen={isSidebarOpen}
//         onLogout={onLogout}
//       />
//       <main className={mainContentClass}>
//         <AdminTopbar 
//           toggleSidebar={toggleSidebar} 
//           api={api} 
//           activeSection={activeSection}
//         />
//         <div className="admin-content-area">
//           {renderContent()}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react'; // Import useEffect
import api from '../../services/api'; 
import './AdminDashboard.css';

import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminHome from './AdminHome';
import ManageAuthors from './ManageAuthors';
import ManageBooks from './ManageBooks';
import BorrowRequests from './BorrowRequests';
import ReturnRequests from './ReturnRequests';
import AllRecords from './AllRecords';
import UserManagement from './UserManagement';
import AdminMyAccount from './AdminMyAccount';

const AdminDashboard = ({ user, onLogout }) => {
  // Set initial state based on window width: hidden on mobile, visible on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 992);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const isMobile = window.innerWidth <= 992;

  // This effect adds a listener to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      // If window is resized to be larger than 992px, show the sidebar
      // Otherwise, leave it as is (so it doesn't pop open on mobile)
      if (window.innerWidth > 992) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Cleanup the listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  // New function to close sidebar on mobile after clicking a link
  const handleNavItemClick = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <AdminHome api={api} />;
      case 'manage-authors': return <ManageAuthors api={api} />;
      case 'manage-books': return <ManageBooks api={api} />;
      case 'borrow-requests': return <BorrowRequests api={api} />;
      case 'return-requests': return <ReturnRequests api={api} />;
      case 'all-records': return <AllRecords api={api} />;
      case 'user-management': return <UserManagement api={api} />;
      case 'my-account': return <AdminMyAccount user={user} onLogout={onLogout} api={api} />;
      default: return <AdminHome api={api} />;
    }
  };

  const mainContentClass = `admin-main-content ${!isSidebarOpen && !isMobile ? 'collapsed' : ''}`;

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar
        user={user}
        activeSection={activeSection}
        setActiveSection={handleNavItemClick} // Use the new handler
        isOpen={isSidebarOpen}
        onLogout={onLogout}
      />
      <main className={mainContentClass}>
        <AdminTopbar 
          toggleSidebar={toggleSidebar} 
          api={api} 
          activeSection={activeSection}
        />
        <div className="admin-content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
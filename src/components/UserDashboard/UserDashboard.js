
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import './UserDashboard.css'; 
// import api from '../../services/api';
// import Sidebar from './Sidebar';
// import Topbar from './Topbar';
// import DashboardHome from './DashboardHome';
// import AvailableBooks from './AvailableBooks';
// import BorrowingHistory from './BorrowingHistory';
// import MyAccount from './MyAccount';

// const UserDashboard = ({ user, onLogout }) => {
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [stats, setStats] = useState({ borrowed: 0, returned: 0 });
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState({ profile: false, stats: false });
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
//   const hasFetched = useRef({ profile: false, stats: false });
//   const abortControllers = useRef({ profile: null, stats: null });

//   const toggleSidebar = () => {
//     setIsSidebarOpen(prev => !prev);
//   };
  
//   useEffect(() => {
//     const controllers = abortControllers.current;
//     return () => {
//       Object.values(controllers).forEach(controller => controller?.abort());
//     };
//   }, []);

//   const fetchCommonData = useCallback(async (type) => {
//     if (loading[type] || hasFetched.current[type]) return;

//     abortControllers.current[type]?.abort();
//     abortControllers.current[type] = new AbortController();
//     setLoading(prev => ({ ...prev, [type]: true }));
//     try {
//       if (type === 'stats') {
//         const response = await api.get('/borrowing-history/', { signal: abortControllers.current.stats.signal });
//         const historyData = response.data.borrowing_history;
//         const borrowedCount = historyData.filter(item => item.status === 'approved' || item.status_display === 'Borrowed').length;
//         const returnedCount = historyData.filter(item => item.status === 'return_verified' || item.status_display === 'Returned').length;
//         setStats({ borrowed: borrowedCount, returned: returnedCount });
//       } else if (type === 'profile') {
//         const response = await api.get('/my-account/', { signal: abortControllers.current.profile.signal });
//         setUserProfile(response.data);
//       }
//       hasFetched.current[type] = true;
//     } catch (error) {
//       if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
//         console.error(`Error fetching ${type}:`, error);
//         hasFetched.current[type] = false;
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, [type]: false }));
//     }
//   }, []); 

//   useEffect(() => {
//     fetchCommonData('profile');
//   }, [fetchCommonData]);

//   useEffect(() => {
//     if (activeSection === 'dashboard' || activeSection === 'my-account') {
//       fetchCommonData('stats');
//     }
//   }, [activeSection, fetchCommonData]);

//   const handleRefresh = (section) => {
//     hasFetched.current[section] = false;
//     if (section === 'stats' || section === 'profile') {
//       fetchCommonData(section);
//     }
//   };

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'dashboard':
//         return <DashboardHome user={user} stats={stats} loading={loading.stats} setActiveSection={setActiveSection} />;
//       case 'available-books':
//         return <AvailableBooks api={api} onDataChange={() => handleRefresh('stats')} />;
//       case 'borrowing-history':
//         return <BorrowingHistory api={api} onDataChange={() => handleRefresh('stats')} />;
//       case 'my-account':
//         return <MyAccount user={user} userProfile={userProfile} stats={stats} loading={loading.profile} api={api} onRefresh={() => handleRefresh('profile')} onLogout={onLogout} />;
//       default: return null;
//     }
//   };
  
//   const mainContentClass = `main-content ${!isSidebarOpen ? 'collapsed' : ''}`;

//   return (
//     <div className="user-dashboard">
//       <Sidebar 
//         user={user} 
//         userProfile={userProfile} 
//         activeSection={activeSection} 
//         setActiveSection={setActiveSection}
//         isOpen={isSidebarOpen} // Pass state to sidebar
//       />
//       <div className={mainContentClass}>
//         <Topbar activeSection={activeSection} toggleSidebar={toggleSidebar} />
//         <div className="content-area">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import './UserDashboard.css'; 
import api from '../../services/api';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardHome from './DashboardHome';
import AvailableBooks from './AvailableBooks';
import BorrowingHistory from './BorrowingHistory';
import MyAccount from './MyAccount';

const UserDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({ borrowed: 0, returned: 0 });
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState({ profile: false, stats: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const hasFetched = useRef({ profile: false, stats: false });
  const abortControllers = useRef({ profile: null, stats: null });

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  useEffect(() => {
    const controllers = abortControllers.current;
    return () => {
      Object.values(controllers).forEach(controller => controller?.abort());
    };
  }, []);

  const fetchCommonData = useCallback(async (type) => {
    // ✅ FIX: Added 'loading' to the dependency array below, so this check is now valid.
    if (loading[type] || hasFetched.current[type]) return;

    abortControllers.current[type]?.abort();
    abortControllers.current[type] = new AbortController();
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      if (type === 'stats') {
        const response = await api.get('/borrowing-history/', { signal: abortControllers.current.stats.signal });
        const historyData = response.data.borrowing_history;
        const borrowedCount = historyData.filter(item => item.status === 'approved' || item.status_display === 'Borrowed').length;
        const returnedCount = historyData.filter(item => item.status === 'return_verified' || item.status_display === 'Returned').length;
        setStats({ borrowed: borrowedCount, returned: returnedCount });
      } else if (type === 'profile') {
        const response = await api.get('/my-account/', { signal: abortControllers.current.profile.signal });
        setUserProfile(response.data);
      }
      hasFetched.current[type] = true;
    } catch (error) {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error(`Error fetching ${type}:`, error);
        hasFetched.current[type] = false;
      }
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [loading]); // ✅ FIX: Added the missing 'loading' dependency.

  useEffect(() => {
    fetchCommonData('profile');
  }, [fetchCommonData]);

  useEffect(() => {
    if (activeSection === 'dashboard' || activeSection === 'my-account') {
      fetchCommonData('stats');
    }
  }, [activeSection, fetchCommonData]);

  const handleRefresh = (section) => {
    hasFetched.current[section] = false;
    if (section === 'stats' || section === 'profile') {
      fetchCommonData(section);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome user={user} stats={stats} loading={loading.stats} setActiveSection={setActiveSection} />;
      case 'available-books':
        return <AvailableBooks api={api} onDataChange={() => handleRefresh('stats')} />;
      case 'borrowing-history':
        return <BorrowingHistory api={api} onDataChange={() => handleRefresh('stats')} />;
      case 'my-account':
        return <MyAccount user={user} userProfile={userProfile} stats={stats} loading={loading.profile} api={api} onRefresh={() => handleRefresh('profile')} onLogout={onLogout} />;
      default: return null;
    }
  };
  
  const mainContentClass = `main-content ${!isSidebarOpen ? 'collapsed' : ''}`;

  return (
    <div className="user-dashboard">
      <Sidebar 
        user={user} 
        userProfile={userProfile} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className={mainContentClass}>
        <Topbar activeSection={activeSection} toggleSidebar={toggleSidebar} />
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
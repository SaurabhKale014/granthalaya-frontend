
// import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
// import Login from './components/Login';
// import UserDashboard from './components/UserDashboard/UserDashboard';
// // 2. FIX: Corrected the AdminDashboard path for future consistency
// import AdminDashboard from './components/AdminDashboard/AdminDashboard'; 
// import './App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 3. FIX: Wrap `logout` in useCallback so it's a stable function.
//   // This prevents it from being recreated on every render and satisfies the dependency rule below.
//   const logout = useCallback(() => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//   }, []); // Empty dependency array means this function is created only once.

//   useEffect(() => {
//     const checkAuthentication = () => {
//       const token = localStorage.getItem('accessToken');
//       const userData = localStorage.getItem('user');
      
//       if (token && userData) {
//         try {
//           const userObj = JSON.parse(userData);
//           setIsAuthenticated(true);
//           setUser(userObj);
//         } catch (error) {
//           console.error('Error parsing user data from localStorage:', error);
//           logout(); // Call the stable logout function
//         }
//       }
//       setLoading(false);
//     };

//     checkAuthentication();
//   }, [logout]); // 4. FIX: Add `logout` as a dependency.

//   const handleLogin = (userData) => {
//     setIsAuthenticated(true);
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   if (isAuthenticated && user) {
//     return user.is_admin ? 
//       <AdminDashboard user={user} onLogout={logout} /> :
//       <UserDashboard user={user} onLogout={logout} />;
//   }

//   return <Login onLogin={handleLogin} />;
// }

// export default App;

import React, { useState, useEffect } from 'react'; // Removed useCallback as it's not needed here
import Login from './components/Login';
import UserDashboard from './components/UserDashboard/UserDashboard';
import AdminDashboard from './components/AdminDashboard/AdminDashboard'; 
import './App.css';

function App() {
  // We only need one state for the user object. If it exists, they are authenticated.
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // This effect runs only once when the app component first mounts
  useEffect(() => {
    const checkUserOnLoad = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        
        // Only if both the user data and token exist, we set the user state
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to parse user data from storage.', error);
        // If data is corrupt, clear it to be safe
        localStorage.clear();
      } finally {
        // We are done checking, so we can stop the loading screen
        setLoading(false);
      }
    };

    checkUserOnLoad();
  }, []); // The empty dependency array [] ensures this runs only once

  const handleLogin = (userData) => {
    setUser(userData);
    // The Login component already saves to localStorage, so no need to do it here
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  // While we are checking localStorage, show a loading message
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading Application...</div>
      </div>
    );
  }

  // ✅ THE KEY FIX: We now have a single, foolproof condition.
  // If the 'user' object exists, render a dashboard. If not, render the Login page.
  // This completely prevents the race condition.
  if (user) {
    return user.is_admin ? 
      <AdminDashboard user={user} onLogout={handleLogout} /> :
      <UserDashboard user={user} onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} />;
}

export default App;
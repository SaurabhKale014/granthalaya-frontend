// src/components/DashboardLayout/DashboardLayout.js
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api'; // Make sure this path is correct
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import DashboardHome from '../DashboardHome/DashboardHome';
import AvailableBooks from '../AvailableBooks/AvailableBooks';
import BorrowingHistory from '../BorrowingHistory/BorrowingHistory';
import MyAccount from '../MyAccount/MyAccount';
import './DashboardLayout.css'; // Keep the main layout CSS here

const DashboardLayout = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({ borrowed: 0, returned: 0 });
  const [userProfile, setUserProfile] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Use refs to track API call status for global data
  const hasFetchedStatsRef = useRef(false);
  const hasFetchedProfileRef = useRef(false);

  const abortControllerStatsRef = useRef(null);
  const abortControllerProfileRef = useRef(null);

  // Cleanup function to abort ongoing requests
  useEffect(() => {
    return () => {
      if (abortControllerStatsRef.current) {
        abortControllerStatsRef.current.abort();
      }
      if (abortControllerProfileRef.current) {
        abortControllerProfileRef.current.abort();
      }
    };
  }, []);

  const fetchStats = async () => {
    if (loadingStats || hasFetchedStatsRef.current) return;

    if (abortControllerStatsRef.current) {
      abortControllerStatsRef.current.abort();
    }
    abortControllerStatsRef.current = new AbortController();

    setLoadingStats(true);
    try {
      const response = await api.get('/borrowing-history/', {
        signal: abortControllerStatsRef.current.signal,
      });
      const historyData = response.data.borrowing_history;

      const borrowedCount = historyData.filter(
        (item) => item.status === 'approved' || item.status_display === 'Borrowed'
      ).length;

      const returnedCount = historyData.filter(
        (item) => item.status === 'return_verified' || item.status_display === 'Returned'
      ).length;

      setStats({ borrowed: borrowedCount, returned: returnedCount });
      hasFetchedStatsRef.current = true;
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        console.log('Stats request was aborted');
      } else {
        console.error('Error fetching stats:', error);
        hasFetchedStatsRef.current = false;
      }
    } finally {
      setLoadingStats(false);
      abortControllerStatsRef.current = null;
    }
  };

  const fetchUserProfile = async () => {
    if (loadingProfile || hasFetchedProfileRef.current) return;

    if (abortControllerProfileRef.current) {
      abortControllerProfileRef.current.abort();
    }
    abortControllerProfileRef.current = new AbortController();

    setLoadingProfile(true);
    try {
      const response = await api.get('/user/profile/', {
        signal: abortControllerProfileRef.current.signal,
      });
      setUserProfile(response.data);
      hasFetchedProfileRef.current = true;
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        console.log('User profile request was aborted');
      } else {
        console.error('Error fetching user profile:', error);
        hasFetchedProfileRef.current = false;
      }
    } finally {
      setLoadingProfile(false);
      abortControllerProfileRef.current = null;
    }
  };

  // Fetch stats and profile on initial load and when activeSection changes for relevant sections
  useEffect(() => {
    fetchUserProfile(); // Always try to fetch profile for sidebar info
  }, []);

  useEffect(() => {
    if (activeSection === 'dashboard' || activeSection === 'my-account') {
      fetchStats();
    }
    if (activeSection === 'my-account') {
      fetchUserProfile();
    }
  }, [activeSection]);


  const handleRefreshStats = () => {
    hasFetchedStatsRef.current = false;
    fetchStats();
  };

  const handleRefreshProfile = () => {
    hasFetchedProfileRef.current = false;
    fetchUserProfile();
  };

  const handleLogout = () => {
    onLogout();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardHome
            user={user}
            stats={stats}
            loadingStats={loadingStats}
            setActiveSection={setActiveSection}
            onRefreshStats={handleRefreshStats}
          />
        );
      case 'available-books':
        return <AvailableBooks api={api} />;
      case 'borrowing-history':
        return <BorrowingHistory api={api} />;
      case 'my-account':
        return (
          <MyAccount
            user={user}
            userProfile={userProfile}
            stats={stats}
            loadingProfile={loadingProfile}
            onRefreshProfile={handleRefreshProfile}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-dashboard">
      <Sidebar
        user={user}
        userProfile={userProfile}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="main-content">
        <Topbar activeSection={activeSection} />
        <div className="content-area">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
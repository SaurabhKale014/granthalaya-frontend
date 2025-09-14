import React, { useState, useEffect } from 'react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="admin-card dashboard-stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: `5px solid ${color}` }}>
    <i className={`fas ${icon}`} style={{ fontSize: '2rem', color }}></i>
    <div>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827' }}>{value}</div>
      <div style={{ color: '#6b7280' }}>{title}</div>
    </div>
  </div>
);

const UserStatCard = ({ total, active, inactive }) => (
  <div className="admin-card dashboard-stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
      <div>
        <h3 style={{ margin: 0, color: '#6b7280', fontWeight: 500 }}>Total Users</h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>{total}</p>
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        backgroundColor: '#ede9fe', color: '#8b5cf6',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <i className="fas fa-users"></i>
      </div>
    </div>
    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ height: 10, width: 10, backgroundColor: '#22c55e', borderRadius: '50%', marginRight: '8px' }}></span>
        <span style={{ color: '#6b7280' }}>Active Users - {active}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ height: 10, width: 10, backgroundColor: '#ef4444', borderRadius: '50%', marginRight: '8px' }}></span>
        <span style={{ color: '#6b7280' }}>Inactive Users - {inactive}</span>
      </div>
    </div>
  </div>
);

const AdminHome = ({ api }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin-dashboard/');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [api]);

  if (loading) return <div className="admin-card">Loading dashboard data...</div>;
  if (error) return <div className="admin-card">{error}</div>;

  return (
    <div>
      <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem'}}>Dashboard Overview</h2>
      <div className="dashboard-grid">
        <UserStatCard total={stats.total_users} active={stats.active_users} inactive={stats.inactive_users} />
        <StatCard title="Total Books" value={stats.total_books} icon="fa-book" color="#8b5cf6" />
        <StatCard title="Available Books" value={stats.available_books} icon="fa-check-circle" color="#22c55e" />
        <StatCard title="Pending Requests" value={stats.pending_requests} icon="fa-hourglass-half" color="#f97316" />
      </div>
    </div>
  );
};

export default AdminHome;
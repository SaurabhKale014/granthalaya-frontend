import React from 'react';

const DashboardHome = ({ user, stats, loading, setActiveSection }) => {
  // --- INLINE STYLES ---
  const welcomeSectionStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '25px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

  const statsCardsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  };

  const statCardBaseStyle = {
    borderRadius: '8px',
    padding: '20px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  };

  const statCardPrimaryStyle = { ...statCardBaseStyle, background: 'linear-gradient(135deg, #4e73df 0%, #2a5bc9 100%)' };
  const statCardSuccessStyle = { ...statCardBaseStyle, background: 'linear-gradient(135deg, #1cc88a 0%, #17a673 100%)' };

  const statNumberStyle = { fontSize: '1.8rem', fontWeight: 'bold' };

  const quickActionsCardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '25px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
  };

  const btnActionBaseStyle = {
    padding: '12px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: '500',
    color: 'white',
    gap: '8px',
  };

  const btnActionPrimaryStyle = { ...btnActionBaseStyle, background: 'linear-gradient(135deg, #4e73df 0%, #2a5bc9 100%)' };
  const btnActionSecondaryStyle = { ...btnActionBaseStyle, background: 'linear-gradient(135deg, #858796 0%, #6c757d 100%)' };

  return (
    <div>
      <div style={welcomeSectionStyle}>
        <h1 style={{ margin: '0 0 10px 0', color: '#4e73df' }}>Welcome, {user?.first_name}!</h1>
        <p style={{ margin: 0, color: '#858796' }}>Manage your books and borrowing history from your dashboard.</p>
      </div>

      <div style={statsCardsStyle}>
        <div style={statCardPrimaryStyle}>
          <i className="fas fa-book" style={{ fontSize: '2rem', opacity: 0.9 }}></i>
          <div>
            <div style={statNumberStyle}>{loading ? '...' : stats.borrowed}</div>
            <div style={{ opacity: 0.9 }}>Currently Borrowed</div>
          </div>
        </div>
        <div style={statCardSuccessStyle}>
          <i className="fas fa-check-circle" style={{ fontSize: '2rem', opacity: 0.9 }}></i>
          <div>
            <div style={statNumberStyle}>{loading ? '...' : stats.returned}</div>
            <div style={{ opacity: 0.9 }}>Books Returned</div>
          </div>
        </div>
      </div>

      <div style={quickActionsCardStyle}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button style={btnActionPrimaryStyle} onClick={() => setActiveSection('available-books')}>
            <i className="fas fa-book-open"></i> Browse Available Books
          </button>
          <button style={btnActionSecondaryStyle} onClick={() => setActiveSection('borrowing-history')}>
            <i className="fas fa-history"></i> View Borrowing History
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
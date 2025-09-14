import React, { useState, useEffect, useCallback } from 'react';

const StatusBadge = ({ status }) => {
  const style = {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'white',
    textTransform: 'capitalize'
  };
  let backgroundColor;
  switch (status.toLowerCase()) {
    case 'pending approval': backgroundColor = '#f97316'; break;
    case 'borrowed': backgroundColor = '#3b82f6'; break;
    case 'return requested': backgroundColor = '#eab308'; break;
    case 'returned': backgroundColor = '#22c55e'; break;
    default: backgroundColor = '#6b7280';
  }
  return <span style={{ ...style, backgroundColor }}>{status}</span>;
};


const AllRecords = ({ api }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/all-records/');
      setRecords(response.data.records);
    } catch (err) {
      console.error("Failed to fetch records:", err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="admin-card">
      <h2>All Transaction Records</h2>
      {loading ? <p>Loading records...</p> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{width: '50px'}}>Sr. No.</th>
                <th>User</th>
                <th>Book</th>
                <th>Author</th>
                <th>Status</th>
                <th>Requested At</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, index) => (
                <tr key={rec.record_id}>
                  <td>{index + 1}</td>
                  <td>{rec.user_name}</td>
                  <td>{rec.book_title}</td>
                  <td>{rec.author_name}</td>
                  <td><StatusBadge status={rec.status_display} /></td>
                  <td>{new Date(rec.borrow_requested_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllRecords;
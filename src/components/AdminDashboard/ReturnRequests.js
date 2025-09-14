// src/components/AdminDashboard/ReturnRequests.js
import React, { useState, useEffect, useCallback } from 'react';

const ReturnRequests = ({ api }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/return-request-list/');
      setRequests(response.data.data);
    } catch (err) {
      console.error("Failed to fetch return requests:", err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (recordId) => {
    setProcessingId(recordId);
    try {
      await api.patch(`/approve-return/${recordId}/`);
      alert("Return approved successfully!");
      fetchRequests();
    } catch (error) {
      console.error("Failed to approve return:", error);
      alert("Error approving return.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="admin-card">
      <h2>Pending Return Requests</h2>
      {loading ? <p>Loading requests...</p> : requests.length === 0 ? <p>No pending return requests.</p> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Book</th>
                <th>Request Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.record_id}>
                  <td>{req.user_name}</td>
                  <td>{req.book_name}</td>
                  <td>{new Date(req.request_date).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="admin-btn admin-btn-success"
                      onClick={() => handleApprove(req.record_id)}
                      disabled={processingId === req.record_id}
                    >
                      {processingId === req.record_id ? 'Approving...' : 'Approve Return'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReturnRequests;
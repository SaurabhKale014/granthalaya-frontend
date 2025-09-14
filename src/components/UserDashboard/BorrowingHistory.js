import React, { useState, useEffect, useCallback, useRef } from 'react';

// ✅ FIX: Define the base style as a separate constant first
const btnActionBase = {
  padding: '8px 15px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  color: 'white',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontWeight: 500,
  transition: 'background-color 0.2s ease',
};

// --- STYLES OBJECT ---
const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '25px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    color: '#4e7df',
  },
  refreshButton: {
    background: 'none',
    border: 'none',
    color: '#4e7df',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    backgroundColor: '#f8f9fc',
    color: '#4e7df',
    padding: '12px 15px',
    fontWeight: '600',
    borderBottom: '2px solid #e3e6f0',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #e3e6f0',
    verticalAlign: 'middle',
  },
  // ✅ FIX: Now we reference the constant directly
  returnButton: {
    ...btnActionBase,
    background: 'linear-gradient(135deg, #1cc88a 0%, #17a673 100%)',
  },
  returnButtonLoading: {
    ...btnActionBase,
    background: '#858796',
    cursor: 'not-allowed',
    opacity: 0.8,
  },
  statusBadge: (statusText) => {
    const base = {
      padding: '5px 12px',
      borderRadius: '12px',
      fontSize: '0.8rem',
      fontWeight: 500,
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
      display: 'inline-block',
    };
    const lowerStatus = (statusText || '').toLowerCase();

    if (lowerStatus.includes('borrowed')) {
      return { ...base, backgroundColor: '#d1fae5', color: '#065f46' }; // Green
    }
    if (lowerStatus.includes('pending')) {
      return { ...base, backgroundColor: '#fef3c7', color: '#92400e' }; // Yellow
    }
    if (lowerStatus.includes('returned')) {
      return { ...base, backgroundColor: '#e0f2fe', color: '#0c4a6e' }; // Light Blue
    }
    return { ...base, backgroundColor: '#e5e7eb', color: '#4b5563' }; // Grey
  },
};

const BorrowingHistory = ({ api, onDataChange }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returningId, setReturningId] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setLoading(true);
    try {
      const response = await api.get('/borrowing-history/', { signal: abortControllerRef.current.signal });
      setHistory(response.data.borrowing_history);
    } catch (error) {
      if (error.name !== 'CanceledError') console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
    return () => abortControllerRef.current?.abort();
  }, [fetchData]);

  const handleReturnRequest = async (recordId) => {
    setReturningId(recordId);
    try {
      await api.patch(`/return-request/${recordId}/`);
      alert('Return request submitted successfully!');
      onDataChange();
      fetchData();
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to submit return request.');
    } finally {
      setReturningId(null);
    }
  };

  if (loading) return <div style={styles.card}>Loading history...</div>;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Borrowing History</h2>
        <button
          onClick={fetchData}
          disabled={loading || returningId}
          style={styles.refreshButton}
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
      {history.length === 0 ? (
        <p>No borrowing history found.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{...styles.th, width: '60px'}}>Sr. No.</th>
                <th style={styles.th}>Book Title</th>
                <th style={styles.th}>Author</th>
                <th style={styles.th}>ISBN</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Requested Date</th>
                {/* <th style={{...styles.th, textAlign: 'center'}}>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {history.map((record, index) => (
                <tr key={record.record_id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{record.book_title}</td>
                  <td style={styles.td}>{record.author_name}</td>
                  <td style={styles.td}>{record.isbn}</td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(record.status_display)}>
                      {record.status_display}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(record.requested_at).toLocaleDateString()}</td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    {record.status_display === 'Borrowed' && (
                      <button
                        style={returningId === record.record_id ? styles.returnButtonLoading : styles.returnButton}
                        onClick={() => handleReturnRequest(record.record_id)}
                        disabled={returningId !== null}
                      >
                        {returningId === record.record_id ? (
                           <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Processing...</span>
                           </>
                        ) : (
                           <>
                                <i className="fas fa-undo"></i>
                                <span>Return</span>
                           </>
                        )}
                      </button>
                    )}
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

export default BorrowingHistory;
import React, { useState, useEffect, useRef, useCallback } from 'react';

const AvailableBooks = ({ api, onDataChange }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  // State to track the ID of the book being borrowed
  const [borrowingId, setBorrowingId] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setLoading(true);

    try {
      const response = await api.get('/available-books/', { signal: abortControllerRef.current.signal });
      setBooks(response.data.books);
    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error('Error fetching books:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  const handleBorrowRequest = async (bookId) => {
    // Set the loading state for this specific book
    setBorrowingId(bookId);
    try {
      await api.post(`/borrow-request/${bookId}/`);
      alert('Borrow request submitted successfully!');
      onDataChange(); // Notify parent to refresh stats
      fetchData();     // Re-fetch the book list
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Failed to submit borrow request.');
    } finally {
      // Reset the loading state after the request is complete
      setBorrowingId(null);
    }
  };

  // --- STYLES ---
  const cardStyle = { backgroundColor: 'white', borderRadius: '8px', padding: '25px', boxShadow: '0 3px 6px rgba(0,0,0,0.1)' };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse' };
  const thStyle = { backgroundColor: '#f8f9fc', color: '#4e73df', padding: '12px 15px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e3e6f0' };
  const tdStyle = { padding: '15px', borderBottom: '1px solid #e3e6f0' };
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
  const btnBorrowStyle = { ...btnActionBase, background: 'linear-gradient(135deg, #4e73df 0%, #2a5bc9 100%)' };
  // Style for the button when it's in a loading/disabled state
  const btnBorrowLoadingStyle = { ...btnActionBase, background: '#858796', cursor: 'not-allowed', opacity: 0.8 };

  if (loading) return <div style={cardStyle}>Loading books...</div>;

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, color: '#4e73df' }}>Available Books</h2>
        <button onClick={fetchData} disabled={loading || borrowingId} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4e73df', fontSize: '0.9rem' }}>
          <i className="fas fa-sync-alt" style={{ marginRight: '5px' }}></i> Refresh
        </button>
      </div>
      {books.length === 0 ? (
        <p>No books available at the moment.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{...thStyle, width: '60px'}}>Sr. No.</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Author</th>
                <th style={{...thStyle, width: '120px'}}>Published</th>
                <th style={{...thStyle, width: '150px', textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{book.title}</td>
                  <td style={tdStyle}>{book.author_name}</td>
                  <td style={tdStyle}>{new Date(book.published_date).toLocaleDateString()}</td>
                  <td style={{...tdStyle, textAlign: 'center'}}>
                    <button 
                      style={borrowingId === book.id ? btnBorrowLoadingStyle : btnBorrowStyle} 
                      onClick={() => handleBorrowRequest(book.id)}
                      // Disable the button if this or any other request is processing
                      disabled={borrowingId !== null} 
                    >
                      {borrowingId === book.id ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-hand-holding"></i>
                          <span>Borrow</span>
                        </>
                      )}
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

export default AvailableBooks;
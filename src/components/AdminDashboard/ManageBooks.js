// import React, { useState, useEffect, useCallback } from 'react';

// const BookModal = ({ isOpen, onClose, onSave, book, authors, processing }) => {
//   const [formData, setFormData] = useState({
//     title: '', author: '', isbn: '', published_date: '', total_copies: '', available_copies: ''
//   });

//   useEffect(() => {
//     if (book) {
//       setFormData({
//         title: book.title || '',
//         author: book.author || '',
//         isbn: book.isbn || '',
//         published_date: book.published_date || '',
//         total_copies: book.total_copies || '',
//         available_copies: book.available_copies || ''
//       });
//     } else {
//       setFormData({ title: '', author: '', isbn: '', published_date: '', total_copies: '', available_copies: ''});
//     }
//   }, [book]);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Title</label>
//             <input name="title" value={formData.title} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Author</label>
//             <select name="author" value={formData.author} onChange={handleChange} required>
//               <option value="">Select an Author</option>
//               {authors.map(author => <option key={author.id} value={author.id}>{author.name}</option>)}
//             </select>
//           </div>
//           <div className="form-group">
//             <label>ISBN</label>
//             <input name="isbn" value={formData.isbn} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Published Date</label>
//             <input type="date" name="published_date" value={formData.published_date} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Total Copies</label>
//             <input type="number" name="total_copies" value={formData.total_copies} onChange={handleChange} required />
//           </div>
//           <div className="form-group">
//             <label>Available Copies</label>
//             <input type="number" name="available_copies" value={formData.available_copies} onChange={handleChange} required />
//           </div>
//           <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
//             <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose} disabled={processing}>Cancel</button>
//             <button type="submit" className="admin-btn admin-btn-primary" disabled={processing}>
//               {processing ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };


// const ManageBooks = ({ api }) => {
//   const [books, setBooks] = useState([]);
//   const [authors, setAuthors] = useState([]);
//   const [authorMap, setAuthorMap] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingBook, setEditingBook] = useState(null);
//   const [processing, setProcessing] = useState(false);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [booksRes, authorsRes] = await Promise.all([
//         api.get('/books/'),
//         api.get('/authors/')
//       ]);
//       setBooks(booksRes.data);
//       setAuthors(authorsRes.data);
//       const newAuthorMap = authorsRes.data.reduce((map, author) => {
//         map[author.id] = author.name;
//         return map;
//       }, {});
//       setAuthorMap(newAuthorMap);
//     } catch (err) {
//       console.error("Failed to fetch data:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [api]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleSave = async (bookData) => {
//     setProcessing(true);
//     try {
//         if(editingBook) {
//             await api.patch(`/books/${editingBook.id}/`, bookData);
//         } else {
//             await api.post('/books/', bookData);
//         }
//         setIsModalOpen(false);
//         setEditingBook(null);
//         fetchData();
//     } catch (error) {
//         console.error("Failed to save book:", error);
//         alert("Error saving book.");
//     } finally {
//         setProcessing(false);
//     }
//   }

//   const handleDelete = async (bookId) => {
//       if(window.confirm("Are you sure you want to delete this book?")) {
//           try {
//               await api.delete(`/books/${bookId}/`);
//               fetchData();
//           } catch (error) {
//               console.error("Failed to delete book:", error);
//               alert("Error deleting book.");
//           }
//       }
//   }

//   return (
//     <div className="admin-card">
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//         <h2>Manage Books</h2>
//         <button className="admin-btn admin-btn-primary" onClick={() => { setEditingBook(null); setIsModalOpen(true); }}>Add New Book</button>
//       </div>

//       {loading ? <p>Loading books...</p> : (
//         <div className="admin-table-wrapper">
//           <table className="admin-table">
//             <thead>
//               <tr>
//                 <th style={{width: '50px'}}>Sr. No.</th>
//                 <th>Title</th>
//                 <th>Author</th>
//                 <th>ISBN</th>
//                 <th>Copies (Available/Total)</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {books.map((book, index) => (
//                 <tr key={book.id}>
//                   <td>{index + 1}</td>
//                   <td>{book.title}</td>
//                   <td>{authorMap[book.author] || 'Unknown'}</td>
//                   <td>{book.isbn}</td>
//                   <td>{book.available_copies} / {book.total_copies}</td>
//                   <td style={{display: 'flex', gap: '0.5rem'}}>
//                     <button className="admin-btn admin-btn-secondary" onClick={() => { setEditingBook(book); setIsModalOpen(true); }}>Edit</button>
//                     <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} book={editingBook} authors={authors} processing={processing}/>
//     </div>
//   );
// };

// export default ManageBooks;

import React, { useState, useEffect, useCallback } from 'react';

const BookModal = ({ isOpen, onClose, onSave, book, authors, processing }) => {
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', published_date: '', total_copies: '', available_copies: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        published_date: book.published_date || '',
        total_copies: book.total_copies || '',
        available_copies: book.available_copies || ''
      });
    } else {
      setFormData({ title: '', author: '', isbn: '', published_date: '', total_copies: '', available_copies: ''});
    }
  }, [book]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Author</label>
            <select name="author" value={formData.author} onChange={handleChange} required>
              <option value="">Select an Author</option>
              {authors.map(author => <option key={author.id} value={author.id}>{author.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input name="isbn" value={formData.isbn} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Published Date</label>
            <input type="date" name="published_date" value={formData.published_date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Total Copies</label>
            <input type="number" name="total_copies" value={formData.total_copies} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Available Copies</label>
            <input type="number" name="available_copies" value={formData.available_copies} onChange={handleChange} required />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose} disabled={processing}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={processing}>
              {processing ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ManageBooks = ({ api }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [authorMap, setAuthorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [booksRes, authorsRes] = await Promise.all([
        api.get('/books/'),
        api.get('/authors/')
      ]);
      setBooks(booksRes.data);
      setAuthors(authorsRes.data);
      const newAuthorMap = authorsRes.data.reduce((map, author) => {
        map[author.id] = author.name;
        return map;
      }, {});
      setAuthorMap(newAuthorMap);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (bookData) => {
    setProcessing(true);
    try {
      if (editingBook) {
        // ✅ FIX: This block now runs ONLY for editing (PATCH)
        // It creates the special payload with 'author_id'
        const { author, ...restOfData } = bookData;
        const payload = {
          ...restOfData,
          author_id: author,
        };
        await api.patch(`/books/${editingBook.id}/`, payload);
      } else {
        // This block runs ONLY for creating (POST)
        // It sends the original bookData, which works correctly
        await api.post('/books/', bookData);
      }

      // This part is the same for both
      setIsModalOpen(false);
      setEditingBook(null);
      fetchData();
    } catch (error) {
        console.error("Failed to save book:", error);
        alert("Error saving book.");
    } finally {
        setProcessing(false);
    }
  }

  const handleDelete = async (bookId) => {
      if(window.confirm("Are you sure you want to delete this book?")) {
          try {
              await api.delete(`/books/${bookId}/`);
              fetchData();
          } catch (error) {
              console.error("Failed to delete book:", error);
              alert("Error deleting book.");
          }
      }
  }

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Manage Books</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => { setEditingBook(null); setIsModalOpen(true); }}>Add New Book</button>
      </div>

      {loading ? <p>Loading books...</p> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{width: '50px'}}>Sr. No.</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Copies (Available/Total)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id}>
                  <td>{index + 1}</td>
                  <td>{book.title}</td>
                  <td>{authorMap[book.author] || 'Unknown'}</td>
                  <td>{book.isbn}</td>
                  <td>{book.available_copies} / {book.total_copies}</td>
                  <td style={{display: 'flex', gap: '0.5rem'}}>
                    <button className="admin-btn admin-btn-secondary" onClick={() => { setEditingBook(book); setIsModalOpen(true); }}>Edit</button>
                    <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} book={editingBook} authors={authors} processing={processing}/>
    </div>
  );
};

export default ManageBooks;
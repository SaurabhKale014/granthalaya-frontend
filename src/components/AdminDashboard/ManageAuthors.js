
import React, { useState, useEffect, useCallback } from 'react';

const AuthorModal = ({ isOpen, onClose, onSave, author, processing }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    setName(author ? author.name : '');
    setBio(author ? author.bio : '');
  }, [author]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, bio });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{author ? 'Edit Author' : 'Add New Author'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} required rows="4"></textarea>
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

const ManageAuthors = ({ api }) => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/authors/');
      setAuthors(response.data);
    } catch (err) {
      console.error("Failed to fetch authors:", err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const handleSave = async (authorData) => {
      setProcessing(true);
      try {
          if(editingAuthor) {
              await api.patch(`/authors/${editingAuthor.id}/`, authorData);
          } else {
              await api.post('/authors/', authorData);
          }
          setIsModalOpen(false);
          setEditingAuthor(null);
          fetchAuthors(); // Refresh list
      } catch (error) {
          console.error("Failed to save author:", error);
          alert("Error saving author.");
      } finally {
          setProcessing(false);
      }
  }

  const handleDelete = async (authorId) => {
      if(window.confirm("Are you sure you want to delete this author? This action cannot be undone.")) {
          try {
              await api.delete(`/authors/${authorId}/`);
              fetchAuthors(); // Refresh list
          } catch (error) {
              console.error("Failed to delete author:", error);
              alert("Error deleting author.");
          }
      }
  }

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Manage Authors</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => { setEditingAuthor(null); setIsModalOpen(true); }}>Add New Author</button>
      </div>

      {loading ? <p>Loading authors...</p> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{width: '50px'}}>Sr. No.</th>
                <th>Name</th>
                <th>Bio</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author, index) => (
                <tr key={author.id}>
                  <td>{index + 1}</td>
                  <td>{author.name}</td>
                  <td style={{maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{author.bio}</td>
                  <td style={{display: 'flex', gap: '0.5rem'}}>
                    <button className="admin-btn admin-btn-secondary" onClick={() => { setEditingAuthor(author); setIsModalOpen(true); }}>Edit</button>
                    <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(author.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AuthorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} author={editingAuthor} processing={processing} />
    </div>
  );
};

export default ManageAuthors;
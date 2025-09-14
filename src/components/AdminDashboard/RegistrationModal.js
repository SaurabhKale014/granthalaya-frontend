import React, { useState } from 'react';

const RegistrationModal = ({ isOpen, onClose, onSave, processing }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    contact_no: '',
    address: '',
    is_admin: 'No', // Default value
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert the 'Yes'/'No' string to a boolean for the API
    const payload = {
      ...formData,
      is_admin: formData.is_admin === 'Yes',
    };
    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input name="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input name="contact_no" value={formData.contact_no} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="3" required></textarea>
          </div>
          <div className="form-group">
            <label>Make this user an Admin?</label>
            <select name="is_admin" value={formData.is_admin} onChange={handleChange} required>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose} disabled={processing}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={processing}>
              {processing ? 'Registering...' : 'Register User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
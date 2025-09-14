import React, { useState, useEffect, useRef } from 'react';

// Reusable EditableField component (can be moved to a shared folder later)
const EditableField = ({ label, value, name, onChange, isEditing }) => {
  const fieldStyle = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb', alignItems: 'center' };
  const labelStyle = { fontWeight: 500, color: '#6b7280' };
  const inputStyle = { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 10px', width: '60%', fontSize: '0.9rem' };

  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}:</label>
      {isEditing ? (
        <input type="text" name={name} value={value} onChange={onChange} style={inputStyle} />
      ) : (
        <span>{value || 'N/A'}</span>
      )}
    </div>
  );
};

const AdminMyAccount = ({ user, api, onLogout }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', contact_no: '', address: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch the admin's own profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/my-account/'); // Fetches logged-in user's data
        setUserProfile(response.data);
        setFormData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          contact_no: response.data.contact_no || '',
          address: response.data.address || '',
        });
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [api]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.patch('/my-account/update/', formData);
      alert('Details updated successfully!');
      // Refetch profile to show updated data
      const response = await api.get('/my-account/');
      setUserProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating account details:', error);
      alert('Failed to update details.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Styles are inherited from AdminDashboard.css but we define a few specifics
  const profileHeaderStyle = { display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--admin-border-color)' };
  const profileImageStyle = { width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--admin-border-color)', objectFit: 'cover' };

  if (loading) return <div className="admin-card">Loading profile...</div>;

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>My Account</h2>
        {!isEditing && (
           <button onClick={() => setIsEditing(true)} className="admin-btn admin-btn-primary">
             Edit Profile
           </button>
        )}
      </div>

      <div style={profileHeaderStyle}>
        <img
          src={userProfile?.profile_photo || `https://ui-avatars.com/api/?name=${userProfile?.first_name}+${userProfile?.last_name}&background=0f172a&color=fff`}
          alt="Profile"
          style={profileImageStyle}
        />
        <div>
          <h3 style={{ margin: '0 0 5px 0' }}>{userProfile?.first_name} {userProfile?.last_name}</h3>
          <p style={{ margin: 0, color: 'var(--admin-text-secondary)' }}>{userProfile?.email}</p>
        </div>
      </div>

      <form onSubmit={handleUpdateDetails} style={{ margin: '20px 0' }}>
        <EditableField label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} isEditing={isEditing} />
        <EditableField label="Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} isEditing={isEditing} />
        <EditableField label="Contact Number" name="contact_no" value={formData.contact_no} onChange={handleInputChange} isEditing={isEditing} />
        <EditableField label="Address" name="address" value={formData.address} onChange={handleInputChange} isEditing={isEditing} />
        
        {/* Admin does not have stats, so we don't show that section */}

        {isEditing && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsEditing(false)} disabled={isUpdating}>
              Cancel
            </button>
          </div>
        )}
      </form>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button className="admin-btn admin-btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminMyAccount;
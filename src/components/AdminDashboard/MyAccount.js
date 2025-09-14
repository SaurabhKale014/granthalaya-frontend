import React, { useState, useEffect, useRef } from 'react';

const EditableField = ({ label, value, name, onChange, isEditing }) => {
  const fieldStyle = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f1f1', alignItems: 'center' };
  const labelStyle = { fontWeight: 600, color: '#858796' };
  const inputStyle = { border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px 10px', width: '60%', fontSize: '0.9rem' };

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


// ✅ FIX 1: Provide a default value for the stats prop. If it's not passed, it will be null.
const MyAccount = ({ user, userProfile, stats = null, loading, api, onRefresh, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', contact_no: '', address: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        contact_no: userProfile.contact_no || '',
        address: userProfile.address || '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await api.patch('/my-account/update/', formData);
      alert(response.data.message || 'Details updated successfully!');
      if (typeof onRefresh === 'function') onRefresh();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating account details:', error);
      alert('Failed to update details. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const photoFormData = new FormData();
    photoFormData.append('profile_photo', file);

    setIsUpdating(true);
    try {
      await api.patch('/set-profile-photo/', photoFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Profile photo updated successfully!');
      if (typeof onRefresh === 'function') onRefresh();
    } catch (error) {
      console.error('Error updating profile photo:', error);
      alert('Failed to update profile photo.');
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Styles ---
  const cardStyle = { backgroundColor: 'white', borderRadius: '8px', padding: '25px', boxShadow: '0 3px 6px rgba(0,0,0,0.1)' };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
  const profileHeaderStyle = { display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #e3e6f0' };
  const profileImageContainerStyle = { position: 'relative' };
  const profileImageStyle = { width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #e3e6f0', objectFit: 'cover' };
  const changePhotoBtnStyle = { position: 'absolute', bottom: 0, right: 0, background: '#4e73df', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const btnAction = { padding: '10px 18px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 500 };
  const btnPrimary = { ...btnAction, background: 'linear-gradient(135deg, #4e73df 0%, #2a5bc9 100%)', color: 'white' };
  const btnSecondary = { ...btnAction, background: '#f1f1f1', color: '#333' };
  const btnLogoutStyle = { ...btnAction, background: 'linear-gradient(135deg, #e74a3b 0%, #c23b3b 100%)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px' };
  
  // A helper function for the refresh button, since it's optional now
  const handleRefreshClick = () => {
    if (typeof onRefresh === 'function') {
      onRefresh();
    }
  };


  if (loading) return <div style={cardStyle}>Loading profile...</div>;

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, color: '#4e73df' }}>My Account</h2>
        {!isEditing && (
           <button onClick={() => setIsEditing(true)} style={btnPrimary}>
             <i className="fas fa-edit" style={{ marginRight: '5px' }}></i> Edit Profile
           </button>
        )}
      </div>

      <div style={profileHeaderStyle}>
        <div style={profileImageContainerStyle}>
          <img
            src={userProfile?.profile_photo || `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`}
            alt="Profile"
            style={profileImageStyle}
          />
          {isEditing && (
            <>
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoChange} />
              <button style={changePhotoBtnStyle} onClick={() => fileInputRef.current.click()} title="Change profile photo">
                <i className="fas fa-camera"></i>
              </button>
            </>
          )}
        </div>
        <div>
          <h3 style={{ margin: '0 0 5px 0', color: '#4e73df' }}>{userProfile?.first_name} {userProfile?.last_name}</h3>
          <p style={{ margin: 0, color: '#858796' }}>{userProfile?.email}</p>
        </div>
      </div>

      <form onSubmit={handleUpdateDetails} style={{ margin: '20px 0' }}>
        <EditableField label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} isEditing={isEditing} />
        <EditableField label="Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} isEditing={isEditing} />
        <EditableField label="Contact Number" name="contact_no" value={formData.contact_no} onChange={handleInputChange} isEditing={isEditing} />
        <EditableField label="Address" name="address" value={formData.address} onChange={handleInputChange} isEditing={isEditing} />
        
        <div style={{ padding: '12px 0', borderBottom: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: 600, color: '#858796' }}>Member Since:</label>
          <span>{userProfile?.joined_date ? new Date(userProfile.joined_date).toLocaleDateString() : 'N/A'}</span>
        </div>

        {/* ✅ FIX 2: Conditionally render the entire stats block. This will only show if 'stats' is not null. */}
        {stats && (
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f1f1f1', display: 'flex', justifyContent: 'space-between' }}>
            <label style={{ fontWeight: 600, color: '#858796' }}>Total Books Borrowed:</label>
            <span>{stats.borrowed + stats.returned}</span>
          </div>
        )}

        {isEditing && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button type="submit" style={btnPrimary} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" style={btnSecondary} onClick={() => setIsEditing(false)} disabled={isUpdating}>
              Cancel
            </button>
          </div>
        )}
      </form>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button style={btnLogoutStyle} onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
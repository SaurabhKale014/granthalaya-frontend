// import React, { useState, useEffect, useCallback } from 'react';
// import ConfirmationModal from './ConfirmationModal';
// import RegistrationModal from './RegistrationModal'; // <-- Import the new registration modal

// const UserManagement = ({ api }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
  
//   // State for the new registration modal
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

//   // State for the confirmation modal
//   const [confirmModalState, setConfirmModalState] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     onConfirm: null,
//     confirmText: '',
//     confirmButtonClass: ''
//   });

//   const fetchUsers = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/users-list/');
//       setUsers(response.data.data);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [api]);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   const closeConfirmModal = () => {
//     setConfirmModalState({ isOpen: false });
//   };

//   const handleConfirmAction = async () => {
//     if (typeof confirmModalState.onConfirm === 'function') {
//       setProcessing(true);
//       try {
//         await confirmModalState.onConfirm();
//         fetchUsers();
//       } catch (error) {
//         console.error("Action failed:", error);
//         alert("The requested action failed.");
//       } finally {
//         setProcessing(false);
//         closeConfirmModal();
//       }
//     }
//   };

//   // --- Handlers for opening the confirmation modal ---
//   const handleUpdateStatusClick = (user, action) => {
//     const isActivating = action === 1;
//     setConfirmModalState({
//       isOpen: true,
//       title: isActivating ? `Activate ${user.name}?` : `Deactivate ${user.name}?`,
//       message: isActivating ? 'This will allow the user to access their account.' : 'This will prevent the user from logging in.',
//       confirmText: isActivating ? 'Set Active' : 'Set Inactive',
//       confirmButtonClass: isActivating ? 'admin-btn-success' : 'admin-btn-secondary',
//       onConfirm: () => api.patch(`/users-update/${user.id}/`, { action })
//     });
//   };

//   const handleDeleteClick = (user) => {
//     setConfirmModalState({
//       isOpen: true,
//       title: `Delete ${user.name}?`,
//       message: 'This action is permanent and cannot be undone.',
//       confirmText: 'Delete',
//       confirmButtonClass: 'admin-btn-danger',
//       onConfirm: () => api.delete(`/users-delete/${user.id}/`)
//     });
//   };

//   // --- Handler for the new registration modal ---
//   const handleRegisterSave = async (payload) => {
//     setProcessing(true);
//     try {
//       await api.post('/register/', payload);
//       alert('User registered successfully!');
//       setIsRegisterModalOpen(false);
//       fetchUsers(); // Refresh the user list
//     } catch (error) {
//       console.error("Failed to register user:", error);
//       // Display more specific backend errors if available
//       const errorMessage = error.response?.data?.email?.[0] || 'An error occurred during registration.';
//       alert(`Registration failed: ${errorMessage}`);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <>
//       <div className="admin-card">
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//           <h2>User Management</h2>
//           <button className="admin-btn admin-btn-primary" onClick={() => setIsRegisterModalOpen(true)}>
//             Register New User
//           </button>
//         </div>

//         {loading ? <p>Loading users...</p> : (
//           <div className="admin-table-wrapper">
//             <table className="admin-table">
//               <thead>
//                 <tr>
//                   <th style={{width: '50px'}}>Sr. No.</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Contact No</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user, index) => (
//                   <tr key={user.id}>
//                     <td>{index + 1}</td>
//                     <td>{user.name}</td>
//                     <td>{user.email}</td>
//                     <td>{user.contact_no}</td>
//                     <td>{user.is_active}</td>
//                     <td style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
//                       {user.is_active === 'Active' ? 
//                         <button className="admin-btn admin-btn-secondary" onClick={() => handleUpdateStatusClick(user, 0)}>
//                           Set Inactive
//                         </button>
//                         :
//                         <button className="admin-btn admin-btn-success" onClick={() => handleUpdateStatusClick(user, 1)}>
//                           Set Active
//                         </button>
//                       }
//                       <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteClick(user)}>
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <RegistrationModal
//         isOpen={isRegisterModalOpen}
//         onClose={() => setIsRegisterModalOpen(false)}
//         onSave={handleRegisterSave}
//         processing={processing}
//       />

//       <ConfirmationModal
//         isOpen={confirmModalState.isOpen}
//         onClose={closeConfirmModal}
//         onConfirm={handleConfirmAction}
//         title={confirmModalState.title}
//         message={confirmModalState.message}
//         confirmText={confirmModalState.confirmText}
//         confirmButtonClass={confirmModalState.confirmButtonClass}
//         processing={processing}
//       />
//     </>
//   );
// };

// export default UserManagement;

import React, { useState, useEffect, useCallback } from 'react';
import ConfirmationModal from './ConfirmationModal';
import RegistrationModal from './RegistrationModal';
import InfoModal from './InfoModal'; // <-- Import the new info modal

const UserManagement = ({ api }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [confirmModalState, setConfirmModalState] = useState({ isOpen: false });
  
  // State for the new info modal
  const [infoModalState, setInfoModalState] = useState({ isOpen: false });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/users-list/');
      setUsers(response.data.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const closeConfirmModal = () => setConfirmModalState({ isOpen: false });

  const handleConfirmAction = async () => {
    if (typeof confirmModalState.onConfirm === 'function') {
      setProcessing(true);
      try {
        await confirmModalState.onConfirm();
        fetchUsers();
      } catch (error) {
        console.error("Action failed:", error);
        alert("The requested action failed.");
      } finally {
        setProcessing(false);
        closeConfirmModal();
      }
    }
  };

  const handleUpdateStatusClick = (user, action) => {
    const isActivating = action === 1;
    setConfirmModalState({
      isOpen: true,
      title: isActivating ? `Activate ${user.name}?` : `Deactivate ${user.name}?`,
      message: isActivating ? 'This user will regain account access.' : 'This user will be prevented from logging in.',
      confirmText: isActivating ? 'Set Active' : 'Set Inactive',
      confirmButtonClass: isActivating ? 'admin-btn-success' : 'admin-btn-secondary',
      onConfirm: () => api.patch(`/users-update/${user.id}/`, { action })
    });
  };

  const handleDeleteClick = (user) => {
    setConfirmModalState({
      isOpen: true,
      title: `Delete ${user.name}?`,
      message: 'This action is permanent and cannot be undone.',
      confirmText: 'Delete',
      confirmButtonClass: 'admin-btn-danger',
      onConfirm: () => api.delete(`/users-delete/${user.id}/`)
    });
  };

  const handleRegisterSave = async (payload) => {
    setProcessing(true);
    try {
      await api.post('/register/', payload);
      setIsRegisterModalOpen(false);
      fetchUsers();
      // Use the new InfoModal instead of alert()
      setInfoModalState({
          isOpen: true,
          title: 'Success!',
          message: 'A new user has been registered successfully.'
      });
    } catch (error) {
      console.error("Failed to register user:", error);
      const errorMessage = error.response?.data?.email?.[0] || 'An error occurred during registration.';
      alert(`Registration failed: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>User Management</h2>
          <button className="admin-btn admin-btn-primary" onClick={() => setIsRegisterModalOpen(true)}>
            Register New User
          </button>
        </div>

        {loading ? <p>Loading users...</p> : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              {/* Table Head and Body are the same */}
              <thead>
                <tr>
                  <th style={{width: '50px'}}>Sr. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact No</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.contact_no}</td>
                    <td>{user.is_active}</td>
                    <td style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                      {user.is_active === 'Active' ? 
                        <button className="admin-btn admin-btn-secondary" onClick={() => handleUpdateStatusClick(user, 0)}>
                          Set Inactive
                        </button>
                        :
                        <button className="admin-btn admin-btn-success" onClick={() => handleUpdateStatusClick(user, 1)}>
                          Set Active
                        </button>
                      }
                      <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteClick(user)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSave={handleRegisterSave}
        processing={processing}
      />

      <ConfirmationModal
        isOpen={confirmModalState.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={confirmModalState.title}
        message={confirmModalState.message}
        confirmText={confirmModalState.confirmText}
        confirmButtonClass={confirmModalState.confirmButtonClass}
        processing={processing}
      />
      
      <InfoModal
        isOpen={infoModalState.isOpen}
        onClose={() => setInfoModalState({ isOpen: false })}
        title={infoModalState.title}
        message={infoModalState.message}
      />
    </>
  );
};

export default UserManagement;
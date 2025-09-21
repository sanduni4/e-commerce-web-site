import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getUserProfile();
      setProfile(response.user);
    } catch (error) {
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      
      const response = await authAPI.updateProfile(profile);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.email) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
            <button onClick={() => setMessage('')} className="close-btn">×</button>
          </div>
        )}

        <div className="profile-content">
          <div className="profile-avatar">
            <img 
              src={profile.profilePicture || 'https://via.placeholder.com/150?text=User'} 
              alt="Profile"
              className="avatar-img"
            />
            <div className="user-info">
              <h2>{profile.firstName} {profile.lastName}</h2>
              <p className="user-email">{profile.email}</p>
              <span className={`user-type-badge ${user?.type}`}>
                {user?.type}
              </span>
            </div>
          </div>

          <div className="profile-form">
            {!isEditing ? (
              <div className="profile-view">
                <div className="info-grid">
                  <div className="info-item">
                    <label>First Name</label>
                    <p>{profile.firstName}</p>
                  </div>
                  <div className="info-item">
                    <label>Last Name</label>
                    <p>{profile.lastName}</p>
                  </div>
                  <div className="info-item">
                    <label>Email Address</label>
                    <p>{profile.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Account Type</label>
                    <p>{user?.type}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    required
                    disabled // Email usually shouldn't be changed
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profilePicture">Profile Picture URL</label>
                  <input
                    type="url"
                    id="profilePicture"
                    name="profilePicture"
                    value={profile.profilePicture}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="save-btn"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      loadProfile(); // Reset to original values
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
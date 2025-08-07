import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './UserDropdown.css';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button
        className="user-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" />
          ) : (
            <span className="user-initials">
              {getInitials(user.first_name, user.last_name)}
            </span>
          )}
        </div>
        <div className="user-info">
          <span className="user-name">
            {user.first_name} {user.last_name}
          </span>
          <span className="user-email">{user.email}</span>
        </div>
        <FaChevronDown className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown-menu">
          <div className="dropdown-header">
            <div className="user-avatar-large">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" />
              ) : (
                <span className="user-initials-large">
                  {getInitials(user.first_name, user.last_name)}
                </span>
              )}
            </div>
            <div className="user-details">
              <div className="user-name-large">
                {user.first_name} {user.last_name}
              </div>
              <div className="user-email-small">{user.email}</div>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-items">
            <button className="dropdown-item">
              <FaUser className="dropdown-icon" />
              <span>Mon profil</span>
            </button>
            
            <button className="dropdown-item">
              <FaCog className="dropdown-icon" />
              <span>Paramètres</span>
            </button>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-items">
            <button className="dropdown-item logout" onClick={handleLogout}>
              <FaSignOutAlt className="dropdown-icon" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
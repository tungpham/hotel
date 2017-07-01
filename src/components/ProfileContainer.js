import React from "react";
import { compose } from "recompose";
import { NavLink } from "react-router-dom";

import "./ProfileContainer.scss";

export const ProfileContainer = ({ user, children }) =>
  <div className="profile-container">
    <div className="profile-box">
      <div className="profile-sidebar">
        <div className="profile-info">
          <div className="profile-avatar">
            <img src={user.avatar} alt="avatar" className="avatar" />
          </div>
          <div className="profile-name">
            {user.name}
          </div>
          <div className="profile-role">
            Admin
          </div>
        </div>
        <div className="profile-nav">
          <div className="nav-title">
            Account Settings
          </div>
          <div className="profile-nav-link">
            <NavLink to="/profile" exact>Profile</NavLink>
          </div>
          <div className="profile-nav-link">
            <NavLink to="/profile/settings" exact>Settings</NavLink>
          </div>
        </div>
      </div>
      <div className="profile-content">
        {children}
      </div>
    </div>
  </div>;

export const enhance = compose();

export default enhance(ProfileContainer);

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

import ProfileInformation from "components/ProfileInformation";
import { selectors } from "modules";


export const ProfileWrapper = ({ user }) =>
  <div>
    {user ? <ProfileInformation /> : ''}
  </div>;

export const enhance = compose(
  connect(
    state => ({
      user: selectors.auth.user(state),
    }),
  )
);

export default enhance(ProfileWrapper);

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { service as AuthService } from "core/auth";

import AuthForm from "components/AuthForm";


export const SignIn = ({ onOpenAuthO }) =>
  <AuthForm
    title="Welcome to Trump Hotel"
    auth0Action="Log In with Auth0"
    onOpenAuthO={onOpenAuthO}
  />;

export const enhance = compose(
  connect(
    () => ({}),
    dispatch => {
      return {
        onOpenAuthO: () => AuthService.openAuthO(),
      };
    }
  )
);

export default enhance(SignIn);

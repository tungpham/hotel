import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import AuthForm from "components/AuthForm";

import { actions } from "modules";

export const SignIn = ({ onLogin }) =>
  <AuthForm
    title="Welcome to Trump Hotel"
    remember
    action="Log In"
    onSubmit={onLogin}
  />;

export const enhance = compose(
  connect(
    () => ({}),
    dispatch => {
      return {
        onLogin: values =>
          dispatch(
            actions.auth.signIn(
              values.email,
              values.password,
              values.rememberMe
            )
          ).then(() => dispatch(push("/")))
      };
    }
  )
);

export default enhance(SignIn);

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import AuthForm from "components/AuthForm";

import { actions } from "modules";

export const SignUp = ({ onRegister }) =>
  <AuthForm
    title="Welcome to Trump Hotel"
    subtitle="Create your account by filling the form below"
    strength
    action="Register"
    onSubmit={onRegister}
  />;

export const enhance = compose(
  connect(
    () => ({}),
    dispatch => {
      return {
        onRegister: values =>
          dispatch(
            actions.auth.signUp(values.email, values.password)
          ).then(() => dispatch(push("/")))
      };
    }
  )
);

export default enhance(SignUp);

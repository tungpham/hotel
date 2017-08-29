import React from "react";
import { compose, lifecycle } from "recompose";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { service as AuthService } from "core/auth";

import { actions } from "modules";

let dispatcher = null;

export const OAuthCallback = () =>
  <h1>Authenticating!</h1>;

export const enhance = compose(
  lifecycle({
    componentWillMount() {
      AuthService.authOLoginCallback(this.props.location.hash, auth => {
        if (auth) {
          dispatcher(actions.auth.authenticated(auth));
          dispatcher(push('/'));
        } else {
          AuthService.openAuthO();
        }
      });
    },
  }),
  connect(
    () => ({}),
    dispatch => {
      dispatcher = dispatch;
      return {};
    }
  )
);

export default enhance(OAuthCallback);

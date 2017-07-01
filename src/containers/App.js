import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import Navigation from "../components/Navigation";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";

export const AuthRoute = (() => {
  const AuthRoute = ({
    location,
    authenticated,
    component: Component,
    negate = false,
    ...rest
  }) =>
    <Route
      {...rest}
      location={location.location}
      render={props =>
        (negate ? !authenticated : authenticated)
          ? <Component {...props} />
          : <Redirect
              to={{
                pathname: negate ? "/" : "/login",
                state: { from: props.location }
              }}
            />}
    />;

  const enhance = connect(state => ({
    key: state.routing.key,
    authenticated: state.entities.auth != null,
    location: state.routing
  }));

  return enhance(AuthRoute);
})();

export const App = () =>
  <div>
    <Navigation />
    <AuthRoute path="/" component={Dashboard} exact />
    <AuthRoute path="/profile" component={Profile} exact />
    <AuthRoute path="/profile/settings" component={ProfileSettings} exact />
    <AuthRoute path="/contact" component={Contact} />
    <AuthRoute negate path="/login" component={SignIn} exact />
    <AuthRoute negate path="/register" component={SignUp} exact />
  </div>;

export default App;

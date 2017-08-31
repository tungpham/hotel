import React from "react";
import { compose } from "recompose";
import { Button } from "reactstrap";

import "./AuthForm.scss";

export const AuthForm = ({
  title,
  subtitle,
  onOpenAuthO,
  auth0Action,
}) =>
  <div className="login-container">
    <div className="login-box">
      <div className="title">{title}</div>
      {subtitle &&
        <div className="subtitle">
          {subtitle}
        </div>}
      <div className="d-flex justify-content-end">
        <Button color="login" onClick={onOpenAuthO} block={true}>
          {auth0Action}
        </Button>
      </div>
    </div>
  </div>;
export default compose(AuthForm);

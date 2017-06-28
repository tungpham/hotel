import React from "react";
import cx from "classnames";
import zxcvbn from "zxcvbn";
import { Field, reduxForm, Form } from "redux-form";
import { compose, withState } from "recompose";
import { Button } from "reactstrap";
import * as validators from "lib/validators";

import "./AuthForm.scss";

const renderField = ({ input, meta, placeholder }) =>
  <div
    className={cx("form-group", {
      active: meta.active,
      "has-danger": meta.touched && meta.error
    })}
  >
    <label htmlFor={meta.form + input.name}>
      {placeholder}
    </label>
    <input
      {...input}
      className="form-control"
      id={meta.form + input.name}
      placeholder={placeholder}
    />
    {meta.touched &&
      meta.error &&
      <div className="form-control-feedback">{meta.error}</div>}
  </div>;

const StrengthMeter = ({ level }) =>
  <div className="strength-meter">
    {[1, 2, 3, 4].map(l =>
      <div key={l} className={cx(`v-${l}`, { active: level <= l })} />
    )}
  </div>;

const renderPassword = withState(
  "visible",
  "setVisible",
  false
)(({ input, meta, strength, visible, setVisible }) =>
  <div
    className={cx("form-group password", {
      active: meta.active,
      "has-danger": meta.touched && meta.error
    })}
  >
    <label htmlFor={meta.form + input.name}>
      Password
    </label>
    <div className="input-group">
      <input
        {...input}
        type={!visible ? "password" : "text"}
        className="form-control"
        id={meta.form + input.name}
        placeholder="Password"
      />
      <div className="visibility-addon" onClick={() => setVisible(!visible)}>
        {visible
          ? <i className="fa fa-eye-slash" />
          : <i className="fa fa-eye" />}
      </div>
      <div className="strength-addon">
        {strength && <StrengthMeter level={5 - zxcvbn(input.value).score} />}
      </div>
    </div>
    {meta.touched &&
      meta.error &&
      <div className="form-control-feedback">{meta.error}</div>}
  </div>
);

const renderCheckBox = ({ input: { onChange, value }, placeholder }) =>
  <div className="form-group checkbox">
    <div
      className={cx("checkbox-inner", { checked: value })}
      onClick={() => onChange(!value)}
    />
    <div className="checkbox-label" onClick={() => onChange(!value)}>
      {placeholder}
    </div>
  </div>;

export const AuthForm = ({
  handleSubmit,
  title,
  subtitle,
  strength,
  remember,
  action,
  submitting
}) =>
  <div className="login-container">
    <div className="login-box">
      <div className="title">{title}</div>
      {subtitle &&
        <div className="subtitle">
          {subtitle}
        </div>}
      <Form onSubmit={handleSubmit}>
        <Field
          name="email"
          type="email"
          component={renderField}
          validate={[validators.required, validators.email]}
          placeholder="Email"
        />
        <Field
          name="password"
          component={renderPassword}
          validate={[
            validators.required,
            validators.minLength2,
            validators.maxLength15,
            strength ? validators.passwordSecurity : () => undefined
          ]}
          strength={strength}
        />
        {remember &&
          <Field
            name="rememberMe"
            component={renderCheckBox}
            placeholder="Remember Me"
          />}
        <div className="d-flex justify-content-end">
          <Button color="login" disabled={submitting}>
            {action}
          </Button>
        </div>
      </Form>
    </div>
  </div>;

export const enhance = compose(
  reduxForm({
    form: "authForm"
  })
);

export default enhance(AuthForm);

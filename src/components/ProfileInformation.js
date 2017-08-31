import React from "react";
import cx from "classnames";
import { Field, reduxForm, Form, FieldArray } from "redux-form";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { compose, withProps } from "recompose";

import ProfileContainer from "components/ProfileContainer";
import { actions, selectors } from "modules";
import * as validators from "lib/validators";

const renderField = ({ input, meta, label, placeholder }) =>
  <div
    className={cx("form-group profile-form-group", {
      active: meta.active,
      "has-danger": meta.touched && meta.error,
      "has-success": meta.touched && !meta.error
    })}
  >
    <div className="profile-form-input-container">
      <label className="profile-form-label" htmlFor={meta.form + input.name}>
        {label}
      </label>
      <input
        {...input}
        className="form-control profile-form-input"
        id={meta.form + input.name}
        placeholder={placeholder}
      />
    </div>
    {meta.touched &&
      meta.error &&
      <div className="profile-form-error">
        <span className="fa-stack">
          <i className="fa fa-circle-thin fa-stack-2x background" />
          <i className="fa fa-circle fa-stack-2x background" />
          <i className="fa fa-times fa-stack-1x icon" />
        </span>
      </div>}
    {meta.touched &&
      !meta.error &&
      <div className="profile-form-success">
        <span className="fa-stack">
          <i className="fa fa-circle-thin fa-stack-2x background" />
          <i className="fa fa-circle fa-stack-2x background" />
          <i className="fa fa-check fa-stack-1x icon" />
        </span>
      </div>}
  </div>;

const RField = withProps({ type: "text", component: renderField })(Field);

export const ProfileInformation = ({ user, handleSubmit, submitting }) =>
  <ProfileContainer user={user}>
    <Form onSubmit={handleSubmit} className="profile-form">
      <div className="profile-title">Profile</div>

      <RField name="name" validate={[validators.required]} label="Name" />
      <RField name="email" validate={[validators.email]} label="Email" />
      <RField name="phone" label="Phone" />
      <RField name="company" label="Organization / Company name" />
      <RField name="address" label="Address" />
      <RField name="password" label="Password" />

      <div className="profile-form-buttons">
        <Button color="primary" disabled={submitting}>
          Save
        </Button>
      </div>
    </Form>
  </ProfileContainer>;

export const enhance = compose(
  connect(
    state => ({
      user: selectors.auth.user(state),
      initialValues: selectors.auth.user(state)
    }),
    dispatch => ({
      onSubmit: values => dispatch(actions.auth.saveProfile(values))
    })
  ),
  reduxForm({
    form: "profile"
  })
);

export default enhance(ProfileInformation);

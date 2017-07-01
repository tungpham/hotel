import React from "react";
import cx from "classnames";
import { Field, reduxForm, Form, FieldArray, submit } from "redux-form";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { compose, withProps } from "recompose";

import ProfileContainer from "components/ProfileContainer";
import { actions, selectors } from "modules";
import * as validators from "lib/validators";

const renderField = ({ input, meta, label, items }) =>
  <div className="profile-settings-select">
    <div className="profile-settings-label">{label}</div>
    <div className="profile-settings-values">
      {items.map(item =>
        <div
          className={cx("profile-settings-value", {
            active: item.value === input.value
          })}
          onClick={() => input.onChange(item.value)}
        >
          {item.label}
        </div>
      )}
    </div>
  </div>;

const RField = withProps({ component: renderField })(Field);

const YesNoField = withProps({
  items: [{ label: "ON", value: true }, { label: "OFF", value: false }]
})(RField);

export const ProfileSettings = ({ user, handleSubmit, submitting }) =>
  <ProfileContainer user={user}>
    <Form onSubmit={handleSubmit} className="profile-settings-form">
      <div className="profile-title">Settings</div>

      <YesNoField name="desktopNotification" label="Desktop Notifications" />
      <YesNoField name="soundNotification" label="Sound Notifications" />

      <div className="profile-subtitle">Autoresponder Settings</div>

      <RField
        name="autoResponder"
        label="Autoresponder"
        items={[
          {
            label: "ON",
            value: "on"
          },
          {
            label: "OFF",
            value: "off"
          },
          {
            label: "SCHEDULE",
            value: "schedule"
          }
        ]}
      />

      <div className="profile-message">Autoresponder Message</div>
      <div className="profile-message">
        Thank you for your text! We are currently closed. If you need immediate
        assistance, please call the front desk.
      </div>
    </Form>
  </ProfileContainer>;

export const enhance = compose(
  connect(
    state => ({
      user: selectors.auth.user(state),
      initialValues: selectors.auth.user(state).settings
    }),
    dispatch => ({
      onSubmit: values => dispatch(actions.auth.saveProfileSettings(values))
    })
  ),
  reduxForm({
    form: "profile-settings",
    onChange: (values, dispatch) => dispatch(submit("profile-settings"))
  })
);

export default enhance(ProfileSettings);

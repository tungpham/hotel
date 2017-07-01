import React from "react";
import cx from "classnames";
import { compose } from "recompose";
import { Field, reduxForm, Form, FieldArray } from "redux-form";
import { Button } from "reactstrap";
import * as validators from "lib/validators";

const renderField = ({ input, meta, label, placeholder }) =>
  <div
    className={cx("form-group row", {
      active: meta.active,
      "has-danger": meta.touched && meta.error
    })}
  >
    <label className="col-4 col-form-label" htmlFor={meta.form + input.name}>
      {label}
    </label>
    <div className="col-8">
      <input
        {...input}
        className="form-control"
        id={meta.form + input.name}
        placeholder={placeholder ? placeholder : label}
      />
    </div>
    {meta.touched &&
      meta.error &&
      <div className="col-8 offset-4">
        <div className="form-control-feedback">{meta.error}</div>
      </div>}
  </div>;

const renderInlineField = ({ input, meta, label, placeholder }) =>
  <div
    className={cx("form-group", {
      active: meta.active,
      "has-danger": meta.touched && meta.error
    })}
  >
    <label htmlFor={meta.form + input.name}>
      {label}
    </label>
    <input
      {...input}
      className="form-control"
      id={meta.form + input.name}
      placeholder={placeholder ? placeholder : label}
    />
    {meta.touched &&
      meta.error &&
      <div className="form-control-feedback">{meta.error}</div>}
  </div>;

const renderSelect = ({ input, meta, label, items }) =>
  <div
    className={cx("form-group", {
      active: meta.active,
      "has-danger": meta.touched && meta.error
    })}
  >
    <label htmlFor={meta.form + input.name}>
      {label}
    </label>
    <select {...input} className="form-control" id={meta.form + input.name}>
      {items.map(({ value, label }) =>
        <option key={value} value={value}>{label}</option>
      )}
    </select>
    {meta.touched &&
      meta.error &&
      <div className="form-control-feedback">{meta.error}</div>}
  </div>;

const colors = [
  {
    label: "Default",
    value: "default"
  },
  {
    label: "Primary",
    value: "primary"
  },
  {
    label: "Danger",
    value: "danger"
  }
];

const renderTags = ({ fields }) =>
  <div className="form-group row">
    <label className="col-4 col-form-label">
      <Button
        color="primary"
        onClick={() => fields.push({ label: "", color: "default" })}
      >
        Add Tag
      </Button>
    </label>
    <div className="col-8">
      {fields.map((member, index) =>
        <div className="d-flex align-content-center" key={index}>
          <div className="remove-tag">
            <Button
              color="warning"
              size="sm"
              onClick={() => fields.remove(index)}
            >
              -
            </Button>
          </div>
          <div className="row">
            <div className="col-6">
              <Field
                name={`${member}.label`}
                type="text"
                component={renderInlineField}
                validate={[validators.required]}
                label="Label"
              />
            </div>
            <div className="col-6">
              <Field
                name={`${member}.color`}
                type="text"
                component={renderSelect}
                validate={[validators.required]}
                label="Color"
                items={colors}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  </div>;

export const GuestForm = ({
  handleSubmit,
  reset,
  failAction,
  failLabel,
  successLabel
}) =>
  <Form onSubmit={handleSubmit} className="guest-form">
    <div className="fields">
      <Field
        name="name"
        type="text"
        component={renderField}
        validate={[validators.required]}
        label="First name"
        placeholder=""
      />
      <Field
        name="lastName"
        type="text"
        component={renderField}
        validate={[validators.required]}
        label="Last name"
        placeholder=""
      />
      <Field
        name="phone"
        type="text"
        component={renderField}
        validate={[validators.required]}
        label="Phone number"
        placeholder=""
      />
      <Field
        name="room"
        type="text"
        component={renderField}
        validate={[validators.required]}
        label="Room number"
        placeholder=""
      />
      <FieldArray name="tags" component={renderTags} />
    </div>
    <div className="actions d-flex justify-content-between">
      <Button color="danger" onClick={failAction ? failAction : () => reset()}>
        {failLabel}
      </Button>
      <Button color="primary">
        {successLabel}
      </Button>
    </div>
  </Form>;

export const enhance = compose(reduxForm({ form: "guest-form" }));

export default enhance(GuestForm);

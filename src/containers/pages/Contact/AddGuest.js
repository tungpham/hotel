import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Card, CardHeader, CardBlock } from "reactstrap";
import GuestForm from "./GuestForm";

import { actions } from "modules";

export const AddGuest = ({ addGuest }) =>
  <Card>
    <CardHeader>
      Add New Contact
    </CardHeader>
    <CardBlock>
      <GuestForm
        failLabel="Reset"
        successLabel={"Create"}
        onSubmit={addGuest}
      />
    </CardBlock>
  </Card>;

export const enhance = compose(
  connect(
    () => ({}),
    dispatch => ({
      addGuest: values =>
        dispatch(actions.guests.addGuest(values)).then(x =>
          dispatch(push(`/contact/guest/${x.body.id}`))
        )
    })
  )
);

export default enhance(AddGuest);

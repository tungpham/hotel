import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Card, CardHeader, CardBlock } from "reactstrap";
import GuestForm from "./GuestForm";

import { selectors, actions } from "modules";

export const EditGuest = ({ guest, editGuest, removeGuest }) =>
  <Card>
    <CardHeader>
      Edit guest {guest && guest.name}
    </CardHeader>
    <CardBlock>
      {guest &&
        <GuestForm
          failLabel="Delete"
          successLabel={"Update"}
          form="add-guest"
          onSubmit={editGuest}
          failAction={removeGuest}
          initialValues={guest}
        />}
    </CardBlock>
  </Card>;

export const enhance = compose(
  connect(
    (state, { match: { params: { id } } }) => ({
      guest: selectors.guests.guest(state, id)
    }),
    (dispatch, { match: { params: { id } } }) => ({
      editGuest: values => dispatch(actions.guests.editGuest(id, values)),
      removeGuest: () =>
        dispatch(actions.guests.removeGuest(id)).then(() =>
          dispatch(push(`/contact/new`))
        )
    })
  )
);

export default enhance(EditGuest);

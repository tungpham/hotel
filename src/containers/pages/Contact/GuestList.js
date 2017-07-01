import React from "react";
import cx from "classnames";
import { compose } from "recompose";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import {
  Badge,
  Card,
  CardHeader,
  CardBlock,
  ListGroup,
  ListGroupItem
} from "reactstrap";

import connectRequest from "lib/connectRequest";
import { selectors, queries } from "modules";

export const GuestItem = ({ id, name, tags, onClick, active }) =>
  <ListGroupItem className={cx("guest", { active })} onClick={onClick}>
    <div className="name">{name}</div>
    <div>
      {tags.map((tag, i) =>
        <Badge key={i} color={tag.color} pill>{tag.label}</Badge>
      )}
    </div>
  </ListGroupItem>;

export const GuestsList = ({ id: currentId, guests, redirect }) =>
  guests.length === 0
    ? <div>No guests</div>
    : <ListGroup>
        {guests.map(({ id, name, tags }) =>
          <GuestItem
            key={id}
            id={id}
            active={currentId == id}
            name={name}
            tags={tags}
            onClick={() => redirect(`/contact/guest/${id}`)}
          />
        )}
      </ListGroup>;

export const GuestList = ({ guests, redirect, id }) =>
  <Card className="guests">
    <CardHeader>
      <div className="d-flex justify-content-between">
        <div>Guests</div>
        <div onClick={() => redirect("/contact/new")}>+</div>
      </div>
    </CardHeader>
    <CardBlock>
      <GuestsList guests={guests} redirect={redirect} id={id} />
    </CardBlock>
  </Card>;

export const enhance = compose(
  connect(
    state => ({ guests: selectors.guests.guests(state) }),
    dispatch => ({ redirect: url => dispatch(push(url)) })
  ),
  connectRequest(() => queries.guests.getGuestsQuery())
);

export default enhance(GuestList);

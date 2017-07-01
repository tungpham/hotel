import React from "react";
import { compose, withProps } from "recompose";
import { Row, Col } from "reactstrap";
import { Route, withRouter, matchPath } from "react-router-dom";

import AddGuest from "./AddGuest";
import EditGuest from "./EditGuest";
import GuestList from "./GuestList";

import "./Contact.scss";

export const Contact = ({ id }) =>
  <div className="dashboard-container">
    <Row>
      <Col className="dashboard-column" style={{ flexGrow: 1 }}>
        <GuestList id={id} />
      </Col>
      <Col className="dashboard-column" style={{ flexGrow: 2 }}>
        <Route path="/contact/new" component={AddGuest} />
        <Route path="/contact/guest/:id" component={EditGuest} />
      </Col>
    </Row>
  </div>;

export const enhance = compose(
  withRouter,
  withProps(({ location: { pathname } }) => {
    const match = matchPath(pathname, { path: "/contact/guest/:id" });

    return {
      id: match ? match.params.id : null
    };
  })
);

export default enhance(Contact);

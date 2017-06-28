import React from "react";
import { compose } from "recompose";
import { Row, Col } from "reactstrap";

import GuestOrders from "./GuestOrders";
import Workers from "./Workers";
import Chat from "./Chat";

import "./Dashboard.scss";

export const Dashboard = () =>
  <div className="dashboard-container">
    <Row>
      <Col className="dashboard-column"><GuestOrders /></Col>
      <Col className="dashboard-column"><Chat /></Col>
      <Col className="dashboard-column"><Workers /></Col>
    </Row>
  </div>;

export const enhance = compose();

export default enhance(Dashboard);

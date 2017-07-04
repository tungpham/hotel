import React from "react";
import { compose } from "recompose";
import { Row, Col } from "reactstrap";

import GuestOrders from "./GuestOrders";
import Workers from "./Workers";
import Chat from "./Chat";

import { Resize, ResizeHorizon } from "react-resize-layout";

import "./Dashboard.scss";

const size = "300px";
const width = "400px";

export const Dashboard = () =>
  <div className="dashboard-container">
    <Row>
      <Resize handleWidth="3px" handleColor="#d7d7d7">
        <ResizeHorizon overflow="auto" minWidth={size} width={width}>
          <Col className="dashboard-column"><GuestOrders /></Col>
        </ResizeHorizon>

        <ResizeHorizon overflow="auto" minWidth={size} width={width}>
          <Col className="dashboard-column"><Chat /></Col>
        </ResizeHorizon>

        <ResizeHorizon overflow="auto" minWidth={size} width={width}>
          <Col className="dashboard-column"><Workers /></Col>
        </ResizeHorizon>
      </Resize>
    </Row>
  </div>;

export const enhance = compose();

export default enhance(Dashboard);

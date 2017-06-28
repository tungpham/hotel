import React from "react";
import { compose, withProps, withState } from "recompose";
import { connect } from "react-redux";
import cx from "classnames";
import {
  Badge,
  Card,
  CardHeader,
  CardBlock,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import connectRequest from "lib/connectRequest";
import { actions, selectors, queries } from "modules";

import "./Workers.scss";

export const NavigationLink = (() => {
  const NavigationLink = ({ active, onClick, text }) =>
    <NavItem>
      <NavLink className={cx({ active })} onClick={onClick}>
        {text}
      </NavLink>
    </NavItem>;

  const enhance = withProps(({ name, active, onChange }) => ({
    active: name === active,
    onClick: () => onChange(name)
  }));

  return enhance(NavigationLink);
})();

export const Navigation = ({ tab, onChangeTab }) =>
  <Nav tabs>
    <NavigationLink name="all" active={tab} onChange={onChangeTab} text="All" />
    <NavigationLink
      name="available"
      active={tab}
      onChange={onChangeTab}
      text="Available"
    />
    <NavigationLink
      name="busy"
      active={tab}
      onChange={onChangeTab}
      text="Busy"
    />
  </Nav>;

export const WorkerListItem = ({ id, avatar, name, status }) =>
  <ListGroupItem className="worker-list-item">
    <div>
      <div className="avatar">
        <img src={avatar} />
      </div>
      <div>
        <div className="name">{name}</div>
        <div className={cx("status", { [status]: true })}>
          {status === "busy" ? "Busy" : "Available"}
        </div>
      </div>
    </div>
    <div className="actions">
      <i className="fa fa-comment" />
      <i className="fa fa-phone" />
    </div>
  </ListGroupItem>;

export const WorkersList = ({ workers, onWorkerClick }) =>
  <ListGroup>
    {workers.map(({ name, status, id, avatar }) =>
      <WorkerListItem
        key={id}
        avatar={avatar}
        id={id}
        name={name}
        status={status}
      />
    )}
  </ListGroup>;

export const Workers = ({ tab, changeTab, workers, openChat }) =>
  <Card className="workers">
    <CardHeader>Workers</CardHeader>
    <CardBlock>
      <Navigation tab={tab} onChangeTab={changeTab} />
      <WorkersList workers={workers} onWorkerClick={openChat} />
    </CardBlock>
  </Card>;

export const enhance = compose(
  connectRequest(() => queries.workers.getWorkersQuery()),
  withState("tab", "changeTab", "all"),
  connect(
    (state, props) => ({
      workers: selectors.workers.getWorkers(
        state,
        props.tab === "all" ? null : props.tab
      )
    }),
    {
      openChat: actions.chats.openWorkerChat
    }
  )
);

export default enhance(Workers);

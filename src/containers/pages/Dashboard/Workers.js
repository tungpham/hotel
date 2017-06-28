import React from "react";
import { compose, withProps, withState } from "recompose";
import { connect } from "react-redux";
import cx from "classnames";
import {
  Card,
  CardHeader,
  CardBlock,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import connectRequest, { spinnerOnLoading } from "lib/connectRequest";
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

export const WorkerListItem = ({ id, avatar, name, status, onClick, active }) =>
  <ListGroupItem className="worker-list-item" active={active}>
    <div>
      <div className="avatar">
        <img src={avatar} alt="avatar" />
      </div>
      <div>
        <div className="name">{name}</div>
        <div className={cx("status", { [status]: true })}>
          {status === "busy" ? "Busy" : "Available"}
        </div>
      </div>
    </div>
    <div className="actions">
      <i className="fa fa-comment" onClick={() => onClick("text")} />
      <i className="fa fa-phone" onClick={() => onClick("call")} />
    </div>
  </ListGroupItem>;

export const WorkersList = ({ workers, onWorkerClick, currentWorker }) =>
  <ListGroup>
    {workers.map(({ name, status, id, avatar }) =>
      <WorkerListItem
        key={id}
        avatar={avatar}
        id={id}
        name={name}
        status={status}
        onClick={type => onWorkerClick(id, type)}
        active={currentWorker && currentWorker.id === id}
      />
    )}
  </ListGroup>;

export const Workers = ({ tab, changeTab, workers, openChat, currentWorker }) =>
  <Card className="workers">
    <CardHeader>Workers</CardHeader>
    <CardBlock>
      <Navigation tab={tab} onChangeTab={changeTab} />
      <WorkersList
        workers={workers}
        onWorkerClick={openChat}
        currentWorker={currentWorker}
      />
    </CardBlock>
  </Card>;

export const enhance = compose(
  connectRequest(() => queries.workers.getWorkersQuery()),
  withState("tab", "changeTab", "all"),
  connect(
    (state, props) => ({
      currentWorker: selectors.chats.getWorker(state),
      workers: selectors.workers.getWorkers(
        state,
        props.tab === "all" ? null : props.tab
      )
    }),
    {
      openChat: actions.chats.openWorkerChat
    }
  ),
  spinnerOnLoading()
);

export default enhance(Workers);

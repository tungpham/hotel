import React from "react";
import { Field, reduxForm, formValueSelector, change } from "redux-form";
import { compose, withHandlers, withState } from "recompose";
import { connect } from "react-redux";
import moment from "moment";
import cx from "classnames";
import {
  Button,
  ButtonDropdown,
  Card,
  CardHeader,
  CardBlock,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import TextArea from "react-textarea-autosize";

import ScrollToBottom from "components/ScrollToBottom";
import connectRequest from "lib/connectRequest";
import { actions, selectors, queries } from "modules";

import "./Chat.scss";

export const ChatView = (() => {
  const nl2br = text =>
    text.split("\n").map((item, key) => <span key={key}>{item}<br /></span>);

  const renderTextArea = ({ input, onKeyPress }) =>
    <TextArea
      {...input}
      className="message-input"
      placeholder="Type your message..."
      maxRows={3}
      onKeyPress={onKeyPress}
    />;

  const ChatView = ({
    messages,
    templates,
    showDate,
    onKeyPress,
    onClick,
    onSend,
    from,
    to
  }) =>
    <ScrollToBottom className="messages-view">
      <div className="messages-list">
        {messages.map((message, i) => {
          const local = message.from === from.id;
          const name = local ? from.name : to.name;

          return (
            <div
              className={
                "message-box d-flex" +
                (!local ? " local flex-row-reverse" : " remote flex-row")
              }
              key={i}
            >
              <div className="message-content">
                <div className="message-author">
                  <strong>{name}</strong>
                </div>
                <div className="message-text">
                  {nl2br(message.message)}
                </div>
              </div>
              {showDate &&
                <div className="message-date">
                  {moment(message.date).format("h:mm a")}
                </div>}
            </div>
          );
        })}
      </div>
      <div className="send-area">
        <Field
          name="value"
          component={renderTextArea}
          onKeyPress={onKeyPress}
        />
        {templates &&
          <ButtonDropdown dropup>
            <DropdownToggle caret>
              <i className="fa fa-comment" />
            </DropdownToggle>
            <DropdownMenu>
              {templates.map(template =>
                <DropdownItem onClick={() => onSend(template.value)}>
                  {template.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </ButtonDropdown>}
        <Button className="message-button" onClick={onClick}>SEND</Button>
      </div>
    </ScrollToBottom>;

  const enhance = compose(
    withState("state", "setState", { limit: 20, skip: 0 }),
    connect(
      (state, { from, to, type }) => {
        const form = `${from.id}-${to.id}-${type}`;
        const selector = formValueSelector(form);
        const value = selector(state, "value");

        return {
          form,
          messageValue: value,
          messages: selectors.chats.getMessages(state, type, to.id)
        };
      },
      (dispatch, { form, type, from, to }) => {
        return {
          onSend: value => {
            dispatch(change(form, "value", ""));
            dispatch(actions.chats.sendMessage(type, from.id, to.id));
          }
        };
      }
    ),
    reduxForm({
      form: ({ form }) => form
    }),
    withHandlers({
      onKeyPress: ({ messageValue, onSend }) => e => {
        const { key, shiftKey } = e;

        if (key === "Enter" && !shiftKey && messageValue.trim().length > 0) {
          onSend(messageValue);
          e.preventDefault();
        }
      },
      onClick: ({ messageValue, onSend }) => () => {
        if (messageValue.trim().length > 0) {
          onSend(messageValue);
        }
      }
    }),
    connectRequest(({ from, to, type, state }) =>
      queries.chats.getChatQuery(type, from.id, to.id, state.skip, state.limit)
    )
  );

  return enhance(ChatView);
})();

export const WorkersNavigationLink = ({ worker, active, openChat, text }) =>
  <NavItem>
    <NavLink
      className={cx({ active: active.id === worker.id })}
      onClick={openChat(worker.id, worker.type)}
    >
      {text}
    </NavLink>
  </NavItem>;

export const WorkersTab = ({ worker, workers, openChat }) =>
  <Card>
    <CardHeader>
      {workers.length > 1
        ? <Nav tabs>
            {workers.map(iworker =>
              <WorkersNavigationLink
                worker={iworker}
                active={worker}
                openChat={openChat}
                text={iworker.name}
              />
            )}
          </Nav>
        : worker != null
          ? `Conversation with ${worker.name}`
          : `No Worker selected`}
    </CardHeader>
    <CardBlock />
  </Card>;

export const GuestsTab = ({ guest }) =>
  <Card>
    <CardHeader>
      {guest ? `Conversation with ${guest.name}` : `No Guest selected`}
    </CardHeader>
    <CardBlock>
      {guest &&
        <ChatView
          type={"guest"}
          from={{
            name: "Me",
            id: -1
          }}
          to={{
            id: guest.id,
            name: guest.name
          }}
          showDate
        />}
    </CardBlock>
  </Card>;

export const Chat = ({ worker, workers, guest, openChat }) =>
  <div className="dashboard-column chats">
    <GuestsTab guest={guest} />
    <WorkersTab worker={worker} workers={workers} openChat={openChat} />
  </div>;

export const enhance = compose(
  connect((state, props) => ({
    workers: selectors.chats.getWorkers(state),
    worker: selectors.chats.getWorker(state),
    guest: selectors.chats.getGuest(state)
  }))
);

export default enhance(Chat);

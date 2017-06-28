import React from "react";
import { Field, reduxForm, formValueSelector, change } from "redux-form";
import { compose, withHandlers, withState } from "recompose";
import { connect } from "react-redux";
import { FormattedRelative, FormattedTime } from "react-intl";
import cx from "classnames";
import {
  Button,
  ButtonDropdown,
  ButtonGroup,
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
import connectRequest, { spinnerOnLoading } from "lib/connectRequest";
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
    to,
    templateDropdown,
    onToggle
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
                  <div>
                    <strong><FormattedTime value={message.date} /></strong>
                  </div>
                  <FormattedRelative
                    value={message.date}
                    updateInterval={60 * 1000}
                  />
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
        <ButtonGroup>
          <Button color="primary" className="message-button" onClick={onClick}>
            SEND
          </Button>
          {templates &&
            <ButtonDropdown tether toggle={onToggle} isOpen={templateDropdown}>
              <DropdownToggle caret color="primary">
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
        </ButtonGroup>
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
          key: form,
          messageValue: value,
          messages: selectors.chats.getMessages(state, type, to.id)
        };
      },
      (dispatch, { type, from, to }) => {
        const form = `${from.id}-${to.id}-${type}`;

        return {
          onSend: value => {
            dispatch(change(form, "value", ""));
            dispatch(actions.chats.sendMessage(type, from.id, to.id, value));
          }
        };
      }
    ),
    reduxForm({
      form: ({ form }) => form
    }),
    withState("templateDropdown", "setTemplateDropdown", false),
    withHandlers({
      onToggle: ({ templateDropdown, setTemplateDropdown }) => () =>
        setTemplateDropdown(!templateDropdown),
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
    ),
    spinnerOnLoading()
  );

  return enhance(ChatView);
})();

export const WorkersNavigationLink = ({ worker, active, openChat, text }) =>
  <NavItem>
    <NavLink
      className={cx({
        active: active.id === worker.id && active.type === worker.type
      })}
      onClick={() => openChat(worker.id, worker.type)}
    >
      {text}
    </NavLink>
  </NavItem>;

export const CallPanel = ({ worker, endCall }) =>
  <div className="call-panel">
    <div className="phone-number">{worker.phone}</div>
    <div className="avatar"><img src={worker.avatar} alt="avatar" /></div>
    <div className="status">Calling...</div>
    <div className="actions">
      <span className="fa-stack">
        <i className="fa fa-circle-thin fa-stack-2x" />
        <i className="fa fa-microphone fa-stack-1x" />
      </span>
      <span className="fa-stack decline" onClick={endCall}>
        <i className="fa fa-circle-thin fa-stack-2x background" />
        <i className="fa fa-circle fa-stack-2x background" />
        <i className="fa fa-phone fa-stack-1x phone" />
      </span>
      <span className="fa-stack">
        <i className="fa fa-circle-thin fa-stack-2x" />
        <i className="fa fa-volume-up fa-stack-1x" />
      </span>
    </div>
  </div>;

export const WorkersTab = ({ worker, workers, openChat, endCall }) =>
  <Card>
    <CardHeader className="workers-chat-header">
      {worker && worker.type === "call"
        ? `Call with ${worker.name}`
        : workers.length > 1
          ? <Nav tabs className="workers-chat-navigation">
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
    <CardBlock>
      {worker &&
        worker.type === "call" &&
        <CallPanel worker={worker} endCall={endCall} />}
      {worker &&
        worker.type === "text" &&
        <ChatView
          type={"worker"}
          from={{
            name: "Me",
            id: -1
          }}
          to={{
            id: worker.id,
            name: worker.name
          }}
        />}
    </CardBlock>
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
          templates={[
            {
              label: "Default Welcome Message",
              value: "Hello Customer!"
            }
          ]}
        />}
    </CardBlock>
  </Card>;

export const Chat = ({ worker, workers, guest, openChat, endCall }) =>
  <div className="dashboard-column chats">
    <GuestsTab guest={guest} />
    <WorkersTab
      worker={worker}
      workers={workers}
      openChat={openChat}
      endCall={endCall}
    />
  </div>;

export const enhance = compose(
  connect(
    (state, props) => ({
      workers: selectors.chats.getWorkers(state),
      worker: selectors.chats.getWorker(state),
      guest: selectors.chats.getGuest(state)
    }),
    {
      openChat: actions.chats.openWorkerChat,
      endCall: actions.chats.endCall
    }
  )
);

export default enhance(Chat);

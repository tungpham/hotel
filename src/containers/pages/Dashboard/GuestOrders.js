import React from "react";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { compose, branch } from "recompose";
import { connect } from "react-redux";
import moment from "moment";
import Autocomplete from "react-autocomplete";
import {
  Badge,
  Card,
  CardHeader,
  CardBlock,
  ListGroup,
  ListGroupItem
} from "reactstrap";

import connectRequest from "lib/connectRequest";
import { selectors, queries, actions } from "modules";

import "./GuestOrders.scss";

export const Favourite = ({ favourite, onClick }) =>
  <div className="favourite" onClick={onClick}>
    {favourite ? <i className="fa fa-star" /> : <i className="fa fa-star-o" />}
  </div>;

export const GuestOrderItem = ({
  id,
  active,
  name,
  message,
  tags,
  favourite,
  onClick,
  onFavourite
}) =>
  <ListGroupItem
    className="guest-order"
    onClick={() => onClick(id)}
    active={active}
  >
    <div className="justify-content-between">
      <div>
        <span className="name">{name}</span>
        <span className="date">{moment(message.date).format("LL")}</span>
      </div>
      <div>
        <Favourite
          favourite={favourite}
          onClick={e => {
            e.stopPropagation();

            onFavourite(id, !favourite);
          }}
        />
      </div>
    </div>
    <div>
      <div
        className="message"
        dangerouslySetInnerHTML={{ __html: message.message }}
      />
    </div>
    <div>
      <div>
        {tags.map((tag, i) =>
          <Badge key={i} color={tag.color} pill>{tag.label}</Badge>
        )}
      </div>
    </div>
  </ListGroupItem>;

export const GuestOrderList = ({
  guests,
  onClick,
  currentGuest,
  onFavourite
}) =>
  guests.length == 0
    ? <div>No guests</div>
    : <ListGroup>
        {guests.map(({ id, name, tags, message, favourite }) =>
          <GuestOrderItem
            key={id}
            id={id}
            active={currentGuest && currentGuest.id === id}
            name={name}
            tags={tags}
            message={message}
            favourite={favourite}
            onFavourite={onFavourite}
            onClick={onClick}
          />
        )}
      </ListGroup>;

export const GuestOrderSearch = (() => {
  const renderAutocomplete = ({ input, items, onSelect }) =>
    <Autocomplete
      {...input}
      inputProps={{
        className: "form-control search"
      }}
      menuStyle={{
        borderRadius: "0px",
        boxShadow: "0 5px 12px rgba(0, 0, 0, 0.2)",
        background: "rgba(255, 255, 255, 0.9)",
        fontSize: "90%",
        position: "fixed",
        overflow: "auto",
        maxHeight: "50%",
        zIndex: 100
      }}
      wrapperProps={{
        className: "search-wrapper",
        style: {}
      }}
      getItemValue={guest => String(guest.id)}
      items={items}
      onSelect={val => onSelect(Number(val))}
      renderItem={(item, isHighlighted) =>
        <div
          style={{
            background: isHighlighted ? "lightgray" : "white",
            padding: "5px"
          }}
        >
          <strong
            style={{
              paddingRight: "1em"
            }}
          >
            {item.name}
          </strong>
          Phone Number {item.phone}
        </div>}
    />;

  const GuestOrderSearch = ({ suggestions, onSelect }) =>
    <Field
      name="search"
      component={renderAutocomplete}
      items={suggestions}
      onSelect={onSelect}
    />;

  return GuestOrderSearch;
})();

export const GuestOrders = ({
  guests,
  search,
  suggestions,
  openChat,
  currentGuest,
  favourite
}) =>
  <Card className="guest-orders">
    <CardHeader>Guest Orders</CardHeader>
    <CardBlock>
      <GuestOrderSearch
        suggestions={suggestions}
        onSelect={id => openChat(id)}
      />
      <GuestOrderList
        guests={guests}
        onClick={openChat}
        currentGuest={currentGuest}
        onFavourite={favourite}
      />
    </CardBlock>
  </Card>;

const selector = formValueSelector("guestOrderSearch");

export const enhance = compose(
  reduxForm({
    form: "guestOrderSearch"
  }),
  connect(
    state => ({
      guests: selectors.guests.guestOrders(state),
      suggestions: selectors.guests.guestSuggestions(state),
      search: selector(state, "search"),
      currentGuest: selectors.chats.getGuest(state)
    }),
    {
      openChat: actions.chats.openGuestChat,
      favourite: actions.guests.favourite
    }
  ),
  connectRequest(({ search }) => queries.guests.getGuestOrdersQuery(search))
);

export default enhance(GuestOrders);

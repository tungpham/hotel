import React from "react";
import { connect } from "react-redux";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { NavLink as RouterLink } from "react-router-dom";
import { compose, withState, withHandlers, withProps } from "recompose";

import { actions, selectors } from "modules";

import "./Navigation.scss";

const Link = withProps({ tag: RouterLink })(NavLink);

export const Navigation = ({
  toggle,
  isOpen,
  isOpenProfile,
  toggleProfile,
  user,
  signOut
}) =>
  <Navbar color="primary" light toggleable inverse className="fixed-top">
    <NavbarToggler right onClick={toggle} />
    <NavbarBrand href="/">Hotel</NavbarBrand>
    {user &&
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <Link to="/" exact>Dashboard</Link>
          </NavItem>
          <NavItem>
            <Link to="/contact">Contact</Link>
          </NavItem>
          <NavItem>
            <Link to="/analytic">Analytics</Link>
          </NavItem>
        </Nav>
        <Nav navbar>
          <NavDropdown isOpen={isOpenProfile} toggle={toggleProfile}>
            <DropdownToggle nav>
              {user.name}
              <img
                src={user.avatar}
                className="avatar rounded-circle"
                alt="avatar"
              />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem to="/profile" tag={RouterLink}>
                Profile
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => signOut()}>Logout</DropdownItem>
            </DropdownMenu>
          </NavDropdown>
        </Nav>
      </Collapse>}
  </Navbar>;

export const enhance = compose(
  withState("isOpen", "setIsOpen", false),
  withState("isOpenProfile", "setIsOpenProfile", false),
  withHandlers({
    toggle: ({ isOpen, setIsOpen }) => () => setIsOpen(!isOpen),
    toggleProfile: ({ isOpenProfile, setIsOpenProfile }) => () =>
      setIsOpenProfile(!isOpenProfile)
  }),
  withHandlers({
    isOpen: ({ isOpen, setIsOpen }) => () => setIsOpen(isOpen)
  }),
  connect(
    state => ({
      user: selectors.auth.user(state)
    }),
    dispatch => ({
      signOut: () => dispatch(actions.auth.signOut())
    })
  )
);

export default enhance(Navigation);

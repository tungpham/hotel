import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { NavLink as RouterLink } from "react-router-dom";
import { compose, withState, withHandlers, withProps } from "recompose";

const Link = withProps({ tag: RouterLink })(NavLink);

export const Navigation = ({ toggle, isOpen }) =>
  <Navbar color="primary" light toggleable inverse className="fixed-top">
    <NavbarToggler right onClick={toggle} />
    <NavbarBrand href="/">Hotel</NavbarBrand>
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
    </Collapse>
  </Navbar>;

export const enhance = compose(
  withState("isOpen", "setIsOpen", false),
  withHandlers({
    isOpen: ({ isOpen, setIsOpen }) => () => setIsOpen(isOpen)
  })
);

export default Navigation;

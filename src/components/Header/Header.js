import React, { useState,useEffect } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {

  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);
  const [userInfo, setUserInfo] = useState(null);


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Get accessToken
        const accessToken = await getAccessTokenSilently({
          audience: `https://fct-netex.eu.auth0.com/api/v2/`,
        });
        // Get user info
        const userResponse = await fetch(`https://fct-netex.eu.auth0.com/api/v2/users/${user.sub}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userInfo = await userResponse.json();
        setUserInfo(userInfo);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [getAccessTokenSilently]);



  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

    return (
      <div className="nav-container">
        <Navbar color="light" light expand="md">
          <Container>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Home
                  </NavLink>
                </NavItem>
                {isAuthenticated && (
                  <NavItem>
                    <NavLink
                      tag={RouterNavLink}
                      to="/activities"
                      exact
                      activeClassName="router-link-exact-active"
                    >
                      Activities
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
              
              <Nav className="d-none d-md-block" navbar>
                {!isAuthenticated && (
                  <NavItem>
                    <Button
                      id="qsLoginBtn"
                      color="primary"
                      className="btn-margin"
                      onClick={() => loginWithRedirect()}
                    >
                      Log in
                    </Button>
                  </NavItem>
                )}
                {isAuthenticated && userInfo && (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret id="profileDropDown">
                      <img
                        src={userInfo.picture}
                        alt="Profile"
                        className="nav-user-profile rounded-circle"
                        width="50"
                      />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>{userInfo.nickname}</DropdownItem>
                      <DropdownItem
                        tag={RouterNavLink}
                        to="/profile"
                        className="dropdown-profile"
                        activeClassName="router-link-exact-active"
                      >
                        <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                      </DropdownItem>
                      <DropdownItem
                        id="qsLogoutBtn"
                        onClick={() => logoutWithRedirect()}
                      >
                        <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                        out
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )}
              </Nav>
              {!isAuthenticated && (
                <Nav className="d-md-none" navbar>
                  <NavItem>
                    <Button
                      id="qsLoginBtn"
                      color="primary"
                      block
                      onClick={() => loginWithRedirect({})}
                    >
                      Log in
                    </Button>
                  </NavItem>
                </Nav>
              )}
              {isAuthenticated && userInfo && (
                <Nav
                  className="d-md-none justify-content-between"
                  navbar
                  style={{ minHeight: 170 }}
                >
                  <NavItem>
                    <span className="user-info">
                      <img
                        src={userInfo.picture}
                        alt="Profile"
                        className="nav-user-profile d-inline-block rounded-circle mr-3"
                        width="50"
                      />
                      <h6 className="d-inline-block">{userInfo.nickname}</h6>
                    </span>
                  </NavItem>
                  <NavItem>
                    <FontAwesomeIcon icon="user" className="mr-3" />
                    <RouterNavLink
                      to="/profile"
                      activeClassName="router-link-exact-active"
                    >
                      Profile
                    </RouterNavLink>
                  </NavItem>
                  <NavItem>
                    <FontAwesomeIcon icon="power-off" className="mr-3" />
                    <RouterNavLink
                      to="#"
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      Log out
                    </RouterNavLink>
                  </NavItem>
                </Nav>
              )}
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
    
};

export default Header;

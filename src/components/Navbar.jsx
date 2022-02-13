import React from "react";
import styled from "styled-components";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { signout, currentUser } = useAuthContext();

  const navigate = useNavigate();

  const singoutAction = async () => {
    await signout();
    navigate("/");
  };

  const navIcon = <FontAwesomeIcon icon={faCameraRetro} />;

  return (
    <NavWrapper>
      <Link to="/">
        <LinkText style={{ fontSize: "35px" }}>{navIcon}</LinkText>
      </Link>
      <LoginSignupWrapper>
        {!currentUser ? (
          <>
            <NavLink to="/sign-in">
              <LinkText>Sign in</LinkText>
            </NavLink>
            <NavLink to="/create-account">
              <LinkText>Create</LinkText>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/albums">
              <LinkText>Your albums</LinkText>
            </NavLink>
            <Logout onClick={singoutAction}>Sign out</Logout>
          </>
        )}
      </LoginSignupWrapper>
    </NavWrapper>
  );
};

const NavWrapper = styled.div`
  width: 100%;
  height: 65px;
  background: #11123b;
  padding: 7px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Space Grotesk;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
`;

const LoginSignupWrapper = styled.div`
  display: flex;
  align-content: flex-end;
`;

const LinkText = styled.p`
  font-size: 0.9rem;
  color: #f1efeb;
  padding: 10px;
  cursor: pointer;
  font-weight: 500;

  &: hover {
    color: #373869;
    transition: 0.5s;
  }
`;

const Logout = styled(LinkText)``;

export default Navbar;

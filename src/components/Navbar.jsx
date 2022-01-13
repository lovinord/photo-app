import React from "react";
import styled from "styled-components";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { signout, currentUser } = useAuthContext();

  const navigate = useNavigate();

  const singoutAction = async () => {
    await signout();
    navigate("/");
  };

  return (
    <NavWrapper>
      <Link to="/">
        <LinkText>ShareVision</LinkText>
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
  height: 60px;
  background: #f50057;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LoginSignupWrapper = styled.div`
  display: flex;
  align-content: flex-end;
`;

const LinkText = styled.p`
  font-size: 1rem;
  color: white;
  padding: 10px;
  cursor: pointer;
`;

const Logout = styled(LinkText)``;

export default Navbar;

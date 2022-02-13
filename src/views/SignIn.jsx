import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, MenuHeader, InputText } from "../styles/styleAssets";
import { useAuthContext } from "../contexts/AuthContext";

const SignIn = () => {
  const { signin } = useAuthContext();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await signin(emailRef.current.value, passwordRef.current.value);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header>Sign In</Header>
      {error && <>{error}</>}
      <LoginForm onSubmit={handleSubmit}>
        <InputWrapper>
          <Label>Email</Label>
          <InputEmail
            type="email"
            ref={emailRef}
            placeholder="Enter your email"
          />
        </InputWrapper>
        <InputWrapper>
          <Label>Password</Label>
          <InputPassword
            type="password"
            ref={passwordRef}
            placeholder="Enter your password"
          />
        </InputWrapper>
        <LoginBtn disabled={loading} type="submit">
          Sign in
        </LoginBtn>
      </LoginForm>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 45px;
  height: 400px;

  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  border-radius: 10px;
  padding: 20px;

  @media (min-width: 768px) {
    padding: 30px;
    height: 500px;
  }

  @media (min-width: 1024px) {
    padding: 40px;
    height: 450px;
  }
`;

const Header = styled(MenuHeader)`
  @media (min-width: 768px) {
    padding-bottom: 2rem;
  }

  @media (min-width: 1024px) {
    padding-bottom: 3rem;
  }
`;

const InputWrapper = styled.div``;

const Label = styled.label`
  font-size: 1.1rem;

  @media (min-width: 768px) {
    font-size: 1.6rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.4rem;
  }
`;

const InputEmail = styled(InputText)`
  margin-top: 5px;
`;
const InputPassword = styled(InputText)`
  margin-top: 5px;
`;

const LoginBtn = styled(Button)`
  align-self: center;
`;

export default SignIn;

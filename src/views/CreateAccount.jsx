import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, MenuHeader, InputText } from "../styles/styleAssets";
import { useAuthContext } from "../contexts/AuthContext";

const CreateAccount = () => {
  const { createaccount } = useAuthContext();

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Password does not match");
    }
    setError(null);

    try {
      setLoading(true);
      await createaccount(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header>Create Account</Header>
      {error && <>{error}</>}
      <CreateAccountForm onSubmit={handleSubmit}>
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
        <InputWrapper>
          <Label>Confirm password</Label>
          <InputPassword
            type="password"
            ref={confirmPasswordRef}
            placeholder="Confirm password"
          />
        </InputWrapper>
        <CreateBtn type="submit" disabled={loading}>
          Create
        </CreateBtn>
      </CreateAccountForm>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const CreateAccountForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 45px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
  border-radius: 10px;
  padding: 20px;

  @media (min-width: 768px) {
    padding: 30px;
  }

  @media (min-width: 1024px) {
    padding: 40px;
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

const CreateBtn = styled(Button)`
  align-self: center;
`;

export default CreateAccount;

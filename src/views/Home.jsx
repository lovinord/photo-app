import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles/styleAssets";
import heroImage from "../assets/images/heroTest.jpg";
import { useAuthContext } from "../contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  const goToCreateAccount = async () => {
    navigate("/create-account");
  };

  return (
    <>
      <HeroImageWrapper>
        <HeroOverlay>
          <div>
            <h1>
              Present your vision <br /> in a professional
              <br /> way.
            </h1>
            {!currentUser && (
              <GetStartedButton onClick={goToCreateAccount}>
                Get started
              </GetStartedButton>
            )}
          </div>
        </HeroOverlay>
        <HeroImage src={heroImage} alt="Welcome" />
      </HeroImageWrapper>
    </>
  );
};

const HeroImageWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
`;

const HeroImage = styled.img`
  position: absolute;
  object-position: 35% 15%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;

  @media (min-width: 768px) {
    object-position: 90% 25%;
  }

  @media (min-width: 1024px) {
    object-position: 100% 36%;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);

  div {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    top: 50%;
    padding: 15px;

    @media (min-width: 768px) {
    }

    @media (min-width: 1024px) {
    }
  }

  h1 {
    font-family: Space Grotesk;
    font-weight: 600;
    font-size: 1.4rem;
    letter-spacing: 1px;
    color: #f1efeb;
    position: relative;
    left: 3%;

    @media (min-width: 768px) {
      font-size: 1.6rem;
      left: 5%;
    }

    @media (min-width: 1024px) {
      font-size: 1.8rem;
      letter-spacing: 5px;
      left: 7%;
    }

    span {
      color: white;

      @media (min-width: 768px) {
      }
    }
  }
`;

const GetStartedButton = styled(Button)`
  position: relative;
  margin: 0 auto;
  top: 40px;
  width: 180px;
  height: 50px;
  padding: 20px;
  font-size: 1rem;
  letter-spacing: 1.3px;

  @media (min-width: 768px) {
    width: 180px;
    font-size: 1rem;
    letter-spacing: 2px;
  }

  @media (min-width: 1024px) {
  }
`;

export default Home;

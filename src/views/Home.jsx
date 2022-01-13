import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles/styleAssets";
import heroImage from "../assets/images/hero.jpg";
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
            <p>
              Present <span> your vision</span> in <br />a professional way.
            </p>
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
  position: relative;
  overflow: hidden;
`;

const HeroImage = styled.img`
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  object-position: 15% 80%;
  z-index: -1;
`;

const HeroOverlay = styled.div`
  position: absolute;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);

  div {
    width: 210px;
    position: absolute;
    top: 57%;
    left: 15vw;

    @media (min-width: 768px) {
      height: 65vh;
      width: 320px;
    }

    @media (min-width: 1024px) {
      top: 15%;
      left: 45vw;
      width: 600px;
    }
  }

  p {
    font-size: 0.8rem;
    letter-spacing: 2px;
    color: white;
    margin-bottom: 20px;

    @media (min-width: 768px) {
      font-size: 1.2rem;
      margin-bottom: 50px;
    }

    @media (min-width: 1024px) {
      font-size: 1.5rem;
      letter-spacing: 5px;
    }

    span {
      background: #f50057;
      color: white;
      padding: 2px 4px 2px 6px;
      border-radius: 25px;

      @media (min-width: 768px) {
        padding: 2px 8px 4px 10px;
      }
    }
  }
`;

const GetStartedButton = styled(Button)`
  width: 140px;
  padding: 10px;
  border-radius: 25px;
  font-size: 0.9rem;
  letter-spacing: 1.3px;

  @media (min-width: 768px) {
    width: 160px;
    font-size: 1rem;
    letter-spacing: 2px;
  }

  @media (min-width: 1024px) {
  }
`;

export default Home;

import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPlusCircle,
  faClone,
} from "@fortawesome/free-solid-svg-icons";

const ImageCard = ({ image, hasBeenMarked, hasBeenChosen, isOwner }) => {
  const [isMarked, setIsMarked] = useState(false);

  const [photoChosen, setPhotoChosen] = useState({
    chosen: false,
    rejected: false,
  });

  const handleClick = () => {
    setIsMarked(!isMarked);
    hasBeenMarked(image._id, !isMarked);
  };

  const handleCustomerChosen = () => {
    setPhotoChosen({
      chosen: true,
      rejected: false,
    });
    hasBeenMarked(image._id, true);
    hasBeenChosen(image._id, true);
  };

  const handleCustomerRejected = () => {
    setPhotoChosen({
      chosen: false,
      rejected: true,
    });
    hasBeenMarked(image._id, true);
    hasBeenChosen(image._id, false);
  };

  const choosePhoto = <FontAwesomeIcon icon={faCheckCircle} />;
  const rejectPhoto = <FontAwesomeIcon icon={faPlusCircle} />;
  const clonePhoto = <FontAwesomeIcon icon={faClone} />;
  return (
    <PhotoCard key={image?._id.toString() + isMarked.toString()}>
      {photoChosen.rejected && <Overlay />}
      <Photo src={image.url} alt={image.type} />
      <IconWrapper>
        {!isOwner ? (
          <div style={{ display: "flex", cursor: "pointer" }}>
            <Choose onClick={handleCustomerChosen} chosen={photoChosen.chosen}>
              {choosePhoto}
            </Choose>
            <Reject
              onClick={handleCustomerRejected}
              rejected={photoChosen.rejected}
            >
              {rejectPhoto}
            </Reject>
          </div>
        ) : (
          <Clone clone={isMarked} onClick={handleClick}>
            {clonePhoto}
          </Clone>
        )}
      </IconWrapper>
    </PhotoCard>
  );
};

const PhotoCard = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;

  @media (min-width: 768px) {
    left: 20px;
    bottom: 30px;
    font-size: 1.2rem;
  }

  @media (min-width: 1024px) {
  }
`;

const Reject = styled.div`
  color: ${(props) => (props.rejected ? " #e60000" : "grey")};
  z-index: 1;

  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);

  &: hover {
    color: #e60000;
    transition: 0.3s;
  }

  @media (min-width: 768px) {
  }

  @media (min-width: 1024px) {
  }
`;
const Choose = styled.i`
  color: ${(props) => (props.chosen ? "#01c630" : "grey")};
  margin-right: 10px;
  z-index: 1;

  &: hover {
    color: #01c630;
    transition: 0.3s;
  }

  @media (min-width: 768px) {
    margin-left: 10px;
  }

  @media (min-width: 1024px) {
  }
`;

const Clone = styled.i`
  margin-left: 10px;
  color: ${(props) => (props.clone ? "#1479FE" : "lightblue")};
  z-index: 1;

  &: hover {
    color: #1479fe;
    transition: 0.3s;
  }
`;

const Photo = styled.img`
  object-fit: cover;
  width: 150px;
  height: 150px;
  border-radius: 7px;

  @media (min-width: 768px) {
    width: 280px;
    height: 180px;
    margin: 20px;
  }

  @media (min-width: 1024px) {
    width: 350px;
    height: 200px;
  }
`;

const Overlay = styled.div`
  object-fit: cover;
  position: absolute;
  z-index: 0;
  width: 150px;
  height: 150px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 7px;

  @media (min-width: 768px) {
    width: 280px;
    height: 180px;
    margin: 20px;
  }

  @media (min-width: 1024px) {
    width: 350px;
    height: 200px;
  }
`;

export default ImageCard;

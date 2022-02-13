import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "../styles/styleAssets";
import ImageCard from "./PhotoCard";
import CreateNewAlbumFromPhotosModal from "../components/modals/CreateNewAlbumFromPhotosModal";
import CustomerResponseModal from "../components/modals/NewAlbumFromCustomerResponse";
import { useAuthContext } from "../contexts/AuthContext";
import { SRLWrapper } from "simple-react-lightbox";

const PhotoGrid = ({ query, album, albumId, photographer }) => {
  const { currentUser } = useAuthContext();

  const [markedImages, setMarkedImages] = useState([]);
  const [chosenImages, setChosenImages] = useState([]);
  const [open, setOpen] = useState(false);

  const isOwner = currentUser?.uid === photographer;

  if (query.isError) {
    return <p>{query.error}</p>;
  }
  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  const hasBeenMarked = (imageId, isMarked) => {
    if (isMarked) {
      setMarkedImages((state) => [
        ...state.filter((image) => image !== imageId),
        imageId,
      ]);
    } else {
      setMarkedImages((state) => state.filter((e) => e !== imageId));
    }
  };
  const hasBeenChosen = (imageId, isChosen) => {
    if (isChosen) {
      setChosenImages((state) => [
        ...state.filter((image) => image !== imageId),
        imageId,
      ]);
    } else {
      setChosenImages((state) => state.filter((e) => e !== imageId));
    }
  };

  return (
    <SRLWrapper>
      <PhotoGridWrapper>
        {query.isLoading && <p>Loading...</p>}
        <ImagesContainer>
          {query.data &&
            query.data.map((photo, i) => (
              <ImageCard
                image={photo}
                key={photo._id}
                isOwner={isOwner}
                hasBeenMarked={hasBeenMarked}
                hasBeenChosen={hasBeenChosen}
              />
            ))}
        </ImagesContainer>
        {isOwner && open && (
          <CreateNewAlbumFromPhotosModal
            albumId={albumId}
            setOpen={setOpen}
            markedImages={markedImages}
          />
        )}

        {!isOwner && open && (
          <CustomerResponseModal
            imagesAmount={query.data.length}
            album={album}
            albumId={albumId}
            photographer={photographer}
            chosenImages={chosenImages}
            setOpen={setOpen}
          />
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {isOwner && (
            <CreateAlbumFromPhotosBtn
              onClick={() => setOpen(true)}
              disabled={markedImages.length === 0}
            >
              Create album from photos
            </CreateAlbumFromPhotosBtn>
          )}

          {!isOwner && (
            <SendResponseButton
              onClick={() => setOpen(true)}
              disabled={markedImages.length !== query.data.length}
            >
              Send
            </SendResponseButton>
          )}
        </div>
      </PhotoGridWrapper>
    </SRLWrapper>
  );
};

const PhotoGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ImagesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin: 0 auto;
  width: 95%;
`;

const CreateAlbumFromPhotosBtn = styled(Button)`
  margin: 1.5rem;
  width: 230px;
  height: 40px;
  font-size: 0.8rem;
  padding: 10px;
  border-radius: 7px;
  background: ${(props) => props.disabled && "#aeaeae"};

  &: hover {
    box-shadow: ${(props) => props.disabled && "none"};
    background: ${(props) => props.disabled && "#aeaeae"};
  }
`;

const SendResponseButton = styled(Button)`
  background: ${(props) => props.disabled && "#aeaeae"};

  &: hover {
    box-shadow: ${(props) => props.disabled && "none"};
    background: ${(props) => props.disabled && "#aeaeae"};
  }
  &: focus {
    box-shadow: none;
  }
`;

export default PhotoGrid;

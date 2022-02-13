import React from "react";
import styled from "styled-components";
import { Button } from "../../styles/styleAssets";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import usePhotos from "../../hooks/usePhotos";
import { useNavigate } from "react-router-dom";

const CreateNewAlbumModal = ({
  albumId,
  album,
  setOpen,
  chosenImages,
  photographer,
  imagesAmount,
}) => {
  const photos = usePhotos(albumId);
  const albumTitle = album.title;
  const navigate = useNavigate();
  const markedPhotos = photos.data.filter(
    (photo) => chosenImages.indexOf(photo._id) > -1
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const album = await addDoc(collection(db, "albums"), {
      timestamp: serverTimestamp(),
      title: albumTitle + "(response)",
      owner: photographer,
    });
    await Promise.all(
      markedPhotos.map(async (photo) => {
        const copy = { ...photo };
        delete copy._id;
        await addDoc(collection(db, "photos"), {
          ...copy,
          album: album.id,
        });
      })
    );
    navigate("/");
  };

  return (
    <OverLay>
      <Modal>
        <h2
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            left: "10px",
            top: "10px",
            cursor: "pointer",
          }}
        >
          X
        </h2>
        <h2>Are you sure?</h2>
        <p
          style={{
            width: "60%",
            margin: "20px",
          }}
        >
          You have chosen {chosenImages.length} out of {imagesAmount} photos
          from the album.
        </p>

        <Confirm onClick={handleSubmit}>Yes</Confirm>
      </Modal>
    </OverLay>
  );
};

const OverLay = styled.div`
  z-index: 3;
  position: fixed;
  transform: translate3d(0, 0, 0);
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  position: absolute;
  top: 150px;
  z-index: 4;
  background: #f1efeb;
  color: #11123b;
  border-radius: 8px;
  width: 85%;
  height: 35%;
  display: flex;
  flex-direction: column;
  padding: 30px;
  align-items: center;
  font-size: 0.8rem;
  margin: 60px;

  @media (min-width: 768px) {
    width: 50%;
  }

  @media (min-width: 1024px) {
    width: 30%;
  }
`;

const Confirm = styled(Button)`
  font-size: 0.8rem;
  margin: 10px;
  width: 160px;
  margin: 20px;
  padding: 10px;

  @media (min-width: 768px) {
    width: 35%;
  }

  @media (min-width: 1024px) {
    width: 40%;
  }
`;

export default CreateNewAlbumModal;

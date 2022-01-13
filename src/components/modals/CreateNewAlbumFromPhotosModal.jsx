import React, { useRef } from "react";
import styled from "styled-components";
import { Button, InputText } from "../../styles/styleAssets";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthContext } from "../../contexts/AuthContext";
import usePhotos from "../../hooks/usePhotos";

const CreateNewAlbumFromPhotosModal = ({ albumId, setOpen, markedImages }) => {
  const { currentUser } = useAuthContext();
  const inputTitle = useRef();
  const photos = usePhotos(albumId);
  const markedPhotos = photos.data.filter(
    (photo) => markedImages.indexOf(photo._id) > -1
  );
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputTitle.current.value.length) {
      return;
    }

    const album = await addDoc(collection(db, "albums"), {
      title: inputTitle.current.value,
      timestamp: serverTimestamp(),
      owner: currentUser.uid,
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
    inputTitle.current.value = "";
    setOpen(false);
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

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <label>Album title:</label>
          <Input
            type="text"
            placeholder="What is the album called?"
            ref={inputTitle}
          />
          <Create type="submit">Create</Create>
        </form>
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
  background: #fffafb;
  border-radius: 8px;
  width: 85%;
  height: 35%;
  display: flex;
  flex-direction: column;
  padding: 30px;
  align-items: center;
  font-size: 0.8rem;
  padding: 60px;

  @media (min-width: 768px) {
    width: 75%;
  }

  @media (min-width: 1024px) {
    width: 30%;
  }
`;

const Create = styled(Button)`
  font-size: 0.8rem;
  margin: 10px;
  width: 160px;
  margin: 20px;

  @media (min-width: 768px) {
    width: 75%;
  }

  @media (min-width: 1024px) {
    width: 40%;
  }
`;

const Input = styled(InputText)``;

export default CreateNewAlbumFromPhotosModal;

import React, { useRef } from "react";
import styled from "styled-components";
import { Button, InputText } from "../../styles/styleAssets";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthContext } from "../../contexts/AuthContext";

const CreateNewAlbumModal = ({ setOpen }) => {
  const { currentUser } = useAuthContext();
  const inputTitle = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputTitle.current.value.length) {
      return;
    }

    await addDoc(collection(db, "albums"), {
      title: inputTitle.current.value,
      timestamp: serverTimestamp(),
      owner: currentUser.uid,
    });

    inputTitle.current.value = "";
    setOpen(false);
  };

  return (
    <>
      <OverLay>
        <Modal>
          <h2 onClick={() => setOpen(false)} style={{ padding: "10px" }}>
            X
          </h2>

          <Form onSubmit={handleSubmit}>
            <label>New album name:</label>
            <Input
              type="text"
              placeholder="What is the album called?"
              ref={inputTitle}
            />
            <Create type="submit">Create</Create>
          </Form>
        </Modal>
      </OverLay>
      )
    </>
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
  height: 33%;

  @media (min-width: 768px) {
    width: 75%;
  }

  @media (min-width: 1024px) {
    width: 30%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const Create = styled(Button)`
  width: 120px;
  margin-top: 1rem;

  @media (min-width: 768px) {
    width: 140px;
  }

  @media (min-width: 1024px) {
    width: 140px;
  }
`;

const Input = styled(InputText)`
  margin-top: 1rem;
`;

export default CreateNewAlbumModal;

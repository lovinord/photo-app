import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../styles/styleAssets";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useAuthContext } from "../../contexts/AuthContext";

const ImageUpload = ({ setOpen }) => {
  const { albumId } = useParams();
  const { currentUser } = useAuthContext();

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState();
  const [uploadProgress, setUploadProgress] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return;
    }
    const uuid = uuidv4();
    const ext = image.name.substring(image.name.lastIndexOf("." + 1));
    const fileRef = ref(storage, `photos/${currentUser.uid}/${uuid}.${ext}`);
    const uploadResult = uploadBytesResumable(fileRef, image);

    uploadResult.on(
      "state_changed",
      (uploadResultSnapshot) => {
        setUploadProgress(
          Math.round(
            (uploadResultSnapshot.bytesTransferred /
              uploadResultSnapshot.totalBytes) *
              100
          )
        );
      },
      (e) => {
        setMessage({
          type: "fail",
          msg: `Upload failed due to ${e.message}`,
        });
        setUploadProgress(null);
      },
      async () => {
        const url = await getDownloadURL(fileRef);

        //creating document in db for file
        const collectionRef = collection(db, `photos`);
        await addDoc(collectionRef, {
          owner: currentUser.uid,
          album: albumId,
          name: image.name,
          path: fileRef.fullPath,
          size: image.size,
          type: image.type,
          url: url,
          uuid,
          ext,
        });

        setMessage({
          type: "success",
          msg: "Successful upload bro",
        });
        setOpen(false);
      }
    );
  };

  const handleReset = () => {
    setImage(null);
    setUploadProgress(null);
    setMessage(null);
  };
  return (
    <>
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
          <h1>Upload an image</h1>
          {message && <div variant={message.type}>{message.msg}</div>}
          <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%",
            }}
          >
            {image ? (
              <>
                {image.name}
                <br />({Math.round(image.size / 1024)} kB)
              </>
            ) : (
              <p style={{ margin: "15px 0px 15px 0px" }}>Choose an image</p>
            )}
            <input type="file" id="inputFile" onChange={handleFileChange} />
            <br />

            <br />
            {uploadProgress && <p>Uploading... {uploadProgress} % </p>}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                margin: "0 auto",
              }}
            >
              <UploadBtn type="submit">Upload</UploadBtn>
              <ClearBtn type="reset">Clear</ClearBtn>
            </div>
          </form>
        </Modal>
      </OverLay>
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
  height: 35%;
  display: flex;
  flex-direction: column;
  padding: 30px;
  align-items: center;
  flex-grid: 10px;
  font-size: 0.8rem;

  @media (min-width: 768px) {
    width: 75%;
  }

  @media (min-width: 1024px) {
    width: 30%;
  }
`;

const UploadBtn = styled(Button)`
  font-size: 0.8rem;
  margin: 10px;
  width: 160px;
  padding: 5px;
  background: green;
  @media (min-width: 768px) {
    width: 75%;
  }

  @media (min-width: 1024px) {
    width: 30%;
  }
`;
const ClearBtn = styled(Button)`
  font-size: 0.8rem;
  margin: 10px;
  padding: 5px;
  background: red;

  @media (min-width: 768px) {
    width: 75%;
  }

  @media (min-width: 1024px) {
    width: 30%;
  }
`;

export default ImageUpload;

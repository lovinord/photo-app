import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { InputText, Button } from "../styles/styleAssets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
import {
  useFirestoreDocumentData,
  useFirestoreDocumentMutation,
} from "@react-query-firebase/firestore";
import { useAuthContext } from "../contexts/AuthContext";
import usePhotos from "../hooks/usePhotos";
import { firebaseTimestampToString } from "../helpers/timestampToString";
import ImageUpload from "../components/modals/ImageUploadModal";
import PhotoGrid from "../components/PhotoGrid";

const AlbumDetails = () => {
  const editAlbumNAmeIcon = <FontAwesomeIcon icon={faPencilAlt} />;

  const { albumId } = useParams();
  const { currentUser } = useAuthContext();
  const [editAlbumName, setEditAlbumName] = useState(false);
  const [open, setOpen] = useState(false);

  const changedTitle = useRef();

  const photoQuery = usePhotos(albumId);
  const ref = doc(db, "albums", albumId);
  const album = useFirestoreDocumentData(
    ["albums", albumId],
    ref,
    {
      subscribe: true,
    },
    { refetchOnMount: "always" }
  );

  const mutation = useFirestoreDocumentMutation(ref, { merge: true });
  const handleSaveTitle = () => {
    mutation.mutate(
      {
        title: changedTitle.current.value,
      },
      {
        onSuccess() {
          album.data.title = changedTitle.current.value;
          setEditAlbumName(false);
        },
      }
    );
  };

  const isOwner = currentUser?.uid === album?.data?.owner;

  return (
    <AlbumWrapper>
      {album.isLoading && <p>Loading...</p>}
      {album.data && (
        <>
          <TitleWrapper>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex" }}>
                <p>
                  Album title: <span>{album.data.title}</span>
                </p>
                {isOwner && (
                  <i onClick={() => setEditAlbumName(!editAlbumName)}>
                    {editAlbumNAmeIcon}
                  </i>
                )}
              </div>
              {!editAlbumName && (
                <Timestamp>
                  {firebaseTimestampToString(album.data.timestamp)}
                </Timestamp>
              )}
            </div>
          </TitleWrapper>
          {editAlbumName && (
            <div
              style={{
                display: "flex",
                flexDirectin: "column",
                margin: "3px 0px 3px 0px",
              }}
            >
              <EditTitle
                type="text"
                placeholder="New album title"
                ref={changedTitle}
              />
              <SaveButton onClick={handleSaveTitle}>Save</SaveButton>
              {mutation.isError && <p>{mutation.error.message}</p>}
            </div>
          )}
          {isOwner && (
            <>
              <AddPhotosButton onClick={() => setOpen(true)}>
                Add photos to album
              </AddPhotosButton>
              {open && <ImageUpload setOpen={setOpen} />}
            </>
          )}

          <PhotoGrid
            query={photoQuery}
            album={album.data}
            albumId={albumId}
            photographer={album.data.owner}
          />
        </>
      )}
    </AlbumWrapper>
  );
};

const AlbumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  margin-top: 2rem;
  p {
    font-size: 0.8rem;

    span {
      font-size: 1.1rem;
    }
  }
  i {
    font-size: 0.85rem;
    margin: 0px 3px;
    &: hover {
      color: #f50057;
      transition: 0.3s;
    }
  }
`;

const EditTitle = styled(InputText)`
  width: 200px;
  height: 30px;
  font-size: 0.7rem;
`;

const Timestamp = styled.p`
  font-size: 0.6rem !important;
`;

const SaveButton = styled(Button)`
  width: 60px;
  height: 30px;
  font-size: 0.7rem;
  padding: 5px;
  margin-left: 8px;
  border-radius: 7px;
`;

const AddPhotosButton = styled(Button)`
  margin: 1.5rem;
  width: 200px;
  height: 40px;
  font-size: 0.8rem;
  padding: 10px;
  border-radius: 7px;
`;

export default AlbumDetails;

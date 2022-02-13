import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { InputText, Button } from "../styles/styleAssets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faLink } from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons";
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
  const editAlbumNameIcon = <FontAwesomeIcon icon={faPencilAlt} />;
  const addPhotos = <FontAwesomeIcon icon={faImages} />;
  const showLink = <FontAwesomeIcon icon={faLink} />;

  const { albumId } = useParams();
  const { currentUser } = useAuthContext();
  const [editAlbumName, setEditAlbumName] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
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

  const handleLinkClick = () => {
    setShowUrl(!showUrl);
  };

  const isOwner = currentUser?.uid === album?.data?.owner;

  return (
    <AlbumWrapper>
      {album.isLoading && <p>Loading...</p>}
      {album.data && (
        <>
          <TitleWrapper>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "30%",
                }}
              >
                <p>
                  <span>{album.data.title}</span>
                </p>
                {isOwner && (
                  <>
                    <i
                      onClick={() => setEditAlbumName(!editAlbumName)}
                      style={{ cursor: "pointer" }}
                    >
                      {editAlbumNameIcon}
                    </i>
                  </>
                )}
              </div>
              {!editAlbumName ? (
                <>
                  <Timestamp>
                    {firebaseTimestampToString(album.data.timestamp)}
                    {isOwner && (
                      <>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={handleLinkClick}
                        >
                          <p>Show album link: {showLink} </p>
                        </span>

                        {showUrl && (
                          <Url
                            type="text"
                            defaultValue={window.location.href}
                            ref={changedTitle}
                          />
                        )}
                      </>
                    )}
                  </Timestamp>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
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
            </div>
          </TitleWrapper>
          {isOwner && (
            <>
              <AddPhotosButton onClick={() => setOpen(true)}>
                {addPhotos}Add photos to album
              </AddPhotosButton>
              {open && <ImageUpload setOpen={setOpen} />}
            </>
          )}
          {photoQuery?.data?.length ? (
            <PhotoGrid
              query={photoQuery}
              album={album.data}
              albumId={albumId}
              photographer={album.data.owner}
            />
          ) : (
            <p
              style={{ maxWidth: "80%", margin: "0 auto", paddingTop: "20px" }}
            >
              You haven't uploaded any photos to this album yet.
            </p>
          )}
        </>
      )}
    </AlbumWrapper>
  );
};

const AlbumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TitleWrapper = styled.div`
  font-family: Space Grotesk;
  width: 90vw;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    font-size: 0.8rem;

    span {
      font-size: 1.1rem;
    }
  }
  i {
    font-size: 0.85rem;
    margin: 0px 3px;
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
  width: 230px;
  height: 40px;
  font-size: 0.8rem;
  padding: 10px;
  border-radius: 7px;
  display: flex;
  gap: 10px;
`;

const Url = styled(EditTitle)`
  width: 200px;
  height: 30px;
  font-size: 0.7rem;
`;

export default AlbumDetails;

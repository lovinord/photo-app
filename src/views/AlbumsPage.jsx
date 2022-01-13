import React, { useState } from "react";
import styled from "styled-components";
import { MenuHeader, Button } from "../styles/styleAssets";
import { Link } from "react-router-dom";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { firebaseTimestampToString } from "../helpers/timestampToString";
import { useAuthContext } from "../contexts/AuthContext";
import CreateAlbumModal from "../components/modals/CreateNewAlbumModal";

const AlbumsPage = () => {
  const { currentUser } = useAuthContext();
  const [open, setOpen] = useState(false);

  const queryRef = query(
    collection(db, "albums"),
    where("owner", "==", currentUser.uid),
    orderBy("timestamp", "desc")
  );
  const { data, isLoading } = useFirestoreQueryData(
    ["albums"],
    queryRef,
    { idField: "id", subscribe: true },
    { refetchOnMount: "always" }
  );

  return (
    <AlbumsWrapper>
      <AlbumsHeader>My albums</AlbumsHeader>
      <CreateAlbumButton onClick={() => setOpen(!open)}>
        Create new album
      </CreateAlbumButton>
      {open && <CreateAlbumModal setOpen={setOpen} />}
      {isLoading && <p>Loading...</p>}

      {data && (
        <>
          <OneAlbumWrapper>
            {data.map((album, i) => {
              return (
                <Link to={`/albums/${album.id}`}>
                  <OneAlbum key={i} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <AlbumTitle>{album.title}</AlbumTitle>
                    </div>
                    <AlbumTimestamp>
                      {firebaseTimestampToString(album.timestamp)}
                    </AlbumTimestamp>
                  </OneAlbum>
                </Link>
              );
            })}
          </OneAlbumWrapper>
        </>
      )}
    </AlbumsWrapper>
  );
};

const AlbumsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  margin: 0 auto;

  @media (min-width: 768px) {
    width: 70%;
  }

  @media (min-width: 1024px) {
    width: 60%;
  }
`;
const AlbumsHeader = styled(MenuHeader)``;

const CreateAlbumButton = styled(Button)`
  margin: 0px 0px 50px 0px;
  width: 200px;
  padding: 20px;

  @media (min-width: 768px) {
    width: 230px;
  }

  @media (min-width: 1024px) {
  }
`;

const OneAlbumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  @media (min-width: 1024px) {
  }
`;

const OneAlbum = styled.div`
  cursor: pointer;
  color: black;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
  width: 230px;
  height: 110px;
  border-radius: 7px;
  margin: 10px;
  padding: 15px;

  &: hover {
    box-shadow: 2px 2px 10px rgba(0, 0, 0);
    transition: 0.3s;
  }

  &: active {
    text-decoration: none;
    color: inherit;
  }
`;

const AlbumTitle = styled.p`
  font-size: 0.8rem;
`;
const AlbumTimestamp = styled.p`
  font-size: 0.6rem;
`;

export default AlbumsPage;

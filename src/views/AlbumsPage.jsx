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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";

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

  const createAlbumIcon = <FontAwesomeIcon icon={faPlus} />;
  const goToAlbum = <FontAwesomeIcon icon={faArrowAltCircleRight} />;

  return (
    <>
      {isLoading ? (
        <p style={{ textAlign: "center", marginTop: "30px" }}>Loading...</p>
      ) : (
        <AlbumsWrapper>
          <AlbumsHeader>My albums</AlbumsHeader>
          <CreateAlbumButton onClick={() => setOpen(!open)}>
            {createAlbumIcon} <p>Create new album</p>
          </CreateAlbumButton>
          {open && <CreateAlbumModal setOpen={setOpen} />}
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
                            flexDirection: "column",
                            gap: "20px",
                          }}
                        >
                          <AlbumTitle>{album.title}</AlbumTitle>
                          <AlbumTimestamp>
                            <p>Created:</p>
                            <p>{firebaseTimestampToString(album.timestamp)}</p>
                          </AlbumTimestamp>
                        </div>
                        <span style={{ fontSize: "30px" }}>{goToAlbum}</span>
                      </OneAlbum>
                    </Link>
                  );
                })}
              </OneAlbumWrapper>
            </>
          )}
        </AlbumsWrapper>
      )}
    </>
  );
};

const AlbumsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  background: #11123b;
  color: #f1efeb;
  width: 100%;
  height: 100vh;

  @media (min-width: 768px) {
  }

  @media (min-width: 1024px) {
  }
`;
const AlbumsHeader = styled(MenuHeader)``;

const CreateAlbumButton = styled(Button)`
  margin: 0px 0px 50px 0px;
  width: 240px;
  padding: 25px;
  display: flex;
  gap: 10px;

  @media (min-width: 768px) {
    width: 270px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  color: #f1efeb;
  box-shadow: rgba(1, 2, 17, 0.4) 5px 5px, rgba(1, 2, 17, 0.3) 10px 10px,
    rgba(1, 2, 17, 0.2) 15px 15px, rgba(1, 2, 17, 0.1) 20px 20px,
    rgba(1, 2, 17, 0.05) 25px 25px;
  height: 110px;
  border-radius: 7px;
  margin: 10px;
  padding: 25px;
  background: #373869;

  &: hover {
    box-shadow: 2px 2px 10px rgba(0, 0, 0);
    background: #060724;
    transition: 0.3s;
  }

  &: active {
    text-decoration: none;
  }
`;

const AlbumTitle = styled.p`
  width: 200px;
  font-size: 0.8rem;
  overflow: hidden;
  position: relative;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;

  &: hover {
    white-space: normal;
    word-break: break-all;
    transition: 0.3s;
  }
`;
const AlbumTimestamp = styled.div`
  width: 55%;
  font-size: 0.6rem;
  display: flex;
  justify-content: space-between;
`;

export default AlbumsPage;

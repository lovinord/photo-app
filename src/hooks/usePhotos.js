import { db } from "../firebase";
import { collection, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";

const usePhotos = (albumId) => {
  const photoRef = collection(db, "photos");
  const queryKey = ["photos"];

  const queryRef = query(photoRef, where("album", "==", albumId));

  const photosQuery = useFirestoreQueryData(
    queryKey,
    queryRef,
    {
      idField: "_id",
      subscribe: true,
    },
    {
      refetchOnMount: "always",
    }
  );

  return photosQuery;
};

export default usePhotos;

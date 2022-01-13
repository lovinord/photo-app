import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { useFirestoreDocumentData } from "@react-query-firebase/firestore";

const usePhotoData = (photoId) => {
  const photoRef = doc(db, "photos", photoId);
  const photoData = useFirestoreDocumentData(["photos", photoId], photoRef);

  return photoData;
};

export default usePhotoData;

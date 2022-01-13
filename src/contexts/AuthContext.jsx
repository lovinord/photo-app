import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();
const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //sign up
  const createaccount = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //sign in
  const signin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  //signout
  const signout = () => {
    return signOut(auth);
  };

  //auth-state observer

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const values = { currentUser, createaccount, signin, signout };

  return (
    <AuthContext.Provider value={values}>
      {loading ? "" : <>{children}</>}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthContextProvider as default };

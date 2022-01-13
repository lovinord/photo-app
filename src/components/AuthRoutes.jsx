import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AuthRoutes = ({ children, redirectTo }) => {
  const { currentUser } = useAuthContext();

  return currentUser ? children : <Navigate to={redirectTo} />;
};

export default AuthRoutes;

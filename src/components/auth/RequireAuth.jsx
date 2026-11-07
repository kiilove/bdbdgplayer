import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const RequireAuth = ({ children }) => {
  const { currentUid } = useContext(UserContext);
  const hasStoredToken = Boolean(localStorage.getItem("globalValue"));

  if (!currentUid && !hasStoredToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;


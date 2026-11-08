import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  UserContext,
  readEncryptedSessionUid,
} from "../../context/UserContext";

const RequireAuth = ({ children }) => {
  const { isLoggedIn } = useContext(UserContext);
  const location = useLocation();
  const hasValidStoredSession = Boolean(readEncryptedSessionUid());

  if (!isLoggedIn && !hasValidStoredSession) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
};

export default RequireAuth;

import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { UserContext } from "../../context/UserContext";

const RequireAuth = ({ children }) => {
  const { isLoggedIn, isAuthLoading } = useContext(UserContext);
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex justify-center items-center">
        <RotatingLines
          strokeColor="#111111"
          strokeWidth="4"
          animationDuration="0.75"
          width="48"
          visible={true}
        />
      </div>
    );
  }

  if (!isLoggedIn) {
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

import { useMemo, useReducer } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { AuthReducer } from "./AuthReducer";

const INITIAL_STATE = {
  currentUser: JSON.parse(sessionStorage.getItem("playerUser")),
};

export const AuthContext = createContext(INITIAL_STATE);
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  //console.log(state);
  useMemo(() => {
    //console.log("memo", state);
    sessionStorage.setItem("playerUser", JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

import { useMemo, useReducer } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { AuthReducer } from "./AuthReducer";

const INITIAL_STATE = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")),
};

export const AuthContext = createContext(INITIAL_STATE);
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  //console.log(state);
  useMemo(() => {
    //console.log("memo", state);
    localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
  }, [state.userInfo]);

  return (
    <AuthContext.Provider value={{ userInfo: state.userInfo, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

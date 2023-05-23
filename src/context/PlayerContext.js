import { useMemo, useReducer } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { PlayerEditReducer } from "./PlayerReduce";

const INITIAL_STATE = {
  pInfo: JSON.parse(localStorage.getItem("pInfo")) || {
    pName: "",
    pEmail: "",
    pTel: "",
    pPic: "",
    pNick: "",
    pGender: "",
    pBirth: "",
    pGym: "",
  },
};

export const PlayerEditContext = createContext(INITIAL_STATE);
export const PlayerEditContextProvider = ({ children }) => {
  const [state, editDispatch] = useReducer(PlayerEditReducer, INITIAL_STATE);
  //console.log(state);
  useMemo(() => {
    //console.log("memo", state);
    localStorage.setItem("pInfo", JSON.stringify(state.pInfo));
  }, [state.pInfo]);

  return (
    <PlayerEditContext.Provider value={{ pInfo: state.pInfo, editDispatch }}>
      {children}
    </PlayerEditContext.Provider>
  );
};

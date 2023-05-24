import React, { createContext, useEffect, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestores";
import { where } from "firebase/firestore";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);
  const getQuery = useFirestoreQuery();
  const fetchUser = async () => {
    if (!currentUserInfo?.pUid) {
      setContextLoading(false);
      return;
    }
    const condition = [where("playerUid", "==", currentUserInfo.pUid)];
    const data = await getQuery.getDocuments("players_pool", condition);
    if (data.length === 0) {
      return;
    } else {
      setCurrentUserInfo({
        ...currentUserInfo,
        pId: data[0].id,
        pName: data[0].pName || "",
        pNick: data[0].pNick || "",
        pTel: data[0].pTel || "",
        pBirth: data[0].pBirth || "",
        pEmail: data[0].pEmail || "",
        pGender: data[0].pGender || "",
        pGym: data[0].pGym,
      });
    }
    setContextLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [currentUserInfo?.pUid]);

  useEffect(() => {
    console.log(currentUserInfo);
  }, [currentUserInfo]);

  useEffect(() => {
    setContextLoading(true);
    setCurrentUserInfo({
      ...currentUserInfo,
      pUid: localStorage.getItem("globalValue") || "",
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ currentUserInfo, setCurrentUserInfo, contextLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

import React, { createContext, useEffect, useState } from "react";
import { Decrypt, Encrypt } from "../components/Encrypt";
import { useFirestoreQuery } from "../hooks/useFirestores";
import { where } from "@firebase/firestore";
import ConfirmationModal from "../messageBox/ConfirmationModal";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const [currentUid, setCurrentUid] = useState("");
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const getQuery = useFirestoreQuery();

  const handleMessageBox = () => {
    setMessageOpen(false);
  };

  const setLoginToken = () => {
    const currentTimestamp = new Date().getTime();
    const expirationTimestamp = currentTimestamp + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    const encryptedCurrentId = Encrypt(currentUid);
    const encryptedToken = Encrypt(expirationTimestamp?.toString());

    localStorage.setItem(
      "globalValue",
      JSON.stringify({ value: encryptedCurrentId, token: encryptedToken })
    );
  };

  const fetchUserInfo = async (uid) => {
    const condition = [where("playerUid", "==", uid)];
    const data = await getQuery.getDocuments("players_pool", condition);

    if (!data) {
      setMessage({
        body: "유저정보를 불러오지 못했습니다.",
        isButton: true,
        confirmButtonText: "확인",
      });
      setMessageOpen(true);
      return;
    }
    setCurrentUserInfo({ ...data[0] });
  };

  useEffect(() => {
    const encryptedCurrentUid = localStorage.getItem("globalValue");
    if (encryptedCurrentUid) {
      const decryptedCurrentUid = Decrypt(encryptedCurrentUid);
      setCurrentUid(decryptedCurrentUid);
    }
  }, []);

  useEffect(() => {
    const storedValue = localStorage.getItem("globalValue");
    if (storedValue) {
      const { value, token } = JSON.parse(storedValue);

      const decryptValue = Decrypt(value);
      const decryptedToken = Decrypt(token);

      const expirationTimestamp = parseInt(decryptedToken, 10);

      if (expirationTimestamp <= new Date().getTime()) {
        localStorage.removeItem("globalValue");
      } else {
        setCurrentUid(decryptValue);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUid) {
      setLoginToken();
      fetchUserInfo(currentUid);
    }
  }, [currentUid]);

  useEffect(() => {
    console.log(currentUserInfo);
  }, [currentUserInfo]);

  return (
    <UserContext.Provider
      value={{ currentUid, setCurrentUid, currentUserInfo, setCurrentUserInfo }}
    >
      <ConfirmationModal
        isOpen={messageOpen}
        onCancel={handleMessageBox}
        onConfirm={handleMessageBox}
        message={message}
      />
      {children}
    </UserContext.Provider>
  );
};

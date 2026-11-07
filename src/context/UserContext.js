import React, { createContext, useCallback, useEffect, useState } from "react";
import { Decrypt, Encrypt } from "../components/Encrypt";
import { fetchPlayerByUid } from "../services/playerService";

export const UserContext = createContext();

const STORAGE_KEY = "globalValue";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const saveEncryptedSession = (uid) => {
  const expirationTimestamp = Date.now() + SESSION_TTL_MS;
  const encryptedCurrentId = Encrypt(uid);
  const encryptedToken = Encrypt(String(expirationTimestamp));

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ value: encryptedCurrentId, token: encryptedToken })
  );
};

const readEncryptedSessionUid = () => {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  if (!storedValue) return "";

  try {
    const { value, token } = JSON.parse(storedValue);
    const decryptedUid = Decrypt(value);
    const decryptedToken = Decrypt(token);
    const expirationTimestamp = parseInt(decryptedToken, 10);

    if (
      !decryptedUid ||
      Number.isNaN(expirationTimestamp) ||
      expirationTimestamp <= Date.now()
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return "";
    }
    return decryptedUid;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return "";
  }
};

export const UserContextProvider = ({ children }) => {
  const [currentUid, setCurrentUid] = useState(() => readEncryptedSessionUid());
  const [currentUserInfo, setCurrentUserInfo] = useState({});

  const clearUserSession = useCallback(() => {
    setCurrentUid("");
    setCurrentUserInfo({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!currentUid) {
      return undefined;
    }

    saveEncryptedSession(currentUid);

    fetchPlayerByUid(currentUid)
      .then((playerDoc) => {
        if (isMounted && playerDoc) {
          setCurrentUserInfo({ ...playerDoc });
        }
      })
      .catch((err) => {
        console.error("Failed to load player profile:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUid]);

  return (
    <UserContext.Provider
      value={{
        currentUid,
        setCurrentUid,
        currentUserInfo,
        setCurrentUserInfo,
        clearUserSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

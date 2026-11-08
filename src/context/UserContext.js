import React, { createContext, useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Decrypt, Encrypt } from "../components/Encrypt";
import { fetchPlayerByUid } from "../services/playerService";
import { invalidateContestCache } from "../services/contestService";

export const UserContext = createContext();

const STORAGE_KEY = "globalValue";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const saveEncryptedSession = (uid) => {
  if (!uid) return;
  const expirationTimestamp = Date.now() + SESSION_TTL_MS;
  const encryptedCurrentId = Encrypt(uid);
  const encryptedToken = Encrypt(String(expirationTimestamp));

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ value: encryptedCurrentId, token: encryptedToken })
  );
};

export const readEncryptedSessionUid = () => {
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
  const [currentUserInfo, setCurrentUserInfo] = useState(() => {
    const initialUid = readEncryptedSessionUid();
    return initialUid ? { playerUid: initialUid } : {};
  });
  const [isAuthLoading, setIsAuthLoading] = useState(() =>
    Boolean(readEncryptedSessionUid())
  );

  const clearUserSession = useCallback(() => {
    setCurrentUid("");
    setCurrentUserInfo({});
    setIsAuthLoading(false);
    localStorage.removeItem(STORAGE_KEY);
    invalidateContestCache();
  }, []);

  /**
   * 로그인 또는 회원가입 직후 호출하여 Firebase Auth 유저와 Firestore 프로필을 동기화하고
   * 완료된 프로필 객체를 반환 (페이지 이동 직전 프로필 로드 보장)
   */
  const loginSession = useCallback(async (firebaseUser, initialProfile = null) => {
    const uid = firebaseUser?.uid;
    if (!uid) return null;

    saveEncryptedSession(uid);
    setCurrentUid(uid);
    invalidateContestCache();

    if (initialProfile) {
      const merged = {
        ...initialProfile,
        playerUid: uid,
        pEmail: initialProfile.pEmail || firebaseUser.email || "",
      };
      setCurrentUserInfo(merged);
      setIsAuthLoading(false);
      return merged;
    }

    // 네트워크 응답 전에도 로그인 상태(playerUid)가 끊기지 않도록 즉시 반영
    setCurrentUserInfo((prev) => ({
      ...prev,
      playerUid: uid,
      pEmail: prev?.pEmail || firebaseUser.email || "",
    }));

    try {
      const playerDoc = await fetchPlayerByUid(uid, firebaseUser.email || "");
      const resolvedProfile = playerDoc || {
        playerUid: uid,
        pEmail: firebaseUser.email || "",
      };
      setCurrentUserInfo(resolvedProfile);
      return resolvedProfile;
    } catch (err) {
      console.error("Failed to load player profile on login:", err);
      const fallback = {
        playerUid: uid,
        pEmail: firebaseUser.email || "",
      };
      setCurrentUserInfo(fallback);
      return fallback;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  // Firebase Auth 세션과 로컬 암호화 세션(7일 만료) 동기화
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const storedUid = readEncryptedSessionUid();

      if (firebaseUser?.uid) {
        // 로컬 스토리지가 만료되어 삭제된 상태인데 Firebase Auth만 남아있다면 로그아웃 동기화
        if (!storedUid && !currentUid) {
          signOut(auth).catch(() => {});
          return;
        }
        if (storedUid && storedUid !== firebaseUser.uid) {
          saveEncryptedSession(firebaseUser.uid);
          setCurrentUid(firebaseUser.uid);
        } else if (!currentUid && storedUid) {
          setCurrentUid(storedUid);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUid]);

  // 새로고침 또는 UID 변경 시 Firestore 선수 프로필 로드
  useEffect(() => {
    let isMounted = true;

    if (!currentUid) {
      setIsAuthLoading(false);
      return undefined;
    }

    saveEncryptedSession(currentUid);
    setIsAuthLoading(true);

    fetchPlayerByUid(currentUid, auth.currentUser?.email || "")
      .then((playerDoc) => {
        if (!isMounted) return;
        if (playerDoc) {
          setCurrentUserInfo(playerDoc);
        } else {
          // players_pool 문서가 없더라도 로그인 세션(playerUid)이 풀리지 않도록 기본값 보장
          setCurrentUserInfo((prev) => ({
            ...prev,
            playerUid: currentUid,
            pEmail: prev?.pEmail || auth.currentUser?.email || "",
          }));
        }
      })
      .catch((err) => {
        console.error("Failed to load player profile:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUid]);

  const isLoggedIn = Boolean(currentUid || currentUserInfo?.playerUid);

  return (
    <UserContext.Provider
      value={{
        currentUid,
        setCurrentUid,
        currentUserInfo,
        setCurrentUserInfo,
        isLoggedIn,
        isAuthLoading,
        loginSession,
        clearUserSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

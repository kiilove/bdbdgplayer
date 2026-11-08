import React, { createContext, useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { fetchPlayerByUid } from "../services/playerService";
import { invalidateContestCache } from "../services/contestService";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [currentUid, setCurrentUid] = useState(
    () => auth.currentUser?.uid || ""
  );
  const [currentUserInfo, setCurrentUserInfo] = useState(() =>
    auth.currentUser?.uid
      ? {
          playerUid: auth.currentUser.uid,
          pEmail: auth.currentUser.email || "",
        }
      : {}
  );
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 레거시 localStorage("globalValue") 잔여 데이터가 있다면 초기 1회 완전히 정리
  useEffect(() => {
    try {
      localStorage.removeItem("globalValue");
    } catch {
      // ignore storage errors
    }
  }, []);

  const clearUserSession = useCallback(() => {
    setCurrentUid("");
    setCurrentUserInfo({});
    setIsAuthLoading(false);
    invalidateContestCache();
  }, []);

  /**
   * 로그인 또는 회원가입 직후 호출하여 Firebase Auth 유저와 Firestore 프로필을 즉시 동기화
   */
  const loginSession = useCallback(
    async (firebaseUser, initialProfile = null) => {
      const uid = firebaseUser?.uid;
      if (!uid) return null;

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
    },
    []
  );

  // 오직 Firebase Authentication(onAuthStateChanged)만을 단일 인증 소스로 사용
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;

      if (!firebaseUser?.uid) {
        setCurrentUid("");
        setCurrentUserInfo({});
        setIsAuthLoading(false);
        return;
      }

      const uid = firebaseUser.uid;
      setCurrentUid(uid);
      setCurrentUserInfo((prev) => ({
        ...prev,
        playerUid: uid,
        pEmail: prev?.pEmail || firebaseUser.email || "",
      }));

      try {
        const playerDoc = await fetchPlayerByUid(uid, firebaseUser.email || "");
        if (!isMounted) return;
        if (playerDoc) {
          setCurrentUserInfo(playerDoc);
        } else {
          setCurrentUserInfo((prev) => ({
            ...prev,
            playerUid: uid,
            pEmail: prev?.pEmail || firebaseUser.email || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load player profile:", err);
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

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

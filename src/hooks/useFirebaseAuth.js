import { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email, password) => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return { user: userCredential.user, error: null };
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case "auth/too-many-requests":
          errorMessage = "비밀번호 입력횟수가 초과되었습니다.";
          break;
        case "auth/user-not-found":
          errorMessage = "사용자를 찾을 수 없습니다.";
          break;
        case "auth/wrong-password":
          errorMessage = "잘못된 비밀번호입니다.";
          break;
        case "auth/network-request-failed":
          errorMessage = "네트워크 오류가 발생했습니다.";
          break;
        default:
          errorMessage = error.message;
          break;
      }
      return { user: null, error: { message: errorMessage } };
    }
  };

  const signUpWithEmail = async (email, password) => {
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return { user: userCredential.user, error: null };
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "이미 사용 중인 이메일입니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "유효하지 않은 이메일 주소입니다.";
          break;
        case "auth/weak-password":
          errorMessage = "보안 수준이 낮은 비밀번호입니다.";
          break;
        case "auth/network-request-failed":
          errorMessage = "네트워크 오류가 발생했습니다.";
          break;
        default:
          errorMessage = error.message;
          break;
      }
      return { user: null, error: { message: errorMessage } };
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      return { user: null, error: null };
    } catch (error) {
      return { user: null, error: { message: error.message } };
    }
  };

  return {
    user,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    handleSignOut,
  };
};

export default useFirebaseAuth;

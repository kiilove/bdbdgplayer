import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
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
          errorMessage =
            "로그인 시도 횟수가 초과되었습니다. 잠시 후 다시 시도해 주세요.";
          break;
        case "auth/user-not-found":
          errorMessage = "등록되지 않은 이메일 계정입니다.";
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
          errorMessage = "이메일 또는 비밀번호가 일치하지 않습니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "올바른 이메일 주소 형식이 아닙니다.";
          break;
        case "auth/user-disabled":
          errorMessage = "이용이 제한된 계정입니다. 협회로 문의해 주세요.";
          break;
        case "auth/network-request-failed":
          errorMessage = "네트워크 연결 상태를 확인해 주세요.";
          break;
        default:
          errorMessage =
            "로그인 중 오류가 발생했습니다. 입력 정보를 다시 확인해 주세요.";
          break;
      }
      return { user: null, error: { message: errorMessage } };
    }
  }, []);

  const signUpWithEmail = useCallback(async (email, password) => {
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
          errorMessage = "비밀번호는 6자리 이상이어야 합니다.";
          break;
        case "auth/network-request-failed":
          errorMessage = "네트워크 오류가 발생했습니다.";
          break;
        default:
          errorMessage = "회원가입 중 오류가 발생했습니다.";
          break;
      }
      return { user: null, error: { code: error.code, message: errorMessage } };
    }
  }, []);

  const checkEmailExists = useCallback(async (email) => {
    const methods = await fetchSignInMethodsForEmail(auth, email.trim());
    return Array.isArray(methods) && methods.length > 0;
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { user: null, error: null };
    } catch (error) {
      return { user: null, error: { message: error.message } };
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    auth.languageCode = "ko";
    if (!email || !email.trim()) {
      return {
        success: null,
        error: {
          code: "auth/missing-email",
          message: "이메일 주소를 입력해주세요.",
        },
      };
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: {
          message: `${email.trim()}으로 비밀번호 재설정 링크를 발송했습니다.`,
        },
        error: null,
      };
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage =
            "가입되지 않은 이메일 주소입니다. 이메일을 다시 확인해주세요.";
          break;
        case "auth/invalid-email":
          errorMessage = "올바른 이메일 주소 형식이 아닙니다.";
          break;
        case "auth/missing-email":
          errorMessage = "이메일 주소를 입력해주세요.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.";
          break;
        case "auth/network-request-failed":
          errorMessage = "네트워크 연결 상태를 확인해주세요.";
          break;
        default:
          errorMessage = "비밀번호 재설정 메일 발송 중 오류가 발생했습니다.";
          break;
      }
      return {
        success: null,
        error: { code: error.code || "error", message: errorMessage },
      };
    }
  }, []);

  return {
    user,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    checkEmailExists,
    handleSignOut,
    resetPassword,
  };
};

export default useFirebaseAuth;

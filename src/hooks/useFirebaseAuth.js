import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../firebase";
import { checkPlayerEmailInPool } from "../services/playerService";

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

  /**
   * 비밀번호 찾기 (Firebase 비밀번호 재설정 이메일 발송)
   * - Firebase 이메일 열거 보호가 켜져 있어도 players_pool 조회를 병행하여 미가입 이메일 안내 지원
   */
  const resetPassword = useCallback(async (email) => {
    auth.languageCode = "ko";
    const trimmedEmail = (email || "").trim();
    if (!trimmedEmail) {
      return {
        success: null,
        error: {
          code: "auth/missing-email",
          message: "이메일 주소를 입력해주세요.",
        },
      };
    }

    try {
      const [existsInPool, existsInAuth] = await Promise.all([
        checkPlayerEmailInPool(trimmedEmail).catch(() => true),
        fetchSignInMethodsForEmail(auth, trimmedEmail)
          .then((methods) => Array.isArray(methods) && methods.length > 0)
          .catch(() => false),
      ]);

      if (!existsInPool && !existsInAuth) {
        return {
          success: null,
          error: {
            code: "auth/user-not-found",
            message:
              "가입되지 않은 이메일 주소입니다. '이메일(아이디) 찾기' 탭에서 가입 계정을 먼저 확인해 주세요.",
          },
        };
      }

      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };

      try {
        await sendPasswordResetEmail(auth, trimmedEmail, actionCodeSettings);
      } catch (innerErr) {
        // 만약 현재 도메인(예: 임시 포트 등)이 승인된 도메인 목록에 없을 경우 기본 설정으로 폴백 발송
        if (
          innerErr?.code === "auth/unauthorized-continue-uri" ||
          innerErr?.code === "auth/invalid-continue-uri"
        ) {
          await sendPasswordResetEmail(auth, trimmedEmail);
        } else {
          throw innerErr;
        }
      }

      return {
        success: {
          message: `${trimmedEmail}으로 비밀번호 재설정 링크를 발송했습니다.`,
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

  /**
   * 로그인된 선수의 비밀번호 변경 (현재 비밀번호 재인증 후 Firebase updatePassword 실행)
   */
  const changePassword = useCallback(
    async ({ email, currentPassword, newPassword }) => {
      const trimmedEmail = (email || auth.currentUser?.email || "").trim();
      if (!trimmedEmail) {
        return {
          success: false,
          error: {
            message:
              "계정 이메일 정보를 확인할 수 없습니다. 다시 로그인해 주세요.",
          },
        };
      }
      if (!currentPassword) {
        return {
          success: false,
          error: { message: "현재 사용 중인 비밀번호를 입력해 주세요." },
        };
      }
      if (!newPassword || newPassword.length < 6) {
        return {
          success: false,
          error: { message: "새 비밀번호는 6자리 이상이어야 합니다." },
        };
      }
      if (currentPassword === newPassword) {
        return {
          success: false,
          error: {
            message: "새 비밀번호는 현재 비밀번호와 다르게 입력해 주세요.",
          },
        };
      }

      try {
        let targetUser = auth.currentUser;

        if (
          targetUser &&
          targetUser.email &&
          targetUser.email.toLowerCase() === trimmedEmail.toLowerCase()
        ) {
          const credential = EmailAuthProvider.credential(
            trimmedEmail,
            currentPassword
          );
          await reauthenticateWithCredential(targetUser, credential);
        } else {
          // 로컬 암호화 세션으로만 복원되어 auth.currentUser가 비어있는 경우 재로그인으로 세션 확보
          const userCredential = await signInWithEmailAndPassword(
            auth,
            trimmedEmail,
            currentPassword
          );
          targetUser = userCredential.user;
          setUser(targetUser);
        }

        await updatePassword(targetUser, newPassword);
        return { success: true, error: null };
      } catch (error) {
        let errorMessage;
        switch (error.code) {
          case "auth/wrong-password":
          case "auth/invalid-credential":
          case "auth/invalid-login-credentials":
            errorMessage =
              "현재 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.";
            break;
          case "auth/weak-password":
            errorMessage = "새 비밀번호는 6자리 이상으로 설정해 주세요.";
            break;
          case "auth/too-many-requests":
            errorMessage =
              "시도 횟수가 너무 많습니다. 잠시 후 다시 시도해 주세요.";
            break;
          case "auth/requires-recent-login":
            errorMessage =
              "보안을 위해 다시 로그인한 뒤 비밀번호를 변경해 주세요.";
            break;
          case "auth/network-request-failed":
            errorMessage = "네트워크 연결 상태를 확인해 주세요.";
            break;
          default:
            errorMessage =
              "비밀번호 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
            break;
        }
        return {
          success: false,
          error: { code: error.code || "error", message: errorMessage },
        };
      }
    },
    []
  );

  /**
   * 이메일 재설정 링크(oobCode) 유효성 검증
   */
  const verifyResetCode = useCallback(async (oobCode) => {
    try {
      const accountEmail = await verifyPasswordResetCode(auth, oobCode);
      return { email: accountEmail, error: null };
    } catch {
      return {
        email: null,
        error: {
          message:
            "만료되었거나 이미 사용된 비밀번호 재설정 링크입니다. 재설정 메일을 다시 요청해 주세요.",
        },
      };
    }
  }, []);

  /**
   * 이메일 재설정 링크(oobCode)로 새 비밀번호 확정
   */
  const confirmNewPassword = useCallback(async (oobCode, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: { message: "새 비밀번호는 6자리 이상 입력해 주세요." },
      };
    }
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      return { success: true, error: null };
    } catch (error) {
      let errorMessage =
        "비밀번호 재설정 중 오류가 발생했습니다. 링크를 다시 발급받아 주세요.";
      if (error.code === "auth/weak-password") {
        errorMessage = "새 비밀번호는 6자리 이상이어야 합니다.";
      } else if (
        error.code === "auth/expired-action-code" ||
        error.code === "auth/invalid-action-code"
      ) {
        errorMessage =
          "재설정 링크 유효시간이 만료되었습니다. 재설정 메일을 다시 요청해 주세요.";
      }
      return { success: false, error: { message: errorMessage } };
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
    changePassword,
    verifyResetCode,
    confirmNewPassword,
  };
};

export default useFirebaseAuth;

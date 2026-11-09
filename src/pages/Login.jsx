import React, { useContext, useRef, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PosterWallBackground from "../components/common/PosterWallBackground";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const { signInWithEmail, handleSignOut } = useFirebaseAuth();
  const { loginSession, clearUserSession } = useContext(UserContext);

  const redirectTo =
    location.state?.from && location.state.from !== "/login"
      ? location.state.from
      : "/";

  const handleLogin = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    const trimmedEmail = loginInfo.email.trim();
    const rawPassword = loginInfo.password;

    if (!trimmedEmail || !rawPassword) {
      setMessage({
        type: "warn",
        title: "입력 확인",
        body: "이메일 아이디와 비밀번호를 입력해주세요.",
        body2: "가입하신 이메일 주소와 비밀번호를 모두 입력해야 로그인이 가능합니다.",
        isButton: true,
        confirmButtonText: "확인",
      });
      setMessageOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await handleSignOut();
      clearUserSession();

      const { user, error } = await signInWithEmail(trimmedEmail, rawPassword);
      if (error) {
        setMessage({
          type: "error",
          title: "로그인 안내",
          body: error.message,
          body2: "계정 정보가 기억나지 않으시면 하단의 '아이디 · 비밀번호 찾기'를 이용해 주세요.",
          isButton: true,
          confirmButtonText: "다시 입력하기",
        });
        setMessageOpen(true);
      } else if (user) {
        await loginSession(user);
        navigate(redirectTo, { replace: true });
      }
    } catch {
      setMessage({
        type: "error",
        title: "오류 안내",
        body: "로그인 중 일시적인 오류가 발생했습니다.",
        body2: "네트워크 연결을 확인하신 후 다시 시도해 주세요.",
        isButton: true,
        confirmButtonText: "확인",
      });
      setMessageOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: name === "email" ? value.trim() : value,
    }));
  };

  const handleMessageBox = () => {
    setMessageOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#F6F7F9] text-[#111111] flex flex-col justify-center items-center px-4 py-12 font-sans antialiased">
      <PosterWallBackground />
      <ConfirmationModal
        isOpen={messageOpen}
        onCancel={handleMessageBox}
        onConfirm={handleMessageBox}
        message={message}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex justify-center items-center">
          <RotatingLines
            strokeColor="#111111"
            strokeWidth="4"
            animationDuration="0.75"
            width="52"
            visible={true}
          />
        </div>
      )}

      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-y-2 mb-8">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-[#111111]"
          >
            BDBDG<span className="text-[#FF3B30]">.</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111] mt-1">
            선수 로그인
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            보디빌딩 & 피트니스 대회 공식 참가접수 시스템
          </p>
        </div>

        {/* Semantic Login Form (모바일·브라우저 패스워드 자동완성 지원) */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-0.5"
            >
              EMAIL · 이메일 계정
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              value={loginInfo.email}
              onChange={handleInputs}
              ref={loginEmailRef}
              className="w-full h-12 bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 text-base text-[#111111] placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-black/5 transition"
              placeholder="name@example.com"
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-0.5"
            >
              PASSWORD · 비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={loginInfo.password}
              onChange={handleInputs}
              ref={loginPasswordRef}
              className="w-full h-12 bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 text-base text-[#111111] placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-black/5 transition"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 py-3.5 mt-3 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-[15px] rounded-xl transition cursor-pointer flex items-center justify-center active:scale-[0.99] disabled:opacity-60"
          >
            로그인
          </button>
        </form>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 w-full mt-8 pt-6 border-t border-neutral-100 text-xs sm:text-sm">
          <Link
            to="/register"
            className="font-bold text-[#111111] hover:underline transition"
          >
            신규 선수 회원가입
          </Link>
          <div className="flex items-center gap-x-3">
            <Link
              to="/resetpassword"
              className="text-neutral-500 hover:text-[#111111] transition font-medium"
            >
              아이디 · 비밀번호 찾기
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              to="/"
              className="text-neutral-500 hover:text-[#111111] transition font-medium"
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

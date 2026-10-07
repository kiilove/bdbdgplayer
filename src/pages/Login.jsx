import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { UserContext } from "../context/UserContext";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
} from "../hooks/useFirestores";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [existEmail, setExistEmail] = useState(true);

  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const navigate = useNavigate();

  const getQuery = useFirestoreQuery();
  const { signInWithEmail, handleSignOut } = useFirebaseAuth();
  const { setCurrentUid, currentUserInfo, setCurrentUserInfo } =
    useContext(UserContext);

  const handleLogin = async () => {
    if (loginInfo.email === "" || loginInfo.password === "") {
      setMessage({
        body: "아이디와 패스워드를 입력해주세요",
        isButton: true,
        confirmButtonText: "확인",
      });
      setMessageOpen(true);
      return;
    }

    try {
      await handleSignOut();
      setCurrentUid("");
      setCurrentUserInfo({});
      localStorage.setItem(
        "globalValue",
        JSON.stringify({ value: "", token: "" })
      );
      await signInWithEmail(
        loginInfo.email.trim(),
        loginInfo.password.trim()
      ).then(({ user, error }) => {
        if (error) {
          setMessage({
            body: error.message,
            isButton: true,
            confirmButtonText: "확인",
          });
          setMessageOpen(true);
        }
        if (user) {
          setCurrentUid(user.uid);
          navigate("/");
        }
      });
    } catch (error) {
      return;
    }
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setLoginInfo(() => ({ ...loginInfo, [name]: value.trim() }));
  };

  const handleMessageBox = () => {
    setMessageOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans antialiased">
      <ConfirmationModal
        isOpen={messageOpen}
        onCancel={handleMessageBox}
        onConfirm={handleMessageBox}
        message={message}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
          <RotatingLines
            strokeColor="#ffffff"
            strokeWidth="4"
            animationDuration="0.75"
            width="64"
            visible={true}
          />
        </div>
      )}

      <div className="w-full max-w-md bg-[#141414] border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 flex flex-col items-center">
        {/* Nike Header */}
        <div className="flex flex-col items-center text-center gap-y-2 mb-8">
          <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full">
            ATHLETE PORTAL / SIGN IN
          </span>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase mt-2">
            BDBDg LOGIN
          </h1>
          <p className="text-xs text-neutral-400 font-medium">
            보디빌딩 & 피트니스 대회 공식 접수 시스템
          </p>
        </div>

        {/* Input Form */}
        <div className="w-full flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-1.5">
            <label className="text-xs font-bold text-neutral-300 px-1">이메일 계정</label>
            <input
              type="text"
              name="email"
              value={loginInfo.email}
              onChange={(e) => handleInputs(e)}
              ref={loginEmailRef}
              className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-2xl px-5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <label className="text-xs font-bold text-neutral-300 px-1">비밀번호</label>
            <input
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={(e) => handleInputs(e)}
              ref={loginPasswordRef}
              className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-2xl px-5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
              placeholder="비밀번호를 입력하세요"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            className="w-full h-14 mt-4 bg-white hover:bg-neutral-200 text-black font-black text-sm tracking-wider uppercase rounded-full shadow-xl transition cursor-pointer flex items-center justify-center active:scale-95"
            onClick={() => handleLogin()}
          >
            로그인
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between w-full mt-8 pt-6 border-t border-neutral-800 text-xs">
          <Link to="/register" className="font-black text-white hover:underline transition">
            선수 무료 회원가입
          </Link>
          <div className="flex items-center gap-x-3">
            <Link to="/resetpassword" className="text-neutral-400 hover:text-white transition font-medium">
              아이디 / 비밀번호 찾기
            </Link>
            <span className="text-neutral-700">|</span>
            <Link to="/" className="text-neutral-400 hover:text-white transition font-medium">
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

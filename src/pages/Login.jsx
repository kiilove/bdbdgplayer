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
      console.log(error);
      return;
    }
  };

  const playerLogin = async (email, pwd) => {
    // const auth = getAuth();
    // await signInWithEmailAndPassword(auth, email.trim(), pwd.trim())
    //   .then(async (user) => {
    //     const userInfo = user;
    //     const profile = await getPlayerProfile(userInfo.user.uid);
    //     return profile;
    //     //
    //   })
    //   .then((profile) => {
    //     //console.log(profile);
    //     //console.log(window.navigator.userAgent);
    //     dispatch({
    //       type: "LOGIN",
    //       payload: { id: profile.id, pUid: profile.playerUid },
    //     });
    //     return profile;
    //   })
    //   .then((profile) => {
    //     //console.log(profile);
    //     editDispatch({
    //       type: "EDIT",
    //       payload: {
    //         pName: profile.pName,
    //         pEmail: profile.pEmail,
    //         pTel: profile.pTel || "",
    //         pPic: profile.pPic || "",
    //         pNick: profile.pNick || "",
    //         pGender: profile.gender || "",
    //         pBirth: profile.pBirth || "",
    //         pGym: profile.pGym || "",
    //       },
    //     });
    //   })
    //   .then(() => setIsLoading(false))
    //   .then(() => navigate("/"))
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.log(errorCode);
    //     navigate("/loginerror", { state: errorCode });
    //     //handleToast({ type: "error", msg: errorMessage });
    //   });
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setLoginInfo(() => ({ ...loginInfo, [name]: value.trim() }));
  };

  const handleMessageBox = () => {
    setMessageOpen(false);
  };

  return (
    <div className="flex w-full h-screen justify-center items-start align-top bg-slate-100">
      <ConfirmationModal
        isOpen={messageOpen}
        onCancel={handleMessageBox}
        onConfirm={handleMessageBox}
        message={message}
      />
      <div className="flex w-full flex-col items-center">
        <div
          className={`absolute top-0 left-1/2 w-full h-screen bg-orange-600 border-0 px-10 py-3 outline-none flex flex-col z-50 justify-center items-center ${
            !isLoading && "hidden"
          }`}
          style={{
            maxWidth: "420px",
            transform: "translate(-50%, 0%)",
          }}
        >
          <RotatingLines
            strokeColor="white"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
        <div className="flex w-full justify-center mt-12 flex-col gap-y-1">
          <p className="text-xl flex justify-center items-center h-full">
            대한민국 No.1 피트니스 플랫폼
          </p>
          <p className="text-lg flex justify-center align-middle items-center">
            <span className="text-2xl text-orange-500 font-bold align-middle">
              BDBDg
            </span>
            에 오신것을 환영합니다.
          </p>
        </div>
        <div
          className="flex justify-center mt-10 flex-col gap-y-3 px-4 w-full"
          style={{ maxWidth: "420px" }}
        >
          {/* <button
            className="w-full h-12 bg-yellow-400 rounded-md border-gray-300 border"
            onClick={() => (window.location.href = "/home")}
          >
            <span className=" text-base font-semibold">카카오로 로그인</span>
          </button>
          <button
            className="w-full h-12 bg-white rounded-md border-gray-300 border"
            onClick={() => (window.location.href = "/home")}
          >
            <span className=" text-base font-semibold">네이버로 로그인</span>
          </button> */}
          {/* <button
            className="w-full h-12 bg-white rounded-md border-gray-300 border"
            disabled
            onClick={() => (window.location.href = "/home")}
          >
            <span className=" text-base font-semibold">구글 로그인</span>
          </button> */}
        </div>
        <div
          className="flex justify-center mt-10 flex-col gap-y-3 px-4 w-full"
          style={{ maxWidth: "400px" }}
        >
          <div className="flex justify-center">
            <p className="text-gray-800">이메일 아이디로 로그인</p>
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              name="email"
              value={loginInfo.email}
              onChange={(e) => handleInputs(e)}
              ref={loginEmailRef}
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-400 px-5 font-light"
              placeholder="이메일"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={(e) => handleInputs(e)}
              ref={loginPasswordRef}
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-400 px-5 font-light"
              placeholder="비밀번호"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <button
            className="w-full h-12 bg-orange-500 rounded-md border-gray-300 border"
            onClick={() => handleLogin()}
          >
            <span className=" text-base font-medium text-white">로그인</span>
          </button>
        </div>
        <div className="flex justify-center items-center mt-10 flex-col gap-y-3 px-4 ">
          <p className=" text-base font-light">아직 아이디가 없으신가요?</p>
          <Link to="/register">
            <span className="text-base font-semibold ml-3">무료 회원가입</span>
          </Link>
          <div className="flex justify-center items-center gap-x-5 mt-5">
            <span className="text-base font-semibold">아이디 찾기</span>
            <span className="text-base font-semibold">비밀번호 찾기</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

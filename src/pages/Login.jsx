import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginUSer, setLoginUser] = useState({});

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);
  const { pInfo, editDispatch } = useContext(PlayerEditContext);

  const getPlayerProfile = async (pUid) => {
    console.log(pUid);
    let playerProfile = {};
    const playerRef = collection(db, "player");
    const playerQ = query(playerRef, where("playerUid", "==", pUid));

    try {
      const querySnapshot = await getDocs(playerQ);
      //console.log(querySnapshot);
      querySnapshot.forEach(
        (doc) => (playerProfile = { id: doc.id, ...doc.data() })
      );
      console.log(playerProfile);
    } catch (error) {
      console.log(error);
    }
    return new Promise((resolve, reject) => {
      resolve(playerProfile);
    });
  };

  const getPlayerEmail = async () => {
    let isPlayerEmail;
    let dummy = [];
    const playerRef = collection(db, "player");
    const playerQ = query(
      playerRef,
      where("pEmail", "==", loginEmailRef.current.value)
    );
    try {
      const querySnapshot = await getDocs(playerQ);
      //console.log(querySnapshot);
      querySnapshot.forEach((doc) => dummy.push(doc.id));
      dummy.length > 0 ? (isPlayerEmail = true) : (isPlayerEmail = false);
    } catch (error) {
      console.log(error);
    }
    return new Promise((resolve, reject) => {
      resolve(isPlayerEmail);
    });
  };
  const handleLogin = async () => {
    const lEmail = loginEmailRef.current.value;
    const lPwd = loginPasswordRef.current.value;

    if (!lEmail && !lPwd) {
      window.alert("아이디와 비밀번호를 입력해주세요");
    } else {
      setIsLoading(true);
      await getPlayerEmail().then((result) =>
        result
          ? playerLogin()
          : navigate("/loginerror", { state: "auth/user-not-found" })
      );
    }
  };

  const playerLogin = async () => {
    const auth = getAuth();
    await signInWithEmailAndPassword(
      auth,
      loginEmailRef.current.value,
      loginPasswordRef.current.value
    )
      .then(async (user) => {
        const userInfo = user;
        const profile = await getPlayerProfile(userInfo.user.uid);
        return profile;
        //
      })
      .then((profile) => {
        //console.log(profile);
        //console.log(window.navigator.userAgent);
        dispatch({
          type: "LOGIN",
          payload: { id: profile.id, pUid: profile.playerUid },
        });
        return profile;
      })
      .then((profile) => {
        //console.log(profile);
        editDispatch({
          type: "EDIT",
          payload: {
            pName: profile.pName,
            pEmail: profile.pEmail,
            pTel: profile.pTel || "",
            pPic: profile.pPic || "",
            pNick: profile.pNick || "",
            pGender: profile.gender || "",
            pBirth: profile.pBirth || "",
          },
        });
      })
      .then(() => setIsLoading(false))
      .then(() => navigate("/"))
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);

        navigate("/loginerror", { state: errorCode });

        //handleToast({ type: "error", msg: errorMessage });
      });
  };

  return (
    <div className="flex w-full h-screen justify-center items-start align-top bg-slate-100">
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
          <button
            className="w-full h-12 bg-white rounded-md border-gray-300 border"
            disabled
            onClick={() => (window.location.href = "/home")}
          >
            <span className=" text-base font-semibold">구글 로그인</span>
          </button>
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
              name="refEmail"
              ref={loginEmailRef}
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-400 px-5 font-light"
              placeholder="이메일"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="password"
              name="refPassword"
              ref={loginPasswordRef}
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-400 px-5 font-light"
              placeholder="비밀번호"
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

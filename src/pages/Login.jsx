import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({});
  const [loginUSer, setLoginUser] = useState({});

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

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
      //console.log(playerProfile);
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
    await getPlayerEmail().then((result) =>
      result
        ? playerLogin()
        : navigate("/loginerror", { state: "auth/user-not-found" })
    );
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
        console.log(window.navigator.userAgent);
        dispatch({ type: "LOGIN", payload: profile });
      })
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
          style={{ maxWidth: "400px" }}
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

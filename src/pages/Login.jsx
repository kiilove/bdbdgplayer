import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div
      className="flex w-full h-screen justify-center items-start align-top bg-slate-100"
      style={{ maxWidth: "420px" }}
    >
      <div className="flex flex-col">
        <div className="flex justify-center mt-12 flex-col gap-y-1">
          <p className="text-3xl font-bold flex justify-center items-center h-full">
            대한민국 No.1 피트니스 플랫폼
          </p>
          <p className="text-2xl font-bold flex justify-center align-middle items-center">
            <span className="text-3xl text-orange-500 font-extrabold align-middle">
              BDBDg
            </span>
            에 오신것을 환영합니다.
          </p>
        </div>
        <div className="flex justify-center mt-10 flex-col gap-y-3 px-4">
          <button
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
          </button>
          <button
            className="w-full h-12 bg-white rounded-md border-gray-300 border"
            onClick={() => (window.location.href = "/home")}
          >
            <span className=" text-base font-semibold">구글 로그인</span>
          </button>
          <button
            className="w-full h-12 bg-blue-500 rounded-md border-gray-300 border"
            onClick={() => (window.location.href = "/home")}
          >
            <span className=" text-base font-medium text-white">
              페이스북으로 로그인
            </span>
          </button>
        </div>
        <div className="flex justify-center mt-10 flex-col gap-y-3 px-4">
          <div className="flex justify-center">
            <p className="text-gray-800">이메일 아이디로 로그인</p>
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-400 px-5 font-light"
              placeholder="이메일"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="password"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-400 px-5 font-light"
              placeholder="비밀번호"
            />
          </div>
          <button
            className="w-full h-12 bg-orange-500 rounded-md border-gray-300 border"
            onClick={() => (window.location.href = "/home")}
          >
            <span className=" text-base font-medium text-white">로그인</span>
          </button>
        </div>
        <div className="flex justify-center items-center mt-10 flex-col gap-y-3 px-4">
          <p className=" text-base font-light">
            아직 아이디가 없으신가요?
            <Link to="/register">
              <span className="text-base font-semibold ml-3">
                무료 회원가입
              </span>
            </Link>
          </p>
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

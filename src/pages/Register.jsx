import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="flex w-full h-screen justify-center items-start align-top bg-slate-100">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full justify-center mt-12 flex-col gap-y-1">
          <p className="text-sm font-light flex justify-center items-center h-full">
            따로 시간내서 챙길 필요없어요.
          </p>
          <p className="text-sm font-light flex justify-center items-center h-full">
            저희와 함께 해주세요.
          </p>
          <p className="text-2xl font-bold flex justify-center align-middle items-center">
            <span className="text-3xl text-orange-500 font-extrabold align-middle">
              BDBDg
            </span>
          </p>
        </div>
        <div className="flex justify-center mt-12 flex-col gap-y-1">
          <p className="text-sm font-light flex justify-center items-center h-full">
            세상 편하게 시작해보세요.
          </p>
          <p className="text-sm font-light flex justify-center items-center h-full">
            10초후엔 운동에만 전념하시면 됩니다.
          </p>
        </div>
        <div
          className="flex justify-center mt-10 flex-col gap-y-3 px-4 w-full"
          style={{ maxWidth: "400px" }}
        >
          {/* <button
            className="w-full h-12 bg-yellow-400 rounded-md border-gray-300 border "
            onClick={() => {
              window.location.href = "/registeremail";
            }}
          >
            <span className=" text-base font-semibold">카카오로 시작하기</span>
          </button>
          <button
            className="w-full h-12 bg-white rounded-md border-gray-300 border "
            onClick={() => {
              window.location.href = "/registeremail";
            }}
          >
            <span className=" text-base font-semibold">네이버로 시작하기</span>
          </button> */}
          <button
            className="w-full h-12 bg-white rounded-md border-gray-300 border "
            onClick={() => {
              window.location.href = "/registeremail";
            }}
          >
            <span className=" text-base font-semibold">구글 시작하기</span>
          </button>
          <button
            className="w-full h-12 bg-orange-500 rounded-md border-gray-300 border"
            onClick={() => {
              window.location.href = "/registeremail";
            }}
          >
            <span className=" text-base font-semibold text-white">
              이메일 아이디로 시작하기
            </span>
          </button>
        </div>

        <div className="flex justify-center items-center mt-10 flex-col gap-y-3 px-4">
          <p className=" text-base font-light">
            아이디가 있다면?
            <Link to="/login">
              <span className="text-base font-semibold ml-3">로그인하기</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

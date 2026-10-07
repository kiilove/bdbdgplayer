import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#0B0B0B] text-white p-4 font-sans antialiased">
      <div className="flex w-full flex-col items-center max-w-sm">
        <div className="flex w-full justify-center flex-col items-center gap-y-2 mb-8 text-center">
          <Link to="/" className="inline-block mb-3">
            <span className="text-3xl font-black text-white tracking-tighter uppercase">
              BDBDG
            </span>
          </Link>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 tracking-wider uppercase">
            Athlete Membership
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-2">
            회원가입
          </h1>
          <p className="text-xs text-neutral-400 font-medium">
            10초 만에 가입하고 운동과 대회에만 전념하세요.
          </p>
        </div>

        <div className="w-full bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-y-4">
          <button
            className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-black text-sm rounded-full shadow-xl transition cursor-pointer text-center tracking-tight"
            onClick={() => {
              window.location.href = "/registeremail";
            }}
          >
            이메일 아이디로 시작하기
          </button>
        </div>

        <div className="flex justify-center items-center mt-8 text-center">
          <p className="text-xs text-neutral-400 font-medium">
            이미 계정이 있으신가요?
            <Link to="/login">
              <span className="text-white font-bold ml-2 underline underline-offset-4 hover:text-neutral-300">
                로그인하기
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

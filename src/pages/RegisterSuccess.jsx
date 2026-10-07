import React from "react";
import { useNavigate } from "react-router-dom";
import { RiCheckLine, RiUserSmileLine } from "react-icons/ri";

const RegisterSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-[#0B0B0B] text-white flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-[#141414] border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-4xl mb-6 shadow-xl">
          <RiCheckLine />
        </div>

        {/* Brand / Title */}
        <span className="text-xs uppercase font-black tracking-widest text-neutral-400 mb-2">
          Registration Complete
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
          BDBDg 가입을 축하합니다
        </h1>

        {/* Information Box */}
        <div className="w-full bg-[#1A1A1A] border border-neutral-800/80 rounded-2xl p-5 my-6 text-left space-y-3">
          <div className="flex items-start gap-x-3">
            <RiUserSmileLine className="text-white text-lg mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
              대회 참가신청을 위해선 프로필에 <strong className="text-white font-bold">선수 상세 정보</strong>가 필요합니다.
            </p>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed pl-7">
            방금 가입하신 계정으로 로그인 후 마이프로필을 설정하시면 간편하게 모든 대회를 신청하실 수 있습니다.
          </p>
        </div>

        {/* CTA Button */}
        <button
          className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-black text-sm uppercase tracking-tight rounded-full transition active:scale-[0.98] shadow-lg cursor-pointer"
          onClick={() => navigate("/login")}
        >
          로그인하러 가기
        </button>
      </div>
    </div>
  );
};

export default RegisterSuccess;

import React from "react";
import { useNavigate } from "react-router-dom";
import { RiCheckboxCircleFill, RiHome4Line, RiFileList3Line } from "react-icons/ri";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-[#141414] rounded-3xl p-8 sm:p-10 shadow-2xl border border-neutral-800 text-center flex flex-col items-center gap-y-6">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-4xl shadow-xl">
          <RiCheckboxCircleFill />
        </div>

        {/* Header Titles */}
        <div className="flex flex-col gap-y-2">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 self-center uppercase tracking-wider">
            대회 참가신청 완료
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
            정상적으로 접수가<br />완료되었습니다!
          </h1>
        </div>

        {/* Notice Info Box */}
        <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-left text-xs text-neutral-300 font-medium leading-relaxed flex flex-col gap-y-1.5">
          <span className="font-black text-white flex items-center gap-x-1.5">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            감사의 말씀 및 안내
          </span>
          <p className="text-neutral-400 pl-3">
            대회에 참여해 주셔서 대단히 감사드립니다. 지정된 계좌로 입금을 진행해 주시면 최종 승인 처리가 완료됩니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-y-3 pt-2">
          <button
            className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-black text-sm rounded-full shadow-xl transition flex items-center justify-center gap-x-2 cursor-pointer tracking-tight"
            onClick={() => navigate("/")}
          >
            <RiHome4Line className="text-lg" />
            홈으로 돌아가기
          </button>
          
          <button
            className="w-full py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-full border border-neutral-700 transition flex items-center justify-center gap-x-2 cursor-pointer"
            onClick={() => navigate("/myprofile")}
          >
            <RiFileList3Line className="text-base" />
            내 참가신청 내역 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

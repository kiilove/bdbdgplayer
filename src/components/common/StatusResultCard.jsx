import React from "react";
import { useNavigate } from "react-router-dom";
import {
  RiCheckboxCircleFill,
  RiHome4Line,
  RiFileList3Line,
} from "react-icons/ri";

const StatusResultCard = ({
  badgeText,
  title,
  noticeTitle,
  noticeBody,
  primaryButtonText = "홈으로 돌아가기",
  primaryButtonTo = "/",
  secondaryButtonText = "내 참가신청 내역 확인",
  secondaryButtonTo = "/myprofile",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F5FA] text-[#0F172A] flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(15,23,42,0.05)] border border-slate-200/90 text-center flex flex-col items-center gap-y-6">
        <div className="w-18 h-18 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center text-4xl shadow-sm">
          <RiCheckboxCircleFill />
        </div>

        <div className="flex flex-col gap-y-2">
          <span className="text-xs font-bold px-3 py-1 rounded-[5px] bg-indigo-50 text-[#4F46E5] border border-indigo-200/80 self-center">
            {badgeText}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight tracking-tight whitespace-pre-line mt-1">
            {title}
          </h1>
        </div>

        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5 text-left text-sm text-slate-700 font-medium leading-relaxed flex flex-col gap-y-1.5">
          <span className="font-bold text-[#0F172A] flex items-center gap-x-2">
            <span className="w-1.5 h-3.5 rounded-[2px] bg-[#4F46E5]" />
            {noticeTitle}
          </span>
          <p className="text-slate-600 pl-3.5 text-xs sm:text-sm">{noticeBody}</p>
        </div>

        <div className="w-full flex flex-col gap-y-2.5 pt-1">
          <button
            type="button"
            className="w-full py-4 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-[15px] rounded-xl shadow-[0_6px_18px_rgba(79,70,229,0.28)] transition flex items-center justify-center gap-x-2 cursor-pointer"
            onClick={() => navigate(primaryButtonTo)}
          >
            <RiHome4Line className="text-lg" />
            {primaryButtonText}
          </button>

          {secondaryButtonText && (
            <button
              type="button"
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition flex items-center justify-center gap-x-2 cursor-pointer"
              onClick={() => navigate(secondaryButtonTo)}
            >
              <RiFileList3Line className="text-base" />
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusResultCard;

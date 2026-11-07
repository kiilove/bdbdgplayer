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
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-neutral-200/90 text-center flex flex-col items-center gap-y-6">
        <div className="w-18 h-18 p-4 rounded-full bg-[#111111] text-white flex items-center justify-center text-4xl shadow-sm">
          <RiCheckboxCircleFill />
        </div>

        <div className="flex flex-col gap-y-2">
          <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-[#F5F5F7] text-neutral-700 border border-neutral-200 self-center">
            {badgeText}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] leading-tight tracking-tight whitespace-pre-line mt-1">
            {title}
          </h1>
        </div>

        <div className="w-full bg-[#F5F5F7] rounded-2xl p-4 sm:p-5 text-left text-sm text-neutral-700 font-medium leading-relaxed flex flex-col gap-y-1.5">
          <span className="font-bold text-[#111111] flex items-center gap-x-2">
            <span className="w-2 h-2 rounded-full bg-[#111111]" />
            {noticeTitle}
          </span>
          <p className="text-neutral-600 pl-4 text-xs sm:text-sm">{noticeBody}</p>
        </div>

        <div className="w-full flex flex-col gap-y-2.5 pt-1">
          <button
            type="button"
            className="w-full py-4 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-[15px] rounded-full shadow-sm transition flex items-center justify-center gap-x-2 cursor-pointer"
            onClick={() => navigate(primaryButtonTo)}
          >
            <RiHome4Line className="text-lg" />
            {primaryButtonText}
          </button>

          {secondaryButtonText && (
            <button
              type="button"
              className="w-full py-3.5 bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#111111] font-bold text-sm rounded-full border border-neutral-200 transition flex items-center justify-center gap-x-2 cursor-pointer"
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

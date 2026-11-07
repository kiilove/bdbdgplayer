import React from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  MdOutlineCalendarToday,
  MdOutlineLocationOn,
  MdCreditCard,
  MdFileDownload,
  MdArrowForward,
  MdCheckCircle,
} from "react-icons/md";

import { DEFAULT_POSTER } from "../../consts";

const ContestCard = ({
  contest,
  userInvoiceId,
  isLoggedIn,
  onRequireLogin,
  variant = "horizontal",
  posterBadgeText,
}) => {
  const navigate = useNavigate();
  const posterUrl = contest.contestPoster || DEFAULT_POSTER;
  const contestId = contest.id;
  const associateLabel =
    contest.contestAssociate || contest.contestPromoter || "주관 협회";

  const handleJoinClick = () => {
    if (userInvoiceId) {
      navigate(`/contestjoinedit/${userInvoiceId}`);
    } else if (isLoggedIn) {
      navigate(`/contestjoin/${contestId}`);
    } else if (onRequireLogin) {
      onRequireLogin();
    }
  };

  if (variant === "grid") {
    return (
      <div className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between group">
        {/* Poster Section */}
        <div className="w-full bg-[#F5F5F7] overflow-hidden relative border-b border-neutral-100 flex items-center justify-center">
          <img
            src={posterUrl}
            alt={contest.contestTitle}
            className="w-full h-auto block object-contain group-hover:scale-[1.01] transition duration-500"
          />
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
            <span className="bg-[#111111]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {posterBadgeText || contest.contestStatus || "접수중"}
            </span>
            {userInvoiceId && (
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                <MdCheckCircle className="text-sm" />
                <span>신청완료</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col gap-y-5 flex-grow justify-between">
          <div className="flex flex-col gap-y-2.5">
            <span className="text-xs font-bold text-neutral-600 bg-[#F5F5F7] px-3 py-1 rounded-full inline-block w-fit">
              {associateLabel}
            </span>
            <h3 className="text-xl font-bold text-[#111111] tracking-tight leading-snug line-clamp-2 break-keep">
              {contest.contestTitle}
            </h3>

            <div className="bg-[#F5F5F7] rounded-2xl p-4 flex flex-col gap-y-2.5 mt-1 text-sm text-[#111111]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-neutral-500 font-medium flex items-center gap-1.5 shrink-0">
                  <MdOutlineCalendarToday className="text-neutral-700 text-base" />
                  대회 일자
                </span>
                <span className="font-semibold text-[#111111] text-right">
                  {dayjs(contest.contestDate).format("YYYY년 MM월 DD일")}
                </span>
              </div>

              {contest.contestLocation && (
                <div className="flex items-start justify-between gap-3 pt-2 border-t border-neutral-200/70">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5 shrink-0">
                    <MdOutlineLocationOn className="text-neutral-700 text-base" />
                    개최 장소
                  </span>
                  <span className="font-semibold text-[#111111] text-right break-keep">
                    {contest.contestLocation}
                  </span>
                </div>
              )}

              {contest.contestAccountOwner && contest.contestAccountNumber && (
                <div className="flex items-start justify-between gap-3 pt-2 border-t border-neutral-200/70">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5 shrink-0">
                    <MdCreditCard className="text-neutral-700 text-base" />
                    입금 계좌
                  </span>
                  <span className="font-semibold text-[#111111] text-right break-keep">
                    {contest.contestBankName || ""}{" "}
                    {contest.contestAccountNumber} ({contest.contestAccountOwner}
                    )
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={handleJoinClick}
              className={`flex-1 w-full font-bold text-sm py-3.5 px-5 rounded-full transition cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-[0.99] ${
                userInvoiceId
                  ? "bg-neutral-900 hover:bg-neutral-800 text-white"
                  : "bg-[#111111] hover:bg-neutral-800 text-white shadow-sm"
              }`}
            >
              <span>
                {userInvoiceId ? "신청정보 확인 및 변경" : "참가신청 하기"}
              </span>
              <MdArrowForward className="text-base" />
            </button>

            {contest.contestCollectionFileLink && (
              <a
                href={contest.contestCollectionFileLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#111111] font-semibold text-sm py-3.5 px-4 rounded-full border border-neutral-200/80 transition cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <MdFileDownload className="text-base text-[#111111]" />
                <span>요강 다운로드</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: Horizontal 12-col layout (Home & Gbbf)
  return (
    <div className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-all duration-200 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center group">
      {/* Poster Left */}
      <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[3/4] max-h-[480px] bg-[#F5F5F7] border border-neutral-200/70 flex items-center justify-center">
        <img
          src={posterUrl}
          alt={contest.contestTitle}
          className="relative z-10 w-full h-full object-contain group-hover:scale-[1.01] transition duration-500"
        />
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-20">
          <span className="bg-[#111111]/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
            {posterBadgeText || contest.contestStatus || "접수중"}
          </span>
          {userInvoiceId && (
            <span className="bg-emerald-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
              <MdCheckCircle className="text-sm" />
              <span>신청완료</span>
            </span>
          )}
        </div>
      </div>

      {/* Details Right */}
      <div className="lg:col-span-7 flex flex-col gap-y-6">
        <div>
          <span className="text-xs font-bold text-neutral-600 bg-[#F5F5F7] px-3.5 py-1.5 rounded-full inline-block">
            {associateLabel}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mt-3 leading-snug break-keep">
            {contest.contestTitle}
          </h2>
        </div>

        <div className="bg-[#F5F5F7] rounded-2xl p-5 flex flex-col gap-y-3.5 text-sm sm:text-[15px]">
          <div className="flex justify-between items-center border-b border-neutral-200/80 pb-3 gap-4">
            <span className="text-neutral-500 font-medium flex items-center gap-2 shrink-0">
              <MdOutlineCalendarToday className="text-neutral-700 text-lg" />
              대회 일자
            </span>
            <span className="font-bold text-[#111111] text-right">
              {dayjs(contest.contestDate).format("YYYY년 MM월 DD일")}
            </span>
          </div>

          {contest.contestLocation && (
            <div className="flex justify-between items-start border-b border-neutral-200/80 pb-3 gap-4">
              <span className="text-neutral-500 font-medium flex items-center gap-2 shrink-0">
                <MdOutlineLocationOn className="text-neutral-700 text-lg" />
                개최 장소
              </span>
              <span className="font-bold text-[#111111] break-keep text-right">
                {contest.contestLocation}
              </span>
            </div>
          )}

          {contest.contestAccountOwner && contest.contestAccountNumber && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-neutral-500 font-medium flex items-center gap-2 shrink-0">
                <MdCreditCard className="text-neutral-700 text-lg" />
                참가비 계좌
              </span>
              <span className="font-bold text-[#111111] text-right break-keep">
                {contest.contestBankName || ""} {contest.contestAccountNumber} (
                {contest.contestAccountOwner})
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleJoinClick}
            className="flex-1 py-4 px-6 font-bold text-[15px] rounded-full transition cursor-pointer text-center flex items-center justify-center gap-2 active:scale-[0.99] bg-[#111111] hover:bg-neutral-800 text-white shadow-sm"
          >
            <span>
              {userInvoiceId ? "신청정보 확인 및 변경" : "참가신청 하기"}
            </span>
            <MdArrowForward className="text-lg" />
          </button>

          {contest.contestCollectionFileLink && (
            <a
              href={contest.contestCollectionFileLink}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 bg-[#F5F5F7] hover:bg-neutral-200/80 border border-neutral-200/90 text-[#111111] font-semibold text-sm sm:text-[15px] rounded-full transition text-center whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <MdFileDownload className="text-lg text-[#111111]" />
              <span>공식 요강 다운로드</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestCard;

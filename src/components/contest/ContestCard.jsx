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
  const statusLabel = posterBadgeText || contest.contestStatus || "접수중";

  const handleJoinClick = () => {
    if (userInvoiceId) {
      navigate(`/contestjoinedit/${userInvoiceId}`);
    } else if (isLoggedIn) {
      navigate(`/contestjoin/${contestId}`);
    } else if (onRequireLogin) {
      onRequireLogin(`/contestjoin/${contestId}`);
    }
  };

  if (variant === "grid") {
    return (
      <div className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-3xl p-5 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-all duration-200 flex flex-col justify-between gap-y-5 group">
        <div className="flex flex-col gap-y-5">
          {/* Clean Edge-to-Edge Poster (No Letterbox Bars, No Overlapping Badges) */}
          <div
            onClick={handleJoinClick}
            className="w-full rounded-2xl overflow-hidden border border-neutral-200/70 bg-neutral-100 cursor-pointer"
          >
            <img
              src={posterUrl}
              alt={contest.contestTitle}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block group-hover:scale-[1.01] transition duration-500"
            />
          </div>

          {/* Content Header & Meta */}
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 bg-[#111111] text-white text-xs font-bold px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {statusLabel}
                </span>
                <span className="text-xs font-bold text-neutral-600 bg-[#F5F5F7] border border-neutral-200/80 px-3 py-1 rounded-full">
                  {associateLabel}
                </span>
              </div>

              {userInvoiceId && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                  <MdCheckCircle className="text-sm text-emerald-600" />
                  <span>신청완료</span>
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-[#111111] tracking-tight leading-snug break-keep">
              {contest.contestTitle}
            </h3>

            <div className="bg-[#F5F5F7] rounded-2xl p-4 flex flex-col gap-y-2.5 text-sm text-[#111111]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-neutral-500 font-medium flex items-center gap-1.5 shrink-0">
                  <MdOutlineCalendarToday className="text-neutral-700 text-base" />
                  대회 일자
                </span>
                <span className="font-bold text-[#111111] text-right">
                  {dayjs(contest.contestDate).format("YYYY년 MM월 DD일")}
                </span>
              </div>

              {contest.contestLocation && (
                <div className="flex items-start justify-between gap-3 pt-2.5 border-t border-neutral-200/70">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5 shrink-0">
                    <MdOutlineLocationOn className="text-neutral-700 text-base" />
                    개최 장소
                  </span>
                  <span className="font-bold text-[#111111] text-right break-keep">
                    {contest.contestLocation}
                  </span>
                </div>
              )}

              {contest.contestAccountOwner && contest.contestAccountNumber && (
                <div className="flex items-start justify-between gap-3 pt-2.5 border-t border-neutral-200/70">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5 shrink-0">
                    <MdCreditCard className="text-neutral-700 text-base" />
                    입금 계좌
                  </span>
                  <span className="font-bold text-[#111111] text-right break-keep">
                    {contest.contestBankName || ""}{" "}
                    {contest.contestAccountNumber} ({contest.contestAccountOwner}
                    )
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleJoinClick}
            className="flex-1 w-full font-bold text-sm py-3.5 px-5 rounded-full transition cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-[0.99] bg-[#111111] hover:bg-neutral-800 text-white shadow-sm"
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
    );
  }

  // Default: Horizontal 12-col layout (Home & Gbbf)
  return (
    <div className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-all duration-200 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center group">
      {/* Poster Left: Natural aspect ratio without side letterbox bars or overlapping pills */}
      <div className="lg:col-span-5">
        <div
          onClick={handleJoinClick}
          className="w-full rounded-2xl overflow-hidden border border-neutral-200/70 bg-neutral-100 shadow-sm cursor-pointer"
        >
          <img
            src={posterUrl}
            alt={contest.contestTitle}
            className="w-full h-auto block group-hover:scale-[1.01] transition duration-500"
          />
        </div>
      </div>

      {/* Details Right */}
      <div className="lg:col-span-7 flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-3">
          {/* Unified Status & Association Badge Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 bg-[#111111] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {statusLabel}
              </span>
              <span className="text-xs font-bold text-neutral-600 bg-[#F5F5F7] border border-neutral-200/80 px-3.5 py-1.5 rounded-full">
                {associateLabel}
              </span>
            </div>

            {userInvoiceId && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full">
                <MdCheckCircle className="text-sm text-emerald-600" />
                <span>신청완료</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight leading-snug break-keep">
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

export default React.memo(ContestCard);

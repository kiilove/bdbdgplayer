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
import { getContestDDayBadge } from "../../utils/formatUtils";

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
  const dDayBadge = getContestDDayBadge(contest.contestDate);

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
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 sm:p-6 shadow-[0_6px_24px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_38px_rgba(99,102,241,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-y-5 group">
        <div className="flex flex-col gap-y-5">
          {/* Clean Edge-to-Edge Poster */}
          <div
            onClick={handleJoinClick}
            className="w-full rounded-xl overflow-hidden ring-1 ring-slate-200/70 bg-slate-50 cursor-pointer"
          >
            <img
              src={posterUrl}
              alt={contest.contestTitle}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block group-hover:scale-[1.015] transition duration-500"
            />
          </div>

          {/* Content Header & Bento Meta */}
          <div className="flex flex-col gap-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 bg-[#FF2E54] text-white font-extrabold px-2 py-0.5 rounded-[5px] tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {statusLabel}
                </span>

                {dDayBadge && (
                  <span
                    className={`inline-flex items-center font-black px-2 py-0.5 rounded-[5px] border tabular-nums ${
                      dDayBadge.isUrgent
                        ? "bg-rose-50 text-[#FF2E54] border-rose-200"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200/80"
                    }`}
                  >
                    {dDayBadge.label}
                  </span>
                )}

                <span className="w-px h-3 bg-slate-300 mx-0.5" />

                <span className="font-bold text-slate-500 tracking-tight">
                  {associateLabel}
                </span>
              </div>

              {userInvoiceId && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-[5px]">
                  <MdCheckCircle className="text-sm text-emerald-600" />
                  <span>신청완료</span>
                </span>
              )}
            </div>

            <h3
              onClick={handleJoinClick}
              className="text-xl font-extrabold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors tracking-tight leading-snug break-keep cursor-pointer"
            >
              {contest.contestTitle}
            </h3>

            {/* Modular Bento Metadata Cells */}
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <span className="text-slate-500 text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <MdOutlineCalendarToday className="text-sm" />
                  </span>
                  대회 일자
                </span>
                <span className="font-bold text-sm text-[#0F172A] text-right tabular-nums">
                  {dayjs(contest.contestDate).format("YYYY. MM. DD")}
                </span>
              </div>

              {contest.contestLocation && (
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500 text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0">
                    <span className="w-7 h-7 rounded-lg bg-rose-50 text-[#FF2E54] flex items-center justify-center">
                      <MdOutlineLocationOn className="text-sm" />
                    </span>
                    개최 장소
                  </span>
                  <span className="font-bold text-sm text-[#0F172A] text-right break-keep">
                    {contest.contestLocation}
                  </span>
                </div>
              )}

              {contest.contestAccountOwner && contest.contestAccountNumber && (
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <span className="text-slate-500 text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <MdCreditCard className="text-sm" />
                    </span>
                    입금 계좌
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-[#0F172A] text-right break-keep tabular-nums">
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
            className="flex-1 w-full font-bold text-sm py-3.5 px-5 rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-[0.99] bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:via-[#4F46E5] hover:to-[#6D28D9] text-white shadow-[0_6px_18px_rgba(99,102,241,0.28)]"
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
              className="w-full sm:w-auto bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 font-semibold text-sm py-3.5 px-4 rounded-xl border border-slate-200/80 transition cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              <MdFileDownload className="text-base text-slate-700" />
              <span>요강 다운로드</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal 12-col layout (Home & Gbbf)
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 sm:p-7 md:p-8 shadow-[0_6px_24px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_38px_rgba(99,102,241,0.12)] hover:-translate-y-0.5 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center group">
      {/* Poster Left */}
      <div className="lg:col-span-5">
        <div
          onClick={handleJoinClick}
          className="w-full rounded-xl overflow-hidden ring-1 ring-slate-200/70 bg-slate-50 shadow-sm cursor-pointer"
        >
          <img
            src={posterUrl}
            alt={contest.contestTitle}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block group-hover:scale-[1.015] transition duration-500"
          />
        </div>
      </div>

      {/* Details Right */}
      <div className="lg:col-span-7 flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-3">
          {/* Editorial Eyebrow Row (No Pill Clutter) */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-[#FF2E54] text-white font-extrabold px-2.5 py-1 rounded-[5px] tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {statusLabel}
              </span>

              {dDayBadge && (
                <span
                  className={`inline-flex items-center font-black px-2.5 py-1 rounded-[5px] border tabular-nums ${
                    dDayBadge.isUrgent
                      ? "bg-rose-50 text-[#FF2E54] border-rose-200"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200/80"
                  }`}
                >
                  {dDayBadge.label}
                </span>
              )}

              <span className="w-px h-3.5 bg-slate-300 mx-0.5" />

              <span className="text-xs sm:text-[13px] font-bold text-slate-500 tracking-tight">
                {associateLabel}
              </span>
            </div>

            {userInvoiceId && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-[5px]">
                <MdCheckCircle className="text-sm text-emerald-600" />
                <span>신청완료</span>
              </span>
            )}
          </div>

          <h2
            onClick={handleJoinClick}
            className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors tracking-tight leading-snug break-keep cursor-pointer"
          >
            {contest.contestTitle}
          </h2>
        </div>

        {/* Modular Bento Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <MdOutlineCalendarToday className="text-base" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                대회 일자 · SCHEDULE
              </span>
              <span className="text-sm sm:text-[15px] font-extrabold text-[#0F172A] mt-0.5 tabular-nums">
                {dayjs(contest.contestDate).format("YYYY년 MM월 DD일")}
              </span>
            </div>
          </div>

          {contest.contestLocation && (
            <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-4 flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#FF2E54] flex items-center justify-center shrink-0">
                <MdOutlineLocationOn className="text-base" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  개최 장소 · VENUE
                </span>
                <span className="text-sm sm:text-[15px] font-extrabold text-[#0F172A] mt-0.5 break-keep">
                  {contest.contestLocation}
                </span>
              </div>
            </div>
          )}

          {contest.contestAccountOwner && contest.contestAccountNumber && (
            <div className="sm:col-span-2 bg-[#F8FAFC] border border-slate-100 rounded-xl p-4 flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MdCreditCard className="text-base" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  참가비 입금 계좌 · ACCOUNT
                </span>
                <span className="text-sm sm:text-[15px] font-extrabold text-[#0F172A] mt-0.5 break-keep tabular-nums">
                  {contest.contestBankName || ""}{" "}
                  {contest.contestAccountNumber} (예금주:{" "}
                  {contest.contestAccountOwner})
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleJoinClick}
            className="flex-1 py-4 px-6 font-bold text-[15px] rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-2 active:scale-[0.99] bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:via-[#4F46E5] hover:to-[#6D28D9] text-white shadow-[0_6px_20px_rgba(99,102,241,0.30)]"
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
              className="py-4 px-6 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-slate-700 font-semibold text-sm sm:text-[15px] rounded-xl transition text-center whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <MdFileDownload className="text-lg text-slate-700" />
              <span>공식 요강 다운로드</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ContestCard);

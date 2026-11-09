import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  MdOutlineCalendarToday,
  MdOutlineLocationOn,
  MdCreditCard,
  MdFileDownload,
  MdArrowForward,
  MdCheckCircle,
  MdContentCopy,
  MdCheck,
} from "react-icons/md";
import { DEFAULT_POSTER } from "../../consts";
import { handleToast } from "../HandleToast";
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
  const [copiedAccount, setCopiedAccount] = useState(false);

  const posterUrl = contest.contestPoster || DEFAULT_POSTER;
  const contestId = contest.id;
  const associateLabel =
    contest.contestAssociate || contest.contestPromoter || "주관 협회";
  const statusLabel = posterBadgeText || contest.contestStatus || "접수중";
  const dDayBadge = getContestDDayBadge(contest.contestDate);

  const parsedDate = contest.contestDate ? dayjs(contest.contestDate) : null;
  const monthLabel =
    parsedDate && parsedDate.isValid() ? parsedDate.format("MMM").toUpperCase() : "";
  const dayLabel =
    parsedDate && parsedDate.isValid() ? parsedDate.format("DD") : "";

  const handleJoinClick = () => {
    if (userInvoiceId) {
      navigate(`/contestjoinedit/${userInvoiceId}`);
    } else if (isLoggedIn) {
      navigate(`/contestjoin/${contestId}`);
    } else if (onRequireLogin) {
      onRequireLogin(`/contestjoin/${contestId}`);
    }
  };

  const handleCopyAccount = (e) => {
    e.stopPropagation();
    const accountText = `${contest.contestBankName || ""} ${
      contest.contestAccountNumber || ""
    }`.trim();
    if (!accountText || !navigator?.clipboard) return;

    navigator.clipboard.writeText(accountText).then(() => {
      setCopiedAccount(true);
      handleToast("success", "입금 계좌번호가 클립보드에 복사되었습니다.");
      setTimeout(() => setCopiedAccount(false), 2000);
    });
  };

  if (variant === "grid") {
    return (
      <div className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-2xl p-5 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col justify-between gap-y-5 group">
        <div className="flex flex-col gap-y-5">
          {/* Luma-Style Ambient Poster Frame + SNKRS Date Stamp */}
          <div
            onClick={handleJoinClick}
            className="relative w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/60 cursor-pointer p-3 sm:p-4 flex items-center justify-center"
          >
            <img
              src={posterUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-45 scale-125 pointer-events-none select-none"
            />
            <div className="relative z-10 w-full rounded-lg overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
              <img
                src={posterUrl}
                alt={contest.contestTitle}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block group-hover:scale-[1.015] transition duration-500"
              />
            </div>

            {monthLabel && dayLabel && (
              <div className="absolute top-5 left-5 z-20 bg-[#111111]/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg border border-white/15 flex flex-col items-center leading-none shadow-lg">
                <span className="text-[9px] font-extrabold tracking-[0.12em] text-neutral-300">
                  {monthLabel}
                </span>
                <span className="text-base font-black tracking-tight tabular-nums mt-0.5">
                  {dayLabel}
                </span>
              </div>
            )}
          </div>

          {/* Content Header & Metadata */}
          <div className="flex flex-col gap-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 bg-[#111111] text-white font-bold px-2 py-0.5 rounded-[4px] tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
                  {statusLabel}
                </span>

                {dDayBadge && (
                  <span
                    className={`inline-flex items-center font-extrabold px-2 py-0.5 rounded-[4px] border tabular-nums ${
                      dDayBadge.isUrgent
                        ? "bg-[#FFF5F5] text-[#FF3B30] border-[#FF3B30]/25"
                        : "bg-neutral-100 text-neutral-700 border-neutral-200"
                    }`}
                  >
                    {dDayBadge.label}
                  </span>
                )}

                <span className="w-px h-3 bg-neutral-300 mx-0.5" />

                <span className="font-semibold text-neutral-500 tracking-tight">
                  {associateLabel}
                </span>
              </div>

              {userInvoiceId && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-[4px]">
                  <MdCheckCircle className="text-sm text-emerald-600" />
                  <span>신청완료</span>
                </span>
              )}
            </div>

            <h3
              onClick={handleJoinClick}
              className="text-xl font-black text-[#111111] group-hover:text-neutral-600 transition-colors tracking-[-0.02em] leading-snug break-keep cursor-pointer"
            >
              {contest.contestTitle}
            </h3>

            {/* Editorial Metadata Rows + One-Click Copy */}
            <div className="divide-y divide-neutral-100 border-t border-b border-neutral-100 text-sm py-1">
              <div className="py-2.5 flex items-center justify-between gap-3">
                <span className="text-neutral-400 text-xs font-semibold flex items-center gap-2 shrink-0">
                  <MdOutlineCalendarToday className="text-sm text-neutral-400" />
                  대회 일자
                </span>
                <span className="font-bold text-sm text-[#111111] text-right tabular-nums">
                  {dayjs(contest.contestDate).format("YYYY. MM. DD")}
                </span>
              </div>

              {contest.contestLocation && (
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-neutral-400 text-xs font-semibold flex items-center gap-2 shrink-0">
                    <MdOutlineLocationOn className="text-sm text-neutral-400" />
                    개최 장소
                  </span>
                  <span className="font-bold text-sm text-[#111111] text-right break-keep">
                    {contest.contestLocation}
                  </span>
                </div>
              )}

              {contest.contestAccountOwner && contest.contestAccountNumber && (
                <div className="py-2.5 flex items-center justify-between gap-2">
                  <span className="text-neutral-400 text-xs font-semibold flex items-center gap-2 shrink-0">
                    <MdCreditCard className="text-sm text-neutral-400" />
                    입금 계좌
                  </span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-[#111111] text-right truncate tabular-nums">
                      {contest.contestBankName || ""}{" "}
                      {contest.contestAccountNumber} (
                      {contest.contestAccountOwner})
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="px-2 py-1 rounded-[5px] bg-neutral-100 hover:bg-neutral-200 text-[#111111] text-[11px] font-bold flex items-center gap-1 shrink-0 transition cursor-pointer"
                    >
                      {copiedAccount ? (
                        <>
                          <MdCheck className="text-emerald-600 text-xs" />
                          <span className="text-emerald-700">복사됨</span>
                        </>
                      ) : (
                        <>
                          <MdContentCopy className="text-neutral-500 text-xs" />
                          <span>복사</span>
                        </>
                      )}
                    </button>
                  </div>
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
            className="flex-1 w-full font-bold text-sm py-3.5 px-5 rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-[0.99] bg-[#111111] hover:bg-neutral-800 text-white"
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
              className="w-full sm:w-auto bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 font-semibold text-sm py-3.5 px-4 rounded-xl transition cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              <MdFileDownload className="text-base text-neutral-700" />
              <span>요강 다운로드</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal 12-col layout (Home & Gbbf)
  return (
    <div className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-2xl p-5 sm:p-7 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.07)] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center group">
      {/* Poster Left: Luma Ambient Backdrop + SNKRS Date Stamp */}
      <div className="lg:col-span-5">
        <div
          onClick={handleJoinClick}
          className="relative w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/60 cursor-pointer p-3.5 sm:p-4 flex items-center justify-center"
        >
          <img
            src={posterUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-45 scale-125 pointer-events-none select-none"
          />
          <div className="relative z-10 w-full rounded-lg overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.38)]">
            <img
              src={posterUrl}
              alt={contest.contestTitle}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block group-hover:scale-[1.015] transition duration-500"
            />
          </div>

          {monthLabel && dayLabel && (
            <div className="absolute top-5 left-5 z-20 bg-[#111111]/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg border border-white/15 flex flex-col items-center leading-none shadow-lg">
              <span className="text-[9px] font-extrabold tracking-[0.12em] text-neutral-300">
                {monthLabel}
              </span>
              <span className="text-base font-black tracking-tight tabular-nums mt-0.5">
                {dayLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Details Right */}
      <div className="lg:col-span-7 flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-3">
          {/* Editorial Eyebrow Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-[#111111] text-white font-bold px-2.5 py-1 rounded-[4px] tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
                {statusLabel}
              </span>

              {dDayBadge && (
                <span
                  className={`inline-flex items-center font-extrabold px-2.5 py-1 rounded-[4px] border tabular-nums ${
                    dDayBadge.isUrgent
                      ? "bg-[#FFF5F5] text-[#FF3B30] border-[#FF3B30]/25"
                      : "bg-neutral-100 text-neutral-700 border-neutral-200"
                  }`}
                >
                  {dDayBadge.label}
                </span>
              )}

              <span className="w-px h-3.5 bg-neutral-300 mx-0.5" />

              <span className="text-xs sm:text-[13px] font-semibold text-neutral-500 tracking-tight">
                {associateLabel}
              </span>
            </div>

            {userInvoiceId && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-[4px]">
                <MdCheckCircle className="text-sm text-emerald-600" />
                <span>신청완료</span>
              </span>
            )}
          </div>

          <h2
            onClick={handleJoinClick}
            className="text-2xl sm:text-[28px] font-black text-[#111111] group-hover:text-neutral-600 transition-colors tracking-[-0.025em] leading-[1.28] break-keep cursor-pointer"
          >
            {contest.contestTitle}
          </h2>
        </div>

        {/* Clean Monochrome Architectural Metadata Grid + One-Click Copy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-[#FAFAFA] border border-neutral-200/70 rounded-xl p-4 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <MdOutlineCalendarToday className="text-xs text-neutral-400" />
              대회 일자 · DATE
            </span>
            <span className="text-sm sm:text-[15px] font-extrabold text-[#111111] tabular-nums">
              {dayjs(contest.contestDate).format("YYYY년 MM월 DD일")}
            </span>
          </div>

          {contest.contestLocation && (
            <div className="bg-[#FAFAFA] border border-neutral-200/70 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <MdOutlineLocationOn className="text-xs text-neutral-400" />
                개최 장소 · VENUE
              </span>
              <span className="text-sm sm:text-[15px] font-extrabold text-[#111111] break-keep">
                {contest.contestLocation}
              </span>
            </div>
          )}

          {contest.contestAccountOwner && contest.contestAccountNumber && (
            <div className="sm:col-span-2 bg-[#FAFAFA] border border-neutral-200/70 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MdCreditCard className="text-xs text-neutral-400" />
                  참가비 입금 계좌 · ACCOUNT
                </span>
                <span className="text-sm sm:text-[15px] font-extrabold text-[#111111] break-keep tabular-nums">
                  {contest.contestBankName || ""}{" "}
                  {contest.contestAccountNumber} (예금주:{" "}
                  {contest.contestAccountOwner})
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyAccount}
                className="px-3 py-2 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-[#111111] text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-95"
              >
                {copiedAccount ? (
                  <>
                    <MdCheck className="text-emerald-600 text-sm" />
                    <span className="text-emerald-700">계좌 복사됨</span>
                  </>
                ) : (
                  <>
                    <MdContentCopy className="text-neutral-500 text-xs" />
                    <span>계좌 복사</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleJoinClick}
            className="flex-1 py-4 px-6 font-bold text-[15px] rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-2 active:scale-[0.99] bg-[#111111] hover:bg-neutral-800 text-white"
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
              className="py-4 px-6 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 font-semibold text-sm sm:text-[15px] rounded-xl transition text-center whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <MdFileDownload className="text-lg text-neutral-700" />
              <span>공식 요강 다운로드</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ContestCard);

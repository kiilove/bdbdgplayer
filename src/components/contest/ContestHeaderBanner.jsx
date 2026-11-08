import React from "react";
import dayjs from "dayjs";
import {
  MdCreditCard,
  MdOutlineLocationOn,
  MdFileDownload,
} from "react-icons/md";
import { RiBankLine, RiPrinterLine, RiTimeLine } from "react-icons/ri";
import { getContestDDayBadge } from "../../utils/formatUtils";

const ContestHeaderBanner = ({
  associateName = "보디빌딩협회",
  badgeSubtitle = "공식 참가접수",
  contestTitle = "",
  contestDate = "",
  contestLocation = "",
  contestPriceBasic = 0,
  bankInfo = null,
  collectionFileLink = "",
  onOpenPrintModal = null,
}) => {
  const dDayBadge = getContestDDayBadge(contestDate);

  return (
    <div className="bg-white/95 backdrop-blur-md bg-gradient-to-br from-indigo-50/50 via-white to-rose-50/40 border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-[0_6px_24px_rgba(15,23,42,0.05)] mb-7 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex flex-col gap-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-rose-50 text-[#FF2E54] border border-rose-200/90 shadow-[0_2px_8px_rgba(255,46,84,0.10)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E54] animate-pulse" />
              {badgeSubtitle}
            </span>
            {dDayBadge && (
              <span
                className={`inline-flex items-center text-xs font-extrabold px-2.5 py-1 rounded-full border tabular-nums ${
                  dDayBadge.isUrgent
                    ? "bg-gradient-to-r from-[#FF2E54] to-[#FF6B00] text-white border-transparent shadow-[0_2px_8px_rgba(255,46,84,0.25)]"
                    : "bg-violet-50 text-violet-700 border-violet-200/80"
                }`}
              >
                {dDayBadge.label}
              </span>
            )}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50/90 text-amber-800 border border-amber-200/80">
              {associateName || "보디빌딩협회"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-[1.3] break-keep">
            {contestTitle}
          </h1>
        </div>

        {(onOpenPrintModal || collectionFileLink) && (
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            {onOpenPrintModal && (
              <button
                type="button"
                onClick={onOpenPrintModal}
                className="px-5 py-3.5 bg-white hover:bg-indigo-50/50 text-[#0F172A] border border-slate-200 hover:border-indigo-200 font-bold text-sm rounded-full transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center shadow-sm"
              >
                <RiPrinterLine className="text-base text-indigo-600" />
                <span>접수증 출력 / PDF</span>
              </button>
            )}
            {collectionFileLink && (
              <a
                href={collectionFileLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:via-[#4F46E5] hover:to-[#6D28D9] text-white font-bold text-sm rounded-full shadow-[0_6px_18px_rgba(99,102,241,0.28)] transition flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto text-center"
              >
                <MdFileDownload className="text-base" />
                <span>모집 요강 다운로드</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Modular Bento Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-sm">
        {contestDate && (
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <RiTimeLine className="text-indigo-600 text-sm" />
              대회 일자 · DATE
            </span>
            <span className="font-extrabold text-[#0F172A] tabular-nums">
              {dayjs(contestDate).format("YYYY년 MM월 DD일")}
            </span>
          </div>
        )}

        {contestLocation && (
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MdOutlineLocationOn className="text-[#FF2E54] text-sm" />
              개최 장소 · VENUE
            </span>
            <span className="font-extrabold text-[#0F172A] break-keep">
              {contestLocation}
            </span>
          </div>
        )}

        {Boolean(contestPriceBasic) && (
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MdCreditCard className="text-amber-600 text-sm" />
              기본 참가비 · FEE
            </span>
            <span className="font-extrabold text-[#0F172A] tabular-nums">
              {Number(contestPriceBasic).toLocaleString()}원
            </span>
          </div>
        )}

        {bankInfo?.bankName && (
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <RiBankLine className="text-emerald-600 text-sm" />
              입금 계좌 · ACCOUNT
            </span>
            <span className="font-extrabold text-[#0F172A] break-keep tabular-nums">
              {bankInfo.bankName} {bankInfo.accountNumber} (
              {bankInfo.accountOwner})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestHeaderBanner;

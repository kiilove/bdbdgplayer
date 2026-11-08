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
    <div className="bg-gradient-to-br from-white via-white to-blue-50/40 border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)] mb-7 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex flex-col gap-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              {badgeSubtitle}
            </span>
            {dDayBadge && (
              <span
                className={`inline-flex items-center text-xs font-extrabold px-2.5 py-1 rounded-full border tabular-nums ${
                  dDayBadge.isUrgent
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-indigo-50/70 text-indigo-600 border-indigo-200/70"
                }`}
              >
                {dDayBadge.label}
              </span>
            )}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100/80 text-slate-600 border border-slate-200/70">
              {associateName || "보디빌딩협회"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191F28] tracking-tight leading-[1.3] break-keep">
            {contestTitle}
          </h1>
        </div>

        {(onOpenPrintModal || collectionFileLink) && (
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            {onOpenPrintModal && (
              <button
                type="button"
                onClick={onOpenPrintModal}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-[#191F28] border border-slate-200 font-bold text-sm rounded-full transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center shadow-sm"
              >
                <RiPrinterLine className="text-base text-[#2563EB]" />
                <span>접수증 출력 / PDF</span>
              </button>
            )}
            {collectionFileLink && (
              <a
                href={collectionFileLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto text-center"
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
              <RiTimeLine className="text-[#2563EB] text-sm" />
              대회 일자 · DATE
            </span>
            <span className="font-extrabold text-[#191F28] tabular-nums">
              {dayjs(contestDate).format("YYYY년 MM월 DD일")}
            </span>
          </div>
        )}

        {contestLocation && (
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MdOutlineLocationOn className="text-[#2563EB] text-sm" />
              개최 장소 · VENUE
            </span>
            <span className="font-extrabold text-[#191F28] break-keep">
              {contestLocation}
            </span>
          </div>
        )}

        {Boolean(contestPriceBasic) && (
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MdCreditCard className="text-[#2563EB] text-sm" />
              기본 참가비 · FEE
            </span>
            <span className="font-extrabold text-[#191F28] tabular-nums">
              {Number(contestPriceBasic).toLocaleString()}원
            </span>
          </div>
        )}

        {bankInfo?.bankName && (
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <RiBankLine className="text-[#2563EB] text-sm" />
              입금 계좌 · ACCOUNT
            </span>
            <span className="font-extrabold text-[#191F28] break-keep tabular-nums">
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

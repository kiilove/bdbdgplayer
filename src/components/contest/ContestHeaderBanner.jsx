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
    <div className="bg-white border border-neutral-200/90 rounded-[28px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-7 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex flex-col gap-y-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#111111] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {badgeSubtitle}
            </span>
            {dDayBadge && (
              <span
                className={`inline-flex items-center text-xs font-extrabold px-2.5 py-1 rounded-full border tabular-nums ${
                  dDayBadge.isUrgent
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-[#F5F5F7] text-[#111111] border-neutral-200"
                }`}
              >
                {dDayBadge.label}
              </span>
            )}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F5F5F7] text-neutral-700 border border-neutral-200/80">
              {associateName || "보디빌딩협회"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight leading-[1.3] break-keep">
            {contestTitle}
          </h1>
        </div>

        {(onOpenPrintModal || collectionFileLink) && (
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            {onOpenPrintModal && (
              <button
                type="button"
                onClick={onOpenPrintModal}
                className="px-5 py-3.5 bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#111111] border border-neutral-200 font-bold text-sm rounded-full transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
              >
                <RiPrinterLine className="text-base" />
                <span>접수증 출력 / PDF</span>
              </button>
            )}
            {collectionFileLink && (
              <a
                href={collectionFileLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-sm rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto text-center"
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
          <div className="bg-[#F5F5F7] rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <RiTimeLine className="text-[#111111] text-sm" />
              대회 일자 · DATE
            </span>
            <span className="font-extrabold text-[#111111] tabular-nums">
              {dayjs(contestDate).format("YYYY년 MM월 DD일")}
            </span>
          </div>
        )}

        {contestLocation && (
          <div className="bg-[#F5F5F7] rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <MdOutlineLocationOn className="text-[#111111] text-sm" />
              개최 장소 · VENUE
            </span>
            <span className="font-extrabold text-[#111111] break-keep">
              {contestLocation}
            </span>
          </div>
        )}

        {Boolean(contestPriceBasic) && (
          <div className="bg-[#F5F5F7] rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <MdCreditCard className="text-[#111111] text-sm" />
              기본 참가비 · FEE
            </span>
            <span className="font-extrabold text-[#111111] tabular-nums">
              {Number(contestPriceBasic).toLocaleString()}원
            </span>
          </div>
        )}

        {bankInfo?.bankName && (
          <div className="bg-[#F5F5F7] rounded-2xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <RiBankLine className="text-[#111111] text-sm" />
              입금 계좌 · ACCOUNT
            </span>
            <span className="font-extrabold text-[#111111] break-keep tabular-nums">
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

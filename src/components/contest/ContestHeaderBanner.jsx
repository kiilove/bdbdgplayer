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
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] mb-7 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex flex-col gap-y-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-[4px] bg-[#111111] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
              {badgeSubtitle}
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
            <span className="font-semibold text-neutral-500">
              {associateName || "보디빌딩협회"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-[-0.03em] leading-[1.26] break-keep">
            {contestTitle}
          </h1>
        </div>

        {(onOpenPrintModal || collectionFileLink) && (
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            {onOpenPrintModal && (
              <button
                type="button"
                onClick={onOpenPrintModal}
                className="px-5 py-3.5 bg-white hover:bg-neutral-50 text-[#111111] border border-neutral-200 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
              >
                <RiPrinterLine className="text-base text-neutral-700" />
                <span>접수증 출력 / PDF</span>
              </button>
            )}
            {collectionFileLink && (
              <a
                href={collectionFileLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto text-center"
              >
                <MdFileDownload className="text-base" />
                <span>모집 요강 다운로드</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Monochrome Editorial Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-sm">
        {contestDate && (
          <div className="bg-[#FAFAFA] border border-neutral-200/70 rounded-xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <RiTimeLine className="text-neutral-400 text-sm" />
              대회 일자 · DATE
            </span>
            <span className="font-extrabold text-[#111111] tabular-nums">
              {dayjs(contestDate).format("YYYY년 MM월 DD일")}
            </span>
          </div>
        )}

        {contestLocation && (
          <div className="bg-[#FAFAFA] border border-neutral-200/70 rounded-xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <MdOutlineLocationOn className="text-neutral-400 text-sm" />
              개최 장소 · VENUE
            </span>
            <span className="font-extrabold text-[#111111] break-keep">
              {contestLocation}
            </span>
          </div>
        )}

        {Boolean(contestPriceBasic) && (
          <div className="bg-[#FAFAFA] border border-neutral-200/70 rounded-xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <MdCreditCard className="text-neutral-400 text-sm" />
              기본 참가비 · FEE
            </span>
            <span className="font-extrabold text-[#111111] tabular-nums">
              {Number(contestPriceBasic).toLocaleString()}원
            </span>
          </div>
        )}

        {bankInfo?.bankName && (
          <div className="bg-[#FAFAFA] border border-neutral-200/70 rounded-xl p-4 flex flex-col justify-between gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <RiBankLine className="text-neutral-400 text-sm" />
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

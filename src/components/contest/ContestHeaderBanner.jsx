import React from "react";
import dayjs from "dayjs";
import {
  MdCreditCard,
  MdOutlineLocationOn,
  MdFileDownload,
} from "react-icons/md";
import { RiBankLine, RiPrinterLine, RiTimeLine } from "react-icons/ri";

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
  return (
    <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] mb-7 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex flex-col gap-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#111111] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {badgeSubtitle}
            </span>
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

      {/* Structured Metadata Strip */}
      <div className="bg-[#F5F5F7] rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-sm">
        {contestDate && (
          <div className="flex sm:flex-col justify-between sm:justify-start gap-1">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
              <RiTimeLine className="text-neutral-700 text-sm" />
              대회 일자
            </span>
            <span className="font-bold text-[#111111] text-right sm:text-left">
              {dayjs(contestDate).format("YYYY년 MM월 DD일")}
            </span>
          </div>
        )}

        {contestLocation && (
          <div className="flex sm:flex-col justify-between sm:justify-start gap-1 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-neutral-200/70">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5 shrink-0">
              <MdOutlineLocationOn className="text-neutral-700 text-sm" />
              개최 장소
            </span>
            <span className="font-bold text-[#111111] text-right sm:text-left break-keep">
              {contestLocation}
            </span>
          </div>
        )}

        {Boolean(contestPriceBasic) && (
          <div className="flex sm:flex-col justify-between sm:justify-start gap-1 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-neutral-200/70">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
              <MdCreditCard className="text-neutral-700 text-sm" />
              기본 참가비
            </span>
            <span className="font-bold text-[#111111] text-right sm:text-left">
              {Number(contestPriceBasic).toLocaleString()}원
            </span>
          </div>
        )}

        {bankInfo?.bankName && (
          <div className="flex sm:flex-col justify-between sm:justify-start gap-1 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-neutral-200/70">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5 shrink-0">
              <RiBankLine className="text-neutral-700 text-sm" />
              입금 계좌
            </span>
            <span className="font-bold text-[#111111] text-right sm:text-left break-keep">
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

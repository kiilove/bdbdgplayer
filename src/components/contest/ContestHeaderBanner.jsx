import React from "react";
import dayjs from "dayjs";
import { MdCreditCard, MdOutlineLocationOn } from "react-icons/md";
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
    <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase tracking-wider">
            {associateName || "보디빌딩협회"}
          </span>
          <span className="text-xs font-semibold text-neutral-500">
            {badgeSubtitle}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
          {contestTitle}
        </h1>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-neutral-400 mt-2">
          {contestDate && (
            <span className="flex items-center gap-x-1.5 font-medium">
              <RiTimeLine className="text-white text-base" />
              {dayjs(contestDate).format("YYYY년 MM월 DD일")}
            </span>
          )}
          {contestLocation && (
            <span className="flex items-center gap-x-1.5 font-medium">
              <MdOutlineLocationOn className="text-white text-base" />
              {contestLocation}
            </span>
          )}
          {Boolean(contestPriceBasic) && (
            <span className="flex items-center gap-x-1.5 font-medium">
              <MdCreditCard className="text-white text-base" />
              기본 {Number(contestPriceBasic).toLocaleString()}원
            </span>
          )}
          {bankInfo?.bankName && (
            <span className="flex items-center gap-x-1.5 font-medium text-neutral-300">
              <RiBankLine className="text-white text-base" />
              {bankInfo.bankName} {bankInfo.accountNumber} (
              {bankInfo.accountOwner})
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
        {onOpenPrintModal && (
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 font-black text-xs rounded-full shadow-lg transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
          >
            <RiPrinterLine className="text-sm" />
            <span>접수증 출력 / PDF</span>
          </button>
        )}
        {collectionFileLink && (
          <a
            href={collectionFileLink}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-full shadow-lg transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
          >
            모집 요강 다운로드
          </a>
        )}
      </div>
    </div>
  );
};

export default ContestHeaderBanner;

